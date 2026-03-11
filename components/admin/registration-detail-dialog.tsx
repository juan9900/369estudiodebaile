"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  statusLabels,
  statusColors,
} from "@/components/admin/registrations-table-columns";
import type { RegistrationWithClass, RegistrationStatus } from "@/lib/types/database";

const paymentMethodLabels: Record<string, string> = {
  paypal: "PayPal",
  binance: "Binance",
  bs: "Bs",
  efectivo: "Efectivo",
};

const allStatuses: RegistrationStatus[] = ["pending", "confirmed", "cancelled", "attended"];

interface RegistrationDetailDialogProps {
  registration: RegistrationWithClass | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: RegistrationStatus) => Promise<void>;
}

export function RegistrationDetailDialog({
  registration,
  open,
  onClose,
  onStatusChange,
}: RegistrationDetailDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<RegistrationStatus | null>(null);
  const [saving, setSaving] = useState(false);

  // Keep local status in sync when dialog opens with a new registration
  const currentStatus = selectedStatus ?? registration?.status ?? "pending";

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      setSelectedStatus(null);
    }
  };

  const handleSave = async () => {
    if (!registration || !selectedStatus || selectedStatus === registration.status) return;
    setSaving(true);
    await onStatusChange(registration.id, selectedStatus);
    setSaving(false);
    setSelectedStatus(null);
    onClose();
  };

  if (!registration) return null;

  const cls = registration.classes;
  const dateStr = new Date(cls.scheduled_date + "T00:00:00").toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const createdStr = new Date(registration.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Detalle de inscripción</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Cliente */}
          <Section label="Cliente">
            <span className="font-medium">
              {registration.contact_name} {registration.contact_lastname}
            </span>
          </Section>

          <Row label="Teléfono">{registration.contact_phone}</Row>
          <Row label="Email">{registration.contact_email}</Row>

          {/* Estado actual */}
          <Section label="Estado">
            <Badge className={statusColors[registration.status]}>
              {statusLabels[registration.status]}
            </Badge>
          </Section>

          <Row label="Método de Pago">
            {registration.payment_method
              ? paymentMethodLabels[registration.payment_method] ?? registration.payment_method
              : "—"}
          </Row>
          <Row label="ID Recibo">{registration.transaction_id ?? "—"}</Row>
          {registration.notes && <Row label="Notas">{registration.notes}</Row>}
          <Row label="Fecha de inscripción">{createdStr}</Row>

          {/* Separador */}
          <hr className="my-2" />

          {/* Info de clase */}
          <Section label="Clase">
            <span className="font-medium">{cls.title}</span>
          </Section>
          <Row label="Instructor">{cls.instructor}</Row>
          <Row label="Fecha y hora">
            {dateStr} · {cls.start_time} – {cls.end_time}
          </Row>

          {/* Separador */}
          <hr className="my-2" />

          {/* Cambio de estado */}
          <Section label="Cambiar estado">
            <div className="flex flex-wrap gap-2">
              {allStatuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStatus(s)}
                  className={[
                    "px-3 py-1 rounded-full text-sm border transition-colors",
                    currentStatus === s
                      ? statusColors[s] + " border-transparent font-semibold"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100",
                  ].join(" ")}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </Section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !selectedStatus || selectedStatus === registration.status}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-800 text-right">{children}</span>
    </div>
  );
}
