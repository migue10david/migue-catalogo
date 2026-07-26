import { Suspense } from "react";
import { Users } from "lucide-react";

import { requireRole } from "@/lib/auth";
import { getAllProfiles } from "@/lib/admin";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { UsersTable } from "@/components/admin/users-table";

async function AdminUsersContent() {
  await requireRole("admin");
  const users = await getAllProfiles();

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <AdminPageIntro
        title="Usuarios"
        description="Gestiona usuarios, roles y límites de uso desde un solo lugar."
        icon={Users}
        details={[{ label: "Vista", value: "Todas las cuentas" }]}
      />

      <UsersTable users={users} />
    </div>
  );
}

function AdminUsersSkeleton() {
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

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AdminUsersSkeleton />}>
      <AdminUsersContent />
    </Suspense>
  );
}
