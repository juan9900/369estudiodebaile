import type { SupabaseClient } from "@supabase/supabase-js";
import { buildStatusChangeEmail } from "@/lib/utils/checkout-notifications";

interface NotifyPackStatusParams {
  purchaseId: string;
  /** Send even if some classes in the purchase are still pending. */
  force?: boolean;
}

/**
 * Sends a single consolidated "clientStatusChange" email for every
 * registration created by the same checkout (identified by `purchase_id`),
 * once none of them are left in "pending" — or immediately when `force`
 * is set, e.g. from the admin's manual "Enviar resumen ahora" action.
 */
export async function notifyPackStatusIfResolved(
  supabase: SupabaseClient,
  { purchaseId, force = false }: NotifyPackStatusParams,
) {
  const { data: siblings } = await supabase
    .from("registrations")
    .select(
      "contact_name, contact_lastname, contact_email, status, paid_amount, classes(title, instructor, scheduled_date, start_time, price)",
    )
    .eq("purchase_id", purchaseId);

  if (!siblings || siblings.length === 0) return;

  const stillPending = siblings.some((r: any) => r.status === "pending");
  if (stillPending && !force) return;

  const first = siblings[0] as any;
  const classes = siblings.map((r: any) => ({
    className: r.classes.title,
    instructor: r.classes.instructor,
    day: r.classes.scheduled_date,
    hour: r.classes.start_time,
    price: r.paid_amount ?? r.classes.price,
    status: r.status,
  }));
  const totalPrice = classes.reduce(
    (sum: number, c: any) => sum + (c.price ?? 0),
    0,
  );

  const messages = buildStatusChangeEmail({
    name: first.contact_name,
    lastname: first.contact_lastname,
    email: first.contact_email,
    classes,
    totalPrice,
  });

  await fetch("/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
}
