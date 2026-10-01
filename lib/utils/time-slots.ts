/**
 * Generates time slot strings in 30-minute increments from `from` to `to` (inclusive).
 * @param from - "HH:MM" opening time
 * @param to   - "HH:MM" closing time
 */
export function generateTimeSlots(from: string, to: string): string[] {
  const slots: string[] = [];
  const [fromH, fromM] = from.split(":").map(Number);
  const [toH, toM] = to.split(":").map(Number);
  const fromMinutes = fromH * 60 + fromM;
  const toMinutes = toH * 60 + toM;

  for (let m = fromMinutes; m <= toMinutes; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }

  return slots;
}

/**
 * Formats a "HH:MM" string to "h:mm AM/PM" for display.
 */
export function formatTimeAMPM(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Adds `minutes` to a "HH:MM" string and returns the result as "HH:MM".
 */
export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

/**
 * Returns the set of slots that are occupied by existing classes.
 * A slot is blocked if it falls within [start_time, end_time + 30min).
 * This enforces a 30-minute gap between classes.
 * Example: class 09:00–10:00 blocks 09:00, 09:30, and 10:00; next available is 10:30.
 */
export function getOccupiedSlots(
  existingClasses: { start_time: string; end_time: string }[],
  allSlots: string[],
): Set<string> {
  const occupied = new Set<string>();

  for (const cls of existingClasses) {
    const start = cls.start_time.slice(0, 5);
    const endWithGap = addMinutes(cls.end_time.slice(0, 5), 30);

    for (const slot of allSlots) {
      if (slot >= start && slot < endWithGap) {
        occupied.add(slot);
      }
    }
  }

  return occupied;
}

/**
 * Valid start-time options given existing classes to avoid. When
 * `requireFullHour` is set (used for "clases", which always book a fixed
 * 1-hour block), a slot is only offered if the full hour after it is also
 * free and doesn't run past closing time.
 */
export function getStartTimeOptions(
  existingClasses: { start_time: string; end_time: string }[],
  allSlots: string[],
  closingTime: string,
  requireFullHour: boolean,
): string[] {
  const occupied = getOccupiedSlots(existingClasses, allSlots);
  return allSlots.filter((slot) => {
    if (occupied.has(slot)) return false;
    if (requireFullHour) {
      const endSlot = addMinutes(slot, 60);
      if (endSlot > closingTime) return false;
      if (occupied.has(endSlot)) return false;
    }
    return true;
  });
}

/**
 * Valid end-time options strictly after `startTime`, capped 30 minutes
 * before whichever existing class starts next (enforcing the same gap as
 * getOccupiedSlots).
 */
export function getEndTimeOptions(
  startTime: string,
  existingClasses: { start_time: string; end_time: string }[],
  allSlots: string[],
): string[] {
  if (!startTime) return [];
  const afterStart = allSlots.filter((s) => s > startTime);

  let cap: string | null = null;
  for (const cls of existingClasses) {
    const clsStart = cls.start_time.slice(0, 5);
    if (clsStart > startTime && (cap === null || clsStart < cap)) {
      cap = clsStart;
    }
  }
  if (!cap) return afterStart;

  // Subtract 30 min from cap to enforce the gap: if the next class starts
  // at 13:00, this one must end by 12:30 at the latest.
  const [capH, capM] = cap.split(":").map(Number);
  const capMinus30 = capH * 60 + capM - 30;
  const adjustedCap = `${String(Math.floor(capMinus30 / 60)).padStart(2, "0")}:${String(capMinus30 % 60).padStart(2, "0")}`;

  return afterStart.filter((s) => s <= adjustedCap);
}
