"use client";

import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ImageIcon, Trash2 } from "lucide-react";

type CartItemRowProps = {
  productId: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

export function CartItemRow({
  productId,
  name,
  price,
  image_url,
  quantity,
}: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="group/item relative border-b border-border/50 px-5 py-4 transition-colors last:border-b-0 hover:bg-muted/30 sm:flex sm:items-center sm:gap-5 sm:px-6 sm:py-5">
      {/* ── Mobile layout ── */}
      <div className="flex items-start gap-3.5 sm:hidden">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted/30">
          {image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="size-5 text-foreground/15" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="truncate text-sm font-semibold leading-tight text-foreground">
              {name}
            </h4>
            <button
              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-foreground/20 transition-colors hover:bg-destructive/10 hover:text-destructive"
              onClick={() => removeItem(productId)}
              aria-label="Eliminar producto"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>

          <p className="mt-0.5 text-xs tabular-nums text-foreground/40">
            ${Number(price).toFixed(2)} c/u
          </p>

          <div className="mt-2.5 flex items-center justify-between">
            <div className="inline-flex items-center rounded-full bg-muted/60 p-0.5">
              <button
                className="flex size-7 items-center justify-center rounded-full transition-all duration-150 hover:bg-secondary hover:text-white active:scale-90"
                onClick={() => updateQuantity(productId, quantity - 1)}
              >
                <Minus className="size-3" strokeWidth={2.5} />
              </button>
              <span className="w-8 text-center text-xs font-bold tabular-nums">
                {quantity}
              </span>
              <button
                className="flex size-7 items-center justify-center rounded-full transition-all duration-150 hover:bg-secondary hover:text-white active:scale-90"
                onClick={() => updateQuantity(productId, quantity + 1)}
              >
                <Plus className="size-3" strokeWidth={2.5} />
              </button>
            </div>

            <span className="text-sm font-bold tabular-nums text-foreground">
              ${(price * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden items-center gap-5 sm:flex">
        <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-muted/30">
          {image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover/item:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="size-6 text-foreground/15" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-foreground">
            {name}
          </h4>
          <p className="mt-1 text-xs tabular-nums text-foreground/45">
            ${Number(price).toFixed(2)} c/u
          </p>
        </div>

        <div className="flex items-center rounded-full bg-muted/50 p-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full transition-all duration-200 hover:bg-secondary hover:text-white active:scale-95"
            onClick={() => updateQuantity(productId, quantity - 1)}
          >
            <Minus className="size-3.5" strokeWidth={2.5} />
          </Button>
          <span className="w-9 text-center text-sm font-bold tabular-nums">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full transition-all duration-200 hover:bg-secondary hover:text-white active:scale-95"
            onClick={() => updateQuantity(productId, quantity + 1)}
          >
            <Plus className="size-3.5" strokeWidth={2.5} />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="min-w-[5rem] text-right text-base font-bold tabular-nums">
            ${(price * quantity).toFixed(2)}
          </span>
          <button
            className="flex size-8 items-center justify-center rounded-full text-foreground/25 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive active:scale-95"
            onClick={() => removeItem(productId)}
            aria-label="Eliminar producto"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
