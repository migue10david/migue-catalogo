import { Suspense } from "react";

import { requireRole } from "@/lib/auth";
import { getAllCatalogsWithOwner } from "@/lib/admin";
import { CatalogsTable } from "@/components/admin/catalogs-table";

async function AdminCatalogsContent() {
  await requireRole("admin");
  const catalogs = await getAllCatalogsWithOwner();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-3xl tracking-tight sm:text-4xl">
          Catálogos
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Todos los catálogos creados en la plataforma.
        </p>
      </div>

      <CatalogsTable catalogs={catalogs} />
    </div>
  );
}

function AdminCatalogsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="h-10 w-48 rounded-xl bg-muted/50" />
        <div className="mt-2 h-4 w-72 rounded-lg bg-muted/30" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 rounded-xl border bg-card" />
        ))}
      </div>
      <div className="h-10 w-full rounded-lg bg-muted/20" />
      <div className="h-[28rem] rounded-xl border bg-card" />
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
