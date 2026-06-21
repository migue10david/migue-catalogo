export default function CatalogsSkeleton() {
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