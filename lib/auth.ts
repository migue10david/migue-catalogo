import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "seller" | "user";

export type AuthProfile = {
  id: string;
  email: string | null;
  role: AppRole;
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
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      id: user.id,
      email: user.email ?? null,
      role: "user",
      isRoleConfigured: false,
    };
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
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
