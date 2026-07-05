"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";

export function CartIndicator() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/cart">
        <ShoppingCart className="size-5" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-fade-in">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
        <span className="sr-only">Carrito</span>
      </Link>
    </Button>
  );
}
