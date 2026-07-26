import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  LayoutGrid,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

import type { AdminBusinessCatalog, AdminUserProfile } from "@/lib/admin";
import type { PendingSellerRequest } from "@/lib/seller-requests";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminOverviewProps = {
  users: AdminUserProfile[];
  catalogs: AdminBusinessCatalog[];
  pendingRequests: PendingSellerRequest[];
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accentClassName,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof Users;
  accentClassName: string;
}) {
  return (
    <Card className="border-border/60 bg-card/95 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <CardTitle className="mt-2 text-3xl tracking-tight">{value}</CardTitle>
        </div>
        <div className={`rounded-2xl border p-2.5 ${accentClassName}`}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ProgressRow({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  const safeValue = clampPercent(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{helper}</p>
        </div>
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatPercent(safeValue)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted/70">
        <div
          className="h-2 rounded-full bg-primary transition-[width]"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-5 py-8 text-center">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function AdminOverview({
  users,
  catalogs,
  pendingRequests,
}: AdminOverviewProps) {
  const sellers = users.filter((user) => user.role === "seller");
  const admins = users.filter((user) => user.role === "admin");
  const activeCatalogs = catalogs.filter((catalog) => catalog.is_active);
  const totalProducts = catalogs.reduce(
    (sum, catalog) => sum + catalog.product_count,
    0,
  );
  const sellerCoverage = users.length > 0 ? (sellers.length / users.length) * 100 : 0;
  const catalogActivation =
    catalogs.length > 0 ? (activeCatalogs.length / catalogs.length) * 100 : 0;
  const totalCatalogCapacity = sellers.reduce(
    (sum, seller) => sum + seller.catalog_limit,
    0,
  );
  const usedCatalogCapacity = sellers.reduce(
    (sum, seller) => sum + seller.catalog_count,
    0,
  );
  const catalogCapacityUsage =
    totalCatalogCapacity > 0
      ? (usedCatalogCapacity / totalCatalogCapacity) * 100
      : 0;
  const totalProductCapacity = sellers.reduce(
    (sum, seller) => sum + seller.product_limit,
    0,
  );
  const usedProductCapacity = sellers.reduce(
    (sum, seller) => sum + seller.product_count,
    0,
  );
  const productCapacityUsage =
    totalProductCapacity > 0
      ? (usedProductCapacity / totalProductCapacity) * 100
      : 0;

  const recentUsers = users.slice(0, 5);
  const recentCatalogs = catalogs.slice(0, 5);
  const sellersNeedingCapacity = sellers
    .slice()
    .sort((a, b) => a.remaining_product_slots - b.remaining_product_slots)
    .slice(0, 5);

  const provinceCounts = Array.from(
    catalogs.reduce((map, catalog) => {
      const key = catalog.province ?? "Sin provincia";
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Usuarios"
          value={String(users.length)}
          description={`${sellers.length} vendedores y ${admins.length} administradores`}
          icon={Users}
          accentClassName="border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-300"
        />
        <StatCard
          title="Catálogos activos"
          value={String(activeCatalogs.length)}
          description={`${catalogs.length} catálogos creados en total`}
          icon={LayoutGrid}
          accentClassName="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
        />
        <StatCard
          title="Productos publicados"
          value={String(totalProducts)}
          description="Inventario consolidado de toda la plataforma"
          icon={Store}
          accentClassName="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300"
        />
        <StatCard
          title="Solicitudes pendientes"
          value={String(pendingRequests.length)}
          description="Accesos esperando revisión del equipo"
          icon={Clock3}
          accentClassName="border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card className="overflow-hidden border-border/60 bg-card/95 shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Estado general
                </p>
                <CardTitle className="mt-2 text-2xl tracking-tight">
                  Salud operativa del marketplace
                </CardTitle>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  El panel resume adopción, publicación y capacidad disponible
                  para que el equipo administre el crecimiento desde un solo lugar.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin/users"
                  className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Ver usuarios
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/admin/requests"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
                >
                  Revisar solicitudes
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <ProgressRow
                label="Base de vendedores"
                value={sellerCoverage}
                helper="Porcentaje de cuentas con capacidad de venta"
              />
              <ProgressRow
                label="Activación de catálogos"
                value={catalogActivation}
                helper="Cuántos catálogos están visibles para compradores"
              />
              <ProgressRow
                label="Uso de cupo de catálogos"
                value={catalogCapacityUsage}
                helper={`${usedCatalogCapacity} usados de ${totalCatalogCapacity || 0} disponibles`}
              />
              <ProgressRow
                label="Uso de cupo de productos"
                value={productCapacityUsage}
                helper={`${usedProductCapacity} usados de ${totalProductCapacity || 0} disponibles`}
              />
            </div>

            <div className="rounded-3xl border border-border/60 bg-muted/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Radar rápido
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Publicación activa
                  </div>
                  <p className="mt-2 text-2xl font-semibold tabular-nums">
                    {formatPercent(catalogActivation)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activeCatalogs.length} catálogos activos de {catalogs.length}
                  </p>
                </div>
                <div className="rounded-2xl border bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="size-4 text-sky-500" />
                    Moderación pendiente
                  </div>
                  <p className="mt-2 text-2xl font-semibold tabular-nums">
                    {pendingRequests.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Solicitudes esperando una decisión del admin
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/95 shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Entradas recientes
            </p>
            <CardTitle className="mt-2 text-2xl tracking-tight">
              Movimiento en la plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {recentUsers.length === 0 && recentCatalogs.length === 0 ? (
              <EmptyState
                title="Sin actividad aún"
                description="Cuando haya usuarios y catálogos, aparecerán aquí."
              />
            ) : (
              <>
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-background/80 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.email ?? "Usuario sin email"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Nuevo usuario registrado el {formatDate(user.created_at)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="border-border/60 bg-card/95 shadow-sm xl:col-span-2">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Catálogos recientes
                </p>
                <CardTitle className="mt-2 text-xl tracking-tight">
                  Últimos negocios creados
                </CardTitle>
              </div>
              <Link
                href="/admin/catalogs"
                className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
              >
                Ver todos
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {recentCatalogs.length === 0 ? (
              <EmptyState
                title="Aún no hay catálogos"
                description="Aquí aparecerán las altas más recientes."
              />
            ) : (
              recentCatalogs.map((catalog) => (
                <div
                  key={catalog.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {catalog.name}
                      </p>
                      <Badge variant={catalog.is_active ? "default" : "secondary"}>
                        {catalog.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {catalog.owner_email ?? "Sin email"} ·{" "}
                      {catalog.business_category ?? "Sin categoría"} ·{" "}
                      {catalog.province ?? "Sin provincia"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-sm text-muted-foreground">
                    <span>{catalog.product_count} productos</span>
                    <span>{formatDate(catalog.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/95 shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Moderación
            </p>
            <CardTitle className="mt-2 text-xl tracking-tight">
              Solicitudes por resolver
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {pendingRequests.length === 0 ? (
              <EmptyState
                title="Bandeja al día"
                description="No hay nuevas solicitudes pendientes."
              />
            ) : (
              pendingRequests.slice(0, 4).map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-border/60 bg-background/80 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-foreground">
                      {request.user_email ?? request.user_id}
                    </p>
                    <Badge variant="secondary">{request.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {request.notes || "Sin nota del solicitante."}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Recibida el {formatDate(request.created_at)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/95 shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Capacidad
            </p>
            <CardTitle className="mt-2 text-xl tracking-tight">
              Vendedores con menos margen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {sellersNeedingCapacity.length === 0 ? (
              <EmptyState
                title="Sin vendedores aún"
                description="Cuando existan cuentas seller, verás su disponibilidad aquí."
              />
            ) : (
              sellersNeedingCapacity.map((seller) => (
                <div key={seller.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {seller.email ?? seller.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {seller.product_count} de {seller.product_limit} productos usados
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {seller.remaining_product_slots} libres
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/70">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{
                        width: `${clampPercent(
                          seller.product_limit > 0
                            ? (seller.product_count / seller.product_limit) * 100
                            : 0,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/95 shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Distribución
            </p>
            <CardTitle className="mt-2 text-xl tracking-tight">
              Provincias con más catálogos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {provinceCounts.length === 0 ? (
              <EmptyState
                title="Sin datos territoriales"
                description="Los catálogos publicados alimentarán esta vista."
              />
            ) : (
              provinceCounts.map(([province, count]) => {
                const percent =
                  catalogs.length > 0 ? (count / catalogs.length) * 100 : 0;

                return (
                  <div key={province} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">{province}</p>
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {count}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/70">
                      <div
                        className="h-2 rounded-full bg-sky-500"
                        style={{ width: `${clampPercent(percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
