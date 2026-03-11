"use client";

import type { RegistrationWithClass } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  attended: "Asistida",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  attended: "bg-blue-100 text-blue-800",
};

interface RegistrationCardProps {
  registration: RegistrationWithClass;
}

export function RegistrationCard({ registration }: RegistrationCardProps) {
  const cls = registration.classes;

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-primary" />
              <span className="font-semibold text-[#1a1a1a]">{cls.title}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              <span>
                {new Date(cls.scheduled_date + "T00:00:00").toLocaleDateString(
                  "es-VE",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  },
                )}
                {" · "}
                {cls.start_time.slice(0, 5)} – {cls.end_time.slice(0, 5)}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Instructor: {cls.instructor}
            </p>
          </div>
          <Badge className={statusColors[registration.status]}>
            {statusLabels[registration.status]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
