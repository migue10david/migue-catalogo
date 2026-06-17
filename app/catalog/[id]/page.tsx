import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import {
  getActiveBusinessCatalogById,
  type BusinessCatalog,
} from "@/lib/business-catalogs";
import {
  getActiveProductsForCatalog,
  type BusinessCatalogProduct,
} from "@/lib/products";
import {
  ArrowLeft,
  Package2,
  Store,
  ArrowUpRight,
} from "lucide-react";

function CatalogHero({
  catalog,
  productCount,
}: {
  catalog: BusinessCatalog;
  productCount: number;
}) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        {catalog.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={catalog.cover_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.08),transparent_50%)] bg-muted/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.06),transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground animate-fade-in"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Volver al inicio
        </Link>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex flex-col gap-6 animate-fade-up">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-lg backdrop-blur-sm sm:size-20">
                {catalog.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={catalog.logo_url}
                    alt={`${catalog.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="size-8 text-muted-foreground/40 sm:size-10" />
                )}
              </div>
              <div>
                <Badge
                  variant="secondary"
                  className="mb-2 w-fit border-primary/20 bg-primary/5 text-primary"
                >
                  Catálogo público
                </Badge>
              </div>
            </div>

            <div>
              <h1 className="font-serif-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
                {catalog.name}
              </h1>
              {catalog.description && (
                <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
                  {catalog.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 animate-fade-up stagger-2">
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-background/80 px-6 py-4 shadow-sm backdrop-blur-sm">
              <span className="font-serif-display text-3xl tracking-tight">
                {productCount}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Productos
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-background/80 px-6 py-4 shadow-sm backdrop-blur-sm">
              <span className="font-serif-display text-3xl tracking-tight text-primary">
                ●
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Activo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: BusinessCatalogProduct;
  index: number;
}) {
  const isFeatured = index % 5 === 0;

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.04] ${
        isFeatured ? "sm:col-span-2 sm:row-span-2" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden border-b border-border/50 bg-muted/20 ${
          isFeatured ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08),transparent_60%)]">
            <Package2 className="size-10 text-muted-foreground/20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/80 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
          <ArrowUpRight className="size-4 text-foreground" />
        </div>
      </div>

      <div className={`flex flex-col gap-3 ${isFeatured ? "p-6 sm:p-8" : "p-5"}`}>
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`font-serif-display tracking-tight ${
              isFeatured ? "text-2xl sm:text-3xl" : "text-xl"
            }`}
          >
            {product.name}
          </h3>
          <span
            className={`shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-medium tabular-nums text-primary ${
              isFeatured ? "text-base" : "text-sm"
            }`}
          >
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {product.description && (
          <p
            className={`text-muted-foreground leading-relaxed ${
              isFeatured ? "text-sm sm:text-base" : "text-sm"
            } ${isFeatured ? "" : "line-clamp-2"}`}
          >
            {product.description}
          </p>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/10 px-6 py-24 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted/50">
        <Package2 className="size-8 text-muted-foreground/30" />
      </div>
      <h3 className="font-serif-display text-2xl tracking-tight">
        Sin productos aún
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Este catálogo no tiene productos públicos disponibles por el momento.
        Vuelve pronto para ver las novedades.
      </p>
    </div>
  );
}

async function CatalogContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalog = await getActiveBusinessCatalogById(id);

  if (!catalog) {
    notFound();
  }

  const products = await getActiveProductsForCatalog(catalog.id);

  return (
    <main className="min-h-screen">
      <CatalogHero catalog={catalog} productCount={products.length} />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="mb-10 flex items-center gap-3 animate-fade-up stagger-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted/50">
            <Package2 className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-serif-display text-2xl tracking-tight sm:text-3xl">
              Productos
            </h2>
            <p className="text-sm text-muted-foreground">
              {products.length} producto{products.length !== 1 ? "s" : ""}{" "}
              disponible{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`animate-fade-up stagger-${Math.min(index + 4, 8)}`}
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function CatalogSkeleton() {
  return (
    <main className="min-h-screen">
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-muted/20" />
        <div className="relative mx-auto max-w-6xl px-4 pt-8 pb-16 sm:pt-12 sm:pb-24">
          <div className="mb-10 h-5 w-36 rounded bg-muted" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-muted sm:size-20" />
                <div className="h-6 w-28 rounded bg-muted" />
              </div>
              <div>
                <div className="h-12 w-80 max-w-full rounded bg-muted sm:h-16" />
                <div className="mt-4 h-5 w-full max-w-2xl rounded bg-muted" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-24 w-28 rounded-2xl bg-muted" />
              <div className="h-24 w-28 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="mb-10 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-muted" />
          <div>
            <div className="h-7 w-32 rounded bg-muted" />
            <div className="mt-1 h-4 w-24 rounded bg-muted" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-3xl border bg-card">
              <div className="aspect-[4/3] bg-muted/20" />
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-6 w-32 rounded bg-muted" />
                  <div className="h-7 w-20 rounded-full bg-muted" />
                </div>
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function CatalogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent params={params} />
    </Suspense>
  );
}
