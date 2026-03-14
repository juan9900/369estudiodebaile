"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import type { MediaItem } from "@/lib/supabase/storage";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

type Props = {
  onUploadComplete: (items: MediaItem[]) => void;
  uploading: boolean;
  onUploadStart: (files: File[]) => void;
};

export function MediaUpload({ onUploadComplete, uploading, onUploadStart }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const valid = Array.from(files).filter((f) => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > MAX_SIZE) {
        alert(`"${f.name}" supera el límite de 5 MB.`);
        return false;
      }
      return true;
    });
    if (valid.length > 0) onUploadStart(valid);
  }

  return (
    <Card
      className={`border-2 border-dashed transition-colors cursor-pointer ${
        dragging ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center justify-center gap-3 p-10 text-gray-500 select-none">
        <Upload size={36} className={uploading ? "animate-bounce" : ""} />
        {uploading ? (
          <p className="font-semibold text-primary">Subiendo imágenes…</p>
        ) : (
          <>
            <p className="font-semibold">
              Arrastra imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-xs">PNG, JPG, WEBP · máx. 5 MB por archivo</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </Card>
  );
}
