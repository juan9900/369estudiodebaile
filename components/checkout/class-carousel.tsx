"use client";

import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClassDisplayTitle } from "@/lib/utils/class-display";
import { formatClassMetaMobile } from "@/lib/utils/date-format";
import type { DanceClass } from "@/lib/types/database";

interface ClassCarouselProps {
  classes: DanceClass[];
  loading: boolean;
  packSize: number;
  count: number;
  isSelected: (id: string) => boolean;
  onAdd: (cls: DanceClass) => void;
  onRemove: (id: string) => void;
  isComplete: boolean;
  onContinue: () => void;
  onBack: () => void;
}

export function ClassCarousel({
  classes,
  loading,
  packSize,
  count,
  isSelected,
  onAdd,
  onRemove,
  isComplete,
  onContinue,
  onBack,
}: ClassCarouselProps) {
  const remaining = packSize - count;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white mb-1">
          Elige tus clases
        </h2>
        <p className="text-white/70 text-sm font-bold">
          {remaining > 0
            ? `Escoge ${remaining} clase${remaining === 1 ? "" : "s"} más`
            : "¡Selección completa!"}
        </p>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[220px] w-56 shrink-0 animate-pulse rounded-lg bg-white/10"
            />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <p className="text-white/60 text-sm">
          No hay más clases disponibles en este momento.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {classes.map((cls) => {
            const selected = isSelected(cls.id);
            const disableAdd = !selected && count >= packSize;
            return (
              <div
                key={cls.id}
                className="flex w-56 min-h-[220px] shrink-0 snap-start flex-col rounded-lg border border-line bg-white p-5"
              >
                <h3 className="font-archivo text-lg font-black leading-tight text-ink">
                  {getClassDisplayTitle(cls)}
                </h3>
                <p className="mt-2 text-sm text-muted2">{cls.instructor}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wide text-muted2-2">
                  {formatClassMetaMobile(cls.scheduled_date, cls.start_time)}
                </p>
                <Button
                  type="button"
                  variant={selected ? "default" : "outline"}
                  disabled={disableAdd}
                  onClick={() =>
                    selected ? onRemove(cls.id) : onAdd(cls)
                  }
                  className={
                    selected
                      ? "mt-auto w-full bg-vino text-white font-bold hover:bg-vino-hover"
                      : "mt-auto w-full border-vino text-vino font-bold hover:bg-vino/5"
                  }
                >
                  {selected ? (
                    <>
                      <Check className="mr-1" size={16} />
                      Agregado
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1" size={16} />
                      Agregar
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 border-white/30 text-primary hover:text-primary font-black hover:bg-gray-200"
        >
          ← Volver
        </Button>
        <Button
          onClick={onContinue}
          disabled={!isComplete}
          className="flex-1 bg-white text-primary hover:bg-gray-100 font-black disabled:opacity-50"
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}
