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
} from "@/lib/products";
import { CatalogProductGrid } from "@/components/catalog/catalog-product-grid";
import {
  ArrowLeft,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Package2,
  Phone,
  Store,
} from "lucide-react";

function CatalogHero({
  catalog,
  productCount,
}: {
  catalog: BusinessCatalog;
  productCount: number;
}) {
  const links = [
    catalog.facebook_url
      ? { href: catalog.facebook_url, label: "Facebook", icon: Facebook }
      : null,
    catalog.instagram_url
      ? { href: catalog.instagram_url, label: "Instagram", icon: Instagram }
      : null,
    catalog.whatsapp_url
      ? { href: catalog.whatsapp_url, label: "WhatsApp", icon: MessageCircle }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: typeof Facebook;
  }>;

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

              <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground sm:text-base">
                <div className="flex flex-wrap items-center gap-4">
                  {catalog.business_category?.name && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 backdrop-blur-sm">
                      <span>{catalog.business_category.name}</span>
                    </div>
                  )}
                  {catalog.province?.name && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 backdrop-blur-sm">
                      <MapPin className="size-4" />
                      <span>{catalog.province.name}</span>
                    </div>
                  )}
                  {catalog.phone && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 backdrop-blur-sm">
                      <Phone className="size-4" />
                      <span>{catalog.phone}</span>
                    </div>
                  )}
                </div>

                {catalog.address && (
                  <p className="max-w-2xl text-muted-foreground">
                    {catalog.address}
                  </p>
                )}

                {links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {links.map((link) => {
                      const Icon = link.icon;

                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-3 py-2 text-sm text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
                        >
                          <Icon className="size-4" />
                          {link.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
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

        <CatalogProductGrid products={products} />
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
