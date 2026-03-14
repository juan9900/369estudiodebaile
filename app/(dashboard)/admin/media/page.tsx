"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  listMedia,
  uploadMedia,
  deleteMedia,
  type MediaItem,
} from "@/lib/supabase/storage";
import { MediaUpload } from "@/components/admin/media-upload";
import { MediaGrid } from "@/components/admin/media-grid";

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchMedia() {
      const supabase = createClient();
      try {
        const data = await listMedia(supabase);
        setItems(data);
      } catch (err) {
        console.error("Error al cargar imágenes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  async function handleUploadStart(files: File[]) {
    setUploading(true);
    const supabase = createClient();
    const uploaded: MediaItem[] = [];

    for (const file of files) {
      try {
        const { path, url } = await uploadMedia(supabase, file);
        uploaded.push({
          name: file.name,
          path,
          url,
          size: file.size,
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`Error subiendo "${file.name}":`, err);
        alert(`No se pudo subir "${file.name}".`);
      }
    }

    setItems((prev) => [...uploaded, ...prev]);
    setUploading(false);
  }

  async function handleDelete(path: string) {
    const supabase = createClient();
    try {
      const url = items.find((i) => i.path === path)?.url;
      await deleteMedia(supabase, path);
      setItems((prev) => prev.filter((i) => i.path !== path));
      if (url) {
        await supabase
          .from("classes")
          .update({ image_url: null })
          .eq("image_url", url);
        await supabase
          .from("classes")
          .update({ instructor_photo_url: null })
          .eq("instructor_photo_url", url);
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar la imagen.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">
          Galería de Medios
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Sube imágenes y copia sus URLs para usarlas en clases u otros lugares.
        </p>
      </div>

      <MediaUpload
        onUploadComplete={() => {}}
        onUploadStart={handleUploadStart}
        uploading={uploading}
      />

      <MediaGrid items={items} onDelete={handleDelete} loading={loading} />
    </div>
  );
}
