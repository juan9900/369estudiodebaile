"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { listMedia, uploadMedia, type MediaItem } from "@/lib/supabase/storage";
import { MediaUpload } from "@/components/admin/media-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
};

export function MediaPickerDialog({ open, onOpenChange, onSelect }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    setLoading(true);
    listMedia(supabase)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  async function handleUploadStart(files: File[]) {
    setUploading(true);
    const supabase = createClient();
    try {
      const uploaded: MediaItem[] = [];
      for (const file of files) {
        const { path, url } = await uploadMedia(supabase, file);
        uploaded.push({
          name: file.name,
          path,
          url,
          size: file.size,
          created_at: new Date().toISOString(),
        });
      }
      setItems((prev) => [...uploaded, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  function handleSelect(url: string) {
    onSelect(url);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Seleccionar imagen</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-y-auto">
          <MediaUpload
            uploading={uploading}
            onUploadStart={handleUploadStart}
            onUploadComplete={() => {}}
          />

          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Cargando imágenes…
            </p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No hay imágenes. Sube una arriba.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {items.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleSelect(item.url)}
                  className="relative aspect-square rounded-md overflow-hidden border-2 border-transparent hover:border-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, 25vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
