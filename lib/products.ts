import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { BusinessCatalogProductCategory } from "@/lib/product-categories";

export type BusinessCatalogProduct = {
  id: string;
  business_catalog_id: string;
  product_category_id: string;
  product_category: Pick<BusinessCatalogProductCategory, "id" | "name" | "slug"> | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type RawBusinessCatalogProduct = Omit<BusinessCatalogProduct, "product_category"> & {
  product_category:
    | Pick<BusinessCatalogProductCategory, "id" | "name" | "slug">
    | Pick<BusinessCatalogProductCategory, "id" | "name" | "slug">[]
    | null;
};

const BUSINESS_CATALOG_PRODUCT_SELECT = `
  id,
  business_catalog_id,
  product_category_id,
  product_category:business_catalog_product_categories(id, name, slug),
  name,
  description,
  price,
  image_url,
  is_active,
  created_at,
  updated_at
`;

function normalizeProduct(product: RawBusinessCatalogProduct): BusinessCatalogProduct {
  const productCategory = Array.isArray(product.product_category)
    ? (product.product_category[0] ?? null)
    : product.product_category;

  return {
    ...product,
    product_category: productCategory,
  };
}

export async function getProductsForCatalogs(catalogIds: string[]) {
  if (catalogIds.length === 0) {
    return [] as BusinessCatalogProduct[];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_catalog_products")
    .select(BUSINESS_CATALOG_PRODUCT_SELECT)
    .in("business_catalog_id", catalogIds)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as BusinessCatalogProduct[];
  }

  return ((data ?? []) as RawBusinessCatalogProduct[]).map(normalizeProduct);
}

export async function getActiveProductsForCatalog(catalogId: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_catalog_products")
    .select(BUSINESS_CATALOG_PRODUCT_SELECT)
    .eq("business_catalog_id", catalogId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as BusinessCatalogProduct[];
  }

  return ((data ?? []) as RawBusinessCatalogProduct[]).map(normalizeProduct);
}
