"use client";

import Link from "next/link";
import { Pencil, Users } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import type { DanceClass } from "@/lib/types/database";

function formatClassDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString("es-ES", { weekday: "short" });
  return `${weekday} ${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
}

export function getClassesColumns(
  onDelete: (id: string) => void,
  mode: "upcoming" | "past" | "cancelled" = "upcoming",
): ColumnDef<DanceClass>[] {
  return [
    {
      id: "clase",
      header: "Clase",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const cls = row.original;
        if (cls.cancelled_at) {
          return (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
              Cancelada
            </Badge>
          );
        }
        return (
          <Badge
            className={
              cls.is_active
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
            }
          >
            {cls.is_active ? "Activa" : "Inactiva"}
          </Badge>
        );
      },
    },
    {
      id: "fecha",
      header: "Fecha",
      cell: ({ row }) => formatClassDate(row.original.scheduled_date),
    },
    {
      id: "horario",
      header: "Horario",
      cell: ({ row }) => {
        const cls = row.original;
        return `${cls.start_time.slice(0, 5)} – ${cls.end_time.slice(0, 5)}`;
      },
    },
    {
      id: "instructor",
      header: "Instructor",
      cell: ({ row }) => row.original.instructor,
    },
    {
      id: "inscritos",
      header: "Inscritos",
      cell: ({ row }) => {
        const cls = row.original;
        return `${cls.current_enrollment}/${cls.max_capacity}`;
      },
    },
    {
      id: "precio",
      header: "Precio",
      cell: ({ row }) => {
        const price = row.original.price;
        return price !== null ? `$${price.toFixed(2)}` : "—";
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const cls = row.original;

        if (mode === "cancelled") {
          return (
            <div className="flex items-center gap-1">
              <Link href={`/admin/classes/${cls.id}/registrations`}>
                <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                  <Users size={15} />
                </button>
              </Link>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-1">
            <Link href={`/admin/classes/${cls.id}/registrations`}>
              <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                <Users size={15} />
              </button>
            </Link>
            <Link href={`/admin/classes/${cls.id}/edit`}>
              <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                <Pencil size={15} />
              </button>
            </Link>
            <button
              onClick={() => onDelete(cls.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-semibold"
            >
              Eliminar
            </button>
          </div>
        );
      },
    },
  ];
}
