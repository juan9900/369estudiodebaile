import { createClient } from "@/lib/supabase/server";
import type { DanceClass } from "@/lib/types/database";
import { ClassDetailHero } from "@/components/classes/class-detail-hero";
import { ClassIntegratedContentSection } from "@/components/classes/class-integrated-content-section";
import { ClassCtaSection } from "@/components/classes/class-cta-section";
import { notFound } from "next/navigation";

export default async function ClassDetailPage({
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
    current_enrollment: (data.registrations as { count: number }[])?.[0]?.count ?? 0,
  } as DanceClass;

  return (
    <>
      <ClassDetailHero danceClass={danceClass} />
      <ClassIntegratedContentSection danceClass={danceClass} />
      <ClassCtaSection danceClass={danceClass} />
    </>
  );
}
