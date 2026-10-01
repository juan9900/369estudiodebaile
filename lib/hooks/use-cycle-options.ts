"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { formatCycleRange } from "@/lib/utils/date-format";
import {
  buildCycleWindow,
  getUpcomingCycleStarts,
  windowsOverlap,
  type ClassSlot,
  type SlotSession,
} from "@/lib/utils/fixed-class-cycle";
import { useFixedClassSlots } from "@/lib/hooks/use-fixed-class-slots";

const CYCLE_START_OPTIONS = 2;

export interface CycleOption {
  startDate: string;
  endDate: string;
  label: string;
  note: string;
  sessions: SlotSession[];
  sessionCount: number;
  enrolled: number;
  spotsLeft: number | null;
  disabled: boolean;
  price: number | null;
}

/**
 * The rolling cycles a student can buy for a given fixed class ("fijas"):
 * the next available cycle start, and the one after it.
 * Each cycle is SESSIONS_PER_CYCLE occurrences of every weekly slot,
 * anchored on its start date — never prorated, always the flat
 * classes.price. Capacity is read from fixed_class_enrollment_windows (a
 * view of active registrations' cycle date ranges — see
 * supabase/migrations/018_fixed_class_slots.sql) and compared by overlap.
 */
export function useCycleOptions(danceClass: DanceClass) {
  const isFixed = danceClass.class_type === "fijas";
  const { slotsByClass, loading: loadingSlots } = useFixedClassSlots(
    isFixed ? [danceClass.id] : [],
  );
  const [options, setOptions] = useState<CycleOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFixed) {
      setOptions([]);
      setLoading(false);
      return;
    }
    if (loadingSlots) return;

    const slots = (slotsByClass.get(danceClass.id) ?? []) as ClassSlot[];
    if (slots.length === 0) {
      setOptions([]);
      setLoading(false);
      return;
    }

    let active = true;

    async function fetchOptions() {
      setLoading(true);
      const supabase = createClient();

      const starts = getUpcomingCycleStarts(
        slots,
        CYCLE_START_OPTIONS,
        new Date(),
        danceClass.starts_on,
      );
      const windows = starts.map((start) => buildCycleWindow(slots, start));

      const { data } = await supabase
        .from("fixed_class_enrollment_windows")
        .select("cycle_start_date, cycle_end_date")
        .eq("class_id", danceClass.id);

      if (!active) return;

      const activeWindows =
        (data as { cycle_start_date: string; cycle_end_date: string }[]) ?? [];

      const built: CycleOption[] = windows.map((window, i) => {
        const enrolled = activeWindows.filter((w) => windowsOverlap(window, w)).length;
        const spotsLeft =
          danceClass.max_capacity != null
            ? Math.max(danceClass.max_capacity - enrolled, 0)
            : null;
        return {
          startDate: window.startDate,
          endDate: window.endDate,
          label: i === 0 ? "Lo antes posible" : "Más adelante",
          note: `${window.sessionCount} clases · ${formatCycleRange(window.startDate, window.endDate)}`,
          sessions: window.sessions,
          sessionCount: window.sessionCount,
          enrolled,
          spotsLeft,
          disabled: spotsLeft != null && spotsLeft <= 0,
          price: danceClass.price,
        };
      });

      setOptions(built);
      setLoading(false);
    }

    fetchOptions();
    return () => {
      active = false;
    };
  }, [
    isFixed,
    loadingSlots,
    slotsByClass,
    danceClass.id,
    danceClass.starts_on,
    danceClass.price,
    danceClass.max_capacity,
  ]);

  return { options, loading: loading || loadingSlots };
}
