import { Suspense } from "react";
import { LayoutGrid } from "lucide-react";

import { requireRole } from "@/lib/auth";
import { getAllCatalogsWithOwner } from "@/lib/admin";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { CatalogsTable } from "@/components/admin/catalogs-table";

async function AdminCatalogsContent() {
  await requireRole("admin");
  const catalogs = await getAllCatalogsWithOwner();

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <AdminPageIntro
        title="Catálogos"
        description="Supervisa la publicación, visibilidad y actividad de los catálogos."
        icon={LayoutGrid}
        details={[
          { label: "Vista", value: "Todos los catálogos" },
        ]}
      />

      <CatalogsTable catalogs={catalogs} />
    </div>
  );
}

function AdminCatalogsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="h-8 w-40 rounded-md bg-muted/50" />
        <div className="mt-2 h-4 w-full max-w-md rounded bg-muted/30" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl border bg-card" />
        ))}
      </div>
      <div className="h-[30rem] rounded-xl border bg-card" />
    </div>
  );
}

export default function AdminCatalogsPage() {
  return (
    <Suspense fallback={<AdminCatalogsSkeleton />}>
      <AdminCatalogsContent />
    </Suspense>
  );
}
