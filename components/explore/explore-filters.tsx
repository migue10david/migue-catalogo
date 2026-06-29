"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Province } from "@/lib/provinces";
import type { BusinessCategory } from "@/lib/business-categories";
import { cn } from "@/lib/utils";

type ExploreFiltersProps = {
  provinces: Province[];
  businessCategories: BusinessCategory[];
};

export function ExploreFilters({
  provinces,
  businessCategories,
}: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearch = searchParams.get("search") ?? "";
  const currentProvince = searchParams.get("province") ?? "";
  const currentCategory = searchParams.get("category") ?? "";

  const activeFilters: Array<{ key: string; label: string; value: string }> = [];

  if (currentSearch) {
    activeFilters.push({ key: "search", label: `"${currentSearch}"`, value: currentSearch });
  }
  if (currentProvince) {
    const province = provinces.find((p) => String(p.id) === currentProvince);
    activeFilters.push({ key: "province", label: province?.name ?? currentProvince, value: currentProvince });
  }
  if (currentCategory) {
    const category = businessCategories.find((c) => String(c.id) === currentCategory);
    activeFilters.push({ key: "category", label: category?.name ?? currentCategory, value: currentCategory });
  }

  const hasActiveFilters = activeFilters.length > 0;

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/explore?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition],
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      updateParams("search", value);
    }, 300);
  };

  const removeFilter = (key: string) => {
    if (key === "search") {
      setSearchValue("");
    }
    updateParams(key, "");
  };

  const clearAllFilters = () => {
    setSearchValue("");
    startTransition(() => {
      router.push("/explore", { scroll: false });
    });
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <div
        className={cn(
          "relative flex items-center rounded-2xl border bg-background/80 px-4 transition-all duration-300 backdrop-blur-sm",
          isFocused
            ? "border-primary/30 shadow-lg shadow-primary/5 ring-2 ring-primary/10"
            : "border-border/60 shadow-sm hover:border-border hover:shadow-md",
        )}
      >
        <Search
          className={cn(
            "size-5 shrink-0 transition-colors duration-200",
            isFocused ? "text-primary" : "text-muted-foreground/50",
          )}
        />
        <input
          type="text"
          placeholder="Buscar catálogo o producto..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-muted-foreground/40"
        />
        {searchValue && (
          <button
            onClick={() => {
              setSearchValue("");
              updateParams("search", "");
            }}
            className="shrink-0 rounded-full p-1 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Selects row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          <SlidersHorizontal className="size-3.5" />
          <span className="hidden sm:inline">Filtros</span>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div className="relative">
            <select
              value={currentProvince}
              onChange={(e) => updateParams("province", e.target.value)}
              className={cn(
                "flex h-11 w-full appearance-none rounded-xl border bg-background/60 px-4 pr-9 text-sm backdrop-blur-sm transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:border-primary/30",
                currentProvince
                  ? "border-primary/25 bg-primary/5"
                  : "border-border/60 hover:border-border hover:bg-background/80",
              )}
            >
              <option value="">Todas las provincias</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={currentCategory}
              onChange={(e) => updateParams("category", e.target.value)}
              className={cn(
                "flex h-11 w-full appearance-none rounded-xl border bg-background/60 px-4 pr-9 text-sm backdrop-blur-sm transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:border-primary/30",
                currentCategory
                  ? "border-primary/25 bg-primary/5"
                  : "border-border/60 hover:border-border hover:bg-background/80",
              )}
            >
              <option value="">Todas las categorías</option>
              {businessCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="shrink-0 rounded-xl text-muted-foreground/60 hover:text-foreground"
          >
            <X className="mr-1 size-3.5" />
            Limpiar todo
          </Button>
        )}
      </div>

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => removeFilter(filter.key)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/10 hover:border-primary/30"
            >
              {filter.label}
              <X className="size-3 opacity-50 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
