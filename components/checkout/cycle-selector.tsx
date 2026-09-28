"use client";

import { Button } from "@/components/ui/button";
import type { CycleOption } from "@/lib/hooks/use-cycle-options";
import { formatSessionDatesList } from "@/lib/utils/date-format";

interface CycleSelectorProps {
  options: CycleOption[];
  loading: boolean;
  onSelect: (cycle: CycleOption) => void;
  onBack: () => void;
}

/** Sibling of PromoSelector, for "clases fijas": lets the student pick the
 * monthly cycle to buy — the rest of the current month (prorated, if any
 * sessions remain) or the full next month. */
export function CycleSelector({
  options,
  loading,
  onSelect,
  onBack,
}: CycleSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white mb-2">
          Elige tu ciclo mensual
        </h2>
        <p className="text-white/50 text-sm">
          Cada ciclo incluye 4 clases, una por semana, al mismo horario. Si
          te unes a mitad de mes, pagas solo las clases que quedan.
        </p>
      </div>

      {loading ? (
        <p className="text-white/60 text-sm text-center">Cargando...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {options.map((option) => (
            <button
              key={option.month}
              type="button"
              disabled={option.disabled}
              onClick={() => onSelect(option)}
              className="w-full rounded-lg border bg-white p-4 text-left text-primary font-bold transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{option.monthLabel}</span>
                {option.price != null && (
                  <span className="text-lg font-black">${option.price}</span>
                )}
              </div>
              <span className="block text-sm font-medium text-black">
                {option.note}
              </span>
              <span className="block text-xs text-muted2-2 mt-1">
                {formatSessionDatesList(option.sessions)}
              </span>
              {option.disabled && (
                <span className="block text-xs font-bold text-red-600 mt-1">
                  Sin cupos disponibles
                </span>
              )}
            </button>
          ))}
        </div>
      )}

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
