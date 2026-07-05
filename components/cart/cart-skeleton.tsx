export function CartSkeleton() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
        <div className="mb-12 h-4 w-28 animate-pulse bg-foreground/10" />

        {/* ── Cabecera brutalista ── */}
        <div className="mb-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="h-12 w-56 animate-pulse bg-foreground/10" />
            </div>
            <div className="hidden text-right sm:block">
              <div className="ml-auto h-2.5 w-10 animate-pulse bg-foreground/10" />
              <div className="mt-1.5 ml-auto h-8 w-14 animate-pulse bg-foreground/10" />
            </div>
          </div>
          <div className="mt-3 h-3 w-48 animate-pulse bg-foreground/10" />
          <div className="mt-6 border-t-[3px] border-foreground/10" />
        </div>

        {/* ── Capítulos / grupos ── */}
        <div className="space-y-8">
          {[1, 2].map((group) => (
            <div key={group} className="border-[3px] border-foreground/10">
              {/* Header */}
              <div className="flex items-center gap-4 border-b-[3px] border-foreground/10 bg-foreground/[0.02] px-5 py-4 sm:px-6">
                <div className="h-14 w-14 animate-pulse bg-foreground/10" />
                <div className="space-y-2">
                  <div className="h-4 w-36 animate-pulse bg-foreground/10" />
                  <div className="h-2.5 w-24 animate-pulse bg-foreground/10" />
                </div>
                <div className="ml-auto h-9 w-28 animate-pulse bg-foreground/10" />
              </div>

              {/* Items */}
              <div>
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 border-b-2 border-foreground/5 px-5 py-4 last:border-b-0 sm:gap-5 sm:px-6 sm:py-5"
                  >
                    <div className="size-16 shrink-0 animate-pulse border-[2px] border-foreground/10 bg-foreground/5 sm:size-[72px]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-32 animate-pulse bg-foreground/10" />
                      <div className="h-2 w-20 animate-pulse bg-foreground/10" />
                      <div className="h-3 w-16 animate-pulse bg-foreground/10" />
                    </div>
                    <div className="flex items-center border-[2px] border-foreground/10">
                      <div className="size-9 animate-pulse bg-foreground/5" />
                      <div className="h-3.5 w-10 border-x-2 border-foreground/10 animate-pulse bg-foreground/10" />
                      <div className="size-9 animate-pulse bg-foreground/5" />
                    </div>
                    <div className="h-5 w-16 animate-pulse bg-foreground/10" />
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between border-t-[3px] border-foreground/10 bg-foreground/[0.02] px-5 py-3 sm:px-6">
                <div className="h-2.5 w-28 animate-pulse bg-foreground/10" />
                <div className="h-4 w-20 animate-pulse bg-foreground/10" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Total ── */}
        <div className="mt-10">
          <div className="border-[3px] border-foreground/10 bg-foreground/[0.04] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="h-2.5 w-28 animate-pulse bg-foreground/10" />
                <div className="h-2.5 w-36 animate-pulse bg-foreground/10" />
              </div>
              <div className="h-10 w-28 animate-pulse bg-foreground/10" />
            </div>
          </div>
          <div className="flex items-center justify-between border-[3px] border-t-0 border-foreground/10 bg-background px-6 py-3 sm:px-8">
            <div className="h-2.5 w-32 animate-pulse bg-foreground/10" />
            <div className="h-7 w-20 animate-pulse bg-foreground/10" />
          </div>
        </div>
      </div>
    </main>
  );
}
