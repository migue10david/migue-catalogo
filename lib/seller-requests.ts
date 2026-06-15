import { createClient } from "@/lib/supabase/server";

export type SellerSubscriptionStatus = "pending" | "approved" | "rejected";

export type SellerSubscriptionRequest = {
  id: string;
  user_id: string;
  status: SellerSubscriptionStatus;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export type PendingSellerRequest = SellerSubscriptionRequest & {
  user_email: string | null;
};

export async function getLatestSellerRequestForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seller_subscription_requests")
    .select("id, user_id, status, notes, admin_notes, created_at, reviewed_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data as SellerSubscriptionRequest | null;
}

export async function getPendingSellerRequests() {
  const supabase = await createClient();
  const { data: requests, error } = await supabase
    .from("seller_subscription_requests")
    .select("id, user_id, status, notes, admin_notes, created_at, reviewed_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error || !requests?.length) {
    return [] as PendingSellerRequest[];
  }

  const userIds = requests.map((request) => request.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email")
    .in("id", userIds);

  const emailsByUserId = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.email]),
  );

  return requests.map((request) => ({
    ...(request as SellerSubscriptionRequest),
    user_email: emailsByUserId.get(request.user_id) ?? null,
  }));
}
