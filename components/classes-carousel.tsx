"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { Button } from "./ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getClassDisplayTitle } from "@/lib/utils/class-display";

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
    month: "long",
  });
}

interface ClassesCarouselProps {
  classType: "clases" | "masterclass" | "proyectos";
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
    const cards = el.querySelectorAll<HTMLElement>(":scope > a");
    if (cards.length < 2) return;
    const scrollAmount = cards[1].offsetLeft - cards[0].offsetLeft;
    el.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <section className="py-20 px-6 bg-primary">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black text-white uppercase">
              {classType !== "proyectos" ? "PRÓXIMAS" : "PRÓXIMOS"} {classType}
            </h2>
          </div>
          {!loading && classes.length > 0 && (
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="p-2 rounded-full border-2 border-white text-white disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="p-2 rounded-full border-2 border-white text-white disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-96 rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <p className="text-center text-white py-12 font-bold">
            No hay {classType}{" "}
            {classType !== "proyectos" ? "activas" : "activos"} en este momento.
          </p>
        ) : (
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex  overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {classes.map((cls) => (
              <Link
                key={cls.id}
                href={`/modalidades/${cls.id}`}
                className="group relative h-96 rounded-lg overflow-hidden flex-none flex flex-col justify-between p-6 snap-start mx-3
                  w-full
                  md:w-[calc(50%-12px)]
                  lg:w-[calc(33.333%-16px)]"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-white" />
                <div className="absolute " />

                <div className="relative z-10 flex flex-col justify-between h-full space-y-1">
                  <div className=""></div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-4xl font-black text-primary text-center uppercase ">
                      {getClassDisplayTitle(cls)}
                    </h3>

                    <div className="flex flex-row items-center justify-between relative z-10 text-primary uppercase font-bold py-2 rounded-md text-2xl  w-4/5 mx-auto ">
                      <div className="w-2/5 ">
                        <span className="text-gray-600 flex flex-col  items-center gap-1 text-sm font-bold uppercase ">
                          <Calendar size={15} />
                          {formatDate(cls.scheduled_date)}
                        </span>
                      </div>
                      <div className="flex-shrink w-1/5  flex items-center justify-center">
                        <div className="rounded-full bg-primary/30 h-2 w-2"></div>
                      </div>
                      <div className="w-2/5 ">
                        <span className="text-gray-600 flex flex-col  items-center gap-1 text-sm font-bold uppercase ">
                          <Clock size={15} />
                          {formatTime(cls.start_time).toString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-primary/80 uppercase text-sm font-semibold">
                        Instructor:
                      </span>
                      <p className="text-gray-700 text-md font-semibold uppercase text-center text-lg">
                        {cls.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Button className="w-full bg-primary text-white hover:bg-primary-dark font-bold">
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
              className="p-2 rounded-full border-2 border-primary text-white disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-full border-2 border-primary text-white disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
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
