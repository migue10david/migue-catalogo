import {
  BellRing,
  ClipboardList,
  LayoutDashboard,
  LayoutGrid,
  Users,
} from "lucide-react";

export const adminNavItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    hint: "Resumen",
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
    hint: "Cuentas",
  },
  {
    title: "Catálogos",
    href: "/admin/catalogs",
    icon: LayoutGrid,
    hint: "Negocios",
  },
  {
    title: "Solicitudes",
    href: "/admin/requests",
    icon: ClipboardList,
    hint: "Accesos",
  },
];

export const adminRouteMeta: Record<
  string,
  { section: string; title: string; description: string; icon: typeof LayoutDashboard }
> = {
  "/admin": {
    section: "Administración",
    title: "Overview",
    description: "Panorama general de la plataforma",
    icon: LayoutDashboard,
  },
  "/admin/users": {
    section: "Administración",
    title: "Usuarios",
    description: "Gestión de cuentas, roles y límites",
    icon: Users,
  },
  "/admin/catalogs": {
    section: "Administración",
    title: "Catálogos",
    description: "Control de publicación y actividad",
    icon: LayoutGrid,
  },
  "/admin/requests": {
    section: "Administración",
    title: "Solicitudes",
    description: "Revisión de altas de vendedores",
    icon: BellRing,
  },
};
