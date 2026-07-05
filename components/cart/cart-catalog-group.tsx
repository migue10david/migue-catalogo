"use client";

import Link from "next/link";
import { MessageCircle, ArrowUpRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "./cart-item-row";
import { useCartStore, type CartItem } from "@/lib/store/cart";

type CartCatalogGroupProps = {
  catalogId: string;
  catalogSlug: string;
  catalogName: string;
  whatsappUrl: string | null;
  items: CartItem[];
  number: number;
};

function buildWhatsAppMessage(
  catalogName: string,
  items: CartItem[],
): string {
  const lines = items.map((item) => {
    const priceStr = Number(item.price).toFixed(2);
    return `• ${item.name} — $${priceStr} x${item.quantity}`;
  });

  return [
    `Hola, me interesan los siguientes productos de tu catálogo "${catalogName}":`,
    "",
    ...lines,
    "",
    "¿Están disponibles?",
  ].join("\n");
}

export function CartCatalogGroup({
  catalogId,
  catalogSlug,
  catalogName,
  whatsappUrl,
  items,
  number,
}: CartCatalogGroupProps) {
  const clearCatalog = useCartStore((state) => state.clearCatalog);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const whatsappMessage = buildWhatsAppMessage(catalogName, items);
  const whatsappHref = whatsappUrl
    ? `${whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  const initial = catalogName.charAt(0).toUpperCase();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 bg-secondary/[0.03] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-secondary/10 font-serif-display text-xl text-secondary">
            {initial}
          </div>
          <div>
            <Link
              href={`/catalog/${catalogSlug}`}
              className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-secondary"
            >
              {catalogName}
              <ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
            <p className="mt-0.5 text-xs text-foreground/45">
              {items.length} producto{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {whatsappHref && (
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#25D366] px-4 text-[13px] font-semibold text-white shadow-sm shadow-[#25D366]/20 transition-all hover:bg-[#1fb855] hover:shadow-md hover:shadow-[#25D366]/30 hover:-translate-y-0.5"
            >
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-1.5 size-3.5" />
                Consultar
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-foreground/30 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => clearCatalog(catalogId)}
            aria-label={`Eliminar catálogo ${catalogName}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div>
        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            productId={item.productId}
            name={item.name}
            price={item.price}
            image_url={item.image_url}
            quantity={item.quantity}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border/50 bg-muted/30 px-5 py-3 sm:px-6">
        <span className="text-xs text-foreground/45">
          Total · {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
        <span className="text-base font-bold tabular-nums text-foreground">
          ${subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
