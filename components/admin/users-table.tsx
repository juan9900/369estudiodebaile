"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import { Badge } from "@/components/ui/badge";

export function UsersTable() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

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

  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);
    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole as any } : u)),
      );
    }
  }

  if (loading) return <p className="text-sm text-gray-500 py-4">Cargando...</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">
              Nombre
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">
              Email
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">
              Teléfono
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
              <td className="px-4 py-3">{user.full_name || "—"}</td>
              <td className="px-4 py-3 text-gray-500">{user.email}</td>
              <td className="px-4 py-3 text-gray-500">{user.phone || "—"}</td>
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
                  onClick={() => toggleRole(user.id, user.role)}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  {user.role === "admin" ? "Hacer cliente" : "Hacer admin"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
