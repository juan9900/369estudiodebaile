"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/hooks/use-scroll-reveal";

const CATEGORIES = [
  {
    href: "/modalidades/classes",
    title: "Clases",
    description: "Aprende, graba, sorpréndete.",
  },
  {
    href: "/modalidades/masterclass",
    title: "Masterclass",
    description: "Artistas invitados y coreógrafos de alto nivel.",
  },
  {
    href: "/modalidades/proyectos",
    title: "Proyectos",
    description: "Experiencias temporales para vivir de lleno.",
  },
] as const;

export function ClassesSection() {
  const revealRef = useScrollReveal<HTMLDivElement>({ stagger: true });

  return (
    <section id="clases" className="px-[22px] pt-[38px] pb-3.5 md:px-16 md:pt-24 md:pb-6">
      <h2 className="font-archivo text-[34px] md:text-[52px] font-black leading-none tracking-[-0.035em] text-ink">
        Modalidades
      </h2>

      <div ref={revealRef} className="mt-3.5 md:mt-8">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`group flex items-center justify-between gap-4 border-t border-line py-[22px] md:grid md:grid-cols-[280px_1fr_40px] md:gap-10 md:py-8 ${
              i === CATEGORIES.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="md:contents">
              <h3 className="text-2xl md:text-[34px] font-extrabold tracking-[-0.03em] text-ink">
                {cat.title}
              </h3>
              <p className="mt-1.5 text-sm leading-[1.5] text-muted2 md:mt-0 md:text-lg">
                {cat.description}
              </p>
            </div>
            <ArrowRight
              size={22}
              strokeWidth={1.75}
              className="flex-none text-vino transition-transform duration-150 ease-out group-hover:translate-x-1 md:h-[26px] md:w-[26px] md:justify-self-end"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
