"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { StudioSettings } from "@/lib/types/database";
import { generateTimeSlots, formatTimeAMPM } from "@/lib/utils/time-slots";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_SLOTS = generateTimeSlots("00:00", "23:30");

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [openingTime, setOpeningTime] = useState("08:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("studio_settings")
        .select("*")
        .single();
      if (data) {
        setSettings(data);
        setOpeningTime(data.opening_time.slice(0, 5));
        setClosingTime(data.closing_time.slice(0, 5));
      }
      if (error) console.error(error);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  async function handleSave() {
    if (closingTime <= openingTime) {
      setError("La hora de cierre debe ser posterior a la hora de apertura.");
      return;
    }
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const { error } = await supabase
      .from("studio_settings")
      .update({
        opening_time: openingTime,
        closing_time: closingTime,
        updated_at: new Date().toISOString(),
      })
      .eq("id", settings.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando ajustes...</p>;
  }

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">Ajustes del Estudio</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configura el horario de operación del estudio.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>Hora de apertura</Label>
          <Select value={openingTime} onValueChange={setOpeningTime}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_SLOTS.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {formatTimeAMPM(slot)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Hora de cierre</Label>
          <Select value={closingTime} onValueChange={setClosingTime}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_SLOTS.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {formatTimeAMPM(slot)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Ajustes guardados correctamente.</p>
      )}

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-primary hover:bg-[#6d1730] text-white"
      >
        {saving ? "Guardando..." : "Guardar ajustes"}
      </Button>
    </div>
  );
}
