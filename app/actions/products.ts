"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const BUSINESS_CATALOG_MEDIA_BUCKET = "business-catalog-media";

function slugifyCategoryName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadProductImage(file: File | null, ownerId: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const supabase = await createClient();
  const safeFileName = sanitizeFileName(file.name || "product.webp");
  const filePath = `${ownerId}/products/${Date.now()}-${safeFileName}`;

  const { error } = await supabase.storage
    .from(BUSINESS_CATALOG_MEDIA_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(BUSINESS_CATALOG_MEDIA_BUCKET)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  };
}

async function getOwnedCatalog(businessCatalogId: string, ownerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select("id")
    .eq("id", businessCatalogId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Catalog not found");
  }

  return data;
}

async function ensureOwnedProductCategory(
  productCategoryId: string,
  businessCatalogId: string,
  ownerId: string,
) {
  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("business_catalog_product_categories")
    .select("id, business_catalog_id")
    .eq("id", productCategoryId)
    .eq("business_catalog_id", businessCatalogId)
    .maybeSingle();

  if (error || !category) {
    throw new Error("Product category is invalid for the selected catalog");
  }

  await getOwnedCatalog(businessCatalogId, ownerId);
  return category;
}

export async function createBusinessCatalogProduct(formData: FormData) {
  const profile = await requireRole("seller");
  const supabase = await createClient();

  const businessCatalogId = String(
    formData.get("business_catalog_id") ?? "",
  ).trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageFile = formData.get("image_file");
  const priceRaw = String(formData.get("price") ?? "").trim();
  const productCategoryId = String(
    formData.get("product_category_id") ?? "",
  ).trim();
  const price = Number(priceRaw);

  if (!businessCatalogId) {
    throw new Error("Catalog is required");
  }

  if (!name) {
    throw new Error("Product name is required");
  }

  if (!productCategoryId) {
    throw new Error("Product category is required");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a valid non-negative number");
  }

  await ensureOwnedProductCategory(
    productCategoryId,
    businessCatalogId,
    profile.id,
  );

  const uploadedImage = await uploadProductImage(
    imageFile instanceof File ? imageFile : null,
    profile.id,
  );

  const { error } = await supabase.from("business_catalog_products").insert({
    business_catalog_id: businessCatalogId,
    product_category_id: productCategoryId,
    name,
    description: description || null,
    price,
    image_url: uploadedImage?.publicUrl ?? null,
    is_active: true,
  });

  if (error) {
    if (uploadedImage?.path) {
      await supabase.storage
        .from(BUSINESS_CATALOG_MEDIA_BUCKET)
        .remove([uploadedImage.path]);
    }

    throw new Error(error.message);
  }

  revalidatePath("/seller");
  revalidatePath("/seller/products");
}

export async function createBusinessCatalogProductCategory(formData: FormData) {
  const profile = await requireRole("seller");
  const supabase = await createClient();

  const businessCatalogId = String(
    formData.get("business_catalog_id") ?? "",
  ).trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!businessCatalogId) {
    throw new Error("Catalog is required");
  }

  if (!name) {
    throw new Error("Category name is required");
  }

  await getOwnedCatalog(businessCatalogId, profile.id);

  const slug = slugifyCategoryName(name);

  if (!slug) {
    throw new Error("Category name is invalid");
  }

  const { error } = await supabase
    .from("business_catalog_product_categories")
    .insert({
      business_catalog_id: businessCatalogId,
      name,
      slug,
      is_active: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/seller");
  revalidatePath("/seller/products");
}
