"use client";

import { useEffect, useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";

import { createClient } from "@/lib/supabase/client";
import type { RegistrationWithClass, RegistrationStatus } from "@/lib/types/database";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { columns } from "@/components/admin/registrations-table-columns";
import { RegistrationDetailDialog } from "@/components/admin/registration-detail-dialog";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

const PAGE_SIZE = 50;

interface RegistrationsTableProps {
  classId?: string;
}

export function RegistrationsTable({ classId }: RegistrationsTableProps) {
  const [registrations, setRegistrations] = useState<RegistrationWithClass[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [selectedReg, setSelectedReg] = useState<RegistrationWithClass | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const from = pagination.pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let countQuery = supabase
      .from("registrations")
      .select("id", { count: "exact", head: true });
    let dataQuery = supabase
      .from("registrations")
      .select("*, classes(id, title, instructor, scheduled_date, start_time, end_time)")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (classId) {
      countQuery = countQuery.eq("class_id", classId);
      dataQuery = dataQuery.eq("class_id", classId);
    }

    const [{ count }, { data }] = await Promise.all([countQuery, dataQuery]);

    setTotalCount(count ?? 0);
    setRegistrations((data as RegistrationWithClass[]) ?? []);
    setLoading(false);
  }, [classId, pagination.pageIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onStatusChange = useCallback(async (id: string, newStatus: RegistrationStatus) => {
    const reg = registrations.find((r) => r.id === id);
    if (!reg) return;

    const supabase = createClient();
    const oldStatus = reg.status;

    await supabase.from("registrations").update({ status: newStatus }).eq("id", id);

    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
  }, [registrations]);

  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  const table = useReactTable({
    data: registrations,
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
        data={registrations}
        columns={columns}
        pagination={pagination}
        pageCount={pageCount}
        onPaginationChange={setPagination}
        onRowClick={(row) => setSelectedReg(row)}
      />
      {totalCount > 0 && <DataTablePagination table={table} />}

      <RegistrationDetailDialog
        registration={selectedReg}
        open={selectedReg !== null}
        onClose={() => setSelectedReg(null)}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
