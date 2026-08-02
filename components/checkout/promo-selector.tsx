"use client";

import { Button } from "@/components/ui/button";
import type { PromoPackRow } from "@/lib/types/database";
import { getPackageTotal, getDefaultNote } from "@/lib/utils/promo-pricing";

interface PromoSelectorProps {
  packs: PromoPackRow[];
  classPrice: number | null;
  onSelect: (pack: PromoPackRow) => void;
  onBack: () => void;
}

export function PromoSelector({
  packs,
  classPrice,
  onSelect,
  onBack,
}: PromoSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white mb-2">
          Aprovecha y ahorra reservando más clases
        </h2>
        <p className="text-white/50 text-sm">
          Arma tu paquete combinando las clases que quieras — pueden ser de
          distintos géneros, instructores y fechas — y paga menos por cada
          una.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {packs.map((pack) => {
          const total = getPackageTotal(pack, classPrice);
          const note = pack.note || getDefaultNote(pack, classPrice);
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => onSelect(pack)}
              className="w-full rounded-lg border bg-white p-4 text-left text-primary font-bold transition-colors hover:bg-gray-100"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{pack.label}</span>
                {total != null && (
                  <span className="text-lg font-black">${total}</span>
                )}
              </div>
              <span className="text-sm font-medium text-black">{note}</span>
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        onClick={onBack}
        className="w-full border-white/30 text-primary hover:text-primary font-black hover:bg-gray-200"
      >
        ← Volver
      </Button>
    </div>
  );
}
