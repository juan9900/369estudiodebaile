import { createClient } from "@/lib/supabase/server";
import { RegistrationsTable } from "@/components/admin/registrations-table";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ClassRegistrationsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const classId = (await params).id;

  const { data } = await supabase
    .from("classes")
    .select("title")
    .eq("id", classId)
    .single();

  if (!data) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/classes"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Volver a clases
        </Link>
        <h1 className="text-2xl font-black text-[#1a1a1a]">{data.title}</h1>
        <p className="text-gray-500 text-sm mt-1">Inscripciones de esta clase</p>
      </div>
      <RegistrationsTable classId={classId} />
    </div>
  );
}
