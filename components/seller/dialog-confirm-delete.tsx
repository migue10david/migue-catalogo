"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type DialogConfirmDeleteProps = {
  title?: string;
  description?: string;
  warningMessage?: string;
  onConfirm: (formData: FormData) => Promise<void>;
  formData?: Record<string, string>;
  trigger?: ReactNode;
  triggerClassName?: string;
};

export function DialogConfirmDelete({
  title = "Confirmar eliminación",
  description = "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
  warningMessage,
  onConfirm,
  formData = {},
  trigger,
  triggerClassName,
}: DialogConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);
    const fd = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      fd.set(key, value);
    }

    startTransition(async () => {
      try {
        await onConfirm(fd);
        setOpen(false);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Ocurrió un error inesperado",
        );
      }
    });
  };

  const hasWarning = !!warningMessage;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className={`size-8 text-muted-foreground hover:text-destructive ${triggerClassName ?? ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasWarning && (
              <AlertTriangle className="size-5 text-amber-500" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>
            {hasWarning ? warningMessage : description}
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          {!hasWarning && (
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
