"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleBusinessCatalogStatus } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof LayoutGrid;
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

function StatusToggleButton({ catalogId, isActive }: { catalogId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await toggleBusinessCatalogStatus(formData);
        toast.success(isActive ? "Catálogo desactivado" : "Catálogo activado");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al cambiar estado");
      }
    });
  };

  if (isActive) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="outline">Desactivar</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desactivar catálogo</AlertDialogTitle>
            <AlertDialogDescription>
              Este catálogo dejará de ser visible para los compradores. ¿Estás seguro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <form action={handleSubmit}>
              <input type="hidden" name="catalogId" value={catalogId} />
              <input type="hidden" name="nextState" value="false" />
              <AlertDialogAction asChild>
                <Button type="submit" variant="destructive" disabled={isPending}>
                  {isPending ? "Desactivando..." : "Desactivar"}
                </Button>
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="catalogId" value={catalogId} />
      <input type="hidden" name="nextState" value="true" />
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "Activando..." : "Activar"}
      </Button>
    </form>
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
      <div className="rounded-xl border border-dashed bg-card px-8 py-16 text-center">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg border bg-muted/40">
          <LayoutGrid className="size-5 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">
          Sin catálogos aún
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Aún no hay catálogos creados en la plataforma.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total catálogos"
          value={catalogs.length}
          description="Creados en la plataforma"
          icon={LayoutGrid}
        />
        <MetricCard
          label="Activos"
          value={activeCatalogs}
          description="Visibles públicamente"
          icon={CheckCircle2}
        />
        <MetricCard
          label="Inactivos"
          value={inactiveCatalogs}
          description="Ocultos para compradores"
          icon={XCircle}
        />
      </section>

      <section className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Directorio de catálogos</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {filteredCatalogs.length} de {catalogs.length} catálogos
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o dueño..."
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
              <TableHead className="w-[25%] px-4 text-xs text-muted-foreground">
                Catálogo
              </TableHead>
              <TableHead className="w-[24%] text-xs text-muted-foreground">
                Dueño
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Clasificación
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Estado
              </TableHead>
              <TableHead className="text-center text-xs text-muted-foreground">
                Productos
              </TableHead>
              <TableHead className="text-right text-xs text-muted-foreground">
                Acción
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCatalogs.map((catalog) => (
              <TableRow
                key={catalog.id}
                className="hover:bg-muted/25"
              >
                <TableCell className="px-4 py-4">
                  <p className="font-medium">{catalog.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Creado {formatDate(catalog.created_at)}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {catalog.owner_email ?? "—"}
                </TableCell>
                <TableCell>
                  <p className="text-sm">{catalog.business_category ?? "Sin categoría"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {catalog.province ?? "Sin provincia"}
                  </p>
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
                <TableCell className="text-right">
                  <StatusToggleButton catalogId={catalog.id} isActive={catalog.is_active} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 p-4 md:hidden">
        {paginatedCatalogs.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No se encontraron catálogos.
            </p>
          </div>
        ) : (
          paginatedCatalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="rounded-lg border bg-background p-4"
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
                <StatusToggleButton catalogId={catalog.id} isActive={catalog.is_active} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground/60">
                {formatDate(catalog.created_at)}
              </p>
            </div>
          ))
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
