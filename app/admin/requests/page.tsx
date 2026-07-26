import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth";
import { getPendingSellerRequests } from "@/lib/seller-requests";
import { ClipboardList } from "lucide-react";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { RequestActions } from "@/components/admin/request-actions";

async function AdminRequestsContent() {
  await requireRole("admin");
  const pendingRequests = await getPendingSellerRequests();

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <AdminPageIntro
        title="Solicitudes"
        description="Revisa y resuelve las solicitudes de acceso para vendedores."
        icon={ClipboardList}
        details={[
          { label: "Estado", value: `${pendingRequests.length} pendientes` },
        ]}
      />

      {pendingRequests.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg border bg-muted/40">
            <ClipboardList className="size-5 text-muted-foreground" />
          </div>
          <p className="text-xl font-semibold text-foreground">
            Sin solicitudes pendientes
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            No hay solicitudes de vendedor pendientes por revisar.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingRequests.map((request) => (
            <article
              key={request.id}
              className="rounded-xl border bg-card shadow-xs"
            >
              <div className="border-b px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">
                  {request.user_email ?? request.user_id}
                </p>
                <Badge variant="outline" className="text-[10px]">
                  {request.status}
                </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                Solicitado el{" "}
                {new Date(request.created_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                </p>
              </div>
              <div className="px-5 pt-4">
                <p className="text-sm leading-6 text-muted-foreground">
                {request.notes || "Sin notas proporcionadas por el usuario."}
                </p>
              </div>
              <div className="p-5">
                <RequestActions requestId={request.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminRequestsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="h-8 w-40 rounded-md bg-muted/50" />
        <div className="mt-2 h-4 w-full max-w-md rounded bg-muted/30" />
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="h-56 rounded-xl border bg-card" />
      ))}
    </div>
  );
}

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={<AdminRequestsSkeleton />}>
      <AdminRequestsContent />
    </Suspense>
  );
}
