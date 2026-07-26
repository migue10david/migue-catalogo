"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/shared/Footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/seller")) {
    return null;
  }

  return <Footer />;
}
