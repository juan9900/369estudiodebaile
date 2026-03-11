"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<DanceClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      const supabase = createClient();
      const { data } = await supabase
        .from("classes")
        .select("*, registrations(count)")
        .eq("registrations.status", "confirmed")
        .order("scheduled_date", { ascending: false });
      if (data)
        setClasses(
          data.map((c) => ({
            ...c,
            current_enrollment:
              (c.registrations as { count: number }[])?.[0]?.count ?? 0,
          })) as DanceClass[],
        );
      setLoading(false);
    }
    fetchClasses();
  }, []);

  async function deleteClass(id: string) {
    if (!confirm("¿Eliminar esta clase?")) return;
    const supabase = createClient();
    await supabase.from("classes").delete().eq("id", id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a1a]">
            Gestión de clases
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Crear, editar y eliminar clases
          </p>
        </div>
        <Link href="/admin/classes/new">
          <Button className="bg-primary hover:bg-[#6d1730]">
            <Plus size={16} className="mr-2" />
            Nueva clase
          </Button>
        </Link>
      </div>

      {classes.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay clases. Crea una nueva.</p>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => (
            <Card key={cls.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1a1a1a]">
                        {cls.title}
                      </h3>
                      <Badge
                        className={
                          cls.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {cls.is_active ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Instructor: {cls.instructor} · {cls.scheduled_date} ·{" "}
                      {cls.start_time.slice(0, 5)} – {cls.end_time.slice(0, 5)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {cls.current_enrollment}/{cls.max_capacity} inscritos
                      {cls.price !== null && ` · $${cls.price.toFixed(2)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/classes/${cls.id}/edit`}>
                      <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <Pencil size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteClass(cls.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
