import { createPublicClient } from "@/lib/supabase/public";

export type BusinessCategory = {
  id: number;
  name: string;
  slug: string;
  display_order: number;
};

export async function getBusinessCategories() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_categories")
    .select("id, name, slug, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    return [] as BusinessCategory[];
  }

  return (data ?? []) as BusinessCategory[];
}
