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
    <div className="flex flex-col sm:flex-row gap-2.5 flex-wrap py-4">
      {user ? (
        <Button asChild size="lg" className="bg-secondary hover:bg-secondary/85 text-secondary-foreground shadow-none">
          <Link href="/protected">
            Ir a mi dashboard
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button asChild size="lg" className="bg-secondary hover:bg-secondary/85 text-secondary-foreground shadow-none">
          <Link href="/auth/sign-up">
            Crear cuenta gratis
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      )}
      <Button asChild variant="outline" size="lg" className="bg-transparent border-white/15 text-white/80 hover:bg-white/10 hover:text-white">
        <Link href="/explore">Explorar catálogos</Link>
      </Button>
    </div>
  );
}

async function SellerSection() {
  const user = await getCurrentUserProfile();
  const isSellerOrAdmin = user?.role === "seller" || user?.role === "admin";

  if (isSellerOrAdmin) return null;

  return (
    <section className="w-full dark:bg-card bg-primary">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="text-center max-w-[600px] mx-auto mb-14">
          <h2 className="font-serif-display text-[clamp(22px,2.8vw,32px)] tracking-tight text-white">
            Convierte tu negocio en un catálogo que sí se ve profesional
          </h2>
          <p className="mt-3 text-[15px] text-white/55 leading-relaxed">
            Publica tus productos, organiza tus negocios y deja que los
            clientes descubran todo desde una vitrina digital clara,
            rápida y fácil de compartir.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
          <div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {sellerBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2.5 text-sm text-white/80 bg-white/[0.04] border border-white/[0.06] rounded-lg px-4 py-3"
                >
                  <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-teal-500">
                    <CheckCircle2 className="size-3 text-white" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            {user ? (
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/85 text-secondary-foreground shadow-none">
                <Link href="/protected">
                  Solicitar acceso de vendedor
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/85 text-secondary-foreground shadow-none">
                <Link href="/auth/sign-up">
                  Crear cuenta y empezar
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <span className="text-[10px] uppercase tracking-[0.1em] text-white/30 font-medium">
              Preview
            </span>
            <h3 className="font-serif-display text-[22px] text-white mt-3 mb-4">
              Tu escaparate
            </h3>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3.5 mb-3">
              <h4 className="font-serif-display text-base text-white">Catálogo principal</h4>
              <p className="text-xs text-white/40 mt-1">
                Muestra tu negocio con identidad propia y enlaces de contacto.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-3.5 text-center">
                <span className="font-serif-display text-[26px] text-teal-300 block">24</span>
                <span className="text-[11px] text-white/35 mt-1 block">Productos</span>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-3.5 text-center">
                <span className="font-serif-display text-[26px] text-teal-300 block">03</span>
                <span className="text-[11px] text-white/35 mt-1 block">Negocios</span>
              </div>
            </div>

            <div className="border border-dashed border-teal-500/20 rounded-lg p-3.5 text-center text-xs text-white/40">
              Empieza con una solicitud. Cuando te aprueben, podrás crear
              catálogos y agregar productos.
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
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Badge className="mb-4 rounded-full bg-secondary/10 border border-secondary/20 text-secondary">
              Últimos catálogos
            </Badge>
            <h2 className="font-serif-display text-[clamp(26px,3vw,36px)] tracking-tight">
              Descubre los negocios más recientes
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">
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
      <section className="relative overflow-hidden dark:bg-card bg-primary min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_55%,rgba(0,106,97,0.08),transparent_50%),radial-gradient(ellipse_at_75%_30%,rgba(255,255,255,0.02),transparent_40%)] pointer-events-none" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 py-24 lg:py-0 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-secondary/15 border border-secondary/25 text-[#6bd8cb] mb-5">
              Plataforma de catálogos online
            </span>
            <h1 className="font-serif-display leading-[1.1] text-white -tracking-[0.03em]" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}>
              Tu catálogo online,{' '}
              <em className="italic text-[#6bd8cb]">siempre accesible</em>
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/55 max-w-[480px]">
              Crea, gestiona y comparte tu catálogo de productos. Los clientes
              te encuentran fácilmente y tú vendes más desde una vitrina
              digital profesional.
            </p>
            <Suspense>
              <HeroActions />
            </Suspense>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-sm hidden lg:block">
            <span className="text-[11px] uppercase tracking-[0.1em] text-white/30 font-medium">
              Cómo funciona
            </span>
            {[
              { num: "01", title: "Crea tu catálogo", desc: "Agrega productos, fotos y precios desde tu panel." },
              { num: "02", title: "Comparte tu catálogo", desc: "Envía el enlace a tus clientes en WhatsApp o redes." },
              { num: "03", title: "Recibe pedidos", desc: "Los clientes te contactan directo por WhatsApp." },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`flex gap-3.5 py-3.5 ${i < 2 ? "border-b border-white/5" : ""}`}
              >
                <span className="font-serif-display text-xl text-[#6bd8cb] min-w-[32px] leading-none">
                  {step.num}
                </span>
                <div>
                  <h4 className="text-white text-sm font-semibold">{step.title}</h4>
                  <p className="text-xs text-white/45 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <h2 className="font-serif-display text-[clamp(26px,3vw,36px)] tracking-tight">
              Todo lo que necesitas
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
              Herramientas pensadas para que vendas más y administres mejor tu negocio en un solo lugar.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="dark:bg-card bg-white border border-[#E2E0DA] dark:border-[#2A3550] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(9,20,38,0.08)] hover:border-transparent"
              >
                <div
                  className={`mb-5 flex size-11 items-center justify-center rounded-[10px] bg-secondary/10`}
                >
                  <feature.icon className="size-[22px] text-primary" />
                </div>
                <h3 className="font-serif-display text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
    </main>
  );
}