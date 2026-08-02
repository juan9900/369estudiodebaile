"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PromoDiscountType, PromoPackRow } from "@/lib/types/database";
import {
  getPackageTotal,
  getDiscountPercent,
  getDefaultNote,
} from "@/lib/utils/promo-pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DISCOUNT_TYPE_LABELS: Record<PromoDiscountType, string> = {
  none: "Sin descuento",
  percent: "% de descuento",
  free_classes: "Clases gratis",
  fixed_price: "Precio fijo",
};

const DISCOUNT_VALUE_LABELS: Record<PromoDiscountType, string> = {
  none: "",
  percent: "% de descuento",
  free_classes: "Clases gratis",
  fixed_price: "Precio total ($)",
};

interface EditablePack {
  key: string; // stable React key — the DB id once saved, a local temp id until then
  id: string | null;
  size: string;
  label: string;
  discount_type: PromoDiscountType;
  discount_value: string;
  note: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  sort_order: number;
}

function rowToEditable(row: PromoPackRow): EditablePack {
  return {
    key: row.id,
    id: row.id,
    size: String(row.size),
    label: row.label,
    discount_type: row.discount_type,
    discount_value:
      row.discount_value != null ? String(row.discount_value) : "",
    note: row.note ?? "",
    valid_from: row.valid_from ?? "",
    valid_until: row.valid_until ?? "",
    is_active: row.is_active,
    sort_order: row.sort_order,
  };
}

/** Builds a `PromoPackRow`-shaped object from in-progress form values, for live preview only. */
function toPreviewRow(pack: EditablePack): PromoPackRow {
  return {
    id: pack.id ?? "preview",
    size: Number(pack.size) || 0,
    label: pack.label,
    discount_type: pack.discount_type,
    discount_value:
      pack.discount_value.trim() === "" ? null : Number(pack.discount_value),
    note: pack.note || null,
    valid_from: pack.valid_from || null,
    valid_until: pack.valid_until || null,
    is_active: pack.is_active,
    sort_order: pack.sort_order,
    created_at: "",
    updated_at: "",
  };
}

function validatePack(pack: EditablePack): string | null {
  const size = Number(pack.size);
  if (!pack.label.trim()) return "Falta el nombre del paquete.";
  if (!size || size <= 0) return "El tamaño del paquete debe ser mayor a 0.";
  if (pack.discount_type === "percent") {
    const v = Number(pack.discount_value);
    if (pack.discount_value.trim() === "" || v < 0 || v > 100) {
      return "El % de descuento debe estar entre 0 y 100.";
    }
  }
  if (pack.discount_type === "free_classes") {
    const v = Number(pack.discount_value);
    if (pack.discount_value.trim() === "" || v < 0 || v >= size) {
      return "Las clases gratis deben ser menos que el tamaño del paquete.";
    }
  }
  if (pack.discount_type === "fixed_price") {
    const v = Number(pack.discount_value);
    if (pack.discount_value.trim() === "" || v < 0) {
      return "El precio fijo debe ser un monto válido.";
    }
  }
  if (pack.valid_from && pack.valid_until && pack.valid_from > pack.valid_until) {
    return "La fecha de inicio no puede ser posterior a la de fin.";
  }
  return null;
}

