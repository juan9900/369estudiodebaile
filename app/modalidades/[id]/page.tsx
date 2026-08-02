import { createClient } from "@/lib/supabase/server";
import type { DanceClass } from "@/lib/types/database";
import { Navbar } from "@/components/navbar";
import { ClassDetailHero } from "@/components/classes/class-detail-hero";
import { ClassDetailContent } from "@/components/classes/class-detail-content";
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

  return (
    <>
      <Navbar />
      <ClassDetailHero danceClass={danceClass} />
      <ClassDetailContent danceClass={danceClass} />
    </>
  );
}
