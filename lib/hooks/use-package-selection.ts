"use client";

import { useMemo, useState } from "react";
import type { DanceClass, PromoPackRow } from "@/lib/types/database";
import {
  getPackageTotal,
  getPerClassAmount,
  getPerClassAmounts,
  getDiscountFlags,
} from "@/lib/utils/promo-pricing";

/**
 * Tracks the promo pack the user picked and the classes they've added to
 * fill it. `initialClass` (the class the user entered checkout from) is
 * always included as slot #1 and can't be removed. `packs` is the list of
 * currently valid packs fetched from the DB (`use-promo-packs.ts`) — this
 * hook is agnostic of where they come from.
 */
export function usePackageSelection(
  initialClass: DanceClass,
  packs: PromoPackRow[],
) {
  const [pack, setPack] = useState<PromoPackRow | null>(null);
  const [extra, setExtra] = useState<DanceClass[]>([]);

  const selected = useMemo(
    () => [initialClass, ...extra],
    [initialClass, extra],
  );

  function choosePack(next: PromoPackRow) {
    setPack(next);
    setExtra([]);
  }

  function clearPack() {
    setPack(null);
    setExtra([]);
  }

  function isSelected(id: string) {
    return id === initialClass.id || extra.some((c) => c.id === id);
  }

  function add(cls: DanceClass) {
    if (!pack) return;
    if (isSelected(cls.id)) return;
    if (extra.length + 1 >= pack.size) return; // already full
    setExtra((prev) => [...prev, cls]);
  }

  function remove(id: string) {
    if (id === initialClass.id) return; // can't remove the starting class
    setExtra((prev) => prev.filter((c) => c.id !== id));
  }

  const count = selected.length;
  const isComplete = pack != null && count === pack.size;
  const total = pack ? getPackageTotal(pack, initialClass.price) : null;
  const perClassAmount = pack
    ? getPerClassAmount(pack, initialClass.price)
    : null;
  const discountApplied = pack != null && pack.size > 1;
  // Per-registration amount/discount, aligned with `selected` order — e.g.
  // for a 6-pack with 1 free class, 5 entries at normal price and the last
  // one at $0, instead of splitting the discount evenly across all 6.
  const perClassAmounts = pack
    ? getPerClassAmounts(pack, initialClass.price)
    : null;
  const discountFlags = pack ? getDiscountFlags(pack) : null;

  return {
    packs,
    pack,
    choosePack,
    clearPack,
    selected,
    add,
    remove,
    isSelected,
    count,
    isComplete,
    total,
    perClassAmount,
    discountApplied,
    perClassAmounts,
    discountFlags,
  };
}
