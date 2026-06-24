"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package2, ArrowUpRight } from "lucide-react";
import type { BusinessCatalogProduct } from "@/lib/products";

type ProductCategory = {
  id: string;
  name: string;
};

type CatalogProductGridProps = {
  products: BusinessCatalogProduct[];
};

function ProductCard({ product }: { product: BusinessCatalogProduct }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.04]">
      <div className="relative overflow-hidden border-b border-border/50 bg-muted/20 aspect-[4/3]">
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

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif-display text-xl tracking-tight">
            {product.name}
          </h3>
          <span className="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium tabular-nums text-primary">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {product.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
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
        Sin productos en esta categoría
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        No hay productos disponibles en esta categoría por el momento.
      </p>
    </div>
  );
}

export function CatalogProductGrid({ products }: CatalogProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const map = new Map<string, ProductCategory>();
    for (const product of products) {
      const cat = product.product_category;
      if (cat && !map.has(cat.id)) {
        map.set(cat.id, { id: cat.id, name: cat.name });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(
      (p) => p.product_category?.id === selectedCategory,
    );
  }, [products, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Sticky category filter bar */}
      <div className="sticky top-0 z-10 -mx-4 border-b border-border/40 bg-background/70 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-8">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex w-full items-center justify-start gap-2 overflow-x-auto bg-transparent py-1 pl-1 pr-1 scrollbar-hide">
            {/* Category tabs */}
            {categories.map((category) => {
              const count = products.filter(
                (p) => p.product_category?.id === category.id,
              ).length;

              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="group relative flex-none shrink-0 rounded-full border border-border/50 bg-muted/30 px-4 py-2 text-[13px] font-medium tracking-wide text-muted-foreground transition-all duration-300 hover:border-border hover:bg-muted/60 hover:text-foreground data-[state=active]:border-foreground/20 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-foreground/10"
                >
                  <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                    {category.name}
                    <span className="inline-flex h-5 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20 px-1.5 text-[10px] font-semibold tabular-nums data-[state=active]:bg-background/20 data-[state=active]:text-background">
                      {count}
                    </span>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid auto-rows-auto gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`animate-fade-up stagger-${Math.min(index + 1, 8)}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
