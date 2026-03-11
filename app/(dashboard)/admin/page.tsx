"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, ClipboardList } from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState({
    users: 0,
    classes: 0,
    registrations: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      const [usersRes, classesRes, regsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("classes").select("id", { count: "exact" }),
        supabase.from("registrations").select("id", { count: "exact" }),
      ]);
      setStats({
        users: usersRes.count ?? 0,
        classes: classesRes.count ?? 0,
        registrations: regsRes.count ?? 0,
      });
    }
    fetchStats();
  }, []);

  const cards = [
    { label: "Usuarios", value: stats.users, icon: Users },
    { label: "Clases", value: stats.classes, icon: BookOpen },
    { label: "Inscripciones", value: stats.registrations, icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">
          Panel de administración
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Resumen general del estudio
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
