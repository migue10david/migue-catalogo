"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const BUSINESS_CATALOG_MEDIA_BUCKET = "business-catalog-media";

function getOptionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function getRequiredProvinceId(formData: FormData) {
  const value = String(formData.get("province_id") ?? "").trim();

  if (!value) {
    throw new Error("Province is required");
  }

  const provinceId = Number.parseInt(value, 10);

  if (!Number.isInteger(provinceId) || provinceId <= 0) {
    throw new Error("Province is invalid");
  }

  return provinceId;
}

function getRequiredBusinessCategoryId(formData: FormData) {
  const value = String(formData.get("business_category_id") ?? "").trim();

  if (!value) {
    throw new Error("Business category is required");
  }

  const businessCategoryId = Number.parseInt(value, 10);

  if (!Number.isInteger(businessCategoryId) || businessCategoryId <= 0) {
    throw new Error("Business category is invalid");
  }

  return businessCategoryId;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadCatalogMedia(
  file: File | null,
  ownerId: string,
  kind: "logo" | "cover",
) {
  if (!file || file.size === 0) {
    return null;
  }

  const supabase = await createClient();
  const safeFileName = sanitizeFileName(file.name || `${kind}.bin`);
  const filePath = `${ownerId}/${kind}-${Date.now()}-${safeFileName}`;

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

function getStoragePathFromPublicUrl(publicUrl: string | null) {
  if (!publicUrl) {
    return null;
  }

  const marker = `/storage/v1/object/public/${BUSINESS_CATALOG_MEDIA_BUCKET}/`;
  const index = publicUrl.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(publicUrl.slice(index + marker.length));
}

async function getOwnedCatalog(catalogId: string, ownerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_catalogs")
    .select("id, owner_id, logo_url, cover_url")
    .eq("id", catalogId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Catalog not found");
  }

  return data;
}

export async function createBusinessCatalog(formData: FormData) {
  const profile = await requireRole("seller");
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = getOptionalText(formData, "description");
  const address = getOptionalText(formData, "address");
  const phone = getOptionalText(formData, "phone");
  const facebookUrl = getOptionalText(formData, "facebook_url");
  const instagramUrl = getOptionalText(formData, "instagram_url");
  const whatsappUrl = getOptionalText(formData, "whatsapp_url");
  const provinceId = getRequiredProvinceId(formData);
  const businessCategoryId = getRequiredBusinessCategoryId(formData);
  const logoFile = formData.get("logo_file");
  const coverFile = formData.get("cover_file");

  if (!name) {
    throw new Error("Name is required");
  }

  const uploadedLogo = await uploadCatalogMedia(
    logoFile instanceof File ? logoFile : null,
    profile.id,
    "logo",
  );
  const uploadedCover = await uploadCatalogMedia(
    coverFile instanceof File ? coverFile : null,
    profile.id,
    "cover",
  );

  const { error } = await supabase.from("business_catalogs").insert({
    owner_id: profile.id,
    name,
    description,
    address,
    phone,
    facebook_url: facebookUrl,
    instagram_url: instagramUrl,
    whatsapp_url: whatsappUrl,
    province_id: provinceId,
    business_category_id: businessCategoryId,
    logo_url: uploadedLogo?.publicUrl ?? null,
    cover_url: uploadedCover?.publicUrl ?? null,
    is_active: true,
  });

  if (error) {
    const uploadedPaths = [uploadedLogo?.path, uploadedCover?.path].filter(
      Boolean,
    ) as string[];

    if (uploadedPaths.length > 0) {
      await supabase.storage
        .from(BUSINESS_CATALOG_MEDIA_BUCKET)
        .remove(uploadedPaths);
    }

    throw new Error(error.message);
  }

  revalidatePath("/seller");
  revalidatePath("/seller/catalogs");
  revalidatePath("/");
}

export async function updateBusinessCatalog(formData: FormData) {
  const profile = await requireRole("seller");
  const supabase = await createClient();

  const catalogId = String(formData.get("catalog_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = getOptionalText(formData, "description");
  const address = getOptionalText(formData, "address");
  const phone = getOptionalText(formData, "phone");
  const facebookUrl = getOptionalText(formData, "facebook_url");
  const instagramUrl = getOptionalText(formData, "instagram_url");
  const whatsappUrl = getOptionalText(formData, "whatsapp_url");
  const provinceId = getRequiredProvinceId(formData);
  const businessCategoryId = getRequiredBusinessCategoryId(formData);
  const logoFile = formData.get("logo_file");
  const coverFile = formData.get("cover_file");

  if (!catalogId) {
    throw new Error("Catalog id is required");
  }

  if (!name) {
    throw new Error("Name is required");
  }

  const currentCatalog = await getOwnedCatalog(catalogId, profile.id);

  const uploadedLogo = await uploadCatalogMedia(
    logoFile instanceof File ? logoFile : null,
    profile.id,
    "logo",
  );
  const uploadedCover = await uploadCatalogMedia(
    coverFile instanceof File ? coverFile : null,
    profile.id,
    "cover",
  );

  const { error } = await supabase
    .from("business_catalogs")
    .update({
      name,
      description,
      address,
      phone,
      facebook_url: facebookUrl,
      instagram_url: instagramUrl,
      whatsapp_url: whatsappUrl,
      province_id: provinceId,
      business_category_id: businessCategoryId,
      logo_url: uploadedLogo?.publicUrl ?? currentCatalog.logo_url,
      cover_url: uploadedCover?.publicUrl ?? currentCatalog.cover_url,
    })
    .eq("id", catalogId)
    .eq("owner_id", profile.id);

  if (error) {
    const uploadedPaths = [uploadedLogo?.path, uploadedCover?.path].filter(
      Boolean,
    ) as string[];

    if (uploadedPaths.length > 0) {
      await supabase.storage
        .from(BUSINESS_CATALOG_MEDIA_BUCKET)
        .remove(uploadedPaths);
    }

    throw new Error(error.message);
  }

  const oldPathsToDelete = [
    uploadedLogo ? getStoragePathFromPublicUrl(currentCatalog.logo_url) : null,
    uploadedCover
      ? getStoragePathFromPublicUrl(currentCatalog.cover_url)
      : null,
  ].filter(Boolean) as string[];

  if (oldPathsToDelete.length > 0) {
    await supabase.storage
      .from(BUSINESS_CATALOG_MEDIA_BUCKET)
      .remove(oldPathsToDelete);
  }

  revalidatePath("/seller");
  revalidatePath("/seller/catalogs");
  revalidatePath("/");
  revalidatePath(`/catalog/${catalogId}`);
}

export async function deleteBusinessCatalog(formData: FormData) {
  const profile = await requireRole("seller");
  const supabase = await createClient();

  const catalogId = String(formData.get("catalog_id") ?? "").trim();

  if (!catalogId) {
    throw new Error("Catalog id is required");
  }

  const currentCatalog = await getOwnedCatalog(catalogId, profile.id);
  const { data: products } = await supabase
    .from("business_catalog_products")
    .select("image_url")
    .eq("business_catalog_id", catalogId);

  const { error } = await supabase
    .from("business_catalogs")
    .delete()
    .eq("id", catalogId)
    .eq("owner_id", profile.id);

  if (error) {
    throw new Error(error.message);
  }

  const storagePaths = [
    getStoragePathFromPublicUrl(currentCatalog.logo_url),
    getStoragePathFromPublicUrl(currentCatalog.cover_url),
    ...(products ?? []).map((product) =>
      getStoragePathFromPublicUrl(product.image_url),
    ),
  ].filter(Boolean) as string[];

  if (storagePaths.length > 0) {
    await supabase.storage
      .from(BUSINESS_CATALOG_MEDIA_BUCKET)
      .remove(storagePaths);
  }

  revalidatePath("/seller");
  revalidatePath("/seller/catalogs");
  revalidatePath("/");
  revalidatePath(`/catalog/${catalogId}`);
}
