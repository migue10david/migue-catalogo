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
import { Menu, Store, LogOut, LayoutDashboard, ShoppingBag, Compass, BookOpen, ShieldCheck } from "lucide-react";
import { CartIndicator } from "@/components/cart/cart-indicator";

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

  const isAdmin = pathname.startsWith("/admin");
  const isSeller = pathname.startsWith("/seller");

  if (isAdmin || isSeller) {
    return null;
  }

  return (
    <nav className={`w-full border-b border-white/10 dark:bg-card bg-primary sticky top-0 ${isAdmin ? "z-40" : "z-50"}`}>
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center h-14 px-4 sm:px-6">
        {/* Left: Sidebar trigger + Logo */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo1.png" alt="Catálogo Online" className="h-9 md:h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop: Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {publicLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="text-white/60 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md"
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === "seller" || user?.role === "admin" ? (
            <NavLink
              href="/seller"
              className="text-white/60 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md"
            >
              Mis Catálogos
            </NavLink>
          ) : null}
          {user?.role === "admin" ? (
            <NavLink
              href="/admin"
              className={`px-3 py-2 rounded-md ${isAdmin ? "text-white bg-white/15 font-medium" : "text-white/60 hover:text-white hover:bg-white/10"}`}
            >
              Admin
            </NavLink>
          ) : null}
        </div>

        {/* Desktop: Right side */}
        <div className="hidden md:flex items-center gap-2 text-white/60">
          <CartIndicator />
          <ThemeSwitcher />

          {!hasEnvVars ? (
            <Badge variant="outline" className="font-normal text-xs border-white/20 text-white/60">
              Configura Supabase
            </Badge>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar size="sm">
                    <AvatarFallback className="text-xs bg-white/15 text-white">
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
                      <ShieldCheck className="mr-2 size-4" />
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
              <Button asChild variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm" className="bg-secondary hover:bg-secondary/85 text-secondary-foreground shadow-none">
                <Link href="/auth/sign-up">Registrarse</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile: Hamburger + Sheet */}
        <div className="flex md:hidden items-center gap-2 text-white/60">
          <CartIndicator />
          <ThemeSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 [&_svg]:text-white/80">
                <Menu className="size-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 dark:bg-card bg-primary border-white/10">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-white">
                  <Store className="size-5 text-[#6bd8cb]" />
                  Catálogo Online
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 mt-2">
                  Navegación
                </p>
                {publicLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white text-sm"
                    onClick={() => setOpen(false)}
                  >
                    {link.href === "/" ? <BookOpen className="size-4" /> : <Compass className="size-4" />}
                    {link.label}
                  </NavLink>
                ))}
                {user?.role === "seller" || user?.role === "admin" ? (
                  <NavLink
                    href="/seller"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white text-sm"
                    onClick={() => setOpen(false)}
                  >
                    <ShoppingBag className="size-4" />
                    Mis Catálogos
                  </NavLink>
                ) : null}
                {user?.role === "admin" ? (
                  <NavLink
                    href="/admin"
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm ${isAdmin ? "bg-white/15 text-white font-medium" : "hover:bg-white/10 text-white/70 hover:text-white"}`}
                    onClick={() => setOpen(false)}
                  >
                    <ShieldCheck className="size-4" />
                    Panel Admin
                  </NavLink>
                ) : null}

                {!hasEnvVars ? (
                  <div className="mt-4">
                    <Badge variant="outline" className="font-normal text-xs w-full justify-center py-2 border-white/20 text-white/60">
                      Configura Supabase
                    </Badge>
                  </div>
                ) : user ? (
                  <>
                    <div className="h-px bg-white/10 my-3" />
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar size="sm">
                        <AvatarFallback className="text-xs bg-white/15 text-white">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white/90">{user.email}</span>
                        <Badge variant="secondary" className="w-fit uppercase text-[10px]">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <NavLink
                        href="/protected"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white text-sm"
                        onClick={() => setOpen(false)}
                      >
                        <LayoutDashboard className="size-4" />
                        Dashboard
                      </NavLink>
                      {(user.role === "seller" || user.role === "admin") && (
                        <NavLink
                          href="/seller"
                          className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <ShoppingBag className="size-4" />
                          Panel Vendedor
                        </NavLink>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 text-red-300 hover:text-red-200 hover:bg-white/10 mt-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-white/10 my-3" />
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="outline" size="sm" className="border-white/20 text-white/80 hover:text-white hover:bg-white/10">
                        <Link href="/auth/login" onClick={() => setOpen(false)}>
                          Iniciar sesión
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="bg-secondary hover:bg-secondary/85 text-secondary-foreground shadow-none">
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
