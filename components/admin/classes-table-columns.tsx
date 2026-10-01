"use client";

import Link from "next/link";
import { Pencil, Users } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import type { DanceClass, FixedClassSlot } from "@/lib/types/database";
import { formatSlotsFull, formatSlotsShort } from "@/lib/utils/fixed-class-slots";

/** A DanceClass row as fetched by ClassesTable, with its fixed_class_slots embed. */
export interface DanceClassRow extends DanceClass {
  fixed_class_slots?: Pick<FixedClassSlot, "weekday" | "start_time" | "end_time">[];
}

function formatClassDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString("es-ES", { weekday: "short" });
  return `${weekday} ${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
}

function isScheduledForFuture(cls: DanceClassRow): boolean {
  const todayIso = new Date().toISOString();
  const notStartedYet = !!cls.starts_on && cls.starts_on > todayIso.split("T")[0];
  const notPublishedYet = !!cls.published_at && cls.published_at > todayIso;
  return notStartedYet || notPublishedYet;
}

export function getClassesColumns(
  onDelete: (id: string) => void,
  mode: "upcoming" | "past" | "cancelled" = "upcoming",
): ColumnDef<DanceClassRow>[] {
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
        if (cls.is_active && isScheduledForFuture(cls)) {
          return (
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              Programada
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
      cell: ({ row }) => {
        const cls = row.original;
        if (cls.class_type === "fijas") {
          const slots = cls.fixed_class_slots ?? [];
          return slots.length > 0
            ? formatSlotsShort(slots)
            : cls.weekday != null
              ? formatSlotsShort([{ weekday: cls.weekday, start_time: cls.start_time, end_time: cls.end_time }])
              : "—";
        }
        return cls.scheduled_date ? formatClassDate(cls.scheduled_date) : "—";
      },
    },
    {
      id: "horario",
      header: "Horario",
      cell: ({ row }) => {
        const cls = row.original;
        if (cls.class_type === "fijas" && (cls.fixed_class_slots?.length ?? 0) > 0) {
          return formatSlotsFull(cls.fixed_class_slots!);
        }
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
        // A fixed class's enrollment is per monthly cycle, not a single
        // count — see its registrations page for cycle-by-cycle numbers.
        if (cls.class_type === "fijas") return "Ver ciclos";
        return `${cls.current_enrollment}/${cls.max_capacity}`;
      },
    },
    {
      id: "precio",
      header: "Precio",
      cell: ({ row }) => {
        const { price, class_type } = row.original;
        if (price === null) return "—";
        return class_type === "fijas"
          ? `$${price.toFixed(2)}/ciclo`
          : `$${price.toFixed(2)}`;
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
