"use client";

import { useUser } from "@/lib/hooks/use-user";
import type { UserRole } from "@/lib/types/database";

interface RoleGateProps {
  requiredRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ requiredRole, children, fallback = null }: RoleGateProps) {
  const { profile, loading } = useUser();

  if (loading) return <div className="p-8 text-gray-500">Cargando...</div>;
  if (profile?.role !== requiredRole) return <>{fallback}</>;

  return <>{children}</>;
}
