import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { BusinessCategory } from "@/lib/business-categories";
import type { Province } from "@/lib/provinces";

export type BusinessCatalog = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
  province_id: number | null;
  province: Province | null;
  business_category_id: number | null;
  business_category: Pick<BusinessCategory, "id" | "name" | "slug"> | null;
  logo_url: string | null;
  cover_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type RawBusinessCatalog = Omit<BusinessCatalog, "province" | "business_category"> & {
  province: Province | Province[] | null;
  business_category:
    | Pick<BusinessCategory, "id" | "name" | "slug">
    | Pick<BusinessCategory, "id" | "name" | "slug">[]
    | null;
};

const BUSINESS_CATALOG_SELECT = `
  id,
  owner_id,
  name,
  slug,
  description,
  address,
  phone,
  facebook_url,
  instagram_url,
  whatsapp_url,
  province_id,
  province:provinces(id, name, slug),
  business_category_id,
  business_category:business_categories(id, name, slug),
  logo_url,
  cover_url,
  is_active,
  created_at,
  updated_at
`;

function normalizeBusinessCatalog(catalog: RawBusinessCatalog): BusinessCatalog {
  const province = Array.isArray(catalog.province)
    ? (catalog.province[0] ?? null)
    : catalog.province;
  const businessCategory = Array.isArray(catalog.business_category)
    ? (catalog.business_category[0] ?? null)
    : catalog.business_category;

  return {
    ...catalog,
    province,
    business_category: businessCategory,
  };
}

export async function getLatestActiveBusinessCatalogs(limit = 6) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select(BUSINESS_CATALOG_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [] as BusinessCatalog[];
  }

  return ((data ?? []) as RawBusinessCatalog[]).map(normalizeBusinessCatalog);
}

export async function getActiveBusinessCatalogBySlug(slug: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select(BUSINESS_CATALOG_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data ? normalizeBusinessCatalog(data as RawBusinessCatalog) : null;
}

export async function getActiveBusinessCatalogById(id: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select(BUSINESS_CATALOG_SELECT)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data ? normalizeBusinessCatalog(data as RawBusinessCatalog) : null;
}

export type PublicCatalogFilters = {
  search?: string;
  provinceId?: number;
  businessCategoryId?: number;
  page?: number;
  pageSize?: number;
};

export type PublicCatalogsResult = {
  catalogs: BusinessCatalog[];
  totalCount: number;
};

export async function getPublicCatalogs(filters: PublicCatalogFilters = {}) {
  const supabase = createPublicClient();
  const {
    search,
    provinceId,
    businessCategoryId,
    page = 1,
    pageSize = 12,
  } = filters;

  let matchingCatalogIds: string[] = [];

  if (search) {
    const { data: matchingProducts } = await supabase
      .from("business_catalog_products")
      .select("business_catalog_id")
      .ilike("name", `%${search}%`);

    matchingCatalogIds = [
      ...new Set(matchingProducts?.map((p) => p.business_catalog_id) ?? []),
    ];
  }

  let query = supabase
    .from("business_catalogs")
    .select(BUSINESS_CATALOG_SELECT, { count: "exact" })
    .eq("is_active", true);

  if (search) {
    const conditions = [`name.ilike.%${search}%`];
    if (matchingCatalogIds.length > 0) {
      conditions.push(`id.in.(${matchingCatalogIds.join(",")})`);
    }
    query = query.or(conditions.join(","));
  }

  if (provinceId) {
    query = query.eq("province_id", provinceId);
  }

  if (businessCategoryId) {
    query = query.eq("business_category_id", businessCategoryId);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return { catalogs: [], totalCount: 0 };
  }

  return {
    catalogs: ((data ?? []) as RawBusinessCatalog[]).map(
      normalizeBusinessCatalog,
    ),
    totalCount: count ?? 0,
  };
}

export async function getBusinessCatalogs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select(BUSINESS_CATALOG_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as BusinessCatalog[];
  }

  return ((data ?? []) as RawBusinessCatalog[]).map(normalizeBusinessCatalog);
}

export async function getBusinessCatalogsForOwner(ownerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select(BUSINESS_CATALOG_SELECT)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as BusinessCatalog[];
  }

  return ((data ?? []) as RawBusinessCatalog[]).map(normalizeBusinessCatalog);
}
