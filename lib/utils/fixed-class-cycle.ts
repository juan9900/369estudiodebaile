/**
 * Monthly-cycle math for "clases fijas" (fixed classes). A fixed class has a
 * recurring weekday + time instead of a single scheduled_date; students buy
 * a monthly cycle covering exactly the first SESSIONS_PER_CYCLE occurrences
 * of that weekday in the month — a 5th occurrence, if the month has one, is
 * never part of the cycle.
 *
 * All date math here uses the "YYYY-MM-DDT00:00:00Z" + getUTCDay() / getUTCDate()
 * convention already used by lib/utils/date-format.ts's getDateParts and by
 * components/admin/class-form.tsx's getDayOfWeek — never local time, or a
 * UTC-negative timezone (e.g. Venezuela, UTC-4) shifts every date by a day.
 */
import { SESSIONS_PER_CYCLE } from "@/constants";

/** First day of a month as "YYYY-MM-01". */
export type MonthKey = string;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Normalizes any date-ish value to its month's "YYYY-MM-01" key (UTC). */
export function toMonthKey(date: Date | string): MonthKey {
  const d = typeof date === "string" ? new Date(date + "T00:00:00Z") : date;
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-01`;
}

/** "YYYY-MM-01" key for the month `now` (or the real current date) falls in. */
export function getCurrentMonthKey(now: Date = new Date()): MonthKey {
  return toMonthKey(now);
}

/** Adds `n` months to a "YYYY-MM-01" key and returns the new key. */
export function addMonthsToKey(key: MonthKey, n: number): MonthKey {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return toMonthKey(d);
}

/**
 * The exactly-4 (SESSIONS_PER_CYCLE) session dates for `weekday` within
 * `month`, as "YYYY-MM-DD" strings. If the month has a 5th occurrence, it is
 * deliberately excluded — the cycle is always exactly 4 sessions.
 */
export function getCycleSessionDates(weekday: number, month: MonthKey): string[] {
  const [y, m] = month.split("-").map(Number);
  const firstOfMonth = new Date(Date.UTC(y, m - 1, 1));
  const firstWeekdayOffset = (weekday - firstOfMonth.getUTCDay() + 7) % 7;
  const firstOccurrenceDay = 1 + firstWeekdayOffset;

  const dates: string[] = [];
  for (let i = 0; i < SESSIONS_PER_CYCLE; i++) {
    const day = firstOccurrenceDay + i * 7;
    const date = new Date(Date.UTC(y, m - 1, day));
    dates.push(
      `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
    );
  }
  return dates;
}

/**
 * Subset of the cycle's session dates that are still bookable: today's
 * session only counts if it hasn't started yet, mirroring the same-day
 * cutoff rule used by components/classes-list.tsx and
 * lib/hooks/use-available-classes.ts.
 */
export function getRemainingSessionDates(
  weekday: number,
  month: MonthKey,
  startTime: string,
  now: Date = new Date(),
): string[] {
  const today = now.toISOString().split("T")[0];
  return getCycleSessionDates(weekday, month).filter((date) => {
    if (date > today) return true;
    if (date < today) return false;
    // date === today: only bookable if the session hasn't started yet.
    const [hours, minutes, seconds] = startTime.split(":").map(Number);
    const sessionStart = new Date(now);
    sessionStart.setHours(hours, minutes, seconds ?? 0, 0);
    return sessionStart > now;
  });
}
