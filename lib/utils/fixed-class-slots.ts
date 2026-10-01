/**
 * Formatting and ordering for a fixed class's weekly slots (see
 * supabase/migrations/018_fixed_class_slots.sql's fixed_class_slots table
 * and lib/types/database.ts's FixedClassSlot). A fixed class can meet on
 * several days, each with its own time range — e.g. Tue+Thu 6-7pm plus
 * Sat 9-10am — so these group slots that share a schedule before rendering.
 */
import { getWeekdayName, getWeekdayNameShort } from "@/lib/utils/date-format";
import { formatTimeAMPM } from "@/lib/utils/time-slots";
import type { ClassSlot } from "@/lib/utils/fixed-class-cycle";

/** Sorted by weekday, then start time. */
export function sortSlots<T extends ClassSlot>(slots: T[]): T[] {
  return [...slots].sort((a, b) =>
    a.weekday !== b.weekday ? a.weekday - b.weekday : a.start_time.localeCompare(b.start_time),
  );
}

export function getSlotWeekdays(slots: ClassSlot[]): number[] {
  return sortSlots(slots).map((s) => s.weekday);
}

function groupBySchedule(slots: ClassSlot[]): { weekdays: number[]; start_time: string; end_time: string }[] {
  const groups = new Map<string, { weekdays: number[]; start_time: string; end_time: string }>();
  for (const slot of sortSlots(slots)) {
    const key = `${slot.start_time}-${slot.end_time}`;
    if (!groups.has(key)) {
      groups.set(key, { weekdays: [], start_time: slot.start_time, end_time: slot.end_time });
    }
    groups.get(key)!.weekdays.push(slot.weekday);
  }
  return [...groups.values()];
}

/** "Martes y jueves" / "Sábados" / "Martes, jueves y sábado" from a set of weekdays sharing one schedule. */
function joinWeekdayNames(weekdays: number[]): string {
  const names = weekdays.map((w) => getWeekdayName(w));
  // Pluralize only when there's exactly one day — "jueves" is already the
  // plural form in Spanish, "sábado" needs an "s", so pluralize per-name.
  const pluralize = (name: string) => (name.endsWith("s") ? name : `${name}s`);
  const plural = weekdays.length > 1 ? names.map(pluralize) : [pluralize(names[0])];
  const capitalized = `${plural[0].charAt(0).toUpperCase()}${plural[0].slice(1)}`;
  if (plural.length === 1) return capitalized;
  const head = [capitalized, ...plural.slice(1, -1)].join(", ");
  return `${head} y ${plural[plural.length - 1]}`;
}

/** "Martes y jueves · 6:00 – 7:00 PM | Sábados · 9:00 – 10:00 AM" — desktop metadata style. */
export function formatSlotsFull(slots: ClassSlot[]): string {
  return groupBySchedule(slots)
    .map(
      (g) =>
        `${joinWeekdayNames(g.weekdays).toUpperCase()} · ${formatTimeAMPM(g.start_time)} – ${formatTimeAMPM(g.end_time)}`,
    )
    .join(" | ");
}

/** "MAR · JUE · SÁB" — compact tag for listing cards. */
export function formatSlotsShort(slots: ClassSlot[]): string {
  return sortSlots(slots)
    .map((s) => getWeekdayNameShort(s.weekday))
    .join(" · ");
}
