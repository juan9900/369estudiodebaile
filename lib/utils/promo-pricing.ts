import type { PromoPackRow } from "@/lib/types/database";

/**
 * Promo pack pricing for regular classes ("clases"). Packs are managed by
 * admins in `/admin/promo-packs` (table `promo_packs`) — each one bundles
 * `size` classes at a discount described by `discount_type` + `discount_value`:
 *
 * - "none": full price (size-1 packs use the class's own price).
 * - "percent": `discount_value`% off the normal total (e.g. 40% off).
 * - "free_classes": `discount_value` of the `size` classes are free
 *   (e.g. size=6, value=1 → "paga 5 y la #6 sale gratis").
 * - "fixed_price": `discount_value` IS the total to charge, no math involved.
 */

/** Rounds to the nearest cent to avoid floating point noise (e.g. 4.999999). */
function roundCents(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Total USD to charge for a given pack, or null if the class has no price yet. */
export function getPackageTotal(
  pack: PromoPackRow,
  classPrice: number | null,
): number | null {
  if (pack.discount_type === "fixed_price") {
    return pack.discount_value;
  }
  if (classPrice == null) return null;

  switch (pack.discount_type) {
    case "percent": {
      const pct = pack.discount_value ?? 0;
      return roundCents(classPrice * pack.size * (1 - pct / 100));
    }
    case "free_classes": {
      const free = pack.discount_value ?? 0;
      return roundCents(classPrice * Math.max(pack.size - free, 0));
    }
    case "none":
    default:
      return roundCents(classPrice * pack.size);
  }
}

/** Amount attributed to each individual class registration within the pack. */
export function getPerClassAmount(
  pack: PromoPackRow,
  classPrice: number | null,
): number | null {
  const total = getPackageTotal(pack, classPrice);
  return total == null ? null : roundCents(total / pack.size);
}

/**
 * Per-registration breakdown within the pack, in the order classes are
 * charged. For "free_classes" this is normal price for the paid classes and
 * $0 for the free ones (e.g. 6-pack with 1 free → [price, price, price,
 * price, price, 0]), matching how the discount is actually applied rather
 * than an even split. Other discount types apply evenly across the pack
 * since the discount isn't tied to any specific class.
 */
export function getPerClassAmounts(
  pack: PromoPackRow,
  classPrice: number | null,
): (number | null)[] {
  if (classPrice == null) return Array(pack.size).fill(null);

  if (pack.discount_type === "free_classes") {
    const free = Math.min(Math.max(pack.discount_value ?? 0, 0), pack.size);
    const paid = pack.size - free;
    return [
      ...Array(paid).fill(roundCents(classPrice)),
      ...Array(free).fill(0),
    ];
  }

  const per = getPerClassAmount(pack, classPrice);
  return Array(pack.size).fill(per);
}

/**
 * Whether each individual registration within the pack should be flagged as
 * discounted, in the same order as `getPerClassAmounts`. For "free_classes"
 * only the free slots are discounted — the paid ones are normal price.
 */
export function getDiscountFlags(pack: PromoPackRow): boolean[] {
  if (pack.discount_type === "free_classes") {
    const free = Math.min(Math.max(pack.discount_value ?? 0, 0), pack.size);
    const paid = pack.size - free;
    return [...Array(paid).fill(false), ...Array(free).fill(true)];
  }
  return Array(pack.size).fill(pack.size > 1);
}

/** Effective discount %, compared against the class's normal price × size. Null if there's nothing to compare (no class price, or a 1-class pack at normal price). */
export function getDiscountPercent(
  pack: PromoPackRow,
  classPrice: number | null,
): number | null {
  if (classPrice == null) return null;
  const total = getPackageTotal(pack, classPrice);
  const normalTotal = classPrice * pack.size;
  if (total == null || normalTotal <= 0) return null;
  const pct = Math.round((1 - total / normalTotal) * 100);
  return pct > 0 ? pct : null;
}

/** Auto-generated subtitle for a pack, used when the admin didn't set a custom `note`. */
export function getDefaultNote(
  pack: PromoPackRow,
  classPrice: number | null,
): string {
  switch (pack.discount_type) {
    case "free_classes": {
      const free = pack.discount_value ?? 0;
      const paid = pack.size - free;
      return `Paga ${paid} clase${paid === 1 ? "" : "s"} y la #${pack.size} sale gratis`;
    }
    case "percent": {
      const perClass = getPerClassAmount(pack, classPrice);
      return `${pack.discount_value}% de descuento${
        perClass != null ? ` — $${perClass.toFixed(2)} c/clase` : ""
      }`;
    }
    case "fixed_price": {
      const pct = getDiscountPercent(pack, classPrice);
      return pct != null ? `¡${pct}% de descuento!` : "Precio especial";
    }
    case "none":
    default:
      return "Precio normal";
  }
}
