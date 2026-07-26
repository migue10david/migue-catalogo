"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  increaseUserCatalogLimit,
  increaseUserProductLimit,
} from "@/app/actions/admin";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Users;
}) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="p-5">
        <div className="flex items-center justify-between gap-4">
          <CardDescription className="font-medium text-foreground">
            {label}
          </CardDescription>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <CardTitle className="pt-2 text-3xl tabular-nums">{value}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
    </Card>
  );
}

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

function ProductLimitControls({ user }: { user: AdminUserProfile }) {
  const [isPending, startTransition] = useTransition();

  if (user.role !== "seller") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await increaseUserProductLimit(formData);
        toast.success("Límite de productos actualizado");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al actualizar límite");
      }
    });
  };

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={user.id} />
      <Input
        name="incrementBy"
        type="number"
        min="1"
        step="1"
        defaultValue="1"
        className="h-8 w-16 text-center"
      />
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "Sumando..." : "Sumar"}
      </Button>
    </form>
  );
}

function CatalogLimitControls({ user }: { user: AdminUserProfile }) {
  const [isPending, startTransition] = useTransition();

  if (user.role !== "seller") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await increaseUserCatalogLimit(formData);
        toast.success("Límite de catálogos actualizado");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al actualizar límite");
      }
    });
  };

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={user.id} />
      <Input
        name="incrementBy"
        type="number"
        min="1"
        step="1"
        defaultValue="1"
        className="h-8 w-16 text-center"
      />
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "Sumando..." : "Sumar"}
      </Button>
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
      <div className="rounded-xl border border-dashed bg-card px-8 py-16 text-center">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg border bg-muted/40">
          <Users className="size-5 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">
          Sin usuarios registrados
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Aún no hay usuarios en la plataforma.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total usuarios"
          value={users.length}
          description="Registrados en la plataforma"
          icon={Users}
        />
        <MetricCard
          label="Vendedores"
          value={totalSellers}
          description="Con límites administrables"
          icon={Store}
        />
        <MetricCard
          label="Administradores"
          value={totalAdmins}
          description="Con acceso completo"
          icon={ShieldCheck}
        />
      </section>

      <section className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Directorio de usuarios</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {filteredUsers.length} de {users.length} usuarios
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por email..."
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="h-9 bg-background pl-9 shadow-none"
            />
          </div>
        </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/35 hover:bg-muted/35">
              <TableHead className="w-[32%] px-4 text-xs text-muted-foreground">
                Usuario
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Rol
              </TableHead>
              <TableHead className="min-w-[240px] text-xs text-muted-foreground">
                Catálogos
              </TableHead>
              <TableHead className="min-w-[240px] text-xs text-muted-foreground">
                Productos
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => {
              const roleStyle = roleConfig[user.role] ?? roleConfig.user;

              return (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/25"
                >
                  <TableCell className="px-4 py-4">
                    <p className="max-w-[260px] truncate font-medium">
                      {user.email ?? "—"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Registrado {formatDate(user.created_at)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-medium ${roleStyle.className}`}
                    >
                      {roleStyle.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {user.role === "seller" ? (
                      <div className="space-y-2">
                        <div className="flex gap-4 text-xs">
                          <span><b className="font-semibold">{user.catalog_count}</b> usados</span>
                          <span><b className="font-semibold">{user.catalog_limit}</b> límite</span>
                          <span className="text-muted-foreground">{user.remaining_catalog_slots} libres</span>
                        </div>
                        <CatalogLimitControls user={user} />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    {user.role === "seller" ? (
                      <div className="space-y-2">
                        <div className="flex gap-4 text-xs">
                          <span><b className="font-semibold">{user.product_count}</b> usados</span>
                          <span><b className="font-semibold">{user.product_limit}</b> límite</span>
                          <span className="text-muted-foreground">{user.remaining_product_slots} libres</span>
                        </div>
                        <ProductLimitControls user={user} />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 p-4 md:hidden">
        {paginatedUsers.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No se encontraron usuarios.
            </p>
          </div>
        ) : (
          paginatedUsers.map((user) => {
            const roleStyle = roleConfig[user.role] ?? roleConfig.user;

            return (
              <div
                key={user.id}
                className="rounded-lg border bg-background p-4"
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
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-md bg-muted/40 p-3">
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
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-md bg-muted/40 p-3">
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

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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
      </section>
    </div>
  );
}
