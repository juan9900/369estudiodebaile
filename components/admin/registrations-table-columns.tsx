"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import type { RegistrationWithClass, RegistrationStatus } from "@/lib/types/database";

export const statusLabels: Record<RegistrationStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  attended: "Asistida",
};

export const statusColors: Record<RegistrationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  attended: "bg-blue-100 text-blue-800",
};

const paymentMethodLabels: Record<string, string> = {
  paypal: "PayPal",
  binance: "Binance",
  bs: "Bs",
  efectivo: "Efectivo",
};

export const columns: ColumnDef<RegistrationWithClass>[] = [
  {
    id: "cliente",
    header: "Cliente",
    cell: ({ row }) => {
      const reg = row.original;
      return (
        <span className="font-medium">
          {reg.contact_name} {reg.contact_lastname}
        </span>
      );
    },
  },
  {
    accessorKey: "contact_phone",
    header: "Teléfono",
  },
  {
    accessorKey: "contact_email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue<RegistrationStatus>("status");
      return (
        <Badge className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Método de Pago",
    cell: ({ row }) => {
      const method = row.getValue<string | null>("payment_method");
      return method ? paymentMethodLabels[method] ?? method : "—";
    },
  },
  {
    accessorKey: "transaction_id",
    header: "ID Recibo",
    cell: ({ row }) => {
      const tid = row.getValue<string | null>("transaction_id");
      return tid ?? "—";
    },
  },
];
