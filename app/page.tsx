import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUserProfile } from "@/lib/auth";
import { getLatestActiveBusinessCatalogs } from "@/lib/business-catalogs";
import { ThemeSwitcher } from "@/components/theme-switcher";
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
  Package2,
} from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Crea tu catálogo",
    description:
      "Organiza tus productos con imágenes, precios y descripciones de forma sencilla.",
  },
  {
    icon: Search,
    title: "Descubre productos",
    description:
      "Explora catálogos de vendedores cercanos y encuentra lo que necesitas.",
  },
  {
    icon: Shield,
    title: "Plataforma segura",
    description:
      "Tus datos están protegidos con autenticación y roles de acceso.",
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
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="rounded-xl border bg-card p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="size-6 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              ¿Quieres ser vendedor?
            </h2>
            <p className="text-muted-foreground">
              Crea tu propio catálogo y llega a miles de clientes. Gestiona tus
              productos y recibe pedidos directamente.
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {sellerBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              {user ? (
                <Button asChild size="lg">
                  <Link href="/protected">
                    Solicitar acceso de vendedor
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link href="/auth/sign-up">
                    Crear cuenta y empezar
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="hidden md:flex size-48 rounded-xl bg-muted items-center justify-center">
            <Store className="size-16 text-muted-foreground/30" />
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
              <Link
                key={catalog.id}
                href={`/catalog/${catalog.id}`}
                className="group relative overflow-hidden rounded-3xl border bg-card transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/[0.06]" />
                <div className="relative h-44 border-b bg-muted/20">
                  {catalog.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={catalog.cover_url}
                      alt={catalog.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_55%)]">
                      <Store className="size-10 text-foreground/30" />
                    </div>
                  )}
                  <div className="absolute left-4 top-4 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                    New #{String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="relative p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center overflow-hidden rounded-2xl border bg-background">
                      {catalog.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={catalog.logo_url}
                          alt={`${catalog.name} logo`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Store className="size-5 text-foreground/40" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold">
                        {catalog.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Package2 className="size-3.5" />
                        Catálogo público activo
                      </div>
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {catalog.description ||
                      "Entra al catálogo para ver los productos publicados por este negocio."}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm font-medium">
                    <span>Ver catálogo</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
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
      <section className="w-full border-t bg-muted/40">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Todo lo que necesitas
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
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

      {/* Footer */}
      <footer className="w-full border-t py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Store className="size-4" />
            <span className="font-medium">Catálogo Online</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Supabase</span>
            <ThemeSwitcher />
          </div>
        </div>
      </footer>
    </main>
  );
}
