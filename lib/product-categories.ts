import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export type BusinessCatalogProductCategory = {
  id: string;
  business_catalog_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getProductCategoriesForCatalogs(catalogIds: string[]) {
  if (catalogIds.length === 0) {
    return [] as BusinessCatalogProductCategory[];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_catalog_product_categories")
    .select("id, business_catalog_id, name, slug, is_active, created_at, updated_at")
    .in("business_catalog_id", catalogIds)
    .order("name", { ascending: true });

  if (error) {
    return [] as BusinessCatalogProductCategory[];
  }

  return (data ?? []) as BusinessCatalogProductCategory[];
}

export async function getActiveProductCategoriesForCatalog(catalogId: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_catalog_product_categories")
    .select("id, business_catalog_id, name, slug, is_active, created_at, updated_at")
    .eq("business_catalog_id", catalogId)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    return [] as BusinessCatalogProductCategory[];
  }

  return (data ?? []) as BusinessCatalogProductCategory[];
}
