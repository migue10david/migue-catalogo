"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { createBusinessCatalogProduct } from "@/app/actions/products";
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
import { Textarea } from "@/components/ui/textarea";

const PRODUCT_IMAGE_MAX_WIDTH = 1400;
const PRODUCT_IMAGE_MAX_HEIGHT = 1400;
const WEBP_QUALITY = 0.86;

type CatalogOption = {
  id: string;
  name: string;
  is_active: boolean;
};

type ProductCategoryOption = {
  id: string;
  business_catalog_id: string;
  name: string;
  is_active: boolean;
};

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read the selected product image"));
    };
    image.src = objectUrl;
  });
}

function getResizedDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

async function convertImageToWebp(file: File) {
  const image = await loadImage(file);
  const { width, height } = getResizedDimensions(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    PRODUCT_IMAGE_MAX_WIDTH,
    PRODUCT_IMAGE_MAX_HEIGHT,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Your browser could not process the selected image");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
  });

  if (!blob) {
    throw new Error("Could not compress the selected image");
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "product";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}

type DialogProductFormProps = {
  catalogs: CatalogOption[];
  categories: ProductCategoryOption[];
  productLimit: number;
  usedProducts: number;
  remainingProductSlots: number;
};

export function DialogProductForm({
  catalogs,
  categories,
  productLimit,
  usedProducts,
  remainingProductSlots,
}: DialogProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState(
    catalogs[0]?.id ?? "",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const availableCategories = categories.filter(
    (category) =>
      category.business_catalog_id === selectedCatalogId && category.is_active,
  );

  useEffect(() => {
    const nextCategoryId = availableCategories[0]?.id ?? "";
    setSelectedCategoryId((current) =>
      availableCategories.some((category) => category.id === current)
        ? current
        : nextCategoryId,
    );
  }, [availableCategories, categories, selectedCatalogId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get("image_file");

    (async () => {
      try {
        if (imageFile instanceof File && imageFile.size > 0) {
          const optimizedImage = await convertImageToWebp(imageFile);
          formData.set("image_file", optimizedImage);
        }

        startTransition(async () => {
          try {
            await createBusinessCatalogProduct(formData);
            formRef.current?.reset();
            setSelectedCatalogId(catalogs[0]?.id ?? "");
            setSelectedCategoryId("");
            setOpen(false);
          } catch (submitError) {
            setError(
              submitError instanceof Error
                ? submitError.message
                : "Ocurrió un error inesperado",
            );
          }
        });
      } catch (compressionError) {
        setError(
          compressionError instanceof Error
            ? compressionError.message
            : "No se pudo procesar la imagen seleccionada",
        );
      }
    })();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={remainingProductSlots <= 0}>Agregar producto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar producto</DialogTitle>
          <DialogDescription>
            Crea un nuevo producto y asígnalo a uno de tus catálogos.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Usados
                </p>
                <p className="mt-1 text-sm font-semibold">{usedProducts}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Cupo
                </p>
                <p className="mt-1 text-sm font-semibold">{productLimit}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Disponibles
                </p>
                <p className="mt-1 text-sm font-semibold">{remainingProductSlots}</p>
              </div>
            </div>
          </div>

          {remainingProductSlots <= 0 && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
              Has alcanzado tu límite de productos. Contacta al administrador
              para ampliar tu cupo.
            </p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="product-catalog">Catálogo</Label>
            <select
              id="product-catalog"
              name="business_catalog_id"
              required
              disabled={isPending}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCatalogId}
              onChange={(event) => setSelectedCatalogId(event.target.value)}
            >
              {catalogs.map((catalog) => (
                <option key={catalog.id} value={catalog.id}>
                  {catalog.name}
                  {catalog.is_active ? "" : " (inactivo)"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product-category">Categoría</Label>
            <select
              id="product-category"
              name="product_category_id"
              required
              disabled={isPending || availableCategories.length === 0}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
            >
              {availableCategories.length === 0 ? (
                <option value="">
                  Primero crea una categoría para este catálogo
                </option>
              ) : (
                availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product-name">Nombre del producto</Label>
            <Input
              id="product-name"
              name="name"
              placeholder="Mouse inalámbrico"
              required
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product-description">Descripción</Label>
            <Textarea
              id="product-description"
              name="description"
              placeholder="Descripción corta del producto"
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="product-price">Precio</Label>
              <Input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="19.99"
                required
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-image-file">Imagen</Label>
              <Input
                id="product-image-file"
                name="image_file"
                type="file"
                accept="image/*"
                disabled={isPending}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={
                isPending ||
                availableCategories.length === 0 ||
                remainingProductSlots <= 0
              }
            >
              {isPending ? "Creando..." : "Crear producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
