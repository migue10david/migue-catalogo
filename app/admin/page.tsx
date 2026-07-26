import { Suspense } from "react";

import { requireRole } from "@/lib/auth";
import { getAllProfiles, getAllCatalogsWithOwner } from "@/lib/admin";
import { getPendingSellerRequests } from "@/lib/seller-requests";
import { AdminOverview } from "@/components/admin/admin-overview";

async function AdminOverviewContent() {
  await requireRole("admin");

  const [users, catalogs, pendingRequests] = await Promise.all([
    getAllProfiles(),
    getAllCatalogsWithOwner(),
    getPendingSellerRequests(),
  ]);

  return (
    <div className="px-4 lg:px-6">
      <AdminOverview
        users={users}
        catalogs={catalogs}
        pendingRequests={pendingRequests}
      />
    </div>
  );
}

function AdminOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-xl border bg-card" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="h-[28rem] rounded-xl border bg-card" />
        <div className="h-[28rem] rounded-xl border bg-card" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-xl border bg-card" />
        <div className="h-64 rounded-xl border bg-card" />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminOverviewSkeleton />}>
      <AdminOverviewContent />
    </Suspense>
  );
}
