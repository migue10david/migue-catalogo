import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "seller" | "user";

export type AuthProfile = {
  id: string;
  email: string | null;
  role: AppRole;
  product_limit: number;
  catalog_limit: number;
  isRoleConfigured: boolean;
};

export async function getCurrentUserProfile(): Promise<AuthProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role, product_limit, catalog_limit")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      id: user.id,
      email: user.email ?? null,
      role: "user",
      product_limit: 0,
      catalog_limit: 0,
      isRoleConfigured: false,
    };
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    product_limit: profile.product_limit ?? 0,
    catalog_limit: profile.catalog_limit ?? 0,
    isRoleConfigured: true,
  };
}

export async function requireUser() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  return profile;
}

export async function requireRole(allowedRoles: AppRole | AppRole[]) {
  const profile = await requireUser();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(profile.role)) {
    redirect("/protected");
  }

  return profile;
}
