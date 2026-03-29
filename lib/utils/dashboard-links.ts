import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  User,
  Users,
  GraduationCap,
  FileText,
  ImageIcon,
  Settings,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export type DashboardLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const customerLinks: DashboardLink[] = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/clases", label: "Clases", icon: BookOpen },
  {
    href: "/dashboard/my-registrations",
    label: "Mis Inscripciones",
    icon: ClipboardList,
  },
  { href: "/dashboard/profile", label: "Mi Perfil", icon: User },
];

export const adminLinks: DashboardLink[] = [
  { href: "/admin", label: "Panel Admin", icon: LayoutDashboard },
  { href: "/admin/clases", label: "Clases", icon: GraduationCap },
  { href: "/admin/inscripciones", label: "Inscripciones", icon: FileText },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/media", label: "Medios", icon: ImageIcon },
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
];
