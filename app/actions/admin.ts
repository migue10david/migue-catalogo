"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function increaseUserProductLimit(formData: FormData) {
  await requireRole("admin");
  const supabase = await createClient();

  const userId = String(formData.get("userId") ?? "").trim();
  const incrementRaw = String(formData.get("incrementBy") ?? "").trim();
  const incrementBy = Number.parseInt(incrementRaw, 10);

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!Number.isInteger(incrementBy) || incrementBy <= 0) {
    throw new Error("Increment must be a positive integer");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, product_limit")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("User not found");
  }

  if (profile.role !== "seller") {
    throw new Error("Only sellers can receive product limit increases");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      product_limit: (profile.product_limit ?? 0) + incrementBy,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/seller/products");
}

export async function increaseUserCatalogLimit(formData: FormData) {
  await requireRole("admin");
  const supabase = await createClient();

  const userId = String(formData.get("userId") ?? "").trim();
  const incrementRaw = String(formData.get("incrementBy") ?? "").trim();
  const incrementBy = Number.parseInt(incrementRaw, 10);

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!Number.isInteger(incrementBy) || incrementBy <= 0) {
    throw new Error("Increment must be a positive integer");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, catalog_limit")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("User not found");
  }

  if (profile.role !== "seller") {
    throw new Error("Only sellers can receive catalog limit increases");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      catalog_limit: (profile.catalog_limit ?? 0) + incrementBy,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/seller/catalogs");
}

export async function toggleBusinessCatalogStatus(formData: FormData) {
  await requireRole("admin");
  const supabase = await createClient();

  const catalogId = String(formData.get("catalogId") ?? "").trim();
  const nextStateRaw = String(formData.get("nextState") ?? "").trim();
  const nextState = nextStateRaw === "true";

  if (!catalogId) {
    throw new Error("Catalog ID is required");
  }

  const { error } = await supabase
    .from("business_catalogs")
    .update({ is_active: nextState })
    .eq("id", catalogId);

  if (error) {
    throw new Error(error.message);
  }

  const { data: catalog } = await supabase
    .from("business_catalogs")
    .select("slug")
    .eq("id", catalogId)
    .maybeSingle();

  revalidatePath("/admin");
  revalidatePath("/admin/catalogs");
  revalidatePath("/");
  if (catalog?.slug) {
    revalidatePath(`/catalog/${catalog.slug}`);
  }
}
