import { Suspense } from "react";
import { requireRole } from "@/lib/auth";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";

async function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("admin");
  return <AdminLayoutShell user={user}>{children}</AdminLayoutShell>;
}

export default function DashboardLayout({
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
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
