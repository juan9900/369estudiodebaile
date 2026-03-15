"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { CLASS_LEVELS } from "@/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MediaPickerDialog } from "@/components/admin/media-picker-dialog";
import Image from "next/image";
import {
  generateTimeSlots,
  getOccupiedSlots,
  formatTimeAMPM,
  addMinutes,
} from "@/lib/utils/time-slots";

interface ClassFormProps {
  initialData?: DanceClass;
}

export function ClassForm({ initialData }: ClassFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerField, setPickerField] = useState<
    "image_url" | "instructor_photo_url" | null
  >(null);

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    instructor: initialData?.instructor ?? "",
    scheduled_date: initialData?.scheduled_date ?? "",
    start_time: initialData?.start_time?.slice(0, 5) ?? "",
    end_time: initialData?.end_time?.slice(0, 5) ?? "",
    max_capacity: initialData?.max_capacity ?? 20,
    price: initialData?.price?.toString() ?? "",
    genre: initialData?.genre ?? "",
    level: initialData?.level ?? 1,
    is_active: initialData?.is_active ?? true,
    is_masterclass: initialData?.is_masterclass ?? false,
    image_url: initialData?.image_url ?? "",
    instructor_photo_url: initialData?.instructor_photo_url ?? "",
    video_url: initialData?.video_url ?? "",
    song_title: initialData?.song_title ?? "",
    song_artist: initialData?.song_artist ?? "",
    song_spotify_url: initialData?.song_spotify_url ?? "",
    song_youtube_url: initialData?.song_youtube_url ?? "",
    song_apple_music_url: initialData?.song_apple_music_url ?? "",
  });

  const [openingTime, setOpeningTime] = useState("08:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [existingClasses, setExistingClasses] = useState<
    { id: string; start_time: string; end_time: string }[]
  >([]);

  // Fetch studio settings on mount
  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("studio_settings")
        .select("opening_time, closing_time")
        .single();
      if (data) {
        setOpeningTime(data.opening_time.slice(0, 5));
        setClosingTime(data.closing_time.slice(0, 5));
      }
    }
    fetchSettings();
  }, []);

  // Fetch existing classes when scheduled_date changes
  useEffect(() => {
    if (!form.scheduled_date) {
      setExistingClasses([]);
      return;
    }
    async function fetchClasses() {
      const supabase = createClient();
      const { data } = await supabase
        .from("classes")
        .select("id, start_time, end_time")
        .eq("scheduled_date", form.scheduled_date);
      if (data) {
        // Exclude the current class when editing
        const filtered = initialData?.id
          ? data.filter((c) => c.id !== initialData.id)
          : data;
        setExistingClasses(filtered);
      }
    }
    fetchClasses();
  }, [form.scheduled_date, initialData?.id]);

  const allSlots = generateTimeSlots(openingTime, closingTime);
  const occupiedSlots = getOccupiedSlots(existingClasses, allSlots);

  // For normal classes, a start slot is only valid if the full 1-hour block is free
  const startTimeSlots = allSlots.filter((slot) => {
    if (occupiedSlots.has(slot)) return false;
    if (!form.is_masterclass) {
      const endSlot = addMinutes(slot, 60);
      // end slot must not exceed closing time
      if (endSlot > closingTime) return false;
      // the slot at start+1h must also be free (not occupied by another class)
      if (occupiedSlots.has(endSlot)) return false;
    }
    return true;
  });

  // End-time slots: only slots strictly after start_time, capped at next occupied slot
  const endTimeSlots = (() => {
    if (!form.start_time) return [];
    const afterStart = allSlots.filter((s) => s > form.start_time);

    // Find the earliest occupied slot after start_time (which would be another class's start)
    // We cap end_time at the start of the next existing class
    let cap: string | null = null;
    for (const cls of existingClasses) {
      const clsStart = cls.start_time.slice(0, 5);
      if (clsStart > form.start_time) {
        if (cap === null || clsStart < cap) {
          cap = clsStart;
        }
      }
    }

    if (!cap) return afterStart;

    // Subtract 30 min from cap to enforce the gap: if next class starts at 13:00,
    // your class must end by 12:30 at the latest.
    const [capH, capM] = cap.split(":").map(Number);
    const capMinus30 = capH * 60 + capM - 30;
    const adjustedCap = `${String(Math.floor(capMinus30 / 60)).padStart(2, "0")}:${String(capMinus30 % 60).padStart(2, "0")}`;

    return afterStart.filter((s) => s <= adjustedCap);
  })();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      scheduled_date: e.target.value,
      start_time: "",
      end_time: "",
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      title: form.title,
      description: form.description || null,
      instructor: form.instructor,
      scheduled_date: form.scheduled_date,
      start_time: form.start_time,
      end_time: form.end_time,
      max_capacity: Number(form.max_capacity),
      price: form.price ? Number(form.price) : null,
      genre: form.genre,
      level: form.level ? Number(form.level) : 1,
      is_active: form.is_active,
      is_masterclass: form.is_masterclass,
      image_url: form.image_url || null,
      instructor_photo_url: form.instructor_photo_url || null,
      video_url: form.video_url || null,
      song_title: form.song_title || null,
      song_artist: form.song_artist || null,
      song_spotify_url: form.song_spotify_url || null,
      song_youtube_url: form.song_youtube_url || null,
      song_apple_music_url: form.song_apple_music_url || null,
    };

    try {
      if (initialData) {
        const { error } = await supabase
          .from("classes")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("classes")
          .insert({ ...payload, created_by: user.id });
        if (error) throw error;
      }
      router.push("/admin/classes");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  const normalClassSlots = {
    Saturday: [
      { start: "09:00", end: "10:00" },
      { start: "10:30", end: "11:30" },
      { start: "13:00", end: "14:00" },
      { start: "14:30", end: "15:30" },
      { start: "16:00", end: "17:00" },
      { start: "17:30", end: "18:30" },
    ],
    Sunday: [
      { start: "10:00", end: "11:00" },
      { start: "11:30", end: "12:30" },
      { start: "13:30", end: "14:30" },
      { start: "15:00", end: "16:00" },
      { start: "16:30", end: "17:30" },
    ],
  };

  const getDayOfWeek = (dateStr: string): string => {
    const date = new Date(dateStr + "T00:00:00Z");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getUTCDay()];
  };

  const currentDay = form.scheduled_date ? getDayOfWeek(form.scheduled_date) : "";
  const isValidDayForNormalClass = currentDay === "Saturday" || currentDay === "Sunday";
  const normalClassSlotsForDay = currentDay === "Saturday" ? normalClassSlots.Saturday : currentDay === "Sunday" ? normalClassSlots.Sunday : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        <input
          type="checkbox"
          id="is_masterclass"
          name="is_masterclass"
          checked={form.is_masterclass}
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              is_masterclass: e.target.checked,
              start_time: "",
              end_time: "",
            }));
          }}
          className="rounded"
        />
        <Label htmlFor="is_masterclass" className="font-semibold">
          Masterclass
        </Label>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Nombre de la clase</Label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="border border-input rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instructor">Instructor</Label>
        <Input
          id="instructor"
          name="instructor"
          value={form.instructor}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="scheduled_date">
          {form.is_masterclass ? "Fecha" : "Fecha (Sábado o Domingo)"}
        </Label>
        <Input
          id="scheduled_date"
          name="scheduled_date"
          type="date"
          value={form.scheduled_date}
          onChange={handleDateChange}
          required
        />
        {!form.is_masterclass && form.scheduled_date && !isValidDayForNormalClass && (
          <p className="text-sm text-red-500">Las clases normales deben ser sábado o domingo</p>
        )}
      </div>

      {form.is_masterclass ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start_time">Hora inicio</Label>
            <Select
              value={form.start_time}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, start_time: val, end_time: "" }))
              }
              disabled={!form.scheduled_date}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {startTimeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {formatTimeAMPM(slot)}
                  </SelectItem>
                ))}
                {allSlots
                  .filter((slot) => !startTimeSlots.includes(slot))
                  .map((slot) => (
                    <SelectItem key={slot} value={slot} disabled>
                      {formatTimeAMPM(slot)} (ocupado)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end_time">Hora fin</Label>
            <Select
              value={form.end_time}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, end_time: val }))
              }
              disabled={!form.start_time || endTimeSlots.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    form.start_time && endTimeSlots.length === 0
                      ? "No disponible"
                      : "Seleccionar"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {endTimeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {formatTimeAMPM(slot)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <Label>Horario</Label>
          <Select
            value={form.start_time}
            onValueChange={(val) => {
              const slotData = normalClassSlotsForDay.find((s) => s.start === val);
              if (slotData) {
                setForm((prev) => ({
                  ...prev,
                  start_time: slotData.start,
                  end_time: slotData.end,
                }));
              }
            }}
            disabled={!form.scheduled_date || !isValidDayForNormalClass}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isValidDayForNormalClass ? "Seleccionar horario" : "Selecciona un sábado o domingo"} />
            </SelectTrigger>
            <SelectContent>
              {normalClassSlotsForDay.map((slot) => (
                <SelectItem key={slot.start} value={slot.start}>
                  {formatTimeAMPM(slot.start)} – {formatTimeAMPM(slot.end)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="max_capacity">Capacidad máxima</Label>
          <Input
            id="max_capacity"
            name="max_capacity"
            type="number"
            min={1}
            value={form.max_capacity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Precio ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min={0}
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="genre">Género</Label>
          <Input
            id="genre"
            name="genre"
            type="text"
            min={1}
            value={form.genre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="level">Nivel</Label>
          <div className="w-full ">
            {" "}
            <Select
              value={form.level.toString()}
              onValueChange={(e) => {
                setForm((prev) => ({ ...prev, level: Number(e) }));
              }}
            >
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Escoge un nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Niveles</SelectLabel>
                  {CLASS_LEVELS.map((level) => (
                    <SelectItem
                      key={level.levelText}
                      value={level.levelNumber.toString()}
                    >
                      {level.levelText}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
          className="rounded"
        />
        <Label htmlFor="is_active">Clase activa</Label>
      </div>

      <div className="border-t pt-5">
        <h3 className="text-lg font-semibold mb-4">Imágenes</h3>
        <div className="grid grid-cols-2 gap-6">
          {(
            [
              { field: "image_url", label: "Imagen de la clase" },
              {
                field: "instructor_photo_url",
                label: "Foto del instructor",
              },
            ] as const
          ).map(({ field, label }) => (
            <div key={field} className="grid gap-2">
              <Label>{label}</Label>
              {form[field] && (
                <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                  <Image
                    src={form[field]}
                    alt={label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPickerField(field)}
                >
                  {form[field] ? "Cambiar imagen" : "Seleccionar imagen"}
                </Button>
                {form[field] && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, [field]: "" }))
                    }
                  >
                    Quitar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MediaPickerDialog
        open={pickerField !== null}
        onOpenChange={(open) => !open && setPickerField(null)}
        onSelect={(url) => {
          if (pickerField) {
            setForm((prev) => ({ ...prev, [pickerField]: url }));
          }
          setPickerField(null);
        }}
      />

      <div className="border-t pt-5">
        <h3 className="text-lg font-semibold mb-4">Canción y video</h3>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="video_url">URL del video (YouTube)</Label>
            <Input
              id="video_url"
              name="video_url"
              type="url"
              value={form.video_url}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="song_title">Título de la canción</Label>
              <Input
                id="song_title"
                name="song_title"
                value={form.song_title}
                onChange={handleChange}
                placeholder="Nombre de la canción"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="song_artist">Artista</Label>
              <Input
                id="song_artist"
                name="song_artist"
                value={form.song_artist}
                onChange={handleChange}
                placeholder="Nombre del artista"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="song_youtube_url">Enlace de YouTube Music</Label>
            <Input
              id="song_youtube_url"
              name="song_youtube_url"
              type="url"
              value={form.song_youtube_url}
              onChange={handleChange}
              placeholder="https://music.youtube.com/watch?v=..."
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button
          type="submit"
          className="bg-primary hover:bg-[#6d1730] text-white"
          disabled={loading}
        >
          {loading
            ? "Guardando..."
            : initialData
              ? "Actualizar"
              : "Crear clase"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/classes")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
