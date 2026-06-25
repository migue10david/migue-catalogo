import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export type AdminUserProfile = {
  id: string;
  email: string | null;
  role: string;
  created_at: string;
  catalog_count: number;
  catalog_limit: number;
  remaining_catalog_slots: number;
  product_limit: number;
  product_count: number;
  remaining_product_slots: number;
};

export type AdminBusinessCatalog = {
  id: string;
  name: string;
  owner_email: string | null;
  owner_id: string;
  is_active: boolean;
  province: string | null;
  business_category: string | null;
  product_count: number;
  created_at: string;
};

export async function requireAdmin() {
  return requireRole("admin");
}

export async function getAllProfiles(): Promise<AdminUserProfile[]> {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, role, created_at, product_limit, catalog_limit")
    .order("created_at", { ascending: false });

  if (error || !profiles) {
    return [];
  }

  const profileIds = profiles.map((p) => p.id);

  const { data: catalogs } = await supabase
    .from("business_catalogs")
    .select("id, owner_id")
    .in("owner_id", profileIds.length > 0 ? profileIds : ["__none__"]);

  const catalogCounts = new Map<string, number>();
  for (const catalog of catalogs ?? []) {
    catalogCounts.set(
      catalog.owner_id,
      (catalogCounts.get(catalog.owner_id) ?? 0) + 1,
    );
  }

  const catalogOwnerById = new Map(
    (catalogs ?? []).map((catalog) => [catalog.id, catalog.owner_id]),
  );
  const catalogIds = (catalogs ?? []).map((catalog) => catalog.id);

  const { data: products } = await supabase
    .from("business_catalog_products")
    .select("business_catalog_id")
    .in("business_catalog_id", catalogIds.length > 0 ? catalogIds : ["__none__"]);

  const productCounts = new Map<string, number>();
  for (const product of products ?? []) {
    const ownerId = catalogOwnerById.get(product.business_catalog_id);
    if (!ownerId) continue;

    productCounts.set(
      ownerId,
      (productCounts.get(ownerId) ?? 0) + 1,
    );
  }

  return profiles.map((profile) => ({
    id: profile.id,
    email: profile.email,
    role: profile.role,
    created_at: profile.created_at,
    catalog_count: catalogCounts.get(profile.id) ?? 0,
    catalog_limit: profile.catalog_limit ?? 0,
    remaining_catalog_slots: Math.max(
      (profile.catalog_limit ?? 0) - (catalogCounts.get(profile.id) ?? 0),
      0,
    ),
    product_limit: profile.product_limit ?? 0,
    product_count: productCounts.get(profile.id) ?? 0,
    remaining_product_slots: Math.max(
      (profile.product_limit ?? 0) - (productCounts.get(profile.id) ?? 0),
      0,
    ),
  }));
}

export async function getAllCatalogsWithOwner(): Promise<AdminBusinessCatalog[]> {
  const supabase = await createClient();

  const { data: catalogs, error } = await supabase
    .from("business_catalogs")
    .select(
      `
      id,
      name,
      owner_id,
      is_active,
      created_at,
      province:provinces(name),
      business_category:business_categories(name),
      profiles!business_catalogs_owner_id_fkey(email)
    `,
    )
    .order("created_at", { ascending: false });

  if (error || !catalogs) {
    return [];
  }

  const catalogIds = catalogs.map((c) => c.id);

  const { data: products } = await supabase
    .from("business_catalog_products")
    .select("business_catalog_id")
    .in(
      "business_catalog_id",
      catalogIds.length > 0 ? catalogIds : ["__none__"],
    );

  const productCounts = new Map<string, number>();
  for (const product of products ?? []) {
    productCounts.set(
      product.business_catalog_id,
      (productCounts.get(product.business_catalog_id) ?? 0) + 1,
    );
  }

  return catalogs.map((catalog) => {
    const profile = Array.isArray(catalog.profiles)
      ? (catalog.profiles[0] ?? null)
      : catalog.profiles;
    const province = Array.isArray(catalog.province)
      ? (catalog.province[0] ?? null)
      : catalog.province;
    const category = Array.isArray(catalog.business_category)
      ? (catalog.business_category[0] ?? null)
      : catalog.business_category;

    return {
      id: catalog.id,
      name: catalog.name,
      owner_email: profile?.email ?? null,
      owner_id: catalog.owner_id,
      is_active: catalog.is_active,
      province: province?.name ?? null,
      business_category: category?.name ?? null,
      product_count: productCounts.get(catalog.id) ?? 0,
      created_at: catalog.created_at,
    };
  });
}
