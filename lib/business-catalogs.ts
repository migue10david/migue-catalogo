import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export type BusinessCatalog = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getLatestActiveBusinessCatalogs(limit = 6) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select(
      "id, owner_id, name, description, logo_url, cover_url, is_active, created_at, updated_at",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [] as BusinessCatalog[];
  }

  return (data ?? []) as BusinessCatalog[];
}

export async function getActiveBusinessCatalogById(id: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select(
      "id, owner_id, name, description, logo_url, cover_url, is_active, created_at, updated_at",
    )
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    return null;
  }

  return (data as BusinessCatalog | null) ?? null;
}

export async function getBusinessCatalogs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select(
      "id, owner_id, name, description, logo_url, cover_url, is_active, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return [] as BusinessCatalog[];
  }

  return (data ?? []) as BusinessCatalog[];
}

export async function getBusinessCatalogsForOwner(ownerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select(
      "id, owner_id, name, description, logo_url, cover_url, is_active, created_at, updated_at",
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as BusinessCatalog[];
  }

  return (data ?? []) as BusinessCatalog[];
}
