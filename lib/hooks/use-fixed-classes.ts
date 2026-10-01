"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass, FixedClassSlot } from "@/lib/types/database";
import { buildCycleWindow, getNextCycleStart, type CycleWindow } from "@/lib/utils/fixed-class-cycle";
import { sortSlots } from "@/lib/utils/fixed-class-slots";

export interface FixedClassWithSlots extends DanceClass {
  slots: FixedClassSlot[];
  /** The cycle a student joining right now would get, or null if the class has no slots. */
  nextCycle: CycleWindow | null;
}

/**
 * Fetches all active, published fixed classes ("fijas") with their weekly
 * slots and next available cycle, for the public listing. Unlike dated
 * classes, fijas have no scheduled_date to filter/sort by — they're always
 * "upcoming" while active and published, and are sorted by their earliest
 * slot (classes.weekday/start_time, kept in sync by a DB trigger).
 */
export function useFixedClasses() {
  const [classes, setClasses] = useState<FixedClassWithSlots[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchFixedClasses() {
      setLoading(true);
      const supabase = createClient();
      const nowIso = new Date().toISOString();

      const { data } = await supabase
        .from("classes")
        .select("*")
        .eq("is_active", true)
        .eq("class_type", "fijas")
        .or(`published_at.is.null,published_at.lte.${nowIso}`);

      if (!active) return;

      const fetched = (data as DanceClass[]) ?? [];
      if (fetched.length === 0) {
        setClasses([]);
        setLoading(false);
        return;
      }

      const { data: slotRows } = await supabase
        .from("fixed_class_slots")
        .select("*")
        .in(
          "class_id",
          fetched.map((c) => c.id),
        );

      if (!active) return;

      const slotsByClass = new Map<string, FixedClassSlot[]>();
      for (const slot of (slotRows as FixedClassSlot[]) ?? []) {
        if (!slotsByClass.has(slot.class_id)) slotsByClass.set(slot.class_id, []);
        slotsByClass.get(slot.class_id)!.push(slot);
      }

      const withSlots: FixedClassWithSlots[] = fetched
        .map((cls) => {
          const slots = sortSlots(slotsByClass.get(cls.id) ?? []);
          const nextStart = getNextCycleStart(slots, new Date(), cls.starts_on);
          return {
            ...cls,
            slots,
            nextCycle: nextStart ? buildCycleWindow(slots, nextStart) : null,
          };
        })
        .filter((cls) => cls.slots.length > 0)
        .sort((a, b) => {
          if (a.weekday !== b.weekday) return (a.weekday ?? 0) - (b.weekday ?? 0);
          return a.start_time.localeCompare(b.start_time);
        });

      setClasses(withSlots);
      setLoading(false);
    }

    fetchFixedClasses();
    return () => {
      active = false;
    };
  }, []);

  return { classes, loading };
}
