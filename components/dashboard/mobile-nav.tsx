"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useMobileMenu } from "@/lib/hooks/use-mobile-menu";
import { useUser } from "@/lib/hooks/use-user";
import { adminLinks, customerLinks } from "@/lib/utils/dashboard-links";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const { isOpen, toggle, close } = useMobileMenu();
  const { isAdmin, profile } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const links = isAdmin ? adminLinks : customerLinks;

  async function handleLogout() {
    close();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <div className="md:hidden">
      {/* Top bar */}
      <div className="h-16 bg-primary text-white flex items-center justify-between px-6">
        <Link href="/" className="text-xl font-black tracking-wide">
          369 ESTUDIO
        </Link>
        <button
          onClick={toggle}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          className="text-white hover:text-white/80 transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Full-screen overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-primary text-white flex flex-col animate-in fade-in duration-200">
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/20">
            <span className="text-xl font-black tracking-wide">369 ESTUDIO</span>
            <button
              onClick={close}
              aria-label="Cerrar menú"
              className="text-white hover:text-white/80 transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                  pathname === href
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/20">
            <div className="px-4 py-2 text-sm text-white/70 mb-2">
              {profile?.full_name || profile?.email || ""}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 w-full text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
