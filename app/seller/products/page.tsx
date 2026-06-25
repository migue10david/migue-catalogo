import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { getBusinessCatalogsForOwner } from "@/lib/business-catalogs";
import { DialogProductForm } from "@/components/seller/dialog-product-form";
import { getProductCategoriesForCatalogs } from "@/lib/product-categories";
import { getProductsForCatalogs } from "@/lib/products";
import { ProductsTable } from "@/components/seller/products-table";
import {
  Package,
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
  const activeProducts = products.filter(
    (product) => product.is_active,
  ).length;
  const usedProducts = products.length;
  const productLimit = profile.product_limit;
  const remainingProductSlots = Math.max(productLimit - usedProducts, 0);

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
    <div className="flex flex-col gap-8">
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

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2 p-5 sm:p-6">
            <CardDescription className="text-xs uppercase tracking-widest">
              Cupo total
            </CardDescription>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {productLimit}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Máximo de productos permitidos por el administrador.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2 p-5 sm:p-6">
            <CardDescription className="text-xs uppercase tracking-widest">
              Usados
            </CardDescription>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {usedProducts}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Productos que ya ocupan espacio en tu cupo.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2 p-5 sm:p-6">
            <CardDescription className="text-xs uppercase tracking-widest">
              Disponibles
            </CardDescription>
            <CardTitle className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              {remainingProductSlots}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs text-muted-foreground">
              Espacios libres para crear nuevos productos.
            </p>
          </CardContent>
        </Card>
      </section>

      {remainingProductSlots <= 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Has alcanzado tu límite de productos. Contacta al administrador para
          ampliar tu cupo antes de crear nuevos artículos.
        </div>
      )}

      {/* Products Table */}
      <section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              Productos
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {products.length} producto{products.length !== 1 ? "s" : ""} en
              total · {activeProducts} activo{activeProducts !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="shrink-0">
            {catalogs.length > 0 ? (
              <DialogProductForm
                catalogs={catalogs.map((c) => ({
                  id: c.id,
                  name: c.name,
                  is_active: c.is_active,
                }))}
                categories={productCategories.map((c) => ({
                  id: c.id,
                  business_catalog_id: c.business_catalog_id,
                  name: c.name,
                  is_active: c.is_active,
                }))}
                productLimit={productLimit}
                usedProducts={usedProducts}
                remainingProductSlots={remainingProductSlots}
              />
            ) : null}
          </div>
        </div>

        <ProductsTable
          products={products}
          catalogs={catalogs.map((c) => ({ id: c.id, name: c.name, is_active: c.is_active }))}
          categories={productCategories.map((c) => ({
            id: c.id,
            business_catalog_id: c.business_catalog_id,
            name: c.name,
            is_active: c.is_active,
          }))}
        />
      </section>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 rounded-xl border bg-card" />
        ))}
      </div>
      <div>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="h-10 w-44 rounded-xl bg-muted/50" />
            <div className="mt-2 h-4 w-56 rounded-lg bg-muted/30" />
          </div>
          <div className="h-10 w-40 rounded-xl bg-muted/50" />
        </div>
        <div className="h-10 w-full rounded-lg bg-muted/20" />
        <div className="mt-4 h-[28rem] rounded-xl border bg-card" />
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
