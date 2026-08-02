"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";

/**
 * Fetches active, upcoming, non-full classes of a given type — same
 * query/filtering rules as `ClassesList` — optionally excluding one class
 * (e.g. the class the user already selected before building a promo pack).
 */
export function useAvailableClasses(
  classType: DanceClass["class_type"],
  excludeId?: string,
  enabled: boolean = true,
) {
  const [classes, setClasses] = useState<DanceClass[]>([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setClasses([]);
      setLoading(false);
      return;
    }

    let active = true;

    async function fetchClasses() {
      setLoading(true);
      const supabase = createClient();
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("classes")
        .select("*, registrations(count)")
        .in("registrations.status", ["confirmed", "pending"])
        .eq("is_active", true)
        .eq("class_type", classType)
        .gte("scheduled_date", today)
        .order("scheduled_date", { ascending: true });

      if (!active) return;

      if (data) {
        const mapped = data.map((c) => ({
          ...c,
          current_enrollment:
            (c.registrations as { count: number }[])?.[0]?.count ?? 0,
        })) as DanceClass[];
        const now = new Date();
        setClasses(
          mapped.filter((c) => {
            if (excludeId && c.id === excludeId) return false;
            if (c.current_enrollment >= c.max_capacity) return false;
            if (c.scheduled_date === today) {
              const [hours, minutes, seconds] = c.start_time
                .split(":")
                .map(Number);
              const classStart = new Date();
              classStart.setHours(hours, minutes, seconds ?? 0, 0);
              return classStart > now;
            }
            return true;
          }),
        );
      }
      setLoading(false);
    }

    fetchClasses();
    return () => {
      active = false;
    };
  }, [classType, excludeId, enabled]);

  return { classes, loading };
}
