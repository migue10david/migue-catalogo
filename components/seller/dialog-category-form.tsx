"use client";

import { useRef, useState, useTransition } from "react";
import {
  createBusinessCatalogProductCategory,
  updateBusinessCatalogProductCategory,
} from "@/app/actions/products";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BusinessCatalogProductCategory } from "@/lib/product-categories";

type CatalogOption = {
  id: string;
  name: string;
  is_active: boolean;
};

type DialogCategoryFormProps = {
  catalogs: CatalogOption[];
  category?: BusinessCatalogProductCategory;
  mode?: "create" | "edit";
  triggerLabel?: string;
  triggerClassName?: string;
};

export function DialogCategoryForm({
  catalogs,
  category,
  mode = "create",
  triggerLabel,
  triggerClassName,
}: DialogCategoryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const submitAction =
    mode === "edit"
      ? updateBusinessCatalogProductCategory
      : createBusinessCatalogProductCategory;

  const buttonLabel =
    triggerLabel ?? (mode === "edit" ? "Editar" : "Crear categoría");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const htmlForm = event.currentTarget;
    const formData = new FormData(htmlForm);

    startTransition(async () => {
      try {
        await submitAction(formData);
        formRef.current?.reset();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={mode === "edit" ? "ghost" : "default"}
          size={mode === "edit" ? "icon" : "default"}
          className={triggerClassName}
        >
          {mode === "edit" ? (
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
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          ) : (
            buttonLabel
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar categoría" : "Crear categoría"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Actualiza el nombre y estado de esta categoría."
              : "Agrega una nueva categoría para organizar productos dentro de un catálogo."}
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          {mode === "edit" && category && (
            <>
              <input
                type="hidden"
                name="product_category_id"
                value={category.id}
              />
              <input
                type="hidden"
                name="business_catalog_id"
                value={category.business_catalog_id}
              />
            </>
          )}

          {mode === "create" && (
            <div className="grid gap-2">
              <Label htmlFor="category-catalog">Catálogo</Label>
              <select
                id="category-catalog"
                name="business_catalog_id"
                required
                disabled={isPending}
                defaultValue={catalogs[0]?.id ?? ""}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {catalogs.map((catalog) => (
                  <option key={catalog.id} value={catalog.id}>
                    {catalog.name}
                    {catalog.is_active ? "" : " (inactivo)"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === "edit" && category && (
            <div className="grid gap-2">
              <Label>Catálogo</Label>
              <p className="text-sm text-muted-foreground">
                {catalogs.find((c) => c.id === category.business_catalog_id)
                  ?.name ?? "Desconocido"}
              </p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="category-name">Nombre de categoría</Label>
            <Input
              id="category-name"
              name="name"
              placeholder="Accesorios, Bebidas, Repuestos..."
              defaultValue={category?.name ?? ""}
              required
              disabled={isPending}
            />
          </div>

          {mode === "edit" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="category-active"
                name="is_active"
                defaultChecked={category?.is_active ?? true}
                disabled={isPending}
                className="size-4 rounded border-input"
              />
              <Label htmlFor="category-active" className="text-sm font-normal">
                Categoría activa
              </Label>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? mode === "edit"
                  ? "Guardando..."
                  : "Creando..."
                : mode === "edit"
                  ? "Guardar cambios"
                  : "Crear categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