export default function PromoPacksPage() {
  const [packs, setPacks] = useState<EditablePack[]>([]);
  const [referencePrice, setReferencePrice] = useState("5");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchPacks() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("promo_packs")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) setPacks((data as PromoPackRow[]).map(rowToEditable));
      if (error) console.error(error);
      setLoading(false);
    }
    fetchPacks();
  }, []);

  function updatePack(key: string, patch: Partial<EditablePack>) {
    setPacks((prev) =>
      prev.map((p) => (p.key === key ? { ...p, ...patch } : p)),
    );
  }

  function addPack() {
    const tempKey = `new-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setPacks((prev) => [
      ...prev,
      {
        key: tempKey,
        id: null,
        size: "1",
        label: "",
        discount_type: "none",
        discount_value: "",
        note: "",
        valid_from: "",
        valid_until: "",
        is_active: true,
        sort_order: prev.length,
      },
    ]);
  }

  async function removePack(pack: EditablePack) {
    if (!window.confirm(`¿Eliminar el paquete "${pack.label || pack.size + " clases"}"?`)) {
      return;
    }
    if (pack.id) {
      const supabase = createClient();
      const { error } = await supabase
        .from("promo_packs")
        .delete()
        .eq("id", pack.id);
      if (error) {
        setError(error.message);
        return;
      }
    }
    setPacks((prev) => prev.filter((p) => p.key !== pack.key));
  }

  async function handleSave() {
    setError(null);
    setSuccess(false);

    for (const pack of packs) {
      const validationError = validatePack(pack);
      if (validationError) {
        setError(`"${pack.label || "Paquete"}": ${validationError}`);
        return;
      }
    }

    setSaving(true);
    const supabase = createClient();

    try {
      for (const [index, pack] of packs.entries()) {
        const payload = {
          size: Number(pack.size),
          label: pack.label.trim(),
          discount_type: pack.discount_type,
          discount_value:
            pack.discount_type === "none" || pack.discount_value.trim() === ""
              ? null
              : Number(pack.discount_value),
          note: pack.note.trim() || null,
          valid_from: pack.valid_from || null,
          valid_until: pack.valid_until || null,
          is_active: pack.is_active,
          sort_order: index,
        };

        if (pack.id) {
          const { error } = await supabase
            .from("promo_packs")
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq("id", pack.id);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from("promo_packs")
            .insert(payload)
            .select("id")
            .single();
          if (error) throw error;
          if (data) {
            setPacks((prev) =>
              prev.map((p) =>
                p.key === pack.key ? { ...p, id: data.id, key: data.id } : p,
              ),
            );
          }
        }
      }
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando paquetes...</p>;
  }

  const refPrice = referencePrice.trim() === "" ? null : Number(referencePrice);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">
          Paquetes promocionales
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gestiona los paquetes de clases que se ofrecen en el checkout (ej.
          &quot;6 clases, paga 5 y la #6 sale gratis&quot;). Los cambios se
          reflejan de inmediato; usa las fechas de vigencia para programar
          cambios con anticipación sin tener que entrar el día exacto.
        </p>
      </div>

      <div className="grid gap-2 max-w-xs">
        <Label>Precio de clase de referencia (solo para la vista previa)</Label>
        <Input
          type="number"
          min={0}
          step="0.01"
          value={referencePrice}
          onChange={(e) => setReferencePrice(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {packs.map((pack) => {
          const preview = toPreviewRow(pack);
          const total = getPackageTotal(preview, refPrice);
          const pct =
            pack.discount_type === "percent"
              ? getDiscountPercent(preview, refPrice)
              : null;
          const defaultNote = getDefaultNote(preview, refPrice);

          return (
            <div
              key={pack.key}
              className="rounded-lg border border-gray-200 p-4 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="grid gap-1">
                  <Label>Clases</Label>
                  <Input
                    type="number"
                    min={1}
                    value={pack.size}
                    onChange={(e) =>
                      updatePack(pack.key, { size: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1 col-span-2 sm:col-span-2">
                  <Label>Nombre</Label>
                  <Input
                    placeholder="Ej. 6 clases"
                    value={pack.label}
                    onChange={(e) =>
                      updatePack(pack.key, { label: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Activo</Label>
                  <div className="flex h-9 items-center gap-2">
                    <Checkbox
                      checked={pack.is_active}
                      onCheckedChange={(checked) =>
                        updatePack(pack.key, { is_active: checked === true })
                      }
                    />
                    <span className="text-sm text-gray-600">
                      {pack.is_active ? "Sí" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="grid gap-1">
                  <Label>Tipo de descuento</Label>
                  <Select
                    value={pack.discount_type}
                    onValueChange={(value) =>
                      updatePack(pack.key, {
                        discount_type: value as PromoDiscountType,
                        discount_value: value === "none" ? "" : pack.discount_value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DISCOUNT_TYPE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {pack.discount_type !== "none" && (
                  <div className="grid gap-1">
                    <Label>{DISCOUNT_VALUE_LABELS[pack.discount_type]}</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={pack.discount_value}
                      onChange={(e) =>
                        updatePack(pack.key, { discount_value: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="grid gap-1 col-span-2 sm:col-span-1">
                  <Label>Nota (opcional)</Label>
                  <Input
                    placeholder={defaultNote}
                    value={pack.note}
                    onChange={(e) =>
                      updatePack(pack.key, { note: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="grid gap-1">
                  <Label>Vigente desde</Label>
                  <Input
                    type="date"
                    value={pack.valid_from}
                    onChange={(e) =>
                      updatePack(pack.key, { valid_from: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Vigente hasta</Label>
                  <Input
                    type="date"
                    value={pack.valid_until}
                    onChange={(e) =>
                      updatePack(pack.key, { valid_until: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                <p className="text-sm text-gray-700">
                  {total != null ? (
                    <>
                      Total: <span className="font-bold">${total}</span>
                      {pct != null && (
                        <span className="text-green-700 font-semibold">
                          {" "}
                          (¡{pct}% de descuento!)
                        </span>
                      )}
                      {" — "}
                      {pack.note || defaultNote}
                    </>
                  ) : (
                    "Completa los datos para ver el precio calculado."
                  )}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePack(pack)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="outline" onClick={addPack} className="w-full">
        + Agregar paquete
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">
          Paquetes guardados correctamente.
        </p>
      )}

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-primary hover:bg-primary-dark text-white"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  );
}
