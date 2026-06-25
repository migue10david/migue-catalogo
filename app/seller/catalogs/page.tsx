import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth";
import { getBusinessCatalogsForOwner } from "@/lib/business-catalogs";
import { getBusinessCategories } from "@/lib/business-categories";
import { getProvinces } from "@/lib/provinces";
import {
  Boxes,
  MapPin,
  Phone,
  Store,
  Trash2,
} from "lucide-react";
import DialogCatalogForm from "@/components/seller/dialog-catalog-form";
import { deleteBusinessCatalog } from "@/app/actions/business-catalogs";
import CatalogLinks from "@/components/seller/catalog-links";
import { getCoverGradient, getAccentBorder } from "@/lib/functions/catalog-functions";
import CatalogsSkeleton from "@/components/seller/catalog-skeleton";


function LogoMark({ catalog }: { catalog: { logo_url: string | null; name: string } }) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-muted/30">
      {catalog.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={catalog.logo_url} alt="" className="size-full object-cover" />
      ) : (
        <Store className="size-5 text-muted-foreground/40" />
      )}
    </div>
  );
}

async function CatalogsContent() {
  const profile = await requireRole(["admin", "seller"]);
  const businessCategories = await getBusinessCategories();
  const provinces = await getProvinces();
  const catalogs =
    profile.role === "seller"
      ? await getBusinessCatalogsForOwner(profile.id)
      : [];
  const activeCatalogs = catalogs.filter((catalog) => catalog.is_active).length;
  const usedCatalogs = catalogs.length;
  const catalogLimit = profile.catalog_limit;
  const remainingCatalogSlots = Math.max(catalogLimit - usedCatalogs, 0);

  if (profile.role !== "seller") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/50">
            <Boxes className="size-7 text-muted-foreground/40" />
          </div>
          <h3 className="font-serif-display text-xl">Espacio de catálogos</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Los administradores pueden inspeccionar módulos de vendedores, pero
            la creación de catálogos pertenece a cuentas de vendedor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-serif-display text-3xl tracking-tight sm:text-4xl">
            Tus catálogos
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {catalogs.length} catálogo{catalogs.length !== 1 ? "s" : ""} en
            total · {activeCatalogs} activo{activeCatalogs !== 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cupo: {catalogLimit} · Disponibles: {remainingCatalogSlots}
          </p>
        </div>
        <div className="shrink-0">
          <DialogCatalogForm
            businessCategories={businessCategories}
            provinces={provinces}
            catalogLimit={catalogLimit}
            usedCatalogs={usedCatalogs}
            remainingCatalogSlots={remainingCatalogSlots}
            triggerLabel="Crear catálogo"
          />
        </div>
      </section>

      {remainingCatalogSlots <= 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Has alcanzado tu límite de catálogos. Contacta al administrador para
          ampliar tu cupo antes de crear uno nuevo.
        </div>
      )}

      <section className="flex flex-col gap-3 sm:gap-4">
        {catalogs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 px-8 py-16 text-center">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted/40">
              <Store className="size-8 text-muted-foreground/25" />
            </div>
            <p className="font-serif-display text-xl text-muted-foreground/70">
              Sin catálogos aún
            </p>
            <p className="mt-2 text-sm text-muted-foreground/50">
              Crea tu primer catálogo para comenzar a gestionar productos.
            </p>
          </div>
        ) : (
          catalogs.map((catalog, index) => (
            <div
              key={catalog.id}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/[0.15] animate-fade-up stagger-${Math.min(index + 1, 8)}`}
            >
              {/* Desktop: horizontal layout with cover */}
              <div className="hidden md:flex">
                <div className="relative w-56 shrink-0 overflow-hidden">
                  {catalog.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={catalog.cover_url}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <div
                      className={`size-full bg-gradient-to-br ${getCoverGradient(catalog.name)} to-background`}
                    >
                      <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                    </div>
                  )}
                  <div className="absolute -bottom-5 left-4">

                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-5 pl-7">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif-display text-lg leading-snug tracking-tight">
                        {catalog.name}
                      </h3>
                      <Badge
                        variant={catalog.is_active ? "default" : "secondary"}
                        className={`shrink-0 ${
                          catalog.is_active
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : ""
                        }`}
                      >
                        {catalog.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    {catalog.description && (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {catalog.description}
                      </p>
                    )}

                    <div className="mt-3">
                      <Badge variant="outline" className="bg-background/60">
                        {catalog.business_category?.name ?? "Sin categoría"}
                      </Badge>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground/80">
                            {catalog.province?.name ?? "Provincia sin asignar"}
                          </p>
                          <p className="line-clamp-2">
                            {catalog.address ?? "Sin dirección registrada"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="size-4 shrink-0" />
                        <span>{catalog.phone ?? "Sin teléfono registrado"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    <CatalogLinks
                      facebookUrl={catalog.facebook_url}
                      instagramUrl={catalog.instagram_url}
                      whatsappUrl={catalog.whatsapp_url}
                    />

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground/60">
                        Creado{" "}
                        {new Date(catalog.created_at).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <DialogCatalogForm
                        mode="edit"
                        catalog={catalog}
                        businessCategories={businessCategories}
                        provinces={provinces}
                        catalogLimit={catalogLimit}
                        usedCatalogs={usedCatalogs}
                        remainingCatalogSlots={remainingCatalogSlots}
                        triggerLabel="Editar"
                        triggerClassName="h-8 px-3 text-xs"
                      />
                      <form action={deleteBusinessCatalog}>
                        <input
                          type="hidden"
                          name="catalog_id"
                          value={catalog.id}
                        />
                        <Button
                          type="submit"
                          variant="destructive"
                          className="h-8 px-3 text-xs"
                        >
                          <Trash2 className="size-3.5" />
                          Eliminar
                        </Button>
                      </form>
                    </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile: compact card with accent border */}
              <div className={`flex flex-col gap-3 border-l-4 ${getAccentBorder(catalog.name)} p-4 md:hidden`}>
                <div className="flex items-start gap-3">
                  <LogoMark catalog={catalog} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif-display text-base leading-snug tracking-tight">
                        {catalog.name}
                      </h3>
                      <Badge
                        variant={catalog.is_active ? "default" : "secondary"}
                        className={`mt-0.5 shrink-0 text-[10px] ${
                          catalog.is_active
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : ""
                        }`}
                      >
                        {catalog.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    {catalog.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {catalog.description}
                      </p>
                    )}

                    <div className="mt-2">
                      <Badge variant="outline" className="bg-background/60 text-[10px]">
                        {catalog.business_category?.name ?? "Sin categoría"}
                      </Badge>
                    </div>

                    <div className="mt-2 grid gap-1 text-[11px] text-muted-foreground">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="mt-0.5 size-3 shrink-0" />
                        <span className="line-clamp-2">
                          {catalog.province?.name ?? "Provincia pendiente"}
                          {catalog.address ? ` · ${catalog.address}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="size-3 shrink-0" />
                        <span>{catalog.phone ?? "Sin teléfono"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
                  <span className="text-[11px] text-muted-foreground/50">
                    {new Date(catalog.created_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <DialogCatalogForm
                      mode="edit"
                      catalog={catalog}
                      businessCategories={businessCategories}
                      provinces={provinces}
                      catalogLimit={catalogLimit}
                      usedCatalogs={usedCatalogs}
                      remainingCatalogSlots={remainingCatalogSlots}
                      triggerLabel="Editar"
                      triggerClassName="h-7 px-2.5 text-[11px]"
                    />
                    <form action={deleteBusinessCatalog}>
                      <input
                        type="hidden"
                        name="catalog_id"
                        value={catalog.id}
                      />
                      <Button
                        type="submit"
                        variant="destructive"
                        size="icon"
                        className="size-7"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}



export default function SellerCatalogsPage() {
  return (
    <Suspense fallback={<CatalogsSkeleton />}>
      <CatalogsContent />
    </Suspense>
  );
}
