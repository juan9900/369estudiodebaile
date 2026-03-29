"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog";

export function UsersTable() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setUsers(data as Profile[]);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <p className="text-sm text-gray-500 py-4">Cargando...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="text-white" onClick={() => setCreateOpen(true)}>
          Crear usuario
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Email
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Rol
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      user.role === "admin"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {user.role === "admin" ? "Admin" : "Cliente"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setDeleteTarget(user)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Eliminar usuario"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(user) => setUsers((prev) => [user, ...prev])}
      />

      {deleteTarget && (
        <DeleteUserDialog
          open={!!deleteTarget}
          userId={deleteTarget.id}
          userEmail={deleteTarget.email ?? ""}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
