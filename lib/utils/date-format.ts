import { formatTimeAMPM } from "./time-slots";
import type { MonthKey } from "./fixed-class-cycle";

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

// ── Fixed classes ("clases fijas") — recurring weekly schedule ──────────

/** "martes" */
export function getWeekdayName(weekday: number): string {
  return DAYS_ES[weekday];
}

/** "MAR" */
export function getWeekdayNameShort(weekday: number): string {
  return DAYS_ES_SHORT[weekday];
}

/** "octubre" from a "YYYY-MM-01" month key */
export function getMonthLabel(month: MonthKey): string {
  const [, m] = month.split("-").map(Number);
  return MONTHS_ES[m - 1];
}

/** "Octubre 2026" from a "YYYY-MM-01" month key */
export function formatCycleMonthLabel(month: MonthKey): string {
  const [y] = month.split("-").map(Number);
  const label = getMonthLabel(month);
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} ${y}`;
}

/** "TODOS LOS MARTES · 6:00 – 7:30 PM" — mirrors formatClassMetaDesktop */
export function formatWeeklyScheduleFull(
  weekday: number,
  startTime: string,
  endTime: string,
): string {
  return `TODOS LOS ${getWeekdayName(weekday).toUpperCase()}S · ${formatTimeAMPM(startTime)} – ${formatTimeAMPM(endTime)}`;
}

/** "MAR · 6:00 PM" — mirrors formatClassMetaMobile */
export function formatWeeklyScheduleShort(
  weekday: number,
  startTime: string,
): string {
  return `${getWeekdayNameShort(weekday)} · ${formatTimeAMPM(startTime)}`;
}

/** "7, 14, 21 y 28 de octubre" — used in cycle summaries and emails. */
export function formatSessionDatesList(dates: string[]): string {
  const days = dates.map((d) => getDateParts(d).dayNum);
  if (days.length === 0) return "";
  if (days.length === 1) {
    return `${days[0]} de ${getDateParts(dates[0]).monthName}`;
  }
  const monthName = getDateParts(dates[dates.length - 1]).monthName;
  const head = days.slice(0, -1).join(", ");
  const last = days[days.length - 1];
  return `${head} y ${last} de ${monthName}`;
}
