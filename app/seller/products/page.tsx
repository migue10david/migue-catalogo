import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { getBusinessCatalogsForOwner } from "@/lib/business-catalogs";
import { BusinessProductCategoryForm } from "@/components/seller/business-product-category-form";
import { BusinessProductForm } from "@/components/seller/business-product-form";
import { getProductCategoriesForCatalogs } from "@/lib/product-categories";
import { getProductsForCatalogs } from "@/lib/products";
import {
  FolderTree,
  Package,
  Tag,
  WalletCards,
  Plus,
  Sparkles,
  Boxes,
} from "lucide-react";

async function ProductsContent() {
  const profile = await requireRole(["admin", "seller"]);
  const catalogs =
    profile.role === "seller"
      ? await getBusinessCatalogsForOwner(profile.id)
      : [];
  const products =
    profile.role === "seller"
      ? await getProductsForCatalogs(catalogs.map((catalog) => catalog.id))
      : [];
  const productCategories =
    profile.role === "seller"
      ? await getProductCategoriesForCatalogs(catalogs.map((catalog) => catalog.id))
      : [];
  const catalogsById = new Map(
    catalogs.map((catalog) => [catalog.id, catalog]),
  );
  const categoriesByCatalogId = new Map(
    catalogs.map((catalog) => [
      catalog.id,
      productCategories.filter(
        (category) => category.business_catalog_id === catalog.id,
      ),
    ]),
  );
  const activeProducts = products.filter(
    (product) => product.is_active,
  ).length;

  if (profile.role !== "seller") {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Espacio de productos</CardTitle>
          <CardDescription>
            Los administradores pueden inspeccionar módulos de vendedores, pero
            la creación de productos pertenece a cuentas de vendedor.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Section */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CardHeader className="relative pb-2 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-widest">
                Total productos
              </CardDescription>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <Package className="size-4 text-primary" />
              </div>
            </div>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {products.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Productos distribuidos en todos tus catálogos.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CardHeader className="relative pb-2 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-widest">
                Productos activos
              </CardDescription>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {activeProducts}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Inventario público visible para compradores.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <CardHeader className="relative pb-2 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-widest">
                Catálogos
              </CardDescription>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Boxes className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {catalogs.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Negocios disponibles para asignar productos.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <FolderTree className="size-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Categorías</CardTitle>
                  <CardDescription className="text-xs">
                    Crea secciones por catálogo antes de agregar productos.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {catalogs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Primero crea un catálogo para poder organizar sus categorías.
                  </p>
                </div>
              ) : (
                <>
                  <BusinessProductCategoryForm
                    catalogs={catalogs.map((catalog) => ({
                      id: catalog.id,
                      name: catalog.name,
                      is_active: catalog.is_active,
                    }))}
                  />

                  <div className="space-y-3">
                    {catalogs.map((catalog) => {
                      const catalogCategories =
                        categoriesByCatalogId.get(catalog.id) ?? [];

                      return (
                        <div
                          key={catalog.id}
                          className="rounded-2xl border border-border/50 bg-muted/10 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium">{catalog.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {catalogCategories.length} categor
                                {catalogCategories.length === 1 ? "ía" : "ías"}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {catalog.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {catalogCategories.length === 0 ? (
                              <span className="text-xs text-muted-foreground">
                                Sin categorías aún
                              </span>
                            ) : (
                              catalogCategories.map((category) => (
                                <Badge key={category.id} variant="secondary">
                                  {category.name}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Create Form */}
          <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Agregar producto</CardTitle>
                <CardDescription className="text-xs">
                  Crea productos asígnalos a uno de tus catálogos.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {catalogs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-10 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-muted/50">
                  <Package className="size-6 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Primero crea un catálogo. Los productos siempre pertenecen a
                  un catálogo específico.
                </p>
              </div>
            ) : (
              <BusinessProductForm
                catalogs={catalogs.map((catalog) => ({
                  id: catalog.id,
                  name: catalog.name,
                  is_active: catalog.is_active,
                }))}
                categories={productCategories.map((category) => ({
                  id: category.id,
                  business_catalog_id: category.business_catalog_id,
                  name: category.name,
                  is_active: category.is_active,
                }))}
              />
            )}
          </CardContent>
          </Card>
        </div>

        {/* Product List */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted/50">
                <Package className="size-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">
                  Productos recientes
                </CardTitle>
                <CardDescription className="text-xs">
                  Los últimos artículos creados en tu espacio de vendedor.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-10 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-muted/50">
                  <Package className="size-6 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Aún no has agregado ningún producto.
                </p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-background/50 p-4 transition-all duration-200 hover:border-border hover:bg-muted/20 hover:shadow-sm sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/30">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image_url}
                              alt=""
                              className="size-full rounded-lg object-cover"
                            />
                          ) : (
                            <Package className="size-4 text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold tracking-tight">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Catálogo:{" "}
                            {catalogsById.get(product.business_catalog_id)
                              ?.name ?? "Desconocido"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Categoría:{" "}
                            {product.product_category?.name ?? "Sin categoría"}
                          </p>
                        </div>
                      </div>
                      {product.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                      className={`w-fit shrink-0 ${
                        product.is_active
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : ""
                      }`}
                    >
                      {product.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-border/40 bg-muted/10 p-3">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                        <WalletCards className="size-3" />
                        Precio
                      </div>
                      <p className="text-sm font-semibold">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/40 bg-muted/10 p-3">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                        <Tag className="size-3" />
                        Imagen
                      </div>
                      {product.image_url ? (
                        <a
                          href={product.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary underline-offset-4 hover:underline"
                        >
                          Ver imagen
                        </a>
                      ) : (
                        <p className="text-xs text-muted-foreground/60">
                          Sin imagen
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 rounded-xl border bg-card" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="h-[32rem] rounded-xl border bg-card" />
        <div className="h-[32rem] rounded-xl border bg-card" />
      </div>
    </div>
  );
}

export default function SellerProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
