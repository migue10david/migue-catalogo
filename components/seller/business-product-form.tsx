"use client";

import { useRef, useState, useTransition } from "react";
import { useEffect } from "react";

import { createBusinessCatalogProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
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

export function BusinessProductForm({
  catalogs,
  categories,
}: {
  catalogs: CatalogOption[];
  categories: ProductCategoryOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
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
          } catch (submitError) {
            setError(
              submitError instanceof Error
                ? submitError.message
                : "An unexpected error occurred",
            );
          }
        });
      } catch (compressionError) {
        setError(
          compressionError instanceof Error
            ? compressionError.message
            : "Could not process the selected image",
        );
      }
    })();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="product-catalog">Catalog</Label>
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
              {catalog.is_active ? "" : " (inactive)"}
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
            <option value="">Primero crea una categoría para este catálogo</option>
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
        <Label htmlFor="product-name">Product name</Label>
        <Input
          id="product-name"
          name="name"
          placeholder="Wireless Mouse"
          required
          disabled={isPending}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="product-description">Description</Label>
        <Textarea
          id="product-description"
          name="description"
          placeholder="Short product description"
          rows={4}
          disabled={isPending}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="product-price">Price</Label>
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
          <Label htmlFor="product-image-file">Product image</Label>
          <Input
            id="product-image-file"
            name="image_file"
            type="file"
            accept="image/*"
            disabled={isPending}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <Button
          type="submit"
          disabled={isPending || availableCategories.length === 0}
        >
          {isPending ? "Creating product..." : "Add product"}
        </Button>
      </div>
    </form>
  );
}
