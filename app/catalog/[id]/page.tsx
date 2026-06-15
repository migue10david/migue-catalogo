import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getActiveBusinessCatalogById,
} from "@/lib/business-catalogs";
import { getActiveProductsForCatalog } from "@/lib/products";
import { ArrowLeft, Package2, Store } from "lucide-react";

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
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
          <Button asChild variant="ghost" className="w-fit px-0">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <Badge variant="secondary" className="w-fit">
                Public catalog
              </Badge>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl border bg-card">
                  <Store className="size-6" />
                </div>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {catalog.name}
                </h1>
              </div>
              <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
                {catalog.description || "Explore the latest products in this catalog."}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Catalog snapshot</CardTitle>
                <CardDescription>
                  Quick public overview of this seller catalog.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span>Products available</span>
                  <span className="font-semibold text-foreground">
                    {products.length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span>Status</span>
                  <Badge>Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Package2 className="size-5 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Products</h2>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              This catalog does not have public active products yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-[4/3] border-b bg-muted/20">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <span className="rounded-full border px-3 py-1 text-sm font-semibold">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <CardDescription>
                    {product.description || "No description available."}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function CatalogSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
          <div className="h-9 w-32 rounded bg-muted" />
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <div className="h-6 w-28 rounded bg-muted" />
              <div className="h-14 w-80 max-w-full rounded bg-muted" />
              <div className="h-5 w-full max-w-3xl rounded bg-muted" />
              <div className="h-5 w-3/4 max-w-2xl rounded bg-muted" />
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="h-7 w-40 rounded bg-muted" />
              <div className="mt-4 h-4 w-56 rounded bg-muted" />
              <div className="mt-6 h-12 w-full rounded bg-muted" />
              <div className="mt-3 h-12 w-full rounded bg-muted" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 h-8 w-40 rounded bg-muted" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="h-80 rounded-xl border bg-card" />
          <div className="h-80 rounded-xl border bg-card" />
          <div className="h-80 rounded-xl border bg-card" />
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
