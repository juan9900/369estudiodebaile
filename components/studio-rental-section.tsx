"use client";

import Image from "next/image";
import { LinkButton } from "@/components/ui/link-button";
import { useScrollReveal } from "@/lib/hooks/use-scroll-reveal";

export function StudioRentalSection() {
  const revealRef = useScrollReveal<HTMLDivElement>({ stagger: true });

  return (
    <section
      ref={revealRef}
      className="px-[22px] pt-11 pb-[46px] md:grid md:grid-cols-[1fr_1.05fr] md:gap-16 md:px-16 md:py-24"
    >
      <div className="flex flex-col md:justify-center">
        <h2 className="font-archivo text-[34px] md:text-[56px] font-black leading-[1] tracking-[-0.035em] text-vino">
          Alquila
          <br />
          nuestro espacio
        </h2>
        <p className="mt-4 max-w-[420px] text-[15px] leading-[1.55] text-muted2 md:mt-6 md:text-lg">
          Sala profesional para ensayos, sesiones de fotos, grabaciones y
          eventos privados.
        </p>
        <LinkButton href="/alquiler" variant="outline" className="mt-5 w-fit md:mt-6">
          Consultar disponibilidad
        </LinkButton>
      </div>

      <div className="relative mt-5 h-[210px] overflow-hidden rounded-lg md:mt-0 md:h-[420px]">
        <Image
          src="/images/studio-rental-hero.webp"
          alt="Estudio 369 — espacio disponible para alquiler"
          fill
          className="object-cover"
          sizes="(max-width: 767px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
