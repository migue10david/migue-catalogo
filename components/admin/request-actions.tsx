"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  approveSellerRequest,
  rejectSellerRequest,
} from "@/app/actions/seller-requests";

type RequestActionsProps = {
  requestId: string;
};

export function RequestActions({ requestId }: RequestActionsProps) {
  const [isPending, startTransition] = useTransition();
  const rejectFormRef = useRef<HTMLFormElement>(null);

  const handleApprove = (formData: FormData) => {
    startTransition(async () => {
      try {
        await approveSellerRequest(formData);
        toast.success("Solicitud aprobada y vendedor promovido");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al aprobar solicitud");
      }
    });
  };

  const handleReject = (formData: FormData) => {
    startTransition(async () => {
      try {
        await rejectSellerRequest(formData);
        toast.success("Solicitud rechazada");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al rechazar solicitud");
      }
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form action={handleApprove} className="flex flex-col gap-3">
        <input type="hidden" name="requestId" value={requestId} />
        <Textarea
          name="adminNotes"
          placeholder="Nota de aprobación (opcional)"
          rows={3}
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Procesando..." : "Aprobar y promover a vendedor"}
        </Button>
      </form>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isPending}>
            Rechazar solicitud
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar solicitud</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción rechazará la solicitud de vendedor. El usuario no podrá vender en la plataforma. ¿Estás seguro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" disabled={isPending} onClick={() => rejectFormRef.current?.requestSubmit()}>
                {isPending ? "Rechazando..." : "Rechazar"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <form ref={rejectFormRef} action={handleReject} className="hidden">
        <input type="hidden" name="requestId" value={requestId} />
        <input type="hidden" name="adminNotes" value="" />
      </form>
    </div>
  );
}
