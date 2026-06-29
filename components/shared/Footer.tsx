import Link from "next/link";
import { Store, Heart } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

const currentYear = new Date().getFullYear();

const platformLinks = [
  { label: "Explorar catálogos", href: "/explore" },
  { label: "Ser vendedor", href: "/auth/sign-up" },
  { label: "Crear cuenta", href: "/auth/sign-up" },
];

const supportLinks = [
  { label: "Centro de ayuda", href: "#" },
  { label: "Contacto", href: "#" },
  { label: "Sugerencias", href: "#" },
];

const legalLinks = [
  { label: "Términos de uso", href: "#" },
  { label: "Política de privacidad", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Store className="size-5 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Catálogo Online
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              La plataforma donde vendedores y compradores se conectan a través
              de catálogos de productos digitales.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Plataforma</h3>
            <ul className="flex flex-col gap-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Soporte</h3>
            <ul className="flex flex-col gap-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            &copy; {currentYear} Catálogo Online. Hecho con{" "}
            <Heart className="size-3 fill-primary text-primary" /> para
            vendedores independientes.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Powered by Supabase
            </span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
