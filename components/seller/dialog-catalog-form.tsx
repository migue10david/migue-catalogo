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
import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import type { BusinessCatalog } from "@/lib/business-catalogs";
import type { BusinessCategory } from "@/lib/business-categories";
import type { Province } from "@/lib/provinces";
import { cn } from "@/lib/utils";
import { convertImageToWebp } from "@/lib/functions/catalog-functions";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CatalogFormData, catalogSchema } from "@/lib/schemas/zod-schemas";

const LOGO_MAX_SIZE = 800;
const COVER_MAX_WIDTH = 1600;
const COVER_MAX_HEIGHT = 900;

type DialogCatalogFormProps = {
  catalog?: BusinessCatalog;
  mode?: "create" | "edit";
  businessCategories: BusinessCategory[];
  provinces: Province[];
  catalogLimit?: number;
  usedCatalogs?: number;
  remainingCatalogSlots?: number;
  triggerLabel?: string;
  triggerClassName?: string;
};

const DialogCatalogForm = ({
  catalog,
  mode = "create",
  businessCategories,
  provinces,
  catalogLimit = 0,
  usedCatalogs = 0,
  remainingCatalogSlots = 0,
  triggerLabel,
  triggerClassName,
}: DialogCatalogFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } =
    useForm<CatalogFormData>({
      resolver: zodResolver(catalogSchema),
      defaultValues: {
        name: catalog?.name ?? "",
        description: catalog?.description ?? "",
        business_category_id: catalog?.business_category_id?.toString() ?? "",
        province_id: catalog?.province_id?.toString() ?? "",
        phone: catalog?.phone ?? "",
        address: catalog?.address ?? "",
        whatsapp_url: catalog?.whatsapp_url ?? "",
        facebook_url: catalog?.facebook_url ?? "",
        instagram_url: catalog?.instagram_url ?? "",
        catalog_id: catalog?.id ?? "",
      },
    });

  const submitAction =
    mode === "edit" ? updateBusinessCatalog : createBusinessCatalog;
  const buttonLabel =
    triggerLabel ?? (mode === "edit" ? "Editar" : "Crear catálogo");
  const isCreateDisabled = mode === "create" && remainingCatalogSlots <= 0;

  const onSubmit = async (data: CatalogFormData) => {
    setError(null);
    const formData = new FormData();

    formData.set("name", data.name);
    if (data.description) formData.set("description", data.description);
    formData.set("business_category_id", data.business_category_id);
    formData.set("province_id", data.province_id);
    if (data.phone) formData.set("phone", data.phone);
    if (data.address) formData.set("address", data.address);
    if (data.whatsapp_url) formData.set("whatsapp_url", data.whatsapp_url);
    if (data.facebook_url) formData.set("facebook_url", data.facebook_url);
    if (data.instagram_url) formData.set("instagram_url", data.instagram_url);
    if (data.catalog_id) formData.set("catalog_id", data.catalog_id);

    try {
      if (data.logo_file && data.logo_file.size > 0) {
        const optimizedLogo = await convertImageToWebp(data.logo_file, {
          maxWidth: LOGO_MAX_SIZE,
          maxHeight: LOGO_MAX_SIZE,
        });
        formData.set("logo_file", optimizedLogo);
      }

      if (data.cover_file && data.cover_file.size > 0) {
        const optimizedCover = await convertImageToWebp(data.cover_file, {
          maxWidth: COVER_MAX_WIDTH,
          maxHeight: COVER_MAX_HEIGHT,
        });
        formData.set("cover_file", optimizedCover);
      }

      startTransition(async () => {
        try {
          await submitAction(formData);
          reset();
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
          : "No se pudieron procesar las imágenes seleccionadas",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={mode === "edit" ? "outline" : "default"}
          className={triggerClassName}
          disabled={isCreateDisabled}
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[96dvh] w-[calc(100%-1rem)] overflow-hidden rounded-3xl border-border/60 p-0 shadow-2xl sm:max-w-2xl">
        <DialogHeader className="border-b border-border/50 px-5 pt-5 pb-4 sm:px-6">
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
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[calc(92dvh-5.5rem)] flex-col"
        >
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-5 pb-1">
              {mode === "create" && (
                <>
                  <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Usados
                        </p>
                        <p className="mt-1 text-sm font-semibold">{usedCatalogs}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Cupo
                        </p>
                        <p className="mt-1 text-sm font-semibold">{catalogLimit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Disponibles
                        </p>
                        <p className="mt-1 text-sm font-semibold">{remainingCatalogSlots}</p>
                      </div>
                    </div>
                  </div>

                  {remainingCatalogSlots <= 0 && (
                    <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
                      Has alcanzado tu límite de catálogos. Contacta al administrador
                      para ampliar tu cupo.
                    </p>
                  )}
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="catalog-name">Nombre</Label>
                <Input
                  id="catalog-name"
                  placeholder="Migue Tech Store"
                  disabled={isPending}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="catalog-description">Descripción</Label>
                <Textarea
                  id="catalog-description"
                  placeholder="Describe qué vende tu negocio y qué lo hace especial."
                  rows={4}
                  disabled={isPending}
                  {...register("description")}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="catalog-category">Categoría</Label>
                  <Controller
                    name="business_category_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        id="catalog-category"
                        disabled={isPending}
                        className={cn(
                          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                        {...field}
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
                    )}
                  />
                  {errors.business_category_id && (
                    <p className="text-xs text-destructive">
                      {errors.business_category_id.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="catalog-province">Provincia</Label>
                  <Controller
                    name="province_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        id="catalog-province"
                        disabled={isPending}
                        className={cn(
                          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                        {...field}
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
                    )}
                  />
                  {errors.province_id && (
                    <p className="text-xs text-destructive">
                      {errors.province_id.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="catalog-phone">Teléfono</Label>
                  <Input
                    id="catalog-phone"
                    type="tel"
                    placeholder="+53 5555 5555"
                    disabled={isPending}
                    {...register("phone")}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="catalog-address">Dirección</Label>
                  <Textarea
                    id="catalog-address"
                    placeholder="Calle, número, entre calles o referencia del local."
                    rows={3}
                    disabled={isPending}
                    {...register("address")}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="catalog-whatsapp-url">WhatsApp</Label>
                  <Input
                    id="catalog-whatsapp-url"
                    type="url"
                    placeholder="https://wa.me/5355555555"
                    disabled={isPending}
                    {...register("whatsapp_url")}
                  />
                  {errors.whatsapp_url && (
                    <p className="text-xs text-destructive">
                      {errors.whatsapp_url.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="catalog-facebook-url">Facebook</Label>
                  <Input
                    id="catalog-facebook-url"
                    type="url"
                    placeholder="https://facebook.com/tunegocio"
                    disabled={isPending}
                    {...register("facebook_url")}
                  />
                  {errors.facebook_url && (
                    <p className="text-xs text-destructive">
                      {errors.facebook_url.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="catalog-instagram-url">Instagram</Label>
                  <Input
                    id="catalog-instagram-url"
                    type="url"
                    placeholder="https://instagram.com/tunegocio"
                    disabled={isPending}
                    {...register("instagram_url")}
                  />
                  {errors.instagram_url && (
                    <p className="text-xs text-destructive">
                      {errors.instagram_url.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="catalog-logo-file">Logo</Label>
                  <Controller
                    name="logo_file"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="catalog-logo-file"
                        type="file"
                        accept="image/*"
                        disabled={isPending}
                        onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
                        ref={undefined}
                      />
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="catalog-cover-file">Cover</Label>
                  <Controller
                    name="cover_file"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="catalog-cover-file"
                        type="file"
                        accept="image/*"
                        disabled={isPending}
                        onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
                        ref={undefined}
                      />
                    )}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <DialogFooter className="border-t border-border/50 bg-background/95 px-5 py-4 backdrop-blur sm:px-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || isCreateDisabled}>
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
