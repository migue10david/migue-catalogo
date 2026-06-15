"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function submitSellerRequest(formData: FormData) {
  const profile = await requireRole("user");
  const notes = String(formData.get("notes") ?? "").trim();
  const supabase = await createClient();

  const { error } = await supabase.from("seller_subscription_requests").insert({
    user_id: profile.id,
    notes: notes || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/protected");
  revalidatePath("/admin");
}

export async function approveSellerRequest(formData: FormData) {
  await requireRole("admin");

  const requestId = String(formData.get("requestId") ?? "").trim();
  const adminNotes = String(formData.get("adminNotes") ?? "").trim();
  const supabase = await createClient();

  const { error } = await supabase.rpc("approve_seller_subscription_request", {
    p_request_id: requestId,
    p_admin_notes: adminNotes || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/protected");
  revalidatePath("/seller");
}

export async function rejectSellerRequest(formData: FormData) {
  await requireRole("admin");

  const requestId = String(formData.get("requestId") ?? "").trim();
  const adminNotes = String(formData.get("adminNotes") ?? "").trim();
  const supabase = await createClient();

  const { error } = await supabase.rpc("reject_seller_subscription_request", {
    p_request_id: requestId,
    p_admin_notes: adminNotes || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/protected");
}
