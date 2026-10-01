"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  CLASS_LEVELS,
  CLASS_TYPES,
  ACTIVE_CLASS_TYPES,
  WEEKDAYS_ES,
  type ActiveClassType,
} from "@/constants";
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
  getStartTimeOptions,
  getEndTimeOptions,
  formatTimeAMPM,
} from "@/lib/utils/time-slots";
import { toDatetimeLocalValue } from "@/lib/utils/date-format";
import { sortSlots } from "@/lib/utils/fixed-class-slots";
import {
  useFixedClassSlotEditor,
  type EditableSlot,
} from "@/lib/hooks/use-fixed-class-slot-editor";
import { useFixedClassSlotConflicts } from "@/lib/hooks/use-fixed-class-slot-conflicts";
import { saveFixedClassSlots } from "@/lib/utils/save-fixed-class-slots";

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
    starts_on: initialData?.starts_on ?? "",
    published_at: initialData?.published_at
      ? toDatetimeLocalValue(initialData.published_at)
      : "",
    max_capacity: initialData?.max_capacity ?? 20,
    price:
      initialData?.price?.toString() ??
      (initialData?.class_type === "clases" || !initialData ? "5" : ""),
    genre: initialData?.genre ?? "",
    level: initialData?.level ?? 1,
    is_active: initialData?.is_active ?? true,
    class_type: (initialData?.class_type === "masterclass"
      ? "clases"
      : (initialData?.class_type ?? "clases")) as ActiveClassType,
    image_url: initialData?.image_url ?? "",
    instructor_photo_url: initialData?.instructor_photo_url ?? "",
    instructor_instagram_url: initialData?.instructor_instagram_url ?? "",
    video_url: initialData?.video_url ?? "",
    song_title: initialData?.song_title ?? "",
    song_artist: initialData?.song_artist ?? "",
    song_youtube_url: initialData?.song_youtube_url ?? "",
    use_genre_as_title: initialData?.use_genre_as_title ?? true,
  });

  const [openingTime, setOpeningTime] = useState("08:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [existingClasses, setExistingClasses] = useState<
    { id: string; start_time: string; end_time: string }[]
  >([]);

  const isFixed = form.class_type === "fijas";

  // The weekly slots for a "fijas" class. For a brand-new class this starts
  // as a single empty row; when editing one, it's seeded from
  // fixed_class_slots below (DanceClass itself only carries the mirrored
  // earliest slot, not the full schedule).
  const slotEditor = useFixedClassSlotEditor();

  useEffect(() => {
    if (!initialData || initialData.class_type !== "fijas") return;
    let active = true;
    async function fetchSlots() {
      const supabase = createClient();
      const { data } = await supabase
        .from("fixed_class_slots")
        .select("weekday, start_time, end_time")
        .eq("class_id", initialData!.id);
      if (!active || !data || data.length === 0) return;
      slotEditor.setSlots(
        sortSlots(data as { weekday: number; start_time: string; end_time: string }[]).map(
          (s): EditableSlot => ({
            weekday: String(s.weekday),
            start_time: s.start_time.slice(0, 5),
            end_time: s.end_time.slice(0, 5),
          }),
        ),
      );
    }
    fetchSlots();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id, initialData?.class_type]);

  const chosenWeekdays = slotEditor.slots
    .map((s) => s.weekday)
    .filter(Boolean)
    .map(Number);
  const slotConflictsByWeekday = useFixedClassSlotConflicts(
    isFixed ? chosenWeekdays : [],
    initialData?.id,
  );

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

  // Fetch existing classes to detect schedule conflicts for DATED classes,
  // by scheduled_date. Fixed-class slot conflicts are handled separately
  // (per weekday) by useFixedClassSlotConflicts above.
  useEffect(() => {
    async function fetchClasses() {
      if (isFixed) {
        setExistingClasses([]);
        return;
      }
      if (!form.scheduled_date) {
        setExistingClasses([]);
        return;
      }
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
  }, [isFixed, form.scheduled_date, initialData?.id]);

  const allSlots = generateTimeSlots(openingTime, closingTime);

  const isFreeSchedule = form.class_type !== "clases";

  // For normal ("clases") classes, a start slot is only valid if the full
  // 1-hour block after it is also free.
  const startTimeSlots = getStartTimeOptions(
    existingClasses,
    allSlots,
    closingTime,
    !isFreeSchedule,
  );
  const endTimeSlots = getEndTimeOptions(form.start_time, existingClasses, allSlots);

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

    let fixedSlots: { weekday: number; start_time: string; end_time: string }[] = [];
    if (isFixed) {
      const incomplete = slotEditor.slots.some(
        (s) => !s.weekday || !s.start_time || !s.end_time,
      );
      if (incomplete) {
        setError("Completa el día y el horario de cada franja.");
        setLoading(false);
        return;
      }
      fixedSlots = sortSlots(
        slotEditor.slots.map((s) => ({
          weekday: Number(s.weekday),
          start_time: s.start_time,
          end_time: s.end_time,
        })),
      );
    }
    // The classes row needs some non-null weekday/start_time/end_time right
    // away (classes_schedule_shape CHECK + NOT NULL columns); the earliest
    // slot is a safe placeholder — fixed_class_slots' trigger recomputes the
    // authoritative mirror right after saveFixedClassSlots runs below.
    const earliestSlot = fixedSlots[0];

    const payload = {
      title: form.title,
      description: form.description || null,
      instructor: form.instructor,
      scheduled_date: isFixed ? null : form.scheduled_date,
      weekday: isFixed ? earliestSlot.weekday : null,
      start_time: isFixed ? earliestSlot.start_time : form.start_time,
      end_time: isFixed ? earliestSlot.end_time : form.end_time,
      starts_on: isFixed && form.starts_on ? form.starts_on : null,
      published_at:
        isFixed && form.published_at
          ? new Date(form.published_at).toISOString()
          : null,
      max_capacity: Number(form.max_capacity),
      price: form.price ? Number(form.price) : null,
      genre: form.genre,
      level: form.level ? Number(form.level) : 1,
      is_active: form.is_active,
      class_type: form.class_type,
      image_url: form.image_url || null,
      instructor_photo_url: form.instructor_photo_url || null,
      instructor_instagram_url: form.instructor_instagram_url || null,
      video_url: form.video_url || null,
      song_title: form.song_title || null,
      song_artist: form.song_artist || null,
      song_youtube_url: form.song_youtube_url || null,
      use_genre_as_title: form.use_genre_as_title,
    };

    try {
      let classId: string;
      if (initialData) {
        const { error } = await supabase
          .from("classes")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
        classId = initialData.id;
      } else {
        const { data, error } = await supabase
          .from("classes")
          .insert({ ...payload, created_by: user.id })
          .select("id")
          .single();
        if (error) throw error;
        classId = data.id;
      }
      if (isFixed) {
        await saveFixedClassSlots(supabase, classId, fixedSlots);
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
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getUTCDay()];
  };

  const currentDay = form.scheduled_date
    ? getDayOfWeek(form.scheduled_date)
    : "";
  const isValidDayForNormalClass =
    currentDay === "Saturday" || currentDay === "Sunday";
  const normalClassSlotsForDay =
    currentDay === "Saturday"
      ? normalClassSlots.Saturday
      : currentDay === "Sunday"
        ? normalClassSlots.Sunday
        : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="p-4 bg-muted rounded-lg space-y-2">
        <Label className="font-semibold">Tipo de clase</Label>
        <div className="flex gap-6">
          {ACTIVE_CLASS_TYPES.map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="class_type"
                value={value}
                checked={form.class_type === value}
                onChange={() => {
                  setForm((prev) => ({
                    ...prev,
                    class_type: value,
                    scheduled_date: "",
                    start_time: "",
                    end_time: "",
                    starts_on: "",
                    published_at: "",
                    price:
                      value === "clases"
                        ? "5"
                        : prev.class_type === "clases"
                          ? ""
                          : prev.price,
                  }));
                  slotEditor.setSlots([{ weekday: "", start_time: "", end_time: "" }]);
                }}
              />
              {CLASS_TYPES[value].singular}
            </label>
          ))}
        </div>
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
        <Label htmlFor="instructor_instagram_url">
          Instagram del instructor
        </Label>
        <Input
          id="instructor_instagram_url"
          name="instructor_instagram_url"
          type="url"
          value={form.instructor_instagram_url}
          onChange={handleChange}
          placeholder="https://www.instagram.com/..."
        />
      </div>

      {isFixed ? (
        <div className="grid gap-3">
          <Label>Días y horarios</Label>
          {slotEditor.slots.map((slot, i) => {
            const rowConflicts = slotConflictsByWeekday.get(Number(slot.weekday)) ?? [];
            const rowStartOptions = slot.weekday
              ? getStartTimeOptions(rowConflicts, allSlots, closingTime, false)
              : [];
            const rowEndOptions = slot.start_time
              ? getEndTimeOptions(slot.start_time, rowConflicts, allSlots)
              : [];
            const usedWeekdays = slotEditor.usedWeekdaysExcept(i);

            return (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 rounded-md border p-3"
              >
                <div className="grid gap-1">
                  <Label className="text-xs text-muted-foreground">Día</Label>
                  <Select
                    value={slot.weekday}
                    onValueChange={(val) =>
                      slotEditor.updateSlot(i, {
                        weekday: val,
                        start_time: "",
                        end_time: "",
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Día" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS_ES.map((label, index) => {
                        const value = String(index);
                        const disabled = usedWeekdays.includes(value);
                        return (
                          <SelectItem key={value} value={value} disabled={disabled}>
                            {label}
                            {disabled ? " (ya usado)" : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1">
                  <Label className="text-xs text-muted-foreground">Hora inicio</Label>
                  <Select
                    value={slot.start_time}
                    onValueChange={(val) =>
                      slotEditor.updateSlot(i, { start_time: val, end_time: "" })
                    }
                    disabled={!slot.weekday}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Inicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {rowStartOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {formatTimeAMPM(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1">
                  <Label className="text-xs text-muted-foreground">Hora fin</Label>
                  <Select
                    value={slot.end_time}
                    onValueChange={(val) => slotEditor.updateSlot(i, { end_time: val })}
                    disabled={!slot.start_time || rowEndOptions.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          slot.start_time && rowEndOptions.length === 0
                            ? "No disponible"
                            : "Fin"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {rowEndOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {formatTimeAMPM(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => slotEditor.removeSlot(i)}
                  disabled={slotEditor.slots.length === 1}
                >
                  Quitar
                </Button>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={slotEditor.addSlot}
            disabled={slotEditor.slots.length >= WEEKDAYS_ES.length}
            className="w-fit"
          >
            + Añadir día
          </Button>

          <p className="text-xs text-muted-foreground">
            La clase se dicta todas las semanas en estos días, sin fecha de
            fin. Los alumnos reservan un ciclo de 4 semanas, con 4 clases de
            cada día elegido.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="grid gap-2">
              <Label htmlFor="starts_on">Fecha de inicio (opcional)</Label>
              <Input
                id="starts_on"
                name="starts_on"
                type="date"
                value={form.starts_on}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Ningún ciclo empezará antes de esta fecha.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="published_at">Publicar a partir de (opcional)</Label>
              <Input
                id="published_at"
                name="published_at"
                type="datetime-local"
                value={form.published_at}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Antes de esta fecha, solo el admin la ve.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="scheduled_date">
            {form.class_type === "clases" ? "Fecha (Sábado o Domingo)" : "Fecha"}
          </Label>
          <Input
            id="scheduled_date"
            name="scheduled_date"
            type="date"
            value={form.scheduled_date}
            onChange={handleDateChange}
            required
          />
          {!isFreeSchedule &&
            form.scheduled_date &&
            !isValidDayForNormalClass && (
              <p className="text-sm text-red-500">
                Las clases normales deben ser sábado o domingo
              </p>
            )}
        </div>
      )}

      {!isFixed &&
        (isFreeSchedule ? (
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
                const slotData = normalClassSlotsForDay.find(
                  (s) => s.start === val,
                );
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
                <SelectValue
                  placeholder={
                    isValidDayForNormalClass
                      ? "Seleccionar horario"
                      : "Selecciona un sábado o domingo"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {normalClassSlotsForDay.map((slot) => {
                  const isOccupied = existingClasses.some((cls) => {
                    const clsStart = cls.start_time.slice(0, 5);
                    const clsEnd = cls.end_time.slice(0, 5);
                    return slot.start < clsEnd && slot.end > clsStart;
                  });
                  return (
                    <SelectItem
                      key={slot.start}
                      value={slot.start}
                      disabled={isOccupied}
                    >
                      {formatTimeAMPM(slot.start)} – {formatTimeAMPM(slot.end)}
                      {isOccupied ? " (ocupado)" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        ))}

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
          <Label htmlFor="price">
            {isFixed ? "Precio del ciclo — 4 semanas ($)" : "Precio ($)"}
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min={0}
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            disabled={form.class_type === "clases"}
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
          id="use_genre_as_title"
          name="use_genre_as_title"
          checked={form.use_genre_as_title}
          onChange={handleChange}
          className="rounded"
        />
        <Label htmlFor="use_genre_as_title">
          Usar género como título (en tarjetas y detalle)
        </Label>
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
          className="bg-primary hover:bg-primary-dark text-white"
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
