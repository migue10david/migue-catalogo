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

export async function createBusinessCatalog(formData: FormData) {
  const profile = await requireRole("seller");
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
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
    description: description || null,
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
}
