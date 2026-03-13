"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, DollarSign } from "lucide-react";

interface ClassCardProps {
  danceClass: DanceClass;
  isRegistered: boolean;
  onRegister: (classId: string) => void;
}

export function ClassCard({
  danceClass,
  isRegistered,
  onRegister,
}: ClassCardProps) {
  const [loading, setLoading] = useState(false);
  const isFull = danceClass.current_enrollment >= danceClass.max_capacity;

  async function handleRegister() {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("registrations").insert({
        user_id: user.id,
        class_id: danceClass.id,
      });

      if (!error) {
        onRegister(danceClass.id);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-primary" />
      <CardHeader>
        <CardTitle className="text-lg text-[#1a1a1a]">
          {danceClass.title}
        </CardTitle>
        {danceClass.description && (
          <p className="text-sm text-gray-500">{danceClass.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} className="text-primary" />
          <span>{danceClass.instructor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} className="text-primary" />
          <span>
            {new Date(
              danceClass.scheduled_date + "T00:00:00",
            ).toLocaleDateString("es-VE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            {" · "}
            {danceClass.start_time.slice(0, 5)} –{" "}
            {danceClass.end_time.slice(0, 5)}
          </span>
        </div>
        {danceClass.price !== null && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign size={16} className="text-primary" />
            <span>${danceClass.price.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-gray-400">
            {danceClass.current_enrollment}/{danceClass.max_capacity} inscritos
          </span>
          {isRegistered ? (
            <span className="text-xs font-semibold text-green-600">
              Ya inscrito
            </span>
          ) : (
            <Button
              size="sm"
              className="bg-primary hover:bg-[#6d1730]"
              disabled={loading || isFull}
              onClick={handleRegister}
            >
              {loading ? "..." : isFull ? "Llena" : "Inscribirse"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
