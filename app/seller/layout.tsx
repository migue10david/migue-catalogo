import { Suspense } from "react";
import { requireRole } from "@/lib/auth";
import { SellerLayoutShell } from "@/components/seller/seller-layout-shell";

async function SellerLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["admin", "seller"]);
  return <SellerLayoutShell user={user}>{children}</SellerLayoutShell>;
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <SellerLayoutContent>{children}</SellerLayoutContent>
    </Suspense>
  );
}
