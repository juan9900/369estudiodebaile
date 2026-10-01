"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FixedClassSlot } from "@/lib/types/database";
import { sortSlots } from "@/lib/utils/fixed-class-slots";

/**
 * Loads the weekly slots (fixed_class_slots) for one or more fixed classes,
 * grouped by class_id. Used wherever a fixed class's full multi-day
 * schedule is needed client-side (checkout, class detail).
 */
export function useFixedClassSlots(classIds: string[]) {
  const [slotsByClass, setSlotsByClass] = useState<Map<string, FixedClassSlot[]>>(new Map());
  const [loading, setLoading] = useState(true);

  // Stable key so the effect doesn't re-run on every render when callers
  // pass a fresh array literal with the same ids.
  const key = classIds.slice().sort().join(",");

  useEffect(() => {
    if (classIds.length === 0) {
      setSlotsByClass(new Map());
      setLoading(false);
      return;
    }

    let active = true;

    async function fetchSlots() {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("fixed_class_slots")
        .select("*")
        .in("class_id", classIds);

      if (!active) return;

      const grouped = new Map<string, FixedClassSlot[]>();
      for (const slot of (data as FixedClassSlot[]) ?? []) {
        if (!grouped.has(slot.class_id)) grouped.set(slot.class_id, []);
        grouped.get(slot.class_id)!.push(slot);
      }
      for (const [classId, slots] of grouped) {
        grouped.set(classId, sortSlots(slots));
      }

      setSlotsByClass(grouped);
      setLoading(false);
    }

    fetchSlots();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { slotsByClass, loading };
}
