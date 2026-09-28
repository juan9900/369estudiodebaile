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
import { getCyclePrice } from "@/lib/utils/fixed-class-pricing";

export interface FixedClassCycle {
  month: MonthKey;
  monthLabel: string;
  sessions: string[];
  remaining: string[];
  enrolled: number;
  spotsLeft: number | null;
  price: number | null;
  isProrated: boolean;
}

export interface FixedClassWithCycles extends DanceClass {
  cycles: FixedClassCycle[];
}

/**
 * Fetches all active fixed classes ("fijas") with their current + next
 * month cycle availability, for the public listing. Unlike dated classes,
 * fijas have no scheduled_date to filter/sort by — they're always "upcoming"
 * while active, and are sorted by weekday then start time.
 */
export function useFixedClasses() {
  const [classes, setClasses] = useState<FixedClassWithCycles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchFixedClasses() {
      setLoading(true);
      const supabase = createClient();

      const { data } = await supabase
        .from("classes")
        .select("*")
        .eq("is_active", true)
        .eq("class_type", "fijas");

      if (!active) return;

      const fetched = (data as DanceClass[]) ?? [];
      if (fetched.length === 0) {
        setClasses([]);
        setLoading(false);
        return;
      }

      const currentMonth = getCurrentMonthKey();
      const nextMonth = addMonthsToKey(currentMonth, 1);

      const { data: enrollmentRows } = await supabase
        .from("fixed_class_cycle_enrollment")
        .select("class_id, cycle_month, enrolled")
        .in(
          "class_id",
          fetched.map((c) => c.id),
        )
        .in("cycle_month", [currentMonth, nextMonth]);

      if (!active) return;

      const enrollmentByKey = new Map<string, number>();
      for (const row of (enrollmentRows as
        | { class_id: string; cycle_month: string; enrolled: number }[]
        | null) ?? []) {
        enrollmentByKey.set(`${row.class_id}:${row.cycle_month}`, row.enrolled);
      }

      const withCycles: FixedClassWithCycles[] = fetched
        .filter((cls) => cls.weekday != null)
        .map((cls) => {
          const weekday = cls.weekday as number;
          const cycles: FixedClassCycle[] = [];

          const remaining = getRemainingSessionDates(
            weekday,
            currentMonth,
            cls.start_time,
          );
          if (remaining.length > 0) {
            const enrolled = enrollmentByKey.get(`${cls.id}:${currentMonth}`) ?? 0;
            const spotsLeft =
              cls.max_capacity != null
                ? Math.max(cls.max_capacity - enrolled, 0)
                : null;
            cycles.push({
              month: currentMonth,
              monthLabel: formatCycleMonthLabel(currentMonth),
              sessions: getCycleSessionDates(weekday, currentMonth),
              remaining,
              enrolled,
              spotsLeft,
              price: getCyclePrice(cls.price, remaining.length),
              isProrated: true,
            });
          }

          const nextSessions = getCycleSessionDates(weekday, nextMonth);
          const nextEnrolled = enrollmentByKey.get(`${cls.id}:${nextMonth}`) ?? 0;
          const nextSpotsLeft =
            cls.max_capacity != null
              ? Math.max(cls.max_capacity - nextEnrolled, 0)
              : null;
          cycles.push({
            month: nextMonth,
            monthLabel: formatCycleMonthLabel(nextMonth),
            sessions: nextSessions,
            remaining: nextSessions,
            enrolled: nextEnrolled,
            spotsLeft: nextSpotsLeft,
            price: getCyclePrice(cls.price, nextSessions.length),
            isProrated: false,
          });

          return { ...cls, cycles };
        })
        .sort((a, b) => {
          if (a.weekday !== b.weekday) return (a.weekday ?? 0) - (b.weekday ?? 0);
          return a.start_time.localeCompare(b.start_time);
        });

      setClasses(withCycles);
      setLoading(false);
    }

    fetchFixedClasses();
    return () => {
      active = false;
    };
  }, []);

  return { classes, loading };
}
