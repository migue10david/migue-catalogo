"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { updateBusinessCatalogProduct } from "@/app/actions/products";
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
import type { BusinessCatalogProduct } from "@/lib/products";

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

type DialogEditProductFormProps = {
  product: BusinessCatalogProduct;
  catalogs: CatalogOption[];
  categories: ProductCategoryOption[];
  trigger: React.ReactNode;
};

export function DialogEditProductForm({
  product,
  catalogs,
  categories,
  trigger,
}: DialogEditProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    product.product_category_id,
  );

  const catalogName =
    catalogs.find((c) => c.id === product.business_catalog_id)?.name ?? "";

  const availableCategories = categories.filter(
    (category) =>
      category.business_catalog_id === product.business_catalog_id &&
      category.is_active,
  );

  useEffect(() => {
    if (open) {
      setSelectedCategoryId(product.product_category_id);
    }
  }, [open, product.product_category_id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("product_id", product.id);
    formData.set("business_catalog_id", product.business_catalog_id);
    const imageFile = formData.get("image_file");

    (async () => {
      try {
        if (imageFile instanceof File && imageFile.size > 0) {
          const optimizedImage = await convertImageToWebp(imageFile);
          formData.set("image_file", optimizedImage);
        }

        startTransition(async () => {
          try {
            await updateBusinessCatalogProduct(formData);
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
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>
            Actualiza la información de &quot;{product.name}&quot;.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div className="grid gap-2">
            <Label>Catálogo</Label>
            <p className="text-sm text-muted-foreground">{catalogName}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-product-category">Categoría</Label>
            <select
              id="edit-product-category"
              name="product_category_id"
              required
              disabled={isPending || availableCategories.length === 0}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
            >
              {availableCategories.length === 0 ? (
                <option value="">Sin categorías disponibles</option>
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
            <Label htmlFor="edit-product-name">Nombre del producto</Label>
            <Input
              id="edit-product-name"
              name="name"
              defaultValue={product.name}
              required
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-product-description">Descripción</Label>
            <Textarea
              id="edit-product-description"
              name="description"
              defaultValue={product.description ?? ""}
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-product-price">Precio</Label>
              <Input
                id="edit-product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product.price}
                required
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-product-image-file">
                Imagen (opcional)
              </Label>
              <Input
                id="edit-product-image-file"
                name="image_file"
                type="file"
                accept="image/*"
                disabled={isPending}
              />
              {product.image_url && (
                <p className="text-[11px] text-muted-foreground/60">
                  Deja vacío para mantener la imagen actual.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-product-active"
              name="is_active"
              defaultChecked={product.is_active}
              disabled={isPending}
              className="size-4 rounded border-input"
            />
            <Label htmlFor="edit-product-active" className="text-sm font-normal">
              Producto activo
            </Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
