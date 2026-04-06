import type { DanceClass } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ClassDetailHeroProps {
  danceClass: DanceClass;
}

export function ClassDetailHero({ danceClass }: ClassDetailHeroProps) {
  const spotsLeft = danceClass.max_capacity - danceClass.current_enrollment;

  return (
    <section className="relative min-h-[55vh] lg:min-h-[40vh] flex items-end overflow-hidden bg-primary">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href={`/modalidades/${danceClass.class_type}`}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold px-4 py-2 rounded-full hover:bg-white/30 transition-colors text-sm z-20"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a {danceClass.class_type}
        </Link>
      </div>

      {/* Content positioned at bottom */}
      <div className="relative z-10 w-full px-6 py-16">
        <div className="container mx-auto max-w-4xl">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight uppercase">
            {danceClass.class_type !== "clases"
              ? danceClass.title
              : danceClass.genre}
          </h1>

          {/* Description */}
          {danceClass.description && (
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-6 leading-relaxed">
              {danceClass.description}
            </p>
          )}

          {/* CTA */}
          <Link href={`#reservar`}>
            <Button
              disabled={spotsLeft > 0 ? false : true}
              className=" bg-white  text-primary hover:bg-gray-100 font-black text-base h-12 px-8 group shadow-lg hover:shadow-xl transition-all"
            >
              RESERVAR AHORA
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
