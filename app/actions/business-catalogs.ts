"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const BUSINESS_CATALOG_MEDIA_BUCKET = "business-catalog-media";

function slugifyCatalogName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function generateCatalogSlug(name: string) {
  const supabase = await createClient();
  const baseSlug = slugifyCatalogName(name) || `catalog-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("business_catalogs")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

function isUniqueSlugViolation(error: { code?: string; message?: string }) {
  return (
    error.code === "23505" &&
    (error.message?.includes("business_catalogs_slug_unique") ?? false)
  );
}

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

async function ensureCatalogLimitAvailable(ownerId: string) {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("catalog_limit")
    .eq("id", ownerId)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Profile not found");
  }

  const { count: catalogCount, error: countError } = await supabase
    .from("business_catalogs")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", ownerId);

  if (countError) {
    throw new Error("Could not verify catalog limit");
  }

  const usedCatalogs = catalogCount ?? 0;
  const catalogLimit = profile.catalog_limit ?? 0;

  if (usedCatalogs >= catalogLimit) {
    throw new Error(
      "Has alcanzado tu límite de catálogos. Contacta al administrador para ampliar tu cupo.",
    );
  }

  return {
    catalogLimit,
    usedCatalogs,
    remainingCatalogSlots: Math.max(catalogLimit - usedCatalogs, 0),
  };
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
    .select("id, owner_id, slug, logo_url, cover_url")
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

  await ensureCatalogLimitAvailable(profile.id);

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

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = await generateCatalogSlug(name);
    const { error } = await supabase.from("business_catalogs").insert({
      owner_id: profile.id,
      name,
      slug,
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

    if (!error) {
      revalidatePath("/seller");
      revalidatePath("/seller/catalogs");
      revalidatePath("/");
      return;
    }

    if (isUniqueSlugViolation(error)) {
      lastError = new Error(
        "El slug del catálogo colisionó durante la creación. Reintentando...",
      );
      continue;
    }

    lastError = new Error(error.message);
    break;
  }

  const uploadedPaths = [uploadedLogo?.path, uploadedCover?.path].filter(
    Boolean,
  ) as string[];

  if (uploadedPaths.length > 0) {
    await supabase.storage
      .from(BUSINESS_CATALOG_MEDIA_BUCKET)
      .remove(uploadedPaths);
  }

  throw lastError ?? new Error("No se pudo crear el catálogo");
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
  revalidatePath(`/catalog/${currentCatalog.slug}`);
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
  revalidatePath(`/catalog/${currentCatalog.slug}`);
}
