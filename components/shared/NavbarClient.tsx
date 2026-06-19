"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AuthProfile } from "@/lib/auth";
import { NavLink } from "./NavLink";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Store, LogOut, LayoutDashboard, ShoppingBag, Compass, BookOpen, PanelLeft } from "lucide-react";

interface NavbarClientProps {
  user: AuthProfile | null;
  hasEnvVars: boolean | null;
}

function getInitials(email: string | null): string {
  if (!email) return "?";
  const parts = email.split("@")[0];
  return parts.slice(0, 2).toUpperCase();
}

const publicLinks = [
  { href: "/", label: "Inicio" },
  { href: "/explore", label: "Explorar" },
];

export function NavbarClient({ user, hasEnvVars }: NavbarClientProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/auth/login");
  };

  return (
    <nav className={`w-full border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 ${pathname.startsWith("/seller") ? "z-0" : "z-50"}`}>
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center h-14 px-4 sm:px-6">
        {/* Left: Sidebar trigger + Logo */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            <Store className="size-5 text-primary" />
            <span className="hidden sm:inline">Catálogo Online</span>
          </Link>
        </div>

        {/* Desktop: Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {publicLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md hover:bg-accent"
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === "seller" || user?.role === "admin" ? (
            <NavLink
              href="/seller"
              className="px-3 py-2 rounded-md hover:bg-accent"
            >
              Mis Catálogos
            </NavLink>
          ) : null}
        </div>

        {/* Desktop: Right side */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeSwitcher />

          {!hasEnvVars ? (
            <Badge variant="outline" className="font-normal text-xs">
              Configura Supabase
            </Badge>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar size="sm">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <Badge variant="secondary" className="w-fit uppercase text-[10px] mt-1">
                      {user.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/protected">
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {(user.role === "seller" || user.role === "admin") && (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/seller">
                      <ShoppingBag className="mr-2 size-4" />
                      Panel Vendedor
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === "admin" && (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/admin">
                      <ShoppingBag className="mr-2 size-4" />
                      Panel Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">Registrarse</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile: Hamburger + Sheet */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="size-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Store className="size-5 text-primary" />
                  Catálogo Online
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 mt-2">
                  Navegación
                </p>
                {publicLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-accent text-sm"
                    onClick={() => setOpen(false)}
                  >
                    {link.href === "/" ? <BookOpen className="size-4" /> : <Compass className="size-4" />}
                    {link.label}
                  </NavLink>
                ))}
                {user?.role === "seller" || user?.role === "admin" ? (
                  <NavLink
                    href="/seller"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-accent text-sm"
                    onClick={() => setOpen(false)}
                  >
                    <ShoppingBag className="size-4" />
                    Mis Catálogos
                  </NavLink>
                ) : null}

                {!hasEnvVars ? (
                  <div className="mt-4">
                    <Badge variant="outline" className="font-normal text-xs w-full justify-center py-2">
                      Configura Supabase
                    </Badge>
                  </div>
                ) : user ? (
                  <>
                    <div className="h-px bg-border my-3" />
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar size="sm">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.email}</span>
                        <Badge variant="secondary" className="w-fit uppercase text-[10px]">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <NavLink
                        href="/protected"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-accent text-sm"
                        onClick={() => setOpen(false)}
                      >
                        <LayoutDashboard className="size-4" />
                        Dashboard
                      </NavLink>
                      {(user.role === "seller" || user.role === "admin") && (
                        <NavLink
                          href="/seller"
                          className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-accent text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <ShoppingBag className="size-4" />
                          Panel Vendedor
                        </NavLink>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 text-destructive hover:text-destructive mt-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-border my-3" />
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/auth/login" onClick={() => setOpen(false)}>
                          Iniciar sesión
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                          Registrarse
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
