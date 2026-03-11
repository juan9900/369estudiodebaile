import { createClient } from "@/lib/supabase/server";
import type { DanceClass } from "@/lib/types/database";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { notFound } from "next/navigation";
import CheckOutContainer from "@/components/checkout/checkout-container";

export default async function CheckoutPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const classId = (await params).id;

  const { data } = await supabase
    .from("classes")
    .select("*, registrations(count)")
    .eq("registrations.status", "confirmed")
    .eq("id", classId)
    .eq("is_active", true)
    .single();

  if (!data) notFound();

  const danceClass = {
    ...data,
    current_enrollment:
      (data.registrations as { count: number }[])?.[0]?.count ?? 0,
  } as DanceClass;
  const spotsLeft = danceClass.max_capacity - danceClass.current_enrollment;

  if (spotsLeft <= 0) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-black text-white mb-3">
            {danceClass.title}
          </h1>
          <p className="text-white/70">
            Esta clase ya está llena. Por favor, elige otra clase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <CheckOutContainer danceClass={danceClass} />
      </div>
    </div>
  );
}
