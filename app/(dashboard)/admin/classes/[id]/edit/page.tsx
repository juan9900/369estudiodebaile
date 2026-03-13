"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { ClassForm } from "@/components/admin/class-form";

export default function EditClassPage() {
  const { id } = useParams<{ id: string }>();
  const [danceClass, setDanceClass] = useState<DanceClass | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClass() {
      const supabase = createClient();
      const { data } = await supabase.from("classes").select("*").eq("id", id).single();
      if (data) setDanceClass(data as DanceClass);
      setLoading(false);
    }
    fetchClass();
  }, [id]);

  if (loading) return <div className="text-gray-500">Cargando...</div>;
  if (!danceClass) return <div className="text-gray-500">Clase no encontrada.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">Editar clase</h1>
        <p className="text-gray-500 text-sm mt-1">{danceClass.title}</p>
      </div>
      <ClassForm initialData={danceClass} />
    </div>
  );
}
