"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const adminItems = [
  {
    title: "Usuarios",
    href: "/admin",
    icon: Users,
    hint: "Gestión de usuarios",
  },
  {
    title: "Catálogos",
    href: "/admin/catalogs",
    icon: LayoutGrid,
    hint: "Todos los catálogos",
  },
  {
    title: "Solicitudes",
    href: "/admin/requests",
    icon: ClipboardList,
    hint: "Pendientes",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/admin"
          className="group flex items-center gap-2.5 rounded-xl bg-primary/5 px-3 py-2.5 transition-all duration-200 hover:bg-primary/10"
        >
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo1.png" alt="Catalogly" className="size-9 object-contain" />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold leading-tight tracking-tight">
              Admin Panel
            </p>
            <p className="text-[11px] leading-tight text-muted-foreground">
              Administración general
            </p>
          </div>
          <Badge
            variant="secondary"
            className="hidden border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary group-data-[collapsible=icon]:hidden"
          >
            Admin
          </Badge>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`rounded-lg px-3 py-6 transition-all duration-150 ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium shadow-sm"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <Link href={item.href}>
                        <item.icon
                          className={`size-5 ${isActive ? "text-primary" : ""}`}
                        />
                        <div className="flex min-w-0 flex-1 items-center justify-between group-data-[collapsible=icon]:hidden">
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-[15px] leading-tight">
                              {item.title}
                            </span>
                            <span className="truncate text-[13px] leading-tight text-muted-foreground/70">
                              {item.hint}
                            </span>
                          </div>
                          {isActive && (
                            <div className="size-1.5 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg border border-border/40 bg-muted/15 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground/70">
          Gestiona usuarios y catálogos de la plataforma.
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
