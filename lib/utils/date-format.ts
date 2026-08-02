import { formatTimeAMPM } from "./time-slots";

const DAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

const DAYS_ES_SHORT = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

const MONTHS_ES = [
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
