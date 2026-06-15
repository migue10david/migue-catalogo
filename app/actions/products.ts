"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const BUSINESS_CATALOG_MEDIA_BUCKET = "business-catalog-media";

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
  const price = Number(priceRaw);

  if (!businessCatalogId) {
    throw new Error("Catalog is required");
  }

  if (!name) {
    throw new Error("Product name is required");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a valid non-negative number");
  }

  const uploadedImage = await uploadProductImage(
    imageFile instanceof File ? imageFile : null,
    profile.id,
  );

  const { error } = await supabase.from("business_catalog_products").insert({
    business_catalog_id: businessCatalogId,
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
}
