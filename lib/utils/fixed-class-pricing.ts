import { SESSIONS_PER_CYCLE } from "@/constants";
import { roundCents } from "@/lib/utils/money";

/**
 * Pricing for "clases fijas" (fixed-class) monthly cycles. There are no
 * promo packs here — `monthlyPrice` is the simple full-cycle price set by
 * the admin (classes.price), and joining mid-cycle is prorated by the
 * number of sessions actually remaining.
 */

/** Price for `monthlyPrice`/SESSIONS_PER_CYCLE per session, rounded to cents. */
export function getPerSessionPrice(monthlyPrice: number | null): number | null {
  if (monthlyPrice == null) return null;
  return roundCents(monthlyPrice / SESSIONS_PER_CYCLE);
}

/**
 * Price to charge for a cycle with `sessions` sessions. A full cycle
 * (sessions === SESSIONS_PER_CYCLE) charges the plain monthly price; joining
 * with fewer sessions remaining is prorated at the per-session rate.
 */
export function getCyclePrice(
  monthlyPrice: number | null,
  sessions: number,
): number | null {
  if (monthlyPrice == null) return null;
  if (sessions >= SESSIONS_PER_CYCLE) return monthlyPrice;
  const perSession = getPerSessionPrice(monthlyPrice);
  return perSession == null ? null : roundCents(perSession * sessions);
}

/** Short note shown under a prorated cycle option, e.g. "2 de 4 clases". */
export function getCycleNote(sessions: number, monthLabel: string): string {
  return sessions >= SESSIONS_PER_CYCLE
    ? `${SESSIONS_PER_CYCLE} clases · ${monthLabel}`
    : `${sessions} de ${SESSIONS_PER_CYCLE} clases restantes · ${monthLabel}`;
}
