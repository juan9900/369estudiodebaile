"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ConflictingSlot {
  start_time: string;
  end_time: string;
}

/**
 * Existing fixed_class_slots rows for the given weekdays (across every
 * other fixed class), excluding `excludeClassId` — the class currently
 * being edited. Used by the admin's slot editor to detect, per weekday,
 * which time ranges are already taken by another fixed class.
 */
export function useFixedClassSlotConflicts(weekdays: number[], excludeClassId?: string) {
  const [conflictsByWeekday, setConflictsByWeekday] = useState<Map<number, ConflictingSlot[]>>(
    new Map(),
  );

  const key = weekdays.slice().sort().join(",");

  useEffect(() => {
    if (weekdays.length === 0) {
      setConflictsByWeekday(new Map());
      return;
    }

    let active = true;

    async function fetchConflicts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("fixed_class_slots")
        .select("class_id, weekday, start_time, end_time")
        .in("weekday", weekdays);

      if (!active) return;

      const grouped = new Map<number, ConflictingSlot[]>();
      for (const row of
        (data as { class_id: string; weekday: number; start_time: string; end_time: string }[]) ??
        []) {
        if (excludeClassId && row.class_id === excludeClassId) continue;
        if (!grouped.has(row.weekday)) grouped.set(row.weekday, []);
        grouped.get(row.weekday)!.push({ start_time: row.start_time, end_time: row.end_time });
      }
      setConflictsByWeekday(grouped);
    }

    fetchConflicts();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, excludeClassId]);

  return conflictsByWeekday;
}
