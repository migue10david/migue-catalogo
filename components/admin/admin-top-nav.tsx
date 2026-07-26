"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { adminNavItems } from "@/components/admin/admin-nav";

export function AdminTopNav() {
  const pathname = usePathname();

  return (
    <div className="scrollbar-hide overflow-x-auto rounded-2xl border bg-background/80 px-2 py-2 md:hidden">
      <div className="flex gap-1">
      {adminNavItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex min-w-fit items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <item.icon className="size-3.5" />
            {item.title}
          </Link>
        );
      })}
      </div>
    </div>
  );
}
