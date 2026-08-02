"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Signal, Tag, User } from "lucide-react";
import type { DanceClass } from "@/lib/types/database";
import { getClassDisplayTitle } from "@/lib/utils/class-display";
import {
  formatClassMetaDesktop,
  formatClassMetaMobile,
} from "@/lib/utils/date-format";
import { CLASS_LEVELS, WHATSAPP_URL } from "@/constants";
import { LinkButton } from "@/components/ui/link-button";
import { useScrollReveal } from "@/lib/hooks/use-scroll-reveal";

const FALLBACK_PHOTO = "/images/studio-rental-hero.webp";

interface ClassDetailContentProps {
  danceClass: DanceClass;
}

export function ClassDetailContent({ danceClass }: ClassDetailContentProps) {
  const spotsLeft = danceClass.max_capacity - danceClass.current_enrollment;
  const isFull = spotsLeft <= 0;
  const levelText = CLASS_LEVELS.find(
    (l) => l.levelNumber == danceClass.level,
  )?.levelText;
  const photo = danceClass.instructor_photo_url || FALLBACK_PHOTO;
  const title = getClassDisplayTitle(danceClass);
  const revealRef = useScrollReveal<HTMLDivElement>({
    stagger: true,
    start: "top 95%",
  });

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title,
        text: danceClass.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  }

  return (
    <div
      ref={revealRef}
      className="md:grid md:grid-cols-[1fr_460px] md:items-start md:gap-16 md:px-16 md:py-[72px] md:pb-[88px]"
    >
      {/* Meta + title */}
      <div className="px-[22px] pt-6 md:col-start-1 md:row-start-1 md:px-0 md:pt-0">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-vino md:text-[13px] md:tracking-[0.16em]">
          <Calendar size={14} strokeWidth={1.75} />
          <span className="md:hidden">
            {formatClassMetaMobile(
              danceClass.scheduled_date,
              danceClass.start_time,
            )}
          </span>
          <span className="hidden md:inline">
            {formatClassMetaDesktop(
              danceClass.scheduled_date,
              danceClass.start_time,
              danceClass.end_time,
            )}
          </span>
        </div>
        <h1 className="mt-3 font-archivo text-[50px] font-black leading-[0.95] tracking-[-0.04em] text-ink md:text-[84px]">
          {title}
        </h1>
      </div>

      {/* Photo */}
      <div className="relative mt-5 h-[260px] overflow-hidden px-0 md:col-start-1 md:row-start-2 md:mt-6 md:h-[420px] md:rounded-lg">
        <Image
          src={photo}
          alt={`Foto de ${danceClass.instructor}`}
          fill
          className="object-cover object-top"
          sizes="(max-width: 767px) 100vw, 60vw"
        />
      </div>

      {/* Ficha de datos + reserve column (desktop right column) */}
      <div className="md:col-start-2 md:row-start-1 md:row-span-2 md:border-t-2 md:border-ink">
        <div className="mt-5 px-[22px] md:mt-0 md:px-0">
          {(
            [
              { label: "Instructor", value: danceClass.instructor, Icon: User },
              levelText
                ? { label: "Nivel", value: levelText, Icon: Signal }
                : null,
              { label: "Género", value: danceClass.genre, Icon: Tag },
              danceClass.price !== null
                ? { label: "Precio", value: `$${danceClass.price}`, Icon: Tag }
                : null,
            ] as const
          )
            .filter((row): row is NonNullable<typeof row> => row !== null)
            .map((row, i) => {
              const Icon = row.Icon;
              return (
                <div
                  key={row.label}
                  className={`flex items-start justify-between gap-4 py-4 md:items-center md:py-[18px] ${
                    i === 0
                      ? "border-t border-line md:border-t-0"
                      : "border-t border-line"
                  }`}
                >
                  <span className="flex shrink-0 items-center gap-2 text-sm text-muted2-2 md:text-[15px]">
                    <Icon size={16} strokeWidth={1.75} className="text-vino" />
                    {row.label}
                  </span>
                  <span className="min-w-0 flex-1 text-right text-base font-bold text-ink md:text-[17px]">
                    {row.value}
                  </span>
                </div>
              );
            })}
        </div>

        {/* Reserve bar — desktop */}
        <div className="mt-6 hidden md:block">
          <Link
            href={isFull ? "#" : `/modalidades/${danceClass.id}/checkout`}
            aria-disabled={isFull}
            className={`block rounded-sm py-5 text-center text-[17px] font-bold transition-colors ${
              isFull
                ? "pointer-events-none bg-line-2 text-muted2-2"
                : "bg-vino text-white hover:bg-vino-hover"
            }`}
          >
            Reservar
          </Link>
          <p className="mt-3 text-center text-sm text-muted2-2">
            Confirmamos tu lugar por WhatsApp
          </p>
        </div>
      </div>

      {/* Description + links */}
      <div className="mt-5 px-[22px] md:col-start-1 md:row-start-3 md:mt-8 md:px-0">
        {danceClass.description && (
          <p className="max-w-[520px] text-[15px] leading-[1.55] text-muted2 md:text-lg">
            {danceClass.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <LinkButton href={WHATSAPP_URL} variant="outline" size="sm">
            Hacer una pregunta
          </LinkButton>
          <LinkButton onClick={handleShare} variant="outline" size="sm">
            Compartir
          </LinkButton>
        </div>
      </div>

      {/* Reserve bar — mobile */}
      <div className="mt-8 flex items-center justify-between border-t border-line px-[22px] py-5 md:hidden">
        <div>
          {danceClass.price !== null && (
            <p className="text-lg font-extrabold text-ink">
              Precio: ${danceClass.price}
            </p>
          )}
        </div>
        <Link
          href={isFull ? "#" : `/modalidades/${danceClass.id}/checkout`}
          aria-disabled={isFull}
          className={`rounded-sm px-[34px] py-4 text-[15px] font-bold transition-colors ${
            isFull
              ? "pointer-events-none bg-line-2 text-muted2-2"
              : "bg-vino text-white hover:bg-vino-hover"
          }`}
        >
          {isFull ? "Sin cupos" : "Reservar"}
        </Link>
      </div>
    </div>
  );
}
