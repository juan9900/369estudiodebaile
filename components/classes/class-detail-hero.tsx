import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DanceClass } from "@/lib/types/database";

interface ClassDetailHeroProps {
  danceClass: DanceClass;
}

/** Secondary row under the navbar with the "Volver a clases" back link. */
export function ClassDetailHero({ danceClass }: ClassDetailHeroProps) {
  return (
    <div className="border-b border-line-soft px-[22px] py-3 md:px-16 md:py-4">
      <Link
        href={`/modalidades/${danceClass.class_type}`}
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted2-2 hover:text-vino transition-colors md:text-sm"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Volver a clases
      </Link>
    </div>
  );
}
