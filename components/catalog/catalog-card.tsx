import Link from "next/link";
import { MapPin, Package2, Store, ArrowRight } from "lucide-react";
import type { BusinessCatalog } from "@/lib/business-catalogs";
import { cn } from "@/lib/utils";

export function CatalogCard({
  catalog,
  badge,
  className,
}: {
  catalog: BusinessCatalog;
  badge?: string;
  className?: string;
}) {
  return (
    <Link
      href={`/catalog/${catalog.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/[0.06]" />
      <div className="relative h-44 border-b bg-muted/20">
        {catalog.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={catalog.cover_url}
            alt={catalog.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_55%)]">
            <Store className="size-10 text-foreground/30" />
          </div>
        )}
        {badge && (
          <div className="absolute left-4 top-4 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
            {badge}
          </div>
        )}
      </div>

      <div className="relative p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-2xl border bg-background">
            {catalog.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={catalog.logo_url}
                alt={`${catalog.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Store className="size-5 text-foreground/40" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{catalog.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Package2 className="size-3.5" />
              Catálogo público activo
            </div>
          </div>
        </div>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {catalog.description ||
            "Entra al catálogo para ver los productos publicados por este negocio."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {catalog.business_category?.name && (
            <div className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              {catalog.business_category.name}
            </div>
          )}
          {catalog.province?.name && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              {catalog.province.name}
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between text-sm font-medium">
          <span>Ver catálogo</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
