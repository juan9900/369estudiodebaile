"use client";

import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { getClassDisplayTitle } from "@/lib/utils/class-display";
import { formatTimeAMPM } from "@/lib/utils/time-slots";
import { getWeekdayNameShort, getWeekdayName } from "@/lib/utils/date-format";
import { useScrollReveal } from "@/lib/hooks/use-scroll-reveal";
import { useFixedClasses } from "@/lib/hooks/use-fixed-classes";

/**
 * Public listing for "clases fijas" — recurring weekly classes sold as a
 * monthly cycle, sibling to `ClassesList` (dated classes). Kept as a
 * separate component instead of branching `ClassesList` because the two
 * layouts differ in almost every row (weekday label vs. day number, no
 * per-row date sort, monthly price instead of per-class price).
 */
export function FixedClassesList() {
  const { classes, loading } = useFixedClasses();
  const revealRef = useScrollReveal<HTMLDivElement>({
    stagger: true,
    deps: [loading, classes.length],
  });

  return (
    <section className="px-[22px] pt-9 pb-[46px] md:px-16 md:pt-16 md:pb-24">
      <h2 className="font-archivo text-[30px] md:text-[44px] font-black leading-none tracking-[-0.03em] text-ink">
        Horarios disponibles
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
            No hay clases fijas activas en este momento.
          </p>
        ) : (
          classes.map((cls) => {
            const nextCycle = cls.cycles[cls.cycles.length - 1];

            return (
              <Link
                key={cls.id}
                href={`/modalidades/${cls.id}`}
                className="group grid grid-cols-[64px_1fr] gap-4 border-t border-line py-[22px] md:grid-cols-[120px_1fr_260px_120px_150px] md:items-center md:gap-8 md:py-[34px]"
              >
                {/* Weekday */}
                <div>
                  <div className="font-archivo text-[26px] md:text-[36px] font-black leading-none text-vino">
                    {getWeekdayNameShort(cls.weekday ?? 0)}
                  </div>
                  <div className="mt-1 font-mono text-[11px] tracking-[0.14em] text-muted2-2 md:text-xs">
                    TODAS LAS SEMANAS
                  </div>
                </div>

                {/* Name */}
                <div className="md:contents">
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-ink md:text-[34px]">
                      {getClassDisplayTitle(cls)}
                    </h3>
                    <div className="mt-1.5 flex flex-col gap-0.5 text-sm text-muted2 md:hidden">
                      <p>Instructor: {cls.instructor}</p>
                      <p>
                        Todos los {getWeekdayName(cls.weekday ?? 0)}s ·{" "}
                        {formatTimeAMPM(cls.start_time)}
                      </p>
                      {cls.price !== null && (
                        <p>Precio mensual: ${cls.price} (4 clases)</p>
                      )}
                      {nextCycle?.spotsLeft != null && (
                        <p>Cupos disponibles: {nextCycle.spotsLeft}</p>
                      )}
                    </div>
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
                        ${cls.price}/mes · 4 clases
                      </span>
                    )}
                    {nextCycle?.spotsLeft != null && (
                      <span className="flex items-center gap-1.5 text-sm text-muted2-2">
                        <Users size={14} strokeWidth={1.75} />
                        {nextCycle.spotsLeft} cupos
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
            Cada clase fija se paga por ciclo mensual: 4 sesiones, una vez
            por semana.
          </p>
        )}
      </div>
    </section>
  );
}
