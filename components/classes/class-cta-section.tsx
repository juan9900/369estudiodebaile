"use client";

import { useRouter } from "next/navigation";
import type { DanceClass } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Share2,
} from "lucide-react";

const DAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

interface ClassCtaSectionProps {
  danceClass: DanceClass;
}

export function ClassCtaSection({ danceClass }: ClassCtaSectionProps) {
  const router = useRouter();

  const spotsLeft = danceClass.max_capacity - danceClass.current_enrollment;
  const isFull = spotsLeft <= 0;
  const enrollmentPercentage =
    (danceClass.current_enrollment / danceClass.max_capacity) * 100;

  // Parse date parts — use UTC to avoid timezone shift on date-only strings
  const date = new Date(danceClass.scheduled_date + "T00:00:00Z");
  const dayName = DAYS_ES[date.getUTCDay()];
  const dayNum = date.getUTCDate();
  const monthName = MONTHS_ES[date.getUTCMonth()];

  return (
    <section
      id="reservar"
      className="py-20 px-6 bg-gradient-to-b from-white to-[#F5F5F0]"
    >
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-2xl border-2 border-gray-100">
          <CardContent className="p-10">
            {/* Urgency badge */}
            {!isFull && spotsLeft <= 5 && (
              <div className="flex justify-center mb-6">
                <Badge className="bg-red-500 text-white animate-pulse px-4 py-2 text-sm">
                  ⚡ Solo {spotsLeft} lugar{spotsLeft === 1 ? "" : "es"}{" "}
                  disponible{spotsLeft === 1 ? "" : "s"}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-primary to-[#DC143C] bg-clip-text text-transparent mb-8">
              ¿Listo para bailar?
            </h2>

            {/* Schedule grid with icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Día
                  </p>
                  <p className="text-gray-900 font-black capitalize truncate">
                    {dayName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Clock className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Horario
                  </p>
                  <p className="text-gray-900 font-black truncate">
                    {danceClass.start_time.slice(0, 5)} -{" "}
                    {danceClass.end_time.slice(0, 5)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Fecha
                  </p>
                  <p className="text-gray-900 font-black truncate">
                    {dayNum} de {monthName}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {!isFull && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">
                    {danceClass.current_enrollment} de {danceClass.max_capacity}{" "}
                    lugares reservados
                  </span>
                  <span className="text-primary font-bold">
                    {Math.round(enrollmentPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-[#DC143C] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${enrollmentPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Primary CTA */}
            <Button
              onClick={() => router.push(`/clases/${danceClass.id}/checkout`)}
              disabled={isFull}
              className="w-full h-16 text-xl font-black bg-gradient-to-r from-primary to-[#DC143C] hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group mb-4 text-white"
            >
              {isFull ? "CLASE LLENA" : "RESERVAR MI LUGAR"}
              {!isFull && (
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              )}
            </Button>

            {/* Secondary actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="font-bold border-gray-300 hover:border-primary hover:text-primary"
                onClick={() => {
                  // Placeholder for future implementation
                  alert("Función próximamente disponible");
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Hacer Pregunta
              </Button>
              <Button
                variant="outline"
                className="font-bold border-gray-300 hover:border-primary hover:text-primary"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: danceClass.title,
                      text: danceClass.description || "",
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Enlace copiado al portapapeles");
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Pago seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Reembolso disponible</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
