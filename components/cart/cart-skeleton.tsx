export function CartSkeleton() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
        <div className="mb-12 h-4 w-28 animate-pulse rounded bg-muted" />

        <div className="mb-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="h-12 w-56 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="mt-3 h-3 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-6 border-t border-border" />
        </div>

        <div className="space-y-6">
          {[1, 2].map((group) => (
            <div key={group} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-4 border-b border-border/50 px-5 py-4 sm:px-6">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="ml-auto h-9 w-28 animate-pulse rounded-full bg-muted" />
              </div>

              <div>
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 border-b border-border/30 px-5 py-4 last:border-b-0 sm:gap-5 sm:px-6 sm:py-5"
                  >
                    <div className="size-14 shrink-0 animate-pulse rounded-xl bg-muted/60 sm:size-[72px]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-muted/40 p-1">
                      <div className="size-8 animate-pulse rounded-full bg-muted" />
                      <div className="h-3.5 w-8 animate-pulse rounded bg-muted" />
                      <div className="size-8 animate-pulse rounded-full bg-muted" />
                    </div>
                    <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-5 py-3 sm:px-6">
                <div className="h-2.5 w-28 animate-pulse rounded bg-muted" />
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                <div className="h-3 w-36 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-10 w-28 animate-pulse rounded bg-muted" />
            </div>
            <div className="mt-5 border-t border-border" />
            <div className="mt-5 flex items-center justify-between">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-7 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
