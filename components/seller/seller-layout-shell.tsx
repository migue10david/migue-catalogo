"use client";

import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerSiteHeader } from "@/components/seller/seller-site-header";
import type { AuthProfile } from "@/lib/auth";

type SellerLayoutShellProps = {
  children: React.ReactNode;
  user: AuthProfile;
};

export function SellerLayoutShell({ children, user }: SellerLayoutShellProps) {
  const sidebarUser = {
    name: user.email?.split("@")[0] ?? "Seller",
    email: user.email ?? "",
    avatar: "",
  };

  const headerUser = {
    email: user.email ?? "",
    role: user.role,
  };

  return (
    <SidebarProvider defaultOpen>
      <SellerSidebar user={sidebarUser} />
      <SidebarInset className="min-h-svh bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.03),transparent_50%)]">
        <SellerSiteHeader user={headerUser} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
                {children}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
