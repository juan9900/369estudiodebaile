"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PromoPackRow } from "@/lib/types/database";

/**
 * Fetches the promo packs currently valid for checkout: active, and within
 * their `valid_from`/`valid_until` window (both optional). Admins manage the
 * full list — including scheduled/expired/inactive packs — from
 * `/admin/promo-packs`.
 */
export function usePromoPacks() {
  const [packs, setPacks] = useState<PromoPackRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchPacks() {
      setLoading(true);
      const supabase = createClient();
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("promo_packs")
        .select("*")
        .eq("is_active", true)
        .or(`valid_from.is.null,valid_from.lte.${today}`)
        .or(`valid_until.is.null,valid_until.gte.${today}`)
        .order("sort_order", { ascending: true });

      if (!active) return;
      setPacks((data as PromoPackRow[]) ?? []);
      setLoading(false);
    }

    fetchPacks();
    return () => {
      active = false;
    };
  }, []);

  return { packs, loading };
}
