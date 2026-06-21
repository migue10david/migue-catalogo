"use client";

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
import {
  createBusinessCatalog,
  updateBusinessCatalog,
} from "@/app/actions/business-catalogs";
import { useRef, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import type { BusinessCatalog } from "@/lib/business-catalogs";
import type { BusinessCategory } from "@/lib/business-categories";
import type { Province } from "@/lib/provinces";
import { cn } from "@/lib/utils";

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

type DialogCatalogFormProps = {
  catalog?: BusinessCatalog;
  mode?: "create" | "edit";
  businessCategories: BusinessCategory[];
  provinces: Province[];
  triggerLabel?: string;
  triggerClassName?: string;
};

const DialogCatalogForm = ({
  catalog,
  mode = "create",
  businessCategories,
  provinces,
  triggerLabel,
  triggerClassName,
}: DialogCatalogFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const submitAction =
    mode === "edit" ? updateBusinessCatalog : createBusinessCatalog;
  const buttonLabel =
    triggerLabel ?? (mode === "edit" ? "Editar" : "Crear catálogo");

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
          await submitAction(formData);
          formRef.current?.reset();
          setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={mode === "edit" ? "outline" : "default"}
          className={triggerClassName}
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar catálogo" : "Crear catálogo"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Actualiza la información principal, ubicación y redes de este catálogo."
              : "Agrega un nuevo negocio con ubicación, contacto y sus medios principales."}
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          {mode === "edit" && catalog && (
            <input type="hidden" name="catalog_id" value={catalog.id} />
          )}
          <div className="grid gap-2">
            <Label htmlFor="catalog-name">Nombre</Label>
            <Input
              id="catalog-name"
              name="name"
              placeholder="Migue Tech Store"
              defaultValue={catalog?.name ?? ""}
              required
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="catalog-description">Descripción</Label>
            <Textarea
              id="catalog-description"
              name="description"
              placeholder="Describe qué vende tu negocio y qué lo hace especial."
              defaultValue={catalog?.description ?? ""}
              rows={4}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="catalog-category">Categoría</Label>
              <select
                id="catalog-category"
                name="business_category_id"
                defaultValue={catalog?.business_category_id?.toString() ?? ""}
                required
                disabled={isPending}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {businessCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="catalog-province">Provincia</Label>
              <select
                id="catalog-province"
                name="province_id"
                defaultValue={catalog?.province_id?.toString() ?? ""}
                required
                disabled={isPending}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                <option value="" disabled>
                  Selecciona una provincia
                </option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="catalog-phone">Teléfono</Label>
              <Input
                id="catalog-phone"
                name="phone"
                type="tel"
                placeholder="+53 5555 5555"
                defaultValue={catalog?.phone ?? ""}
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="catalog-address">Dirección</Label>
              <Textarea
                id="catalog-address"
                name="address"
                placeholder="Calle, número, entre calles o referencia del local."
                defaultValue={catalog?.address ?? ""}
                rows={3}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="catalog-whatsapp-url">WhatsApp</Label>
              <Input
                id="catalog-whatsapp-url"
                name="whatsapp_url"
                type="url"
                placeholder="https://wa.me/5355555555"
                defaultValue={catalog?.whatsapp_url ?? ""}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="catalog-facebook-url">Facebook</Label>
              <Input
                id="catalog-facebook-url"
                name="facebook_url"
                type="url"
                placeholder="https://facebook.com/tunegocio"
                defaultValue={catalog?.facebook_url ?? ""}
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="catalog-instagram-url">Instagram</Label>
              <Input
                id="catalog-instagram-url"
                name="instagram_url"
                type="url"
                placeholder="https://instagram.com/tunegocio"
                defaultValue={catalog?.instagram_url ?? ""}
                disabled={isPending}
              />
            </div>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Procesando y subiendo..."
                : mode === "edit"
                  ? "Guardar cambios"
                  : "Crear catálogo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCatalogForm;
