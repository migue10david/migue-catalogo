import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth";
import { getBusinessCatalogsForOwner } from "@/lib/business-catalogs";
import { Boxes, Store, Trash2 } from "lucide-react";
import DialogCatalogForm from "@/components/seller/dialog-catalog-form";
import { deleteBusinessCatalog } from "@/app/actions/business-catalogs";

function getCoverGradient(name: string) {
  const gradients = [
    "from-amber-500/20 via-orange-400/15 to-rose-400/20",
    "from-emerald-500/20 via-teal-400/15 to-cyan-400/20",
    "from-violet-500/20 via-purple-400/15 to-fuchsia-400/20",
    "from-sky-500/20 via-blue-400/15 to-indigo-400/20",
    "from-rose-500/20 via-pink-400/15 to-red-400/20",
    "from-lime-500/20 via-green-400/15 to-emerald-400/20",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function getAccentBorder(name: string) {
  const accents = [
    "border-l-amber-400",
    "border-l-emerald-400",
    "border-l-violet-400",
    "border-l-sky-400",
    "border-l-rose-400",
    "border-l-lime-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return accents[Math.abs(hash) % accents.length];
}

function LogoMark({ catalog }: { catalog: { logo_url: string | null; name: string } }) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-muted/30">
      {catalog.logo_url ? (
        <img src={catalog.logo_url} alt="" className="size-full object-cover" />
      ) : (
        <Store className="size-5 text-muted-foreground/40" />
      )}
    </div>
  );
}

async function CatalogsContent() {
  const profile = await requireRole(["admin", "seller"]);
  const catalogs =
    profile.role === "seller"
      ? await getBusinessCatalogsForOwner(profile.id)
      : [];
  const activeCatalogs = catalogs.filter((catalog) => catalog.is_active).length;

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
        </div>
        <div className="shrink-0">
          <DialogCatalogForm triggerLabel="Crear catálogo" />
        </div>
      </section>

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
                  </div>

                  <div className="mt-3 flex items-center justify-between">
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

function CatalogsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="h-10 w-52 rounded-xl bg-muted/50" />
          <div className="mt-2 h-4 w-40 rounded-lg bg-muted/30" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-muted/50" />
      </div>

      <div className="flex flex-col gap-4">
        {/* Desktop skeleton */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="hidden overflow-hidden rounded-2xl border border-border/50 bg-card md:flex"
          >
            <div className="w-56 shrink-0 animate-pulse bg-muted/30" />
            <div className="flex flex-1 flex-col justify-between p-5 pl-7">
              <div>
                <div className="flex items-start justify-between">
                  <div className="h-5 w-40 rounded-lg bg-muted/40" />
                  <div className="h-5 w-14 rounded-full bg-muted/30" />
                </div>
                <div className="mt-2 h-4 w-full rounded bg-muted/20" />
                <div className="mt-1 h-4 w-3/4 rounded bg-muted/20" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-muted/20" />
                <div className="h-7 w-20 rounded-lg bg-muted/20" />
              </div>
            </div>
          </div>
        ))}
        {/* Mobile skeleton */}
        {[1, 2, 3].map((i) => (
          <div
            key={`m-${i}`}
            className="overflow-hidden rounded-2xl border border-l-4 border-l-muted/30 border-border/50 bg-card p-4 md:hidden"
          >
            <div className="flex items-start gap-3">
              <div className="size-11 shrink-0 animate-pulse rounded-xl bg-muted/30" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="h-4 w-32 rounded bg-muted/40" />
                  <div className="h-4 w-12 rounded-full bg-muted/30" />
                </div>
                <div className="mt-2 h-3 w-full rounded bg-muted/20" />
                <div className="mt-1 h-3 w-2/3 rounded bg-muted/20" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-2.5">
              <div className="h-3 w-20 rounded bg-muted/20" />
              <div className="flex gap-1.5">
                <div className="h-7 w-14 rounded-lg bg-muted/20" />
                <div className="size-7 rounded-lg bg-muted/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
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
