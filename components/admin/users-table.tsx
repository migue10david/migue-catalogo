"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Badge } from "@/components/ui/badge";
import {
  increaseUserCatalogLimit,
  increaseUserProductLimit,
} from "@/app/actions/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Users, ShieldCheck, Store } from "lucide-react";
import type { AdminUserProfile } from "@/lib/admin";

const ITEMS_PER_PAGE = 10;

type UsersTableProps = {
  users: AdminUserProfile[];
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const roleConfig: Record<string, { label: string; className: string }> = {
  admin: {
    label: "Admin",
    className: "border-primary/20 bg-primary/10 text-primary",
  },
  seller: {
    label: "Seller",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  user: {
    label: "User",
    className: "border-border/60 bg-muted/50 text-muted-foreground",
  },
};

function ProductLimitSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" variant="outline" disabled={pending}>
      {pending ? "Sumando..." : "Sumar"}
    </Button>
  );
}

function ProductLimitControls({ user }: { user: AdminUserProfile }) {
  if (user.role !== "seller") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <form action={increaseUserProductLimit} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={user.id} />
      <Input
        name="incrementBy"
        type="number"
        min="1"
        step="1"
        defaultValue="1"
        className="h-8 w-16 text-center"
      />
      <ProductLimitSubmitButton />
    </form>
  );
}

function CatalogLimitSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" variant="outline" disabled={pending}>
      {pending ? "Sumando..." : "Sumar"}
    </Button>
  );
}

function CatalogLimitControls({ user }: { user: AdminUserProfile }) {
  if (user.role !== "seller") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <form action={increaseUserCatalogLimit} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={user.id} />
      <Input
        name="incrementBy"
        type="number"
        min="1"
        step="1"
        defaultValue="1"
        className="h-8 w-16 text-center"
      />
      <CatalogLimitSubmitButton />
    </form>
  );
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalSellers = useMemo(
    () => users.filter((u) => u.role === "seller").length,
    [users],
  );

  const totalAdmins = useMemo(
    () => users.filter((u) => u.role === "admin").length,
    [users],
  );

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const query = search.toLowerCase();
    return users.filter(
      (u) => u.email?.toLowerCase().includes(query) ?? false,
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 px-8 py-16 text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted/40">
          <Users className="size-8 text-muted-foreground/25" />
        </div>
        <p className="font-serif-display text-xl text-muted-foreground/70">
          Sin usuarios registrados
        </p>
        <p className="mt-2 text-sm text-muted-foreground/50">
          Aún no hay usuarios en la plataforma.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CardHeader className="relative pb-2 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-widest">
                Total usuarios
              </CardDescription>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <Users className="size-4 text-primary" />
              </div>
            </div>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {users.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Usuarios registrados en la plataforma.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CardHeader className="relative pb-2 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-widest">
                Sellers
              </CardDescription>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Store className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {totalSellers}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Vendedores con cupos administrables.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CardHeader className="relative pb-2 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-widest">
                Administradores
              </CardDescription>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
                <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {totalAdmins}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Acceso total a la plataforma.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
        <Input
          placeholder="Buscar por email..."
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden rounded-2xl border border-border/50 bg-card shadow-sm sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Rol
              </TableHead>
              <TableHead className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                Catálogos
              </TableHead>
              <TableHead className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                Cupo catálogos
              </TableHead>
              <TableHead className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                Libres catálogos
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Ajustar catálogos
              </TableHead>
              <TableHead className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                Productos
              </TableHead>
              <TableHead className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                Cupo
              </TableHead>
              <TableHead className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                Disponibles
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Ajustar cupo
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Registrado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => {
              const roleStyle = roleConfig[user.role] ?? roleConfig.user;

              return (
                <TableRow
                  key={user.id}
                  className="border-border/30 transition-colors hover:bg-muted/20"
                >
                  <TableCell className="font-medium">
                    {user.email ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-medium ${roleStyle.className}`}
                    >
                      {roleStyle.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="tabular-nums">{user.catalog_count}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="tabular-nums">{user.role === "seller" ? user.catalog_limit : "—"}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="tabular-nums">{user.role === "seller" ? user.remaining_catalog_slots : "—"}</span>
                  </TableCell>
                  <TableCell>
                    <CatalogLimitControls user={user} />
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="tabular-nums">{user.role === "seller" ? user.product_count : "—"}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="tabular-nums">{user.role === "seller" ? user.product_limit : "—"}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="tabular-nums">{user.role === "seller" ? user.remaining_product_slots : "—"}</span>
                  </TableCell>
                  <TableCell>
                    <ProductLimitControls user={user} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.created_at)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {paginatedUsers.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground/60">
              No se encontraron usuarios.
            </p>
          </div>
        ) : (
          paginatedUsers.map((user) => {
            const roleStyle = roleConfig[user.role] ?? roleConfig.user;

            return (
              <div
                key={user.id}
                className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {user.email ?? "—"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-medium ${roleStyle.className}`}
                      >
                        {roleStyle.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {user.catalog_count} catálogo{user.catalog_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-border/40 bg-muted/10 p-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Catálogos
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {user.role === "seller" ? user.catalog_count : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Cupo cat.
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {user.role === "seller" ? user.catalog_limit : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Libres cat.
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {user.role === "seller" ? user.remaining_catalog_slots : "—"}
                    </p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl border border-border/40 bg-muted/10 p-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Productos
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {user.role === "seller" ? user.product_count : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Cupo
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {user.role === "seller" ? user.product_limit : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Libres
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {user.role === "seller" ? user.remaining_product_slots : "—"}
                    </p>
                  </div>
                </div>
                {user.role === "seller" && (
                  <div className="mt-3 flex flex-col gap-2">
                    <CatalogLimitControls user={user} />
                    <ProductLimitControls user={user} />
                  </div>
                )}
                <p className="mt-2 text-xs text-muted-foreground/60">
                  {formatDate(user.created_at)}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Página {safeCurrentPage} de {totalPages}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                  aria-disabled={safeCurrentPage <= 1}
                  className={
                    safeCurrentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - safeCurrentPage) <= 1,
                )
                .reduce<(number | "ellipsis")[]>((acc, page, index, arr) => {
                  if (index > 0 && page - (arr[index - 1] as number) > 1) {
                    acc.push("ellipsis");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, index) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <span className="px-2 text-muted-foreground/50">…</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={item === safeCurrentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                  aria-disabled={safeCurrentPage >= totalPages}
                  className={
                    safeCurrentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
