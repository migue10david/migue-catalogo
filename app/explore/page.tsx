import { Suspense } from "react";
import { Search, Compass, Sparkles } from "lucide-react";
import {
  getPublicCatalogs,
  type BusinessCatalog,
} from "@/lib/business-catalogs";
import { getProvinces } from "@/lib/provinces";
import { getBusinessCategories } from "@/lib/business-categories";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { ExploreFilters } from "@/components/explore/explore-filters";
import { ExplorePagination } from "@/components/explore/explore-pagination";

const PAGE_SIZE = 12;

export const metadata = {
  title: "Explorar catálogos",
  description:
    "Explora catálogos de productos de vendedores cercanos. Filtra por provincia, categoría o busca por nombre.",
};

type ExplorePageProps = {
  searchParams: Promise<{
    search?: string;
    province?: string;
    category?: string;
    page?: string;
  }>;
};

async function ExploreContent({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const provinceId = params.province
    ? Number.parseInt(params.province, 10)
    : undefined;
  const businessCategoryId = params.category
    ? Number.parseInt(params.category, 10)
    : undefined;
  const page = params.page ? Math.max(1, Number.parseInt(params.page, 10)) : 1;

  const [catalogsResult, provinces, businessCategories] = await Promise.all([
    getPublicCatalogs({
      search,
      provinceId: provinceId && Number.isInteger(provinceId) ? provinceId : undefined,
      businessCategoryId:
        businessCategoryId && Number.isInteger(businessCategoryId)
          ? businessCategoryId
          : undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    getProvinces(),
    getBusinessCategories(),
  ]);

  const { catalogs, totalCount } = catalogsResult;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <main className="min-h-screen">
      {/* Hero section with layered gradients */}
      <section className="relative w-full overflow-hidden border-b">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.06),transparent_50%)]" />
          <div className="absolute inset-0 bg-muted/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(var(--primary)/0.05),transparent_40%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
              <Compass className="size-3.5" />
              Explorar
            </div>
            <h1 className="font-serif-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Explorar catálogos
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed sm:text-lg">
              Encuentra negocios y productos cerca de ti.
            </p>
          </div>

          <div className="mt-8 animate-fade-up stagger-2">
            <Suspense>
              <ExploreFilters
                provinces={provinces}
                businessCategories={businessCategories}
              />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Results section */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* Results count */}
        {totalCount > 0 && (
          <div className="mb-8 flex items-center gap-3 animate-fade-in">
            <div className="h-px flex-1 bg-border/40" />
            <p className="shrink-0 text-sm text-muted-foreground/60">
              {search ? (
                <>
                  <span className="font-medium text-foreground/80">{totalCount}</span>
                  {" "}resultado{totalCount !== 1 ? "s" : ""} para{" "}
                  <span className="font-medium text-foreground/80">&ldquo;{search}&rdquo;</span>
                </>
              ) : (
                <>
                  <span className="font-medium text-foreground/80">{totalCount}</span>
                  {" "}catálogo{totalCount !== 1 ? "s" : ""}
                </>
              )}
            </p>
            <div className="h-px flex-1 bg-border/40" />
          </div>
        )}

        {catalogs.length === 0 ? (
          /* Empty state */
          <div className="relative overflow-hidden rounded-3xl border border-dashed py-24 text-center animate-fade-up">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.04),transparent_60%)]" />
            <div className="relative flex flex-col items-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/40 ring-1 ring-border/40">
                <Search className="size-7 text-muted-foreground/30" />
              </div>
              <h2 className="mt-6 text-xl font-semibold">
                No se encontraron catálogos
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {search
                  ? `No hay catálogos que coincidan con "${search}". Intenta con otros términos o ajusta los filtros.`
                  : "No hay catálogos disponibles con los filtros seleccionados. Prueba a cambiar los criterios de búsqueda."}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/40">
                <Sparkles className="size-3.5" />
                <span>Intenta con otros términos</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Catalog grid with stagger */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {catalogs.map((catalog, index) => (
                <CatalogCard
                  key={catalog.id}
                  catalog={catalog}
                  className={`animate-fade-up stagger-${Math.min(index + 1, 8)}`}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 animate-fade-in stagger-4">
              <ExplorePagination
                currentPage={page}
                totalPages={totalPages}
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function ExploreSkeleton() {
  return (
    <main className="min-h-screen">
      {/* Hero skeleton */}
      <section className="relative w-full overflow-hidden border-b">
        <div className="absolute inset-0 bg-muted/10" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="mb-5 h-7 w-24 rounded-full bg-muted/60" />
            <div className="h-10 w-72 rounded bg-muted/60 sm:h-12" />
            <div className="mt-4 h-6 w-56 rounded bg-muted/40" />
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-14 w-full rounded-2xl bg-muted/40" />
            <div className="flex gap-3">
              <div className="h-11 flex-1 rounded-xl bg-muted/30" />
              <div className="h-11 flex-1 rounded-xl bg-muted/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/30" />
          <div className="h-4 w-32 rounded bg-muted/40" />
          <div className="h-px flex-1 bg-border/30" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border bg-card"
            >
              <div className="h-44 bg-muted/20" />
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-muted/40" />
                  <div className="flex-1">
                    <div className="h-5 w-32 rounded bg-muted/40" />
                    <div className="mt-1.5 h-3 w-24 rounded bg-muted/30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 w-full rounded bg-muted/30" />
                  <div className="h-3.5 w-3/4 rounded bg-muted/25" />
                </div>
                <div className="flex gap-2 pt-1">
                  <div className="h-6 w-16 rounded-full bg-muted/30" />
                  <div className="h-6 w-20 rounded-full bg-muted/25" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <ExploreContent searchParams={searchParams} />
    </Suspense>
  );
}
