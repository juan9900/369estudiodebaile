"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { formatCycleMonthLabel } from "@/lib/utils/date-format";
import {
  addMonthsToKey,
  getCurrentMonthKey,
  getCycleSessionDates,
  getRemainingSessionDates,
  type MonthKey,
} from "@/lib/utils/fixed-class-cycle";
import { getCyclePrice, getCycleNote } from "@/lib/utils/fixed-class-pricing";

export interface CycleOption {
  month: MonthKey;
  monthLabel: string;
  note: string;
  sessions: string[];
  sessionCount: number;
  isProrated: boolean;
  enrolled: number;
  spotsLeft: number | null;
  disabled: boolean;
  price: number | null;
}

/**
 * The monthly cycles a student can buy for a given fixed class ("fijas"):
 * the current month prorated by remaining sessions (only if any remain and
 * it isn't full), and the next month at full price. Capacity is read from
 * `fixed_class_cycle_enrollment`, a view that counts active registrations
 * per (class, cycle_month) — see supabase/migrations/017_fixed_classes.sql.
 */
export function useCycleOptions(danceClass: DanceClass) {
  const [options, setOptions] = useState<CycleOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (danceClass.class_type !== "fijas" || danceClass.weekday == null) {
      setOptions([]);
      setLoading(false);
      return;
    }

    let active = true;

    async function fetchOptions() {
      setLoading(true);
      const supabase = createClient();
      const weekday = danceClass.weekday as number;

      const currentMonth = getCurrentMonthKey();
      const nextMonth = addMonthsToKey(currentMonth, 1);

      const { data } = await supabase
        .from("fixed_class_cycle_enrollment")
        .select("cycle_month, enrolled")
        .eq("class_id", danceClass.id)
        .in("cycle_month", [currentMonth, nextMonth]);

      if (!active) return;

      const enrollmentByMonth = new Map<string, number>();
      for (const row of (data as { cycle_month: string; enrolled: number }[]) ?? []) {
        enrollmentByMonth.set(row.cycle_month, row.enrolled);
      }

      const built: CycleOption[] = [];

      const remaining = getRemainingSessionDates(
        weekday,
        currentMonth,
        danceClass.start_time,
      );
      if (remaining.length > 0) {
        const enrolled = enrollmentByMonth.get(currentMonth) ?? 0;
        const spotsLeft =
          danceClass.max_capacity != null
            ? Math.max(danceClass.max_capacity - enrolled, 0)
            : null;
        built.push({
          month: currentMonth,
          monthLabel: `Resto de ${formatCycleMonthLabel(currentMonth)}`,
          note: getCycleNote(remaining.length, formatCycleMonthLabel(currentMonth)),
          sessions: remaining,
          sessionCount: remaining.length,
          isProrated: true,
          enrolled,
          spotsLeft,
          disabled: spotsLeft != null && spotsLeft <= 0,
          price: getCyclePrice(danceClass.price, remaining.length),
        });
      }

      const nextSessions = getCycleSessionDates(weekday, nextMonth);
      const nextEnrolled = enrollmentByMonth.get(nextMonth) ?? 0;
      const nextSpotsLeft =
        danceClass.max_capacity != null
          ? Math.max(danceClass.max_capacity - nextEnrolled, 0)
          : null;
      built.push({
        month: nextMonth,
        monthLabel: formatCycleMonthLabel(nextMonth),
        note: getCycleNote(nextSessions.length, formatCycleMonthLabel(nextMonth)),
        sessions: nextSessions,
        sessionCount: nextSessions.length,
        isProrated: false,
        enrolled: nextEnrolled,
        spotsLeft: nextSpotsLeft,
        disabled: nextSpotsLeft != null && nextSpotsLeft <= 0,
        price: getCyclePrice(danceClass.price, nextSessions.length),
      });

      setOptions(built);
      setLoading(false);
    }

    fetchOptions();
    return () => {
      active = false;
    };
  }, [
    danceClass.class_type,
    danceClass.weekday,
    danceClass.id,
    danceClass.start_time,
    danceClass.price,
    danceClass.max_capacity,
  ]);

  return { options, loading };
}
