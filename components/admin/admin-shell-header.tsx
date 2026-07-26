"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronsUpDown, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { adminRouteMeta } from "@/components/admin/admin-nav";

export function AdminShellHeader() {
  const pathname = usePathname();

  const meta = useMemo(
    () => adminRouteMeta[pathname] ?? adminRouteMeta["/admin"],
    [pathname],
  );

  return (
    <header className="sticky top-0 z-30 rounded-3xl border bg-background/85 px-4 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/72 sm:px-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="-ml-1 size-8 text-muted-foreground hover:text-foreground" />
          <div className="hidden h-8 w-px bg-border sm:block" />
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden rounded-2xl border bg-muted/30 p-2 sm:flex">
              <meta.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{meta.section}</span>
                <span>/</span>
                <span className="truncate">{meta.title}</span>
              </div>
              <p className="truncate text-sm font-medium text-foreground">
                {meta.description}
              </p>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden w-56 lg:block xl:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Buscar en el panel"
            placeholder="Buscar catálogo, usuario..."
            className="h-10 rounded-xl border-border/70 bg-muted/35 pl-9 shadow-none"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden h-5 -translate-y-1/2 items-center rounded border bg-background px-1.5 font-mono text-[10px] text-muted-foreground xl:flex">
            ⌘ K
          </kbd>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            aria-label="Notificaciones"
          >
            <Bell className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-2 rounded-xl border border-border/70 px-1.5 sm:px-2">
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-medium leading-none">Administrador</p>
                  <p className="mt-1 text-[11px] leading-none text-muted-foreground">
                    Catalogly
                  </p>
                </div>
                <ChevronsUpDown className="hidden size-3.5 text-muted-foreground sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Panel administrativo</DropdownMenuItem>
              <DropdownMenuItem>Sesión activa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
