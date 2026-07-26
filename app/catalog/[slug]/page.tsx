import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import {
  getActiveBusinessCatalogById,
  getActiveBusinessCatalogBySlug,
  type BusinessCatalog,
} from "@/lib/business-catalogs";
import {
  getActiveProductsForCatalog,
} from "@/lib/products";
import { getCurrentUserProfile } from "@/lib/auth";
import { CatalogProductGrid } from "@/components/catalog/catalog-product-grid";
import { CatalogHeroActions } from "@/components/catalog/catalog-hero-actions";
import {
  ArrowLeft,
  MapPin,
  Package2,
  Phone,
  Store,
} from "lucide-react";

function CatalogHero({
  catalog,
}: {
  catalog: BusinessCatalog;
}) {
  const links = [
    catalog.facebook_url
      ? { href: catalog.facebook_url, label: "Facebook" }
      : null,
    catalog.instagram_url
      ? { href: catalog.instagram_url, label: "Instagram" }
      : null,
    catalog.whatsapp_url
      ? { href: catalog.whatsapp_url, label: "WhatsApp" }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
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
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
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
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-background/90 shadow-lg ring-1 ring-border/20">
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

              <div className="mt-6 flex flex-col gap-2.5 text-sm sm:text-base">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  {catalog.business_category?.name && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {catalog.business_category.name}
                    </span>
                  )}
                  {catalog.province?.name && (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="size-4" />
                      {catalog.province.name}
                    </span>
                  )}
                  {catalog.phone && (
                    <a
                      href={`tel:${catalog.phone}`}
                      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Phone className="size-4" />
                      {catalog.phone}
                    </a>
                  )}
                </div>

                {catalog.address && (
                  <p className="max-w-2xl text-muted-foreground/80">
                    {catalog.address}
                  </p>
                )}

                <div className="pt-1.5">
                  <CatalogHeroActions
                    slug={catalog.slug}
                    name={catalog.name}
                    links={links}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function CatalogContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = await getActiveBusinessCatalogBySlug(slug);

  if (!catalog && isUuidLike(slug)) {
    const legacyCatalog = await getActiveBusinessCatalogById(slug);

    if (legacyCatalog) {
      redirect(`/catalog/${legacyCatalog.slug}`);
    }
  }

  if (!catalog) {
    notFound();
  }

  const products = await getActiveProductsForCatalog(catalog.id);
  const user = await getCurrentUserProfile();

  return (
    <main className="min-h-screen">
      <CatalogHero catalog={catalog} />

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

        <CatalogProductGrid
          products={products}
          catalog={catalog}
          user={user}
        />
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
              <div className="size-20 rounded-2xl bg-muted sm:size-24" />
              <div>
                <div className="h-12 w-80 max-w-full rounded bg-muted sm:h-16" />
                <div className="mt-4 h-5 w-full max-w-2xl rounded bg-muted" />
              </div>
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
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent params={params} />
    </Suspense>
  );
}
