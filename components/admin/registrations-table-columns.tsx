"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import type {
  RegistrationWithClass,
  RegistrationStatus,
} from "@/lib/types/database";

export const statusLabels: Record<RegistrationStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

export const statusColors: Record<RegistrationStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800",
  confirmed:
    "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800",
};

const paymentMethodLabels: Record<string, string> = {
  zelle: "Zelle",
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
        <Badge className={`${statusColors[status]}`}>
          {statusLabels[status]}
        </Badge>
      );
    },
  },
  {
    id: "fecha_clase",
    header: "Fecha de Clase",
    cell: ({ row }) => {
      return new Date(row.original.classes.scheduled_date).toLocaleDateString();
    },
  },
  {
    id: "fecha_registro",
    header: "Fecha de Registro",
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleDateString();
    },
  },
  {
    id: "costo",
    header: "Costo",
    cell: ({ row }) => {
      const reg = row.original;
      const amount = reg.paid_amount ?? reg.classes.price;
      return amount != null ? `$${amount}` : "—";
    },
  },
  {
    id: "paquete",
    header: "Paquete",
    cell: ({ row }) => {
      const pack = row.original.promo_pack;
      return pack && pack > 1 ? (
        <Badge className="bg-vino/10 text-vino hover:bg-vino/10 hover:text-vino">
          Pack de {pack}
        </Badge>
      ) : (
        <span className="text-gray-400">—</span>
      );
    },
  },
  {
    accessorKey: "discount_applied",
    header: "Descuento",
    cell: ({ row }) => {
      const discounted = row.original.discount_applied;
      return (
        <Badge
          className={
            discounted
              ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-600"
          }
        >
          {discounted ? "Sí" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Método de Pago",
    cell: ({ row }) => {
      const method = row.getValue<string | null>("payment_method");
      return method ? (paymentMethodLabels[method] ?? method) : "—";
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
