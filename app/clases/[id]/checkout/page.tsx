import { createClient } from "@/lib/supabase/server";
import type { DanceClass } from "@/lib/types/database";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { notFound } from "next/navigation";
import CheckOutContainer from "@/components/checkout/checkout-container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    .in("registrations.status", ["confirmed", "pending"])
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
          <Link href={`/`}>
            <Button className="mt-5 bg-white  text-primary hover:bg-gray-100 font-black text-base h-12 px-8 group shadow-lg hover:shadow-xl transition-all">
              VOLVER A INICIO
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
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
