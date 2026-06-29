import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUserProfile } from "@/lib/auth";
import { getLatestActiveBusinessCatalogs } from "@/lib/business-catalogs";
import { cn } from "@/lib/utils";
import Footer from "@/components/shared/Footer";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Search,
  Shield,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BadgeCheck,
  PanelRightOpen,
  ScanSearch,
  LayoutGrid,
} from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Crea tu catálogo",
    description:
      "Organiza tus productos con imágenes, precios y descripciones. Tu negocio online en minutos, listo para compartir.",
    gradient: "from-primary/[0.04] to-transparent",
  },
  {
    icon: Search,
    title: "Descubre productos",
    description:
      "Explora catálogos de vendedores cercanos, filtra por categoría o provincia y encuentra exactamente lo que necesitas.",
    gradient: "from-primary/[0.03] via-primary/[0.01] to-transparent",
  },
  {
    icon: Shield,
    title: "Plataforma segura",
    description:
      "Tus datos están protegidos con autenticación robusta y roles de acceso. Solo tú controlas tu información.",
    gradient: "from-primary/[0.05] to-transparent",
  },
];

const sellerBenefits = [
  "Gestiona tu inventario desde un solo lugar",
  "Alcanza más clientes en tu zona",
  "Panel exclusivo para vendedores",
  "Control total sobre tus productos",
];

async function HeroActions() {
  const user = await getCurrentUserProfile();

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-8">
      {user ? (
        <Button asChild size="lg">
          <Link href="/protected">
            Ir a mi dashboard
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <>
          <Button asChild size="lg">
            <Link href="/auth/sign-up">
              Crear cuenta gratis
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/login">Iniciar sesión</Link>
          </Button>
        </>
      )}
    </div>
  );
}

async function SellerSection() {
  const user = await getCurrentUserProfile();
  const isSellerOrAdmin = user?.role === "seller" || user?.role === "admin";

  if (isSellerOrAdmin) return null;

  return (
    <section className="w-full border-t">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_34%),radial-gradient(circle_at_85%_18%,hsl(var(--primary)/0.09),transparent_28%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)/0.55))]" />
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.08),transparent)] lg:block" />
          <div className="relative grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:p-12">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="secondary"
                  className="rounded-full border-primary/15 bg-primary/8 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-primary"
                >
                  Programa Seller
                </Badge>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                  <Sparkles className="size-3.5 text-primary" />
                  Solicitud y aprobación por admin
                </div>
              </div>

              <div className="max-w-2xl">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 shadow-sm shadow-primary/10">
                  <ShoppingBag className="size-7 text-primary" />
                </div>
                <h2 className="max-w-xl font-serif-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
                  Convierte tu negocio en un catálogo que sí se ve profesional
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Publica tus productos, organiza tus negocios y deja que los
                  clientes descubran todo desde una vitrina digital clara,
                  rápida y fácil de compartir.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
                  <PanelRightOpen className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-medium">Panel dedicado</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Gestiona catálogos y productos desde un solo espacio.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
                  <ScanSearch className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-medium">Mayor alcance</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Haz que más personas encuentren tu negocio y tus productos.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
                  <BadgeCheck className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-medium">Control total</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Decide qué mostrar, cómo presentarlo y cuándo actualizarlo.
                  </p>
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {sellerBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/55 px-4 py-3 text-sm backdrop-blur-sm"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12">
                      <CheckCircle2 className="size-4 text-primary" />
                    </span>
                    <span className="leading-6">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                {user ? (
                  <Button asChild size="lg" className="rounded-full px-6">
                    <Link href="/protected">
                      Solicitar acceso de vendedor
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="rounded-full px-6">
                    <Link href="/auth/sign-up">
                      Crear cuenta y empezar
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                )}

                <p className="text-xs leading-6 text-muted-foreground sm:max-w-xs">
                  El acceso seller se habilita después de la revisión del
                  administrador.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-primary/8 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/85 p-5 shadow-xl shadow-black/5 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Seller preview
                    </p>
                    <p className="mt-1 font-serif-display text-2xl tracking-tight">
                      Tu escaparate
                    </p>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Store className="size-6 text-primary" />
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">Catálogo principal</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Muestra tu negocio con identidad propia y enlaces de
                          contacto.
                        </p>
                      </div>
                      <div className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-[11px] font-medium">
                        Activo
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border/60 bg-background p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        Productos
                      </p>
                      <p className="mt-2 font-serif-display text-3xl tracking-tight">
                        24
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        visibles para clientes
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        Negocios
                      </p>
                      <p className="mt-2 font-serif-display text-3xl tracking-tight">
                        03
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        organizados por catálogo
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-dashed border-primary/25 bg-primary/6 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12">
                        <Sparkles className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Empieza con una sola solicitud
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          Cuando te aprueben, podrás crear catálogos y luego
                          agregar todos tus productos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function LatestCatalogsSection() {
  const catalogs = await getLatestActiveBusinessCatalogs(6);

  return (
    <section className="w-full border-t">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4">
              Latest catalogs
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Descubre los negocios más recientes
            </h2>
            <p className="mt-3 text-muted-foreground">
              Explora los últimos catálogos agregados a la plataforma y entra a
              ver sus productos con un solo clic.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4" />
            Actualizado con los catálogos activos más nuevos
          </div>
        </div>

        {catalogs.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Todavía no hay catálogos públicos activos para mostrar.
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {catalogs.map((catalog, index) => (
              <CatalogCard
                key={catalog.id}
                catalog={catalog}
                badge={`New #${String(index + 1).padStart(2, "0")}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
        <Badge variant="secondary" className="mb-6">
          Plataforma de catálogos online
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl !leading-tight">
          Tu catálogo online,{" "}
          <span className="text-primary">siempre accessible</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl">
          Crea, gestiona y comparte tu catálogo de productos. Los clientes te
          encuentran fácilmente y tú vendes más.
        </p>
        <Suspense>
          <HeroActions />
        </Suspense>
      </section>

      {/* Features */}
      <section className="relative w-full overflow-hidden border-t">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <div className="text-center animate-fade-up">
            <h2 className="font-serif-display text-3xl tracking-tight sm:text-4xl">
              Todo lo que necesitas
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Herramientas pensadas para que vendas más y administres mejor tu negocio.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/50 bg-background/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-lg hover:shadow-black/5",
                  `animate-fade-up stagger-${index + 1}`,
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    feature.gradient,
                  )}
                />
                <div className="relative">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 shadow-sm shadow-primary/5 transition-colors duration-300 group-hover:bg-primary/10 group-hover:border-primary/15">
                    <feature.icon className="size-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense>
        <LatestCatalogsSection />
      </Suspense>

      {/* Seller CTA */}
      <Suspense>
        <SellerSection />
      </Suspense>
    </main>
  );
}
