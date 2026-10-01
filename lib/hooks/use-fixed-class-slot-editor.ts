"use client";

import { useState } from "react";

export interface EditableSlot {
  weekday: string; // "" = unset, else "0".."6" (matches a Select's string value)
  start_time: string;
  end_time: string;
}

const EMPTY_SLOT: EditableSlot = { weekday: "", start_time: "", end_time: "" };

/**
 * Local editor state for a fixed class's weekly slots in the admin form:
 * add/remove rows, patch a row, and compute which weekdays are still free
 * to pick (a class can't have two slots on the same day — see
 * fixed_class_slots' UNIQUE (class_id, weekday) constraint).
 */
export function useFixedClassSlotEditor(initial: EditableSlot[] = []) {
  const [slots, setSlots] = useState<EditableSlot[]>(
    initial.length > 0 ? initial : [EMPTY_SLOT],
  );

  function addSlot() {
    setSlots((prev) => [...prev, EMPTY_SLOT]);
  }

  function removeSlot(index: number) {
    setSlots((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  function updateSlot(index: number, patch: Partial<EditableSlot>) {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  /** Weekdays already picked by other rows — unavailable for this one. */
  function usedWeekdaysExcept(index: number): string[] {
    return slots
      .filter((_, i) => i !== index)
      .map((s) => s.weekday)
      .filter(Boolean);
  }

  return { slots, setSlots, addSlot, removeSlot, updateSlot, usedWeekdaysExcept };
}
