"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface ClassFormProps {
  initialData?: DanceClass;
}

export function ClassForm({ initialData }: ClassFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    instructor: initialData?.instructor ?? "",
    scheduled_date: initialData?.scheduled_date ?? "",
    start_time: initialData?.start_time?.slice(0, 5) ?? "",
    end_time: initialData?.end_time?.slice(0, 5) ?? "",
    max_capacity: initialData?.max_capacity ?? 20,
    price: initialData?.price?.toString() ?? "",
    is_active: initialData?.is_active ?? true,
    video_url: initialData?.video_url ?? "",
    song_title: initialData?.song_title ?? "",
    song_artist: initialData?.song_artist ?? "",
    song_spotify_url: initialData?.song_spotify_url ?? "",
    song_youtube_url: initialData?.song_youtube_url ?? "",
    song_apple_music_url: initialData?.song_apple_music_url ?? "",
  });

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
      is_active: form.is_active,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
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
        <Label htmlFor="scheduled_date">Fecha</Label>
        <Input
          id="scheduled_date"
          name="scheduled_date"
          type="date"
          value={form.scheduled_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="start_time">Hora inicio</Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            value={form.start_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end_time">Hora fin</Label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            value={form.end_time}
            onChange={handleChange}
            required
          />
        </div>
      </div>

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
            <Label htmlFor="song_spotify_url">Enlace de Spotify</Label>
            <Input
              id="song_spotify_url"
              name="song_spotify_url"
              type="url"
              value={form.song_spotify_url}
              onChange={handleChange}
              placeholder="https://open.spotify.com/track/..."
            />
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

          <div className="grid gap-2">
            <Label htmlFor="song_apple_music_url">Enlace de Apple Music</Label>
            <Input
              id="song_apple_music_url"
              name="song_apple_music_url"
              type="url"
              value={form.song_apple_music_url}
              onChange={handleChange}
              placeholder="https://music.apple.com/..."
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button
          type="submit"
          className="bg-primary hover:bg-[#6d1730]"
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
