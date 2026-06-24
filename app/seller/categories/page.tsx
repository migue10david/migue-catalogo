import { Suspense } from "react";

import { requireRole } from "@/lib/auth";
import { getBusinessCatalogsForOwner } from "@/lib/business-catalogs";
import {
  getProductCategoriesForCatalogs,
  type BusinessCatalogProductCategory,
} from "@/lib/product-categories";
import { getProductsForCatalogs } from "@/lib/products";
import { DialogCategoryForm } from "@/components/seller/dialog-category-form";
import { DialogConfirmDelete } from "@/components/seller/dialog-confirm-delete";
import { deleteBusinessCatalogProductCategory } from "@/app/actions/products";
import { FolderTree, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";

async function CategoriesContent() {
  const profile = await requireRole(["admin", "seller"]);
  const catalogs =
    profile.role === "seller"
      ? await getBusinessCatalogsForOwner(profile.id)
      : [];

  const catalogIds = catalogs.map((c) => c.id);

  const [productCategories, products] =
    profile.role === "seller"
      ? await Promise.all([
          getProductCategoriesForCatalogs(catalogIds),
          getProductsForCatalogs(catalogIds),
        ])
      : [[], []];

  const productsByCategoryId = new Map<string, number>();
  for (const product of products) {
    const catId = product.product_category_id;
    if (catId) {
      productsByCategoryId.set(catId, (productsByCategoryId.get(catId) ?? 0) + 1);
    }
  }

  const categoriesByCatalogId = new Map<string, BusinessCatalogProductCategory[]>();
  for (const catalog of catalogs) {
    categoriesByCatalogId.set(
      catalog.id,
      productCategories.filter((c) => c.business_catalog_id === catalog.id),
    );
  }

  const totalCategories = productCategories.length;
  const catalogsCount = catalogs.length;

  if (profile.role !== "seller") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/50">
            <FolderTree className="size-7 text-muted-foreground/40" />
          </div>
          <h3 className="font-serif-display text-xl">Gestión de categorías</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Los administradores pueden inspeccionar módulos de vendedores, pero
            la gestión de categorías pertenece a cuentas de vendedor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-serif-display text-3xl tracking-tight sm:text-4xl">
            Categorías
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {totalCategories} categoría{totalCategories !== 1 ? "s" : ""} en{" "}
            {catalogsCount} catálogo{catalogsCount !== 1 ? "s" : ""}.
          </p>
        </div>
        <div className="shrink-0">
          <DialogCategoryForm
            catalogs={catalogs.map((c) => ({
              id: c.id,
              name: c.name,
              is_active: c.is_active,
            }))}
            triggerLabel="Crear categoría"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {catalogs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 px-8 py-16 text-center">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted/40">
              <Store className="size-8 text-muted-foreground/25" />
            </div>
            <p className="font-serif-display text-xl text-muted-foreground/70">
              Sin catálogos
            </p>
            <p className="mt-2 text-sm text-muted-foreground/50">
              Crea un catálogo primero para poder organizar sus productos en
              categorías.
            </p>
          </div>
        ) : (
          catalogs.map((catalog) => {
            const catalogCategories = categoriesByCatalogId.get(catalog.id) ?? [];

            return (
              <div
                key={catalog.id}
                className="overflow-hidden rounded-2xl border border-border/50 bg-card"
              >
                {/* Catalog header */}
                <div className="flex items-center justify-between border-b border-border/30 bg-muted/20 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Store className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">
                        {catalog.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {catalogCategories.length} categoría
                        {catalogCategories.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={catalog.is_active ? "default" : "secondary"}
                    className={`text-[10px] ${
                      catalog.is_active
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : ""
                    }`}
                  >
                    {catalog.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                {/* Categories table */}
                {catalogCategories.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-muted-foreground/60">
                      Sin categorías aún. Crea una para organizar los productos
                      de este catálogo.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/30 text-left text-[11px] uppercase tracking-widest text-muted-foreground/60">
                          <th className="px-5 py-2.5 font-medium">Nombre</th>
                          <th className="px-5 py-2.5 font-medium">Slug</th>
                          <th className="px-5 py-2.5 font-medium">Estado</th>
                          <th className="px-5 py-2.5 font-medium">Productos</th>
                          <th className="px-5 py-2.5 font-medium">Creado</th>
                          <th className="px-5 py-2.5 text-right font-medium">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {catalogCategories.map((category) => {
                          const productCount =
                            productsByCategoryId.get(category.id) ?? 0;

                          return (
                            <tr
                              key={category.id}
                              className="border-b border-border/20 last:border-0 transition-colors hover:bg-muted/20"
                            >
                              <td className="px-5 py-3">
                                <span className="font-medium">{category.name}</span>
                              </td>
                              <td className="px-5 py-3">
                                <code className="rounded bg-muted/50 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                                  {category.slug}
                                </code>
                              </td>
                              <td className="px-5 py-3">
                                <Badge
                                  variant={
                                    category.is_active ? "default" : "secondary"
                                  }
                                  className={`text-[10px] ${
                                    category.is_active
                                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                      : ""
                                  }`}
                                >
                                  {category.is_active ? "Activo" : "Inactivo"}
                                </Badge>
                              </td>
                              <td className="px-5 py-3">
                                <span className="text-muted-foreground">
                                  {productCount}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-xs text-muted-foreground/60">
                                {new Date(
                                  category.created_at,
                                ).toLocaleDateString("es-ES", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center justify-end gap-1">
                                  <DialogCategoryForm
                                    mode="edit"
                                    category={category}
                                    catalogs={catalogs.map((c) => ({
                                      id: c.id,
                                      name: c.name,
                                      is_active: c.is_active,
                                    }))}
                                  />
                                  <DialogConfirmDelete
                                    title={
                                      productCount > 0
                                        ? "No se puede eliminar"
                                        : "Eliminar categoría"
                                    }
                                    description={`¿Estás seguro de que deseas eliminar la categoría "${category.name}" del catálogo "${catalog.name}"? Esta acción no se puede deshacer.`}
                                    warningMessage={
                                      productCount > 0
                                        ? `No se puede eliminar "${category.name}" porque tiene ${productCount} producto${productCount !== 1 ? "s" : ""} asignado${productCount !== 1 ? "s" : ""}. Reasigna o elimina los productos primero.`
                                        : undefined
                                    }
                                    formData={{
                                      product_category_id: category.id,
                                      business_catalog_id: catalog.id,
                                    }}
                                    onConfirm={
                                      deleteBusinessCatalogProductCategory
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="h-10 w-44 rounded-xl bg-muted/50" />
          <div className="mt-2 h-4 w-56 rounded-lg bg-muted/30" />
        </div>
        <div className="h-10 w-40 rounded-xl bg-muted/50" />
      </div>

      <div className="flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border/50 bg-card"
          >
            <div className="flex items-center justify-between border-b border-border/30 bg-muted/20 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="size-8 animate-pulse rounded-lg bg-muted/30" />
                <div>
                  <div className="h-4 w-32 rounded bg-muted/40" />
                  <div className="mt-1 h-3 w-20 rounded bg-muted/20" />
                </div>
              </div>
              <div className="h-5 w-14 rounded-full bg-muted/20" />
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-4">
                    <div className="h-4 w-28 rounded bg-muted/30" />
                    <div className="h-4 w-20 rounded bg-muted/20" />
                    <div className="h-5 w-12 rounded-full bg-muted/20" />
                    <div className="h-4 w-8 rounded bg-muted/20" />
                    <div className="ml-auto h-4 w-20 rounded bg-muted/20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SellerCategoriesPage() {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <CategoriesContent />
    </Suspense>
  );
}
