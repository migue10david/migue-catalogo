"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { DialogConfirmDelete } from "@/components/seller/dialog-confirm-delete";
import { DialogEditProductForm } from "@/components/seller/dialog-edit-product-form";
import { deleteBusinessCatalogProduct } from "@/app/actions/products";
import { Package, Search } from "lucide-react";
import type { BusinessCatalogProduct } from "@/lib/products";

type CatalogOption = {
  id: string;
  name: string;
  is_active: boolean;
};

type ProductCategoryOption = {
  id: string;
  business_catalog_id: string;
  name: string;
  is_active: boolean;
};

const ITEMS_PER_PAGE = 10;

type ProductsTableProps = {
  products: BusinessCatalogProduct[];
  catalogs: CatalogOption[];
  categories: ProductCategoryOption[];
};

export function ProductsTable({ products, catalogs, categories }: ProductsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const catalogsById = useMemo(
    () => new Map(catalogs.map((c) => [c.id, c.name])),
    [catalogs],
  );

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const query = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(query));
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 px-8 py-16 text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted/40">
          <Package className="size-8 text-muted-foreground/25" />
        </div>
        <p className="font-serif-display text-xl text-muted-foreground/70">
          Sin productos aún
        </p>
        <p className="mt-2 text-sm text-muted-foreground/50">
          Crea tu primer producto usando el botón &quot;Agregar producto&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filteredProducts.length === products.length
          ? `${products.length} producto${products.length !== 1 ? "s" : ""}`
          : `${filteredProducts.length} de ${products.length} producto${products.length !== 1 ? "s" : ""}`}
      </p>

      {/* Desktop table */}
      <div className="hidden rounded-xl border border-border/50 md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12" />
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Catálogo</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    No se encontraron productos con ese nombre.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell>
                    <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-muted/30">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <Package className="size-4 text-muted-foreground/40" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{product.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {product.product_category?.name ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {catalogsById.get(product.business_catalog_id) ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                      className={`text-[10px] ${
                        product.is_active
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : ""
                      }`}
                    >
                      {product.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                            <DialogEditProductForm
                              product={product}
                              catalogs={catalogs}
                              categories={categories}
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-accent-foreground"
                                >
                                  <span className="sr-only">Editar producto</span>
                                  <svg
                                    className="size-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                  </svg>
                                </Button>
                              }
                            />
                      <DialogConfirmDelete
                        title="Eliminar producto"
                        description={`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`}
                        formData={{ product_id: product.id }}
                        onConfirm={deleteBusinessCatalogProduct}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {paginatedProducts.length === 0 ? (
          <div className="rounded-xl border border-border/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No se encontraron productos.
            </p>
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-muted/30">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <Package className="size-5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-medium text-sm">
                      {product.name}
                    </h3>
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                      className={`shrink-0 text-[10px] ${
                        product.is_active
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : ""
                      }`}
                    >
                      {product.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {product.product_category?.name ?? "Sin categoría"} ·{" "}
                    {catalogsById.get(product.business_catalog_id) ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
                <span className="text-sm font-semibold">
                  ${Number(product.price).toFixed(2)}
                </span>
                <div className="flex items-center gap-1.5">
                  <DialogEditProductForm
                    product={product}
                    catalogs={catalogs}
                    categories={categories}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-3.5"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </Button>
                    }
                  />
                  <DialogConfirmDelete
                    title="Eliminar producto"
                    description={`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`}
                    formData={{ product_id: product.id }}
                    onConfirm={deleteBusinessCatalogProduct}
                    triggerClassName="size-7"
                  />
                </div>
              </div>
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
                  className={
                    safeCurrentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - safeCurrentPage) <= 1) return true;
                  return false;
                })
                .reduce<(number | "ellipsis")[]>((acc, page, i, arr) => {
                  if (i > 0) {
                    const prev = arr[i - 1];
                    if (page - prev > 1) acc.push("ellipsis");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <span className="flex size-9 items-center justify-center text-muted-foreground">
                        …
                      </span>
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
