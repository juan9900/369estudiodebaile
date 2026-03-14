"use client";

import { Copy, Trash2 } from "lucide-react";
import type { MediaItem } from "@/lib/supabase/storage";

type Props = {
  items: MediaItem[];
  onDelete: (path: string) => void;
  loading: boolean;
};

export function MediaGrid({ items, onDelete, loading }: Props) {
  if (loading) {
    return <p className="text-gray-500 text-sm">Cargando imágenes…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        Aún no hay imágenes. ¡Sube la primera!
      </p>
    );
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
  }

  function handleDelete(path: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    onDelete(path);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.path} className="flex flex-col gap-1">
          <div className="relative aspect-square group overflow-hidden rounded-lg bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleCopy(item.url)}
                className="flex items-center gap-1 px-2 py-1 bg-white text-gray-800 rounded text-xs font-semibold hover:bg-gray-100 transition-colors"
                title="Copiar URL"
              >
                <Copy size={12} />
                Copiar
              </button>
              <button
                onClick={() => handleDelete(item.path, item.name)}
                className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors"
                title="Eliminar"
              >
                <Trash2 size={12} />
                Borrar
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 truncate" title={item.name}>
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
}
