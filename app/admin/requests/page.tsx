import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requireRole } from "@/lib/auth";
import { getPendingSellerRequests } from "@/lib/seller-requests";
import {
  approveSellerRequest,
  rejectSellerRequest,
} from "@/app/actions/seller-requests";
import { ClipboardList } from "lucide-react";

async function AdminRequestsContent() {
  await requireRole("admin");
  const pendingRequests = await getPendingSellerRequests();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif-display text-3xl tracking-tight sm:text-4xl">
          Solicitudes
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Solicitudes pendientes de vendedor.
        </p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 px-8 py-16 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted/40">
            <ClipboardList className="size-8 text-muted-foreground/25" />
          </div>
          <p className="font-serif-display text-xl text-muted-foreground/70">
            Sin solicitudes pendientes
          </p>
          <p className="mt-2 text-sm text-muted-foreground/50">
            No hay solicitudes de vendedor pendientes por revisar.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">
                  {request.user_email ?? request.user_id}
                </p>
                <Badge variant="secondary" className="uppercase text-[10px]">
                  {request.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Solicitado el{" "}
                {new Date(request.created_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {request.notes || "Sin notas proporcionadas por el usuario."}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <form action={approveSellerRequest} className="flex flex-col gap-3">
                  <input type="hidden" name="requestId" value={request.id} />
                  <Textarea
                    name="adminNotes"
                    placeholder="Nota de aprobación (opcional)"
                    rows={3}
                  />
                  <Button type="submit" size="sm">
                    Aprobar y promover a vendedor
                  </Button>
                </form>
                <form action={rejectSellerRequest} className="flex flex-col gap-3">
                  <input type="hidden" name="requestId" value={request.id} />
                  <Textarea
                    name="adminNotes"
                    placeholder="Nota de rechazo (opcional)"
                    rows={3}
                  />
                  <Button type="submit" variant="destructive" size="sm">
                    Rechazar solicitud
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminRequestsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="h-10 w-48 rounded-xl bg-muted/50" />
        <div className="mt-2 h-4 w-56 rounded-lg bg-muted/30" />
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="h-48 rounded-2xl border bg-card" />
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
