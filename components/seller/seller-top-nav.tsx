"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  {
    label: "Catálogos",
    href: "/seller/catalogs",
    icon: LayoutGrid,
  },
  {
    label: "Productos",
    href: "/seller/products",
    icon: Package,
  },
    {
    label: "Categorias",
    href: "/seller/categories",
    icon: ShieldCheck,
  }
];

export function SellerTopNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 md:hidden">
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/10"
                : "border-border/60 bg-background text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/30",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
