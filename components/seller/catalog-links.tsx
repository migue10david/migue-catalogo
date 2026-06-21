import { Facebook, Instagram, MessageCircle } from "lucide-react";

type Props = {
  facebookUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
};

export default function CatalogLinks({
  facebookUrl,
  instagramUrl,
  whatsappUrl,
}: Props) {
  const links = [
    facebookUrl
      ? {
          href: facebookUrl,
          label: "Facebook",
          icon: Facebook,
        }
      : null,
    instagramUrl
      ? {
          href: instagramUrl,
          label: "Instagram",
          icon: Instagram,
        }
      : null,
    whatsappUrl
      ? {
          href: whatsappUrl,
          label: "WhatsApp",
          icon: MessageCircle,
        }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: typeof Facebook;
  }>;

  if (links.length === 0) {
    return <span className="text-xs text-muted-foreground/60">Sin enlaces</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon className="size-3.5" />
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
