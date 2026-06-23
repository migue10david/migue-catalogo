"use client";

import { useRef, useState, useTransition } from "react";

import { createBusinessCatalogProductCategory } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CatalogOption = {
  id: string;
  name: string;
  is_active: boolean;
};

export function BusinessProductCategoryForm({
  catalogs,
}: {
  catalogs: CatalogOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await createBusinessCatalogProductCategory(formData);
        formRef.current?.reset();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "An unexpected error occurred",
        );
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="product-category-catalog">Catálogo</Label>
        <select
          id="product-category-catalog"
          name="business_catalog_id"
          required
          disabled={isPending}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          defaultValue={catalogs[0]?.id ?? ""}
        >
          {catalogs.map((catalog) => (
            <option key={catalog.id} value={catalog.id}>
              {catalog.name}
              {catalog.is_active ? "" : " (inactive)"}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="product-category-name">Nombre de categoría</Label>
        <Input
          id="product-category-name"
          name="name"
          placeholder="Accesorios, Bebidas, Repuestos..."
          required
          disabled={isPending}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creando categoría..." : "Crear categoría"}
        </Button>
      </div>
    </form>
  );
}
