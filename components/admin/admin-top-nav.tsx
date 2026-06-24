"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutGrid, ClipboardList } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  {
    label: "Usuarios",
    href: "/admin",
    icon: Users,
  },
  {
    label: "Catálogos",
    href: "/admin/catalogs",
    icon: LayoutGrid,
  },
  {
    label: "Solicitudes",
    href: "/admin/requests",
    icon: ClipboardList,
  },
];

export function AdminTopNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 md:hidden">
      {items.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/10"
                : "border-border/60 bg-background text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/30",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
