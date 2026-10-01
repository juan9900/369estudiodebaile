/**
 * Rolling-cycle math for "clases fijas" (fixed classes). A fixed class now
 * has one or more weekly slots (lib/types/database.ts's FixedClassSlot:
 * weekday + its own start_time/end_time), and students buy a cycle covering
 * exactly SESSIONS_PER_CYCLE occurrences of EACH slot, anchored on the
 * first session actually available to them — not a calendar month, and
 * never prorated. A class with 3 weekly slots always sells cycles of
 * 3 * SESSIONS_PER_CYCLE sessions, crossing month boundaries freely.
 *
 * Date arithmetic below is pure UTC on "YYYY-MM-DD" strings (same
 * convention as lib/utils/date-format.ts's getDateParts) — never local
 * time, or a UTC-negative timezone (e.g. Venezuela, UTC-4) shifts every
 * date by a day. The only place "now" (an actual instant, not a date
 * string) matters is the same-day cutoff for the very next session, which
 * is resolved in America/Caracas via lib/utils/caracas-date.ts.
 */
import { SESSIONS_PER_CYCLE } from "@/constants";
import {
  addDaysToDateStr,
  getCaracasMinutesOfDay,
  getCaracasToday,
} from "@/lib/utils/caracas-date";

export interface ClassSlot {
  weekday: number; // 0=Sunday..6=Saturday, matches Date.getUTCDay()
  start_time: string; // "HH:MM" or "HH:MM:SS"
  end_time: string;
}

export interface SlotSession {
  date: string; // "YYYY-MM-DD"
  slot: ClassSlot;
}

export interface CycleWindow {
  startDate: string; // sessions[0].date
  endDate: string; // last session's date
  sessions: SlotSession[]; // sorted chronologically
  sessionCount: number;
}

function parseDateStr(date: string): Date {
  return new Date(date + "T00:00:00Z");
}

/** First occurrence of `weekday` on or after `floorDate` (both pure date math, no "now" involved). */
function nextWeekdayOnOrAfter(weekday: number, floorDate: string): string {
  const floor = parseDateStr(floorDate);
  const offset = (weekday - floor.getUTCDay() + 7) % 7;
  return addDaysToDateStr(floorDate, offset);
}

/** True if `date` is strictly before `notBefore` (both "YYYY-MM-DD"), i.e. must be skipped. */
function isBeforeFloor(date: string, notBefore?: string | null): boolean {
  return !!notBefore && date < notBefore;
}

/** Advances `date` by 7-day jumps until it's on/after `notBefore` (classes.starts_on). */
function applyStartsOnFloor(date: string, notBefore?: string | null): string {
  let candidate = date;
  while (isBeforeFloor(candidate, notBefore)) {
    candidate = addDaysToDateStr(candidate, 7);
  }
  return candidate;
}

/**
 * The first occurrence of `slot.weekday` on/after today (America/Caracas),
 * respecting `notBefore` (classes.starts_on) and, when it falls on today,
 * the same-day cutoff: today's own session only counts if it hasn't
 * started yet.
 */
export function getNextSlotDate(
  slot: ClassSlot,
  from: Date = new Date(),
  notBefore?: string | null,
): string {
  const today = getCaracasToday(from);
  let candidate = nextWeekdayOnOrAfter(slot.weekday, today);

  if (candidate === today) {
    const [hours, minutes] = slot.start_time.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    if (startMinutes <= getCaracasMinutesOfDay(from)) {
      candidate = addDaysToDateStr(candidate, 7);
    }
  }

  return applyStartsOnFloor(candidate, notBefore);
}

/**
 * The earliest of the next occurrences across every slot — the anchor a new
 * cycle starts on if the student joins right now.
 */
export function getNextCycleStart(
  slots: ClassSlot[],
  from: Date = new Date(),
  notBefore?: string | null,
): string | null {
  if (slots.length === 0) return null;
  const candidates = slots.map((slot) => getNextSlotDate(slot, from, notBefore));
  return candidates.sort()[0];
}

/**
 * The SESSIONS_PER_CYCLE occurrences of EVERY slot from `startDate` onward
 * (inclusive), merged and sorted chronologically. `startDate` need not be
 * one of the slots' weekdays — each slot independently counts its first
 * SESSIONS_PER_CYCLE occurrences on/after it.
 */
export function buildCycleWindow(slots: ClassSlot[], startDate: string): CycleWindow {
  const sessions: SlotSession[] = [];

  for (const slot of slots) {
    const firstOccurrence = nextWeekdayOnOrAfter(slot.weekday, startDate);
    for (let i = 0; i < SESSIONS_PER_CYCLE; i++) {
      sessions.push({ date: addDaysToDateStr(firstOccurrence, i * 7), slot });
    }
  }

  sessions.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? -1 : 1));

  return {
    startDate: sessions[0]?.date ?? startDate,
    endDate: sessions[sessions.length - 1]?.date ?? startDate,
    sessions,
    sessionCount: sessions.length,
  };
}

/**
 * The next `count` distinct cycle-start dates a student could pick: the
 * first is "join right now" (getNextCycleStart), and each following one
 * starts the day after the previous cycle's last session — pure date
 * arithmetic, since by then "now" no longer matters (it's always in the
 * future relative to the first cycle).
 */
export function getUpcomingCycleStarts(
  slots: ClassSlot[],
  count: number,
  from: Date = new Date(),
  notBefore?: string | null,
): string[] {
  if (slots.length === 0) return [];

  const starts: string[] = [];
  let cycleStart = getNextCycleStart(slots, from, notBefore);

  for (let i = 0; i < count && cycleStart; i++) {
    starts.push(cycleStart);
    const window = buildCycleWindow(slots, cycleStart);
    const floor = addDaysToDateStr(window.endDate, 1);
    const candidates = slots.map((slot) =>
      applyStartsOnFloor(nextWeekdayOnOrAfter(slot.weekday, floor), notBefore),
    );
    cycleStart = candidates.sort()[0] ?? null;
  }

  return starts;
}

/** Whether two cycle windows share any date range (used for capacity counting). */
export function windowsOverlap(
  a: { startDate: string; endDate: string },
  b: { cycle_start_date: string; cycle_end_date: string },
): boolean {
  return a.startDate <= b.cycle_end_date && a.endDate >= b.cycle_start_date;
}
