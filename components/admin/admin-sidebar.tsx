"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Sparkles,
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
import { adminNavItems } from "@/components/admin/admin-nav";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/admin"
          className="group flex items-center gap-2.5 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/30 px-3 py-3 transition-all duration-200 hover:bg-sidebar-accent/60"
        >
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 bg-background shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo1.png" alt="Catalogly" className="size-8 object-contain" />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold leading-tight tracking-tight text-sidebar-foreground">
                Admin Console
              </p>
              <Badge
                variant="secondary"
                className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-300"
              >
                Live
              </Badge>
            </div>
            <p className="mt-1 text-[11px] leading-tight text-sidebar-foreground/65">
              Control central de Catalogly
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => {
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
                      className={`rounded-xl px-3 py-6 transition-all duration-150 ${
                        isActive
                          ? "bg-sidebar-primary/10 font-medium text-sidebar-primary shadow-sm"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                      }`}
                    >
                      <Link href={item.href}>
                        <item.icon className={`size-5 ${isActive ? "text-sidebar-primary" : ""}`} />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 group-data-[collapsible=icon]:hidden">
                          <div className="min-w-0">
                            <p className="truncate text-[14px] leading-tight">
                              {item.title}
                            </p>
                            <p className="truncate text-[12px] leading-tight text-sidebar-foreground/55">
                              {item.hint}
                            </p>
                          </div>
                          {isActive && (
                            <div className="size-1.5 shrink-0 rounded-full bg-sidebar-primary" />
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
        <div className="rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/30 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-sidebar-foreground">
            <Sparkles className="size-4 text-sidebar-primary" />
            Ritmo de operación
          </div>
          <p className="mt-2 text-[12px] leading-5 text-sidebar-foreground/65">
            Supervisa altas, catálogos y capacidad sin salir del panel.
          </p>
          <Link
            href="/admin/requests"
            className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-sidebar-primary transition-opacity hover:opacity-80"
          >
            Ir a moderación
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
