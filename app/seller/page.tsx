import Link from "next/link";
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
import { requireRole } from "@/lib/auth";
import { getBusinessCatalogsForOwner } from "@/lib/business-catalogs";
import { BusinessCatalogForm } from "@/components/seller/business-catalog-form";
import { BusinessProductForm } from "@/components/seller/business-product-form";
import { getProductsForCatalogs } from "@/lib/products";

async function SellerContent() {
  const profile = await requireRole(["admin", "seller"]);
  const catalogs =
    profile.role === "seller"
      ? await getBusinessCatalogsForOwner(profile.id)
      : [];
  const products =
    profile.role === "seller"
      ? await getProductsForCatalogs(catalogs.map((catalog) => catalog.id))
      : [];
  const catalogsById = new Map(catalogs.map((catalog) => [catalog.id, catalog]));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Seller access granted</p>
          <Badge className="uppercase">{profile.role}</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Seller dashboard
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          This route is protected on the server and is available to `seller`
          and `admin` users.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/protected">Back to protected area</Link>
          </Button>
          {profile.role === "admin" && (
            <Button asChild variant="outline">
              <Link href="/admin">Open admin panel</Link>
            </Button>
          )}
        </div>
      </div>

      {profile.role === "seller" ? (
        <>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Create business catalog</CardTitle>
                <CardDescription>
                  Add one business for each store, brand, or commercial venture
                  you manage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessCatalogForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your business catalogs</CardTitle>
                <CardDescription>
                  Current businesses linked to your seller account.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {catalogs.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    You have not created any business catalogs yet.
                  </div>
                ) : (
                  catalogs.map((catalog) => (
                    <div key={catalog.id} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{catalog.name}</h3>
                        <Badge
                          variant={catalog.is_active ? "default" : "secondary"}
                        >
                          {catalog.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {catalog.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {catalog.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
                        <span>
                          Logo:{" "}
                          {catalog.logo_url ? (
                            <a
                              href={catalog.logo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline underline-offset-4"
                            >
                              Open uploaded logo
                            </a>
                          ) : (
                            "Not set"
                          )}
                        </span>
                        <span>
                          Cover:{" "}
                          {catalog.cover_url ? (
                            <a
                              href={catalog.cover_url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline underline-offset-4"
                            >
                              Open uploaded cover
                            </a>
                          ) : (
                            "Not set"
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Add product</CardTitle>
                <CardDescription>
                  Create products inside one of your business catalogs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {catalogs.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    Create a business catalog first so you can assign products
                    to it.
                  </div>
                ) : (
                  <BusinessProductForm
                    catalogs={catalogs.map((catalog) => ({
                      id: catalog.id,
                      name: catalog.name,
                      is_active: catalog.is_active,
                    }))}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your latest products</CardTitle>
                <CardDescription>
                  Recent products across all your business catalogs.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {products.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    You have not added any products yet.
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{product.name}</h3>
                        <Badge
                          variant={product.is_active ? "default" : "secondary"}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Catalog:{" "}
                        {catalogsById.get(product.business_catalog_id)?.name ??
                          "Unknown catalog"}
                      </p>
                      {product.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        Image:{" "}
                        {product.image_url ? (
                          <a
                            href={product.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-4"
                          >
                            Open product image
                          </a>
                        ) : (
                          "Not set"
                        )}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Seller workspace</CardTitle>
            <CardDescription>
              Admins can inspect the seller area, but business catalogs are
              created only by seller accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            If you want admins to create or edit seller catalogs too, I can add
            that flow next.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SellerSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="mt-4 h-10 w-56 rounded bg-muted" />
        <div className="mt-3 h-4 w-full max-w-2xl rounded bg-muted" />
        <div className="mt-2 h-4 w-3/4 max-w-xl rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-48 rounded-xl border bg-card" />
        <div className="h-48 rounded-xl border bg-card" />
        <div className="h-48 rounded-xl border bg-card" />
      </div>
    </div>
  );
}

export default function SellerPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <Suspense fallback={<SellerSkeleton />}>
          <SellerContent />
        </Suspense>
      </div>
    </main>
  );
}
