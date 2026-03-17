"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    weekday: "long",
  });
}

interface ClassesCarouselProps {
  classType: "individual" | "masterclass" | "proyecto";
}

export function ClassesCarousel({ classType }: ClassesCarouselProps) {
  const [classes, setClasses] = useState<DanceClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchClasses() {
      const supabase = createClient();
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("classes")
        .select("*, registrations(count)")
        .in("registrations.status", ["confirmed", "pending"])
        .eq("is_active", true)
        .eq("class_type", classType)
        .gte("scheduled_date", today)
        .order("scheduled_date", { ascending: true });
      if (data) {
        const mapped = data.map((c) => ({
          ...c,
          current_enrollment:
            (c.registrations as { count: number }[])?.[0]?.count ?? 0,
        })) as DanceClass[];
        setClasses(mapped.filter((c) => c.current_enrollment < c.max_capacity));
      }
      setLoading(false);
    }
    fetchClasses();
  }, [classType]);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    checkScroll();
  }, [classes]);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a")?.offsetWidth ?? 300;
    el.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }

  return (
    <section className="py-20 px-6 bg-[#F5F5F0]">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black text-[#1a1a1a]">
              PRÓXIMAS CLASES
            </h2>
          </div>
          {!loading && classes.length > 0 && (
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="p-2 rounded-full border-2 border-primary text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="p-2 rounded-full border-2 border-primary text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
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
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {classes.map((cls) => (
              <Link
                key={cls.id}
                href={`/clases/${cls.id}`}
                className="group relative h-96 rounded-lg overflow-hidden flex-none flex flex-col justify-between p-6 snap-start
                  w-full
                  md:w-[calc(50%-12px)]
                  lg:w-[calc(33.333%-16px)]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cls.image_url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent" />

                <div className="relative z-10 flex flex-col justify-between h-full space-y-1">
                  <div>
                    <h3 className="text-3xl font-black text-white">
                      {cls.title.toUpperCase()}
                    </h3>
                    <p className="text-white/90 text-md font-bold">
                      Instructor: {cls.instructor}
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-start relative z-10 text-white uppercase font-bold py-2 rounded-md text-2xl w-fit">
                      <span>{formatDate(cls.scheduled_date)}</span>
                      <span>{formatTime(cls.start_time)}</span>
                    </div>
                    <Button className="w-full bg-white text-primary hover:bg-gray-100 font-bold">
                      RESERVAR
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && classes.length > 0 && (
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border-2 border-primary text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-full border-2 border-primary text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
