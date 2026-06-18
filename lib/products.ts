import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export type BusinessCatalogProduct = {
  id: string;
  business_catalog_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getProductsForCatalogs(catalogIds: string[]) {
  if (catalogIds.length === 0) {
    return [] as BusinessCatalogProduct[];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_catalog_products")
    .select(
      "id, business_catalog_id, name, description, price, image_url, is_active, created_at, updated_at",
    )
    .in("business_catalog_id", catalogIds)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as BusinessCatalogProduct[];
  }

  return (data ?? []) as BusinessCatalogProduct[];
}

export async function getActiveProductsForCatalog(catalogId: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_catalog_products")
    .select(
      "id, business_catalog_id, name, description, price, image_url, is_active, created_at, updated_at",
    )
    .eq("business_catalog_id", catalogId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as BusinessCatalogProduct[];
  }

  return (data ?? []) as BusinessCatalogProduct[];
}
