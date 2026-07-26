import { type LucideIcon } from "lucide-react";

type Detail = {
  label: string;
  value: string;
};

type AdminPageIntroProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  details?: Detail[];
};

export function AdminPageIntro({
  title,
  description,
  icon: Icon,
  details = [],
}: AdminPageIntroProps) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
        </div>
      </div>

      {details.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="rounded-md border bg-card px-3 py-2 text-xs shadow-xs"
            >
              <span className="text-muted-foreground">{detail.label}: </span>
              <span className="font-medium text-foreground">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
