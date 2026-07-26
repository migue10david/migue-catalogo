"use client";

import { Share2, Check, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";

type SocialLink = {
  href: string;
  label: string;
};

export function CatalogHeroActions({
  slug,
  name,
  links,
}: {
  slug: string;
  name: string;
  links: SocialLink[];
}) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/catalog/${slug}`
      : `/catalog/${slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: name, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const iconByLabel: Record<string, typeof Facebook> = {
    Facebook,
    Instagram,
    WhatsApp: MessageCircle,
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border/40 bg-background/85 px-4 py-2 text-sm text-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:bg-background hover:shadow-md hover:border-border/70"
      >
        {copied ? (
          <>
            <Check className="size-4" />
            Copiado
          </>
        ) : (
          <>
            <Share2 className="size-4" />
            Compartir
          </>
        )}
      </button>

      {links.length > 0 && (
        <div className="flex items-center gap-0.5 pl-1.5 border-l border-border/30">
          {links.map((link) => {
            const Icon = iconByLabel[link.label] || Facebook;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                title={link.label}
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground/70 transition-all hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-[18px]" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
