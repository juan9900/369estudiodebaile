"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { Button } from "./ui/button";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1547153760-18fc9498041d?w=800&h=1200&fit=crop",
];

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function ClassesSection() {
  const [classes, setClasses] = useState<DanceClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      const supabase = createClient();
      const { data } = await supabase
        .from("classes")
        .select("*, registrations(count)")
        .in("registrations.status", ["confirmed", "pending"])
        .eq("is_active", true)
        .order("scheduled_date", { ascending: true });
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

  return (
    <section id="clases" className="py-20 px-6 bg-[#F5F5F0]">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-sm font-bold text-primary mb-2 tracking-wider">
              CLASES
            </p>
            <h2 className="text-5xl font-black text-[#1a1a1a]">
              PRÓXIMAS CLASES
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-96 rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <p className="text-center text-primary py-12 font-bold">
            No hay clases activas en este momento.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {classes.map((cls, index) => {
              const image =
                cls.image_url ||
                FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              return (
                <Link
                  key={cls.id}
                  href={`/clases/${cls.id}`}
                  className="group relative h-96 rounded-lg overflow-hidden flex flex-col justify-between p-6"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent" />

                  <div className="relative z-10 bg-white text-primary font-bold px-4 py-2 rounded-full text-sm w-fit">
                    {formatTime(cls.start_time)}
                  </div>

                  <div className="relative z-10 space-y-3">
                    <h3 className="text-3xl font-black text-white">
                      {cls.title.toUpperCase()}
                    </h3>
                    <p className="text-white/90 text-sm">
                      Instructor: {cls.instructor}
                    </p>
                    <Button className="w-full bg-white text-primary hover:bg-gray-100 font-bold">
                      RESERVAR
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
