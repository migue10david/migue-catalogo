import { Suspense } from "react";
import type { Metadata } from "next";
import { CartContent } from "@/components/cart/cart-content";
import { CartSkeleton } from "@/components/cart/cart-skeleton";

export const metadata: Metadata = {
  title: "Mi carrito",
  description: "Revisa los productos en tu carrito y contáctanos por WhatsApp.",
};

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartContent />
    </Suspense>
  );
}
