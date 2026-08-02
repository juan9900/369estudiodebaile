"use client";

import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { useEntranceReveal } from "@/lib/hooks/use-scroll-reveal";

export function Hero() {
  const revealRef = useEntranceReveal<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Faded "369" watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06] md:justify-end"
      >
        <span className="translate-y-4 rotate-[-8deg] font-archivo text-[280px] font-black text-vino md:translate-x-16 md:text-[460px]">
          369
        </span>
      </div>

      <div
        ref={revealRef}
        className="relative z-10 px-[22px] pt-[34px] pb-7 md:px-16 md:py-24"
      >
        <h1 className="font-archivo text-[52px] md:text-[88px] font-black leading-[0.92] tracking-[-0.045em] text-ink">
          <span className="text-vino">369</span> ESTUDIO
          <br />
          DE BAILE
        </h1>
        <p className="mt-[18px] max-w-[305px] text-[15px] leading-[1.55] text-muted2 md:mt-6 md:max-w-[440px] md:text-lg">
          Eleva tu ritmo cada sábado y domingo. Coreografías nuevas, para
          todos los niveles.
        </p>
        <div className="mt-[26px] flex items-center gap-4 md:mt-9 md:gap-6">
          <LinkButton href="/modalidades/classes">
            Ver horarios
            <ArrowRight size={18} strokeWidth={1.75} />
          </LinkButton>
          <LinkButton href="/alquiler" variant="outline">
            Alquilar estudio
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
