import { formatTimeAMPM } from "./time-slots";

export const DAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export const DAYS_ES_SHORT = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

export const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const MONTHS_ES_SHORT = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

/**
 * Parses a "YYYY-MM-DD" date-only string into its calendar parts, using UTC
 * to avoid timezone shift (the value has no time component).
 */
export function getDateParts(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00Z");
  const dayIndex = date.getUTCDay();
  const monthIndex = date.getUTCMonth();
  const dayNum = date.getUTCDate();

  return {
    dayNum,
    dayNumPadded: String(dayNum).padStart(2, "0"),
    dayName: DAYS_ES[dayIndex],
    dayNameShort: DAYS_ES_SHORT[dayIndex],
    monthName: MONTHS_ES[monthIndex],
    monthNameShort: MONTHS_ES_SHORT[monthIndex],
  };
}

/** "8 de agosto" */
export function formatDateLong(dateStr: string): string {
  const { dayNum, monthName } = getDateParts(dateStr);
  return `${dayNum} de ${monthName}`;
}

/** "SÁBADO 8 DE AGOSTO" — desktop metadata style */
export function formatDateFull(dateStr: string): string {
  const { dayNum, dayName, monthName } = getDateParts(dateStr);
  return `${dayName.toUpperCase()} ${dayNum} DE ${monthName.toUpperCase()}`;
}

/** "AGO · SÁB" — mono metadata style used next to the big day number */
export function formatDateShortLabel(dateStr: string): string {
  const { monthNameShort, dayNameShort } = getDateParts(dateStr);
  return `${monthNameShort} · ${dayNameShort}`;
}

/**
 * "YYYY-MM-DDTHH:MM" for a `<input type="datetime-local">`, from an ISO
 * timestamp, rendered in the viewer's own local timezone (same timezone
 * that datetime-local input values are always interpreted in).
 */
export function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "SÁB 8 AGO · 10:30 AM" — class detail metadata, mobile */
export function formatClassMetaMobile(
  dateStr: string,
  startTime: string,
): string {
  const { dayNum, dayNameShort, monthNameShort } = getDateParts(dateStr);
  return `${dayNameShort} ${dayNum} ${monthNameShort} · ${formatTimeAMPM(startTime)}`;
}

/** "SÁBADO 8 DE AGOSTO · 10:30 – 11:30 AM" — class detail metadata, desktop */
export function formatClassMetaDesktop(
  dateStr: string,
  startTime: string,
  endTime: string,
): string {
  return `${formatDateFull(dateStr)} · ${formatTimeAMPM(startTime)} – ${formatTimeAMPM(endTime)}`;
}

// ── Fixed classes ("clases fijas") — weekly schedule + rolling cycles ───
// Per-slot formatters (several weekdays, each with its own time range) live
// in lib/utils/fixed-class-slots.ts. This file keeps the generic date-list
// and date-range formatters shared with dated classes.

/** "martes" */
export function getWeekdayName(weekday: number): string {
  return DAYS_ES[weekday];
}

/** "MAR" */
export function getWeekdayNameShort(weekday: number): string {
  return DAYS_ES_SHORT[weekday];
}

/**
 * "26 de septiembre; 1, 3, 8, 10 de octubre" — a cycle's session dates,
 * grouped by month since a rolling cycle routinely crosses a month
 * boundary (unlike the old calendar-month cycles, which never did).
 */
export function formatSessionDatesList(dates: string[]): string {
  if (dates.length === 0) return "";

  const byMonth = new Map<string, number[]>();
  for (const date of dates) {
    const { monthName, dayNum } = getDateParts(date);
    if (!byMonth.has(monthName)) byMonth.set(monthName, []);
    byMonth.get(monthName)!.push(dayNum);
  }

  return [...byMonth.entries()]
    .map(([monthName, days]) => {
      if (days.length === 1) return `${days[0]} de ${monthName}`;
      const head = days.slice(0, -1).join(", ");
      const last = days[days.length - 1];
      return `${head} y ${last} de ${monthName}`;
    })
    .join("; ");
}

/** "26 sep – 17 oct" — a cycle's overall date range, for compact summaries. */
export function formatCycleRange(startDate: string, endDate: string): string {
  const start = getDateParts(startDate);
  const end = getDateParts(endDate);
  return `${start.dayNum} ${start.monthNameShort.toLowerCase()} – ${end.dayNum} ${end.monthNameShort.toLowerCase()}`;
}
