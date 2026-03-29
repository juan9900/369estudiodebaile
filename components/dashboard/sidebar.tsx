"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/hooks/use-user";
import { adminLinks, customerLinks } from "@/lib/utils/dashboard-links";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useUser();

  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <aside className="w-64 min-h-screen bg-primary text-white hidden md:flex flex-col">
      <div className="p-6 border-b border-white/20">
        <Link href="/" className="text-xl font-black tracking-wide">
          369 ESTUDIO
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
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
    </aside>
  );
}
