"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { toggleBusinessCatalogStatus } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, LayoutGrid, CheckCircle2, XCircle } from "lucide-react";
import type { AdminBusinessCatalog } from "@/lib/admin";

const ITEMS_PER_PAGE = 10;

type CatalogsTableProps = {
  catalogs: AdminBusinessCatalog[];
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusToggleButton({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" variant="outline" disabled={pending}>
      {pending ? "Guardando..." : isActive ? "Desactivar" : "Activar"}
    </Button>
  );
}

export function CatalogsTable({ catalogs }: CatalogsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const activeCatalogs = useMemo(
    () => catalogs.filter((c) => c.is_active).length,
    [catalogs],
  );

  const inactiveCatalogs = useMemo(
    () => catalogs.filter((c) => !c.is_active).length,
    [catalogs],
  );

  const filteredCatalogs = useMemo(() => {
    if (!search.trim()) return catalogs;
    const query = search.toLowerCase();
    return catalogs.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.owner_email?.toLowerCase().includes(query) ?? false),
    );
  }, [catalogs, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCatalogs.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCatalogs = filteredCatalogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (catalogs.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 px-8 py-16 text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted/40">
          <LayoutGrid className="size-8 text-muted-foreground/25" />
        </div>
        <p className="font-serif-display text-xl text-muted-foreground/70">
          Sin catálogos aún
        </p>
        <p className="mt-2 text-sm text-muted-foreground/50">
          Aún no hay catálogos creados en la plataforma.
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
                Total catálogos
              </CardDescription>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <LayoutGrid className="size-4 text-primary" />
              </div>
            </div>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {catalogs.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Catálogos creados en la plataforma.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CardHeader className="relative pb-2 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-widest">
                Activos
              </CardDescription>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {activeCatalogs}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Visibles públicamente.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CardHeader className="relative pb-2 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-widest">
                Inactivos
              </CardDescription>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
                <XCircle className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {inactiveCatalogs}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              No visibles para compradores.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
        <Input
          placeholder="Buscar por nombre o dueño..."
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
                Nombre
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Dueño
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Categoría
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Provincia
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Estado
              </TableHead>
              <TableHead className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                Productos
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Acción
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                Creado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCatalogs.map((catalog) => (
              <TableRow
                key={catalog.id}
                className="border-border/30 transition-colors hover:bg-muted/20"
              >
                <TableCell className="font-medium">
                  {catalog.name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {catalog.owner_email ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {catalog.business_category ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {catalog.province ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-medium ${
                      catalog.is_active
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-border/60 bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {catalog.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="tabular-nums">{catalog.product_count}</span>
                </TableCell>
                <TableCell>
                  <form action={toggleBusinessCatalogStatus}>
                    <input type="hidden" name="catalogId" value={catalog.id} />
                    <input
                      type="hidden"
                      name="nextState"
                      value={String(!catalog.is_active)}
                    />
                    <StatusToggleButton isActive={catalog.is_active} />
                  </form>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(catalog.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {paginatedCatalogs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground/60">
              No se encontraron catálogos.
            </p>
          </div>
        ) : (
          paginatedCatalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {catalog.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {catalog.owner_email ?? "—"}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={`shrink-0 text-[10px] font-medium ${
                    catalog.is_active
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-border/60 bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {catalog.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {catalog.business_category && (
                  <span>{catalog.business_category}</span>
                )}
                {catalog.province && (
                  <span>{catalog.province}</span>
                )}
                <span>
                  {catalog.product_count} producto{catalog.product_count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-3">
                <form action={toggleBusinessCatalogStatus}>
                  <input type="hidden" name="catalogId" value={catalog.id} />
                  <input
                    type="hidden"
                    name="nextState"
                    value={String(!catalog.is_active)}
                  />
                  <StatusToggleButton isActive={catalog.is_active} />
                </form>
              </div>
              <p className="mt-2 text-xs text-muted-foreground/60">
                {formatDate(catalog.created_at)}
              </p>
            </div>
          ))
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
