"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { CartCatalogGroup } from "@/components/cart/cart-catalog-group";

export function CartContent() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const catalogGroups = items.reduce<
    Record<
      string,
      {
        catalogId: string;
        catalogSlug: string;
        catalogName: string;
        whatsappUrl: string | null;
        items: typeof items;
      }
    >
  >((groups, item) => {
    if (!groups[item.catalogId]) {
      groups[item.catalogId] = {
        catalogId: item.catalogId,
        catalogSlug: item.catalogSlug,
        catalogName: item.catalogName,
        whatsappUrl: item.whatsappUrl,
        items: [],
      };
    }
    groups[item.catalogId].items.push(item);
    return groups;
  }, {});

  const groups = Object.values(catalogGroups);

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
          <Link
            href="/"
            className="group mb-14 inline-flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-secondary"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </Link>

          <div className="animate-fade-up stagger-2 flex flex-col items-center justify-center rounded-3xl border border-border bg-card px-6 py-28 text-center shadow-sm">
            <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-secondary/10">
              <ShoppingBag className="size-10 text-secondary/60" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif-display text-3xl text-foreground/80 sm:text-4xl">
              Tu carrito está vacío
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground/50">
              Explora los catálogos disponibles y agrega productos que te
              interesen.
            </p>
            <Button
              asChild
              className="mt-8 rounded-2xl bg-secondary px-8 py-6 text-base font-semibold text-white shadow-md shadow-secondary/20 transition-all hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5"
            >
              <Link href="/explore">
                Explorar catálogos
                <ArrowLeft className="ml-2 size-4 rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-20">
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-secondary"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Volver al inicio
        </Link>

        <div
          className="animate-fade-up stagger-2 mb-10"
          style={{ animationDelay: "0.06s" }}
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="font-serif-display text-4xl text-foreground sm:text-5xl">
                Mi carrito
              </h1>
              <p className="mt-2 text-sm text-foreground/50">
                {totalItems} producto{totalItems !== 1 ? "s" : ""} ·{" "}
                {groups.length} catálogo{groups.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-border" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,340px] lg:items-start">
          <div className="space-y-6">
            {groups.map((group, index) => (
              <div
                key={group.catalogId}
                className="animate-fade-up"
                style={{ animationDelay: `${(index + 3) * 120}ms` }}
              >
                <CartCatalogGroup
                  catalogId={group.catalogId}
                  catalogSlug={group.catalogSlug}
                  catalogName={group.catalogName}
                  whatsappUrl={group.whatsappUrl}
                  items={group.items}
                  number={index + 1}
                />
              </div>
            ))}
          </div>

          <div
            className="animate-fade-up lg:sticky lg:top-8"
            style={{ animationDelay: `${(groups.length + 4) * 120}ms` }}
          >
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-foreground">
                Resumen del pedido
              </h2>

              <div className="mt-6 space-y-3">
                {groups.map((group) => (
                  <div
                    key={group.catalogId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground/60">
                      {group.catalogName}
                    </span>
                    <span className="font-medium tabular-nums text-foreground">
                      $
                      {group.items
                        .reduce((sum, i) => sum + i.price * i.quantity, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-border" />

              <div className="flex items-center justify-between">
                <span className="text-foreground/60">Total</span>
                <span className="font-serif-display text-3xl tabular-nums text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <p className="mt-2 text-right text-xs text-foreground/40">
                {totalItems} producto{totalItems !== 1 ? "s" : ""}
              </p>

              <div className="mt-6 border-t border-border pt-5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="w-full gap-2 rounded-2xl text-foreground/50 transition-all hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                  Vaciar carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
