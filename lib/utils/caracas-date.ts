/**
 * "Today" / "now", resolved in America/Caracas (Venezuela, UTC-4, no DST).
 *
 * Built with Intl.DateTimeFormat instead of toLocaleString + new Date(...),
 * which round-trips through the environment's local timezone and silently
 * reintroduces a UTC offset. That pattern previously lived inline in
 * app/api/cron/unpaid-reminders/route.ts and was wrong on any host not
 * already running in Caracas time.
 */

const CARACAS_TZ = "America/Caracas";

function getCaracasParts(now: Date): Record<string, string> {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CARACAS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return map;
}

/** "YYYY-MM-DD" for `now` (or the real current instant) in America/Caracas. */
export function getCaracasToday(now: Date = new Date()): string {
  const p = getCaracasParts(now);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Minutes since midnight in America/Caracas, for same-day session cutoffs. */
export function getCaracasMinutesOfDay(now: Date = new Date()): number {
  const p = getCaracasParts(now);
  return Number(p.hour) * 60 + Number(p.minute);
}

/** Shifts a "YYYY-MM-DD" date string by `days` (pure UTC arithmetic, no timezone involved). */
export function addDaysToDateStr(date: string, days: number): string {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}
