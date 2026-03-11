"use client";

import { useUser } from "@/lib/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";

export function Header() {
  const { profile, loading } = useUser();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {loading ? (
          <span className="text-sm text-gray-400">Cargando...</span>
        ) : (
          <>
            <span className="font-semibold text-[#1a1a1a]">
              {profile?.full_name || profile?.email || ""}
            </span>
            <Badge
              className={
                profile?.role === "admin"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700"
              }
            >
              {profile?.role === "admin" ? "Admin" : "Cliente"}
            </Badge>
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
      >
        <LogOut size={16} />
        Cerrar sesión
      </button>
    </header>
  );
}
