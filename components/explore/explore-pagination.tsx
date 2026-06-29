"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type ExplorePaginationProps = {
  currentPage: number;
  totalPages: number;
};

function buildPageHref(searchParams: URLSearchParams, page: number) {
  const params = new URLSearchParams(searchParams.toString());
  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }
  const qs = params.toString();
  return `/explore${qs ? `?${qs}` : ""}`;
}

export function ExplorePagination({
  currentPage,
  totalPages,
}: ExplorePaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (page) =>
        page === 1 ||
        page === totalPages ||
        Math.abs(page - currentPage) <= 1,
    )
    .reduce<(number | "ellipsis")[]>((acc, page, index, arr) => {
      if (index > 0 && page - (arr[index - 1] as number) > 1) {
        acc.push("ellipsis");
      }
      acc.push(page);
      return acc;
    }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-muted-foreground/50">
        Página {currentPage} de {totalPages}
      </p>
      <Pagination>
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              href={buildPageHref(searchParams, currentPage - 1)}
              aria-disabled={currentPage <= 1}
              className={cn(
                "rounded-xl border-border/40 transition-all duration-200",
                currentPage <= 1
                  ? "pointer-events-none opacity-30"
                  : "hover:bg-muted/60 hover:border-border/60",
              )}
            />
          </PaginationItem>
          {pages.map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <span className="px-1.5 text-muted-foreground/30">…</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href={buildPageHref(searchParams, item)}
                  isActive={item === currentPage}
                  className={cn(
                    "rounded-xl size-9 p-0 text-sm transition-all duration-200",
                    item === currentPage
                      ? "border-primary/20 bg-primary/5 text-primary shadow-sm"
                      : "border-transparent hover:bg-muted/60 hover:border-border/40",
                  )}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href={buildPageHref(searchParams, currentPage + 1)}
              aria-disabled={currentPage >= totalPages}
              className={cn(
                "rounded-xl border-border/40 transition-all duration-200",
                currentPage >= totalPages
                  ? "pointer-events-none opacity-30"
                  : "hover:bg-muted/60 hover:border-border/60",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
