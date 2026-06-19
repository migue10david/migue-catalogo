import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerTopNav } from "@/components/seller/seller-top-nav";
import Navbar from "@/components/shared/Navbar";
import { Suspense } from "react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <SellerSidebar />
      <SidebarInset className="min-h-svh bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.03),transparent_50%)]">
        <div className="flex-1 px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
            <SellerTopNav />
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
