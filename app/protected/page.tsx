import { Suspense } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requireUser, type AppRole } from "@/lib/auth";
import { submitSellerRequest } from "@/app/actions/seller-requests";
import { getLatestSellerRequestForUser } from "@/lib/seller-requests";
import {
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Store,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lock,
} from "lucide-react";

const roleConfig: Record<
  AppRole,
  {
    label: string;
    description: string;
    color: string;
    icon: typeof Store;
  }
> = {
  admin: {
    label: "Administrador",
    description: "Control total de la plataforma, vendedores y usuarios.",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    icon: ShieldCheck,
  },
  seller: {
    label: "Vendedor",
    description: "Gestiona tus catálogos y productos.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: ShoppingBag,
  },
  user: {
    label: "Usuario",
    description: "Explora catálogos y descubre productos.",
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    icon: Store,
  },
};

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="size-4 text-emerald-500" />;
    case "rejected":
      return <XCircle className="size-4 text-destructive" />;
    default:
      return <Clock className="size-4 text-amber-500" />;
  }
}

function StatusLabel({ status }: { status: string }) {
  const map: Record<string, { text: string; class: string }> = {
    pending: {
      text: "Pendiente",
      class: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    approved: {
      text: "Aprobada",
      class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    rejected: {
      text: "Rechazada",
      class: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };
  const s = map[status] ?? map.pending;
  return (
    <Badge variant="outline" className={s.class}>
      <StatusIcon status={status} />
      {s.text}
    </Badge>
  );
}

async function ProtectedContent() {
  const profile = await requireUser();
  const latestSellerRequest =
    profile.role === "user"
      ? await getLatestSellerRequestForUser(profile.id)
      : null;

  const config = roleConfig[profile.role];
  const RoleIcon = config.icon;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.06),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 animate-fade-up">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl ${config.color}`}
                >
                  <RoleIcon className="size-6" />
                </div>
                <Badge
                  variant="outline"
                  className={`${config.color} border-current/20 text-xs uppercase tracking-widest`}
                >
                  {config.label}
                </Badge>
              </div>
              <div>
                <h1 className="font-serif-display text-3xl tracking-tight sm:text-4xl">
                  Bienvenido de vuelta
                </h1>
                <p className="mt-2 max-w-lg text-muted-foreground">
                  {config.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* Panels based on role */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-2 animate-fade-up stagger-1">
            <LayoutDashboard className="size-5 text-muted-foreground" />
            <h2 className="font-serif-display text-xl tracking-tight">
              Tus paneles
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Seller Panel */}
            {(profile.role === "admin" || profile.role === "seller") && (
              <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/[0.04] animate-fade-up stagger-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative">
                  <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <ShoppingBag className="size-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-lg">Panel de Vendedor</CardTitle>
                  <CardDescription>
                    Catálogos, productos e inventario de tu negocio.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button asChild size="sm" className="w-full">
                    <Link href="/seller">
                      Abrir panel
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Admin Panel */}
            {profile.role === "admin" && (
              <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/[0.04] animate-fade-up stagger-3">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <CardHeader className="relative">
                  <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-rose-500/10">
                    <ShieldCheck className="size-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <CardTitle className="text-lg">Panel de Admin</CardTitle>
                  <CardDescription>
                    Gestión de usuarios, roles y configuración de la plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button asChild size="sm" className="w-full">
                    <Link href="/admin">
                      Abrir panel
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Explore catalogs */}
            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/[0.04] animate-fade-up stagger-4">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <CardHeader className="relative">
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
                  <Package className="size-5 text-sky-600 dark:text-sky-400" />
                </div>
                <CardTitle className="text-lg">Explorar Catálogos</CardTitle>
                <CardDescription>
                  Descubre productos de vendedores cercanos.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/">
                    Ir al inicio
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Role info */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-2 animate-fade-up stagger-3">
            <Lock className="size-5 text-muted-foreground" />
            <h2 className="font-serif-display text-xl tracking-tight">
              Tu acceso
            </h2>
          </div>

          <Card className="animate-fade-up stagger-4">
            <CardContent className="py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-12 items-center justify-center rounded-2xl ${config.color}`}
                  >
                    <RoleIcon className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Rol actual
                    </p>
                    <p className="font-serif-display text-lg">
                      {config.label}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                  {config.description}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Seller request for users */}
        {profile.role === "user" && (
          <section>
            <div className="mb-6 flex items-center gap-2 animate-fade-up stagger-5">
              <Sparkles className="size-5 text-muted-foreground" />
              <h2 className="font-serif-display text-xl tracking-tight">
                Convertirse en vendedor
              </h2>
            </div>

            <Card className="animate-fade-up stagger-6">
              <CardHeader>
                <CardTitle>Solicitar acceso de vendedor</CardTitle>
                <CardDescription>
                  Envía una solicitud y un administrador revisará tu cuenta
                  para promoverla a vendedor.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {latestSellerRequest && (
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Última solicitud
                        </span>
                        <StatusLabel status={latestSellerRequest.status} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(
                          latestSellerRequest.created_at,
                        ).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {latestSellerRequest.notes && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Tu nota:
                        </span>{" "}
                        {latestSellerRequest.notes}
                      </p>
                    )}
                    {latestSellerRequest.admin_notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Respuesta del admin:
                        </span>{" "}
                        {latestSellerRequest.admin_notes}
                      </p>
                    )}
                  </div>
                )}

                {latestSellerRequest?.status === "pending" ? (
                  <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <Clock className="size-5 text-amber-500" />
                    <p className="text-sm text-muted-foreground">
                      Tu solicitud está pendiente de revisión. Un administrador
                      la aprobará o rechazará pronto.
                    </p>
                  </div>
                ) : (
                  <form
                    action={submitSellerRequest}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid gap-2">
                      <label
                        htmlFor="seller-request-notes"
                        className="text-sm font-medium"
                      >
                        ¿Por qué quieres ser vendedor?
                      </label>
                      <Textarea
                        id="seller-request-notes"
                        name="notes"
                        placeholder="Cuéntanos sobre tu tienda, productos o plan de negocio..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <div>
                      <Button type="submit" size="sm">
                        Enviar solicitud
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}

function ProtectedSkeleton() {
  return (
    <div className="min-h-screen">
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-muted" />
              <div className="h-6 w-28 rounded bg-muted" />
            </div>
            <div>
              <div className="h-10 w-72 rounded bg-muted" />
              <div className="mt-2 h-5 w-96 max-w-full rounded bg-muted" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-6 flex items-center gap-2">
          <div className="size-5 rounded bg-muted" />
          <div className="h-6 w-32 rounded bg-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <div className="mb-2 size-10 rounded-xl bg-muted" />
              <div className="h-5 w-36 rounded bg-muted" />
              <div className="mt-2 h-4 w-full rounded bg-muted" />
              <div className="mt-4 h-9 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense fallback={<ProtectedSkeleton />}>
      <ProtectedContent />
    </Suspense>
  );
}
