"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  PanelTop,
  Store,
  ShoppingBag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const sellerItems = [
  {
    title: "Catálogos",
    href: "/seller/catalogs",
    icon: LayoutGrid,
    hint: "Negocios",
  },
  {
    title: "Productos",
    href: "/seller/products",
    icon: Package,
    hint: "Inventario",
  },
];

const navItems = [
  {
    title: "Dashboard",
    href: "/protected",
    icon: PanelTop,
  },
  {
    title: "Marketplace",
    href: "/",
    icon: ShoppingBag,
  },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/seller/catalogs"
          className="group flex items-center gap-2.5 rounded-xl bg-primary/5 px-3 py-2.5 transition-all duration-200 hover:bg-primary/10"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Store className="size-[18px]" />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold leading-tight tracking-tight">
              Seller Studio
            </p>
            <p className="text-[11px] leading-tight text-muted-foreground">
              Gestión de catálogos
            </p>
          </div>
          <Badge
            variant="secondary"
            className="hidden border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 group-data-[collapsible=icon]:hidden"
          >
            Live
          </Badge>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sellerItems.map((item) => {
                const isActive = pathname === item.href;
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
                        <item.icon className={`size-5 ${isActive ? "text-primary" : ""}`} />
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
          Mantén catálogos e inventario separados.
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
