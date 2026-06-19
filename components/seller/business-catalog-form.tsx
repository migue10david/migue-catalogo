"use client";

import { useRef, useState, useTransition } from "react";

import { createBusinessCatalog } from "@/app/actions/business-catalogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LOGO_MAX_SIZE = 800;
const COVER_MAX_WIDTH = 1600;
const COVER_MAX_HEIGHT = 900;
const WEBP_QUALITY = 0.86;

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
      reject(new Error("Could not read the selected image"));
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

async function convertImageToWebp(
  file: File,
  options: {
    maxWidth: number;
    maxHeight: number;
  },
) {
  const image = await loadImage(file);
  const { width, height } = getResizedDimensions(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    options.maxWidth,
    options.maxHeight,
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

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}

export function BusinessCatalogForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const htmlForm = event.currentTarget;
    const formData = new FormData(htmlForm);
    const logoFile = formData.get("logo_file");
    const coverFile = formData.get("cover_file");

    try {
      if (logoFile instanceof File && logoFile.size > 0) {
        const optimizedLogo = await convertImageToWebp(logoFile, {
          maxWidth: LOGO_MAX_SIZE,
          maxHeight: LOGO_MAX_SIZE,
        });
        formData.set("logo_file", optimizedLogo);
      }

      if (coverFile instanceof File && coverFile.size > 0) {
        const optimizedCover = await convertImageToWebp(coverFile, {
          maxWidth: COVER_MAX_WIDTH,
          maxHeight: COVER_MAX_HEIGHT,
        });
        formData.set("cover_file", optimizedCover);
      }

      startTransition(async () => {
        try {
          await createBusinessCatalog(formData);
          formRef.current?.reset();
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
          : "Could not process the selected images",
      );
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="catalog-name">Name</Label>
        <Input
          id="catalog-name"
          name="name"
          placeholder="Migue Tech Store"
          required
          disabled={isPending}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="catalog-description">Description</Label>
        <Textarea
          id="catalog-description"
          name="description"
          placeholder="Short description of the business and what it sells."
          rows={5}
          disabled={isPending}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="catalog-logo-file">Logo</Label>
          <Input
            id="catalog-logo-file"
            name="logo_file"
            type="file"
            accept="image/*"
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="catalog-cover-file">Cover</Label>
          <Input
            id="catalog-cover-file"
            name="cover_file"
            type="file"
            accept="image/*"
            disabled={isPending}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Optimizing and uploading..." : "Create catalog"}
        </Button>
      </div>
    </form>
  );
}
