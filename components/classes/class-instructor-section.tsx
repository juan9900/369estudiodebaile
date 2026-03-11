"use client";

import { useState } from "react";
import type { DanceClass } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face";

const DEFAULT_BIO =
  "Profesional de la danza con años de experiencia en formación y escenario. Apasionado por compartir el ritmo y la cultura del baile con cada alumno.";

interface ClassInstructorSectionProps {
  danceClass: DanceClass;
}

export function ClassInstructorSection({
  danceClass,
}: ClassInstructorSectionProps) {
  const photo = danceClass.instructor_photo_url || FALLBACK_PHOTO;
  const bio = danceClass.instructor_bio || DEFAULT_BIO;
  const [expanded, setExpanded] = useState(false);

  // Check if bio is long enough to need expansion
  const needsExpansion = bio.length > 200;

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <Card className="overflow-hidden shadow-lg border border-gray-200">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Animated border photo */}
              <div className="relative w-40 h-40 flex-shrink-0 mx-auto md:mx-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-[#DC143C] to-primary p-1">
                  <div className="w-full h-full rounded-2xl bg-white p-1">
                    <img
                      src={photo}
                      alt={`Foto de ${danceClass.instructor}`}
                      width={160}
                      height={160}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Instructor: {danceClass.instructor}
                </h3>

                <p
                  className={`text-gray-600 leading-relaxed text-base ${!expanded && needsExpansion ? "line-clamp-3" : ""}`}
                >
                  {bio}
                </p>

                {needsExpansion && (
                  <Button
                    variant="ghost"
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 text-primary hover:text-[#DC143C] hover:bg-primary/5 font-bold"
                  >
                    {expanded ? "Leer menos" : "Leer más"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
