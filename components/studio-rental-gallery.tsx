"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryItem = {
  label: string;
  image: string;
  className: string;
};

export function StudioRentalGallery({ items }: { items: GalleryItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const showPrev = () =>
    setSelectedIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  const showNext = () =>
    setSelectedIndex((i) => (i === null ? null : (i + 1) % items.length));

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const selected = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`${item.className} rounded-2xl overflow-hidden group cursor-pointer relative`}
          >
            <Image
              src={item.image}
              alt={item.label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-4 md:left-8 text-white/80 hover:text-white transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 md:right-8 text-white/80 hover:text-white transition-colors"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <div
            key={selectedIndex}
            className="relative w-full h-full max-w-5xl max-h-[85vh] animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected.image}
              alt={selected.label}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
