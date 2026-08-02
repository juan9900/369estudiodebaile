"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { getClassDisplayTitle } from "@/lib/utils/class-display";
import { formatTimeAMPM } from "@/lib/utils/time-slots";
import { formatDateShortLabel, getDateParts } from "@/lib/utils/date-format";
import { CLASS_LEVELS } from "@/constants";
import { useScrollReveal } from "@/lib/hooks/use-scroll-reveal";

interface ClassesListProps {
  classType: "clases" | "masterclass" | "proyectos";
}

export function ClassesList({ classType }: ClassesListProps) {
  const [classes, setClasses] = useState<DanceClass[]>([]);
  const [loading, setLoading] = useState(true);

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
        const now = new Date();
        setClasses(
          mapped.filter((c) => {
            if (c.current_enrollment >= c.max_capacity) return false;
            if (c.scheduled_date === today) {
              const [hours, minutes, seconds] = c.start_time
                .split(":")
                .map(Number);
              const classStart = new Date();
              classStart.setHours(hours, minutes, seconds ?? 0, 0);
              return classStart > now;
            }
            return true;
          }),
        );
      }
      setLoading(false);
    }
    fetchClasses();
  }, [classType]);

  const noun = classType !== "proyectos" ? "clases" : "proyectos";
  const revealRef = useScrollReveal<HTMLDivElement>({
    stagger: true,
    deps: [loading, classes.length],
  });

  return (
    <section className="px-[22px] pt-9 pb-[46px] md:px-16 md:pt-16 md:pb-24">
      <h2 className="font-archivo text-[30px] md:text-[44px] font-black leading-none tracking-[-0.03em] text-ink">
        {classType !== "proyectos" ? "Próximas" : "Próximos"} {noun}
      </h2>

      <div ref={revealRef} className="mt-4 md:mt-8">
        {loading ? (
          <div className="flex flex-col gap-4 py-6">
            {[0, 1].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-line-soft" />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <p className="border-t border-line py-8 text-sm text-muted2-2">
            No hay {noun} activas en este momento.
          </p>
        ) : (
          classes.map((cls) => {
            const { dayNumPadded } = getDateParts(cls.scheduled_date);
            const levelText = CLASS_LEVELS.find(
              (l) => l.levelNumber == cls.level,
            )?.levelText;

            return (
              <Link
                key={cls.id}
                href={`/modalidades/${cls.id}`}
                className="group grid grid-cols-[64px_1fr] gap-4 border-t border-line py-[22px] md:grid-cols-[120px_1fr_260px_120px_150px] md:items-center md:gap-8 md:py-[34px]"
              >
                {/* Day */}
                <div>
                  <div className="font-archivo text-[30px] md:text-[44px] font-black leading-none text-vino">
                    {dayNumPadded}
                  </div>
                  <div className="mt-1 font-mono text-[11px] tracking-[0.14em] text-muted2-2 md:text-xs">
                    {formatDateShortLabel(cls.scheduled_date)}
                  </div>
                </div>

                {/* Name (mobile: name + instructor/time/price in one column) */}
                <div className="md:contents">
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-ink md:text-[34px]">
                      {getClassDisplayTitle(cls)}
                    </h3>
                    <div className="mt-1.5 flex flex-col gap-0.5 text-sm text-muted2 md:hidden">
                      <p>Instructor: {cls.instructor}</p>
                      <p>Hora: {formatTimeAMPM(cls.start_time)}</p>
                      {cls.price !== null && <p>Precio: ${cls.price}</p>}
                    </div>
                    {levelText && (
                      <p className="mt-1 hidden text-[15px] text-muted2 md:block">
                        Nivel {levelText.toLowerCase()}
                      </p>
                    )}
                    <span className="mt-3 inline-block rounded-sm bg-vino px-4 py-2 text-[13px] font-bold text-white transition-colors group-hover:bg-vino-hover md:hidden">
                      Reservar
                    </span>
                  </div>

                  <div className="hidden md:flex md:flex-col md:gap-1">
                    <span className="text-xs uppercase tracking-wide text-muted2-2">
                      Instructor
                    </span>
                    <span className="text-base text-ink">
                      {cls.instructor}
                    </span>
                  </div>

                  <div className="hidden md:flex md:flex-col md:gap-1">
                    <span className="flex items-center gap-2 text-base text-ink">
                      <Clock size={16} strokeWidth={1.75} />
                      {formatTimeAMPM(cls.start_time)}
                    </span>
                    {cls.price !== null && (
                      <span className="text-sm text-muted2-2">
                        ${cls.price}
                      </span>
                    )}
                  </div>

                  <div className="hidden md:block">
                    <span className="block rounded-sm bg-vino py-[15px] text-center text-[15px] font-bold text-white transition-colors group-hover:bg-vino-hover">
                      Reservar
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
        {!loading && classes.length > 0 && (
          <p className="border-t border-line py-[18px] text-sm text-muted2-2">
            Publicamos nuevas fechas cada semana.
          </p>
        )}
      </div>
    </section>
  );
}
