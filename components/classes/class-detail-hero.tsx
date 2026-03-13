import type { DanceClass } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CLASS_LEVELS } from "@/constants";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1600&h=900&fit=crop";

interface ClassDetailHeroProps {
  danceClass: DanceClass;
}

export function ClassDetailHero({ danceClass }: ClassDetailHeroProps) {
  const image = danceClass.image_url || FALLBACK_IMAGE;
  const spotsLeft = danceClass.max_capacity - danceClass.current_enrollment;

  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">
      {/* Background image with zoom effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-transparent" />

      {/* Content positioned at bottom */}
      <div className="relative z-10 w-full px-6 py-16">
        <div className="container mx-auto max-w-4xl">
          {/* Dance style badge */}
          {danceClass.dance_style && (
            <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-colors">
              {danceClass.dance_style.toUpperCase()}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
            {danceClass.title}
          </h1>

          {/* Description */}
          {danceClass.description && (
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-6 leading-relaxed">
              {danceClass.description}
            </p>
          )}

          {/* Inline stats badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            {danceClass.price !== null && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-white font-bold text-sm">
                  ${danceClass.price.toFixed(0)}
                </span>
              </div>
            )}

            {danceClass.level && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-white font-bold text-sm capitalize">
                  {
                    CLASS_LEVELS.find(
                      (level) => level.levelNumber == danceClass.level,
                    )?.levelText
                  }
                </span>
              </div>
            )}

            {danceClass.genre && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-white font-bold text-sm capitalize">
                  {danceClass.genre}
                </span>
              </div>
            )}

            <div
              className={`backdrop-blur-sm px-4 py-2 rounded-full border ${
                spotsLeft <= 5
                  ? "bg-red-500/30 border-red-300/50"
                  : "bg-white/20 border-white/30"
              }`}
            >
              <span className="text-white font-bold text-sm">
                {spotsLeft}{" "}
                {spotsLeft === 1 ? "lugar disponible" : "lugares disponibles"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link href={`/clases/${danceClass.id}#reservar`}>
            <Button className="bg-white text-primary hover:bg-gray-100 font-black text-base h-12 px-8 group shadow-lg hover:shadow-xl transition-all">
              RESERVAR AHORA
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
