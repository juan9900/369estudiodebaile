"use client";

import { useEffect, useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

import { createClient } from "@/lib/supabase/client";
import type { DanceClass } from "@/lib/types/database";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { getClassesColumns } from "@/components/admin/classes-table-columns";
import { DeleteClassDialog } from "@/components/admin/delete-class-dialog";

const PAGE_SIZE = 20;

interface ClassesTableProps {
  mode: "upcoming" | "past" | "cancelled";
}

type DeleteDialogState = "no-registrations" | "has-active" | "all-cancelled";

interface DeleteDialogInfo {
  classId: string;
  className: string;
  state: DeleteDialogState;
  activeCount: number;
}

export function ClassesTable({ mode }: ClassesTableProps) {
  const [classes, setClasses] = useState<DanceClass[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogInfo | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    const from = pagination.pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const baseQuery = () =>
      supabase
        .from("classes")
        .select("*, registrations(count)", { count: "exact" })
        .in("registrations.status", ["confirmed", "pending"]);

    let countQuery = supabase
      .from("classes")
      .select("id", { count: "exact", head: true });

    let dataQuery = baseQuery().range(from, to);

    if (mode === "upcoming") {
      countQuery = countQuery
        .gte("scheduled_date", today)
        .is("cancelled_at", null);
      dataQuery = dataQuery
        .gte("scheduled_date", today)
        .is("cancelled_at", null)
        .order("scheduled_date", { ascending: true });
    } else if (mode === "past") {
      countQuery = countQuery
        .lt("scheduled_date", today)
        .is("cancelled_at", null);
      dataQuery = dataQuery
        .lt("scheduled_date", today)
        .is("cancelled_at", null)
        .order("scheduled_date", { ascending: false });
    } else {
      // cancelled
      countQuery = countQuery.not("cancelled_at", "is", null);
      dataQuery = dataQuery
        .not("cancelled_at", "is", null)
        .order("cancelled_at", { ascending: false });
    }

    const [{ count }, { data }] = await Promise.all([countQuery, dataQuery]);

    setTotalCount(count ?? 0);
    setClasses(
      (data ?? []).map((c) => ({
        ...c,
        current_enrollment:
          (c.registrations as { count: number }[])?.[0]?.count ?? 0,
      })) as DanceClass[],
    );
    setLoading(false);
  }, [mode, pagination.pageIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDeleteDialog = useCallback(async (id: string) => {
    const supabase = createClient();
    const cls = classes.find((c) => c.id === id);
    if (!cls) return;

    const { data } = await supabase
      .from("registrations")
      .select("status")
      .eq("class_id", id);

    const all = data ?? [];
    const activeCount = all.filter(
      (r) => r.status === "pending" || r.status === "confirmed",
    ).length;

    let state: DeleteDialogState;
    if (all.length === 0) {
      state = "no-registrations";
    } else if (activeCount > 0) {
      state = "has-active";
    } else {
      state = "all-cancelled";
    }

    setDeleteDialog({ classId: id, className: cls.title, state, activeCount });
  }, [classes]);

  const handleHardDelete = useCallback(async () => {
    if (!deleteDialog) return;
    const supabase = createClient();
    await supabase.from("classes").delete().eq("id", deleteDialog.classId);
    setClasses((prev) => prev.filter((c) => c.id !== deleteDialog.classId));
    setTotalCount((prev) => prev - 1);
    setDeleteDialog(null);
  }, [deleteDialog]);

  const handleSoftDelete = useCallback(async () => {
    if (!deleteDialog) return;
    const supabase = createClient();
    await supabase
      .from("classes")
      .update({ is_active: false, cancelled_at: new Date().toISOString() })
      .eq("id", deleteDialog.classId);
    setClasses((prev) => prev.filter((c) => c.id !== deleteDialog.classId));
    setTotalCount((prev) => prev - 1);
    setDeleteDialog(null);
  }, [deleteDialog]);

  const emptyMessages: Record<typeof mode, string> = {
    upcoming: "No hay clases próximas.",
    past: "No hay clases pasadas.",
    cancelled: "No hay clases canceladas.",
  };

  const columns = getClassesColumns(openDeleteDialog, mode);

  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  const table = useReactTable({
    data: classes,
    columns,
    pageCount,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (loading) return <p className="text-sm text-gray-500 py-4">Cargando...</p>;

  return (
    <div>
      <DataTable
        data={classes}
        columns={columns}
        pagination={pagination}
        pageCount={pageCount}
        onPaginationChange={setPagination}
        emptyMessage={emptyMessages[mode]}
      />
      {totalCount > PAGE_SIZE && <DataTablePagination table={table} />}

      {deleteDialog && (
        <DeleteClassDialog
          classId={deleteDialog.classId}
          className={deleteDialog.className}
          open={true}
          state={deleteDialog.state}
          activeCount={deleteDialog.activeCount}
          onClose={() => setDeleteDialog(null)}
          onConfirmHardDelete={handleHardDelete}
          onConfirmSoftDelete={handleSoftDelete}
        />
      )}
    </div>
  );
}
