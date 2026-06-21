import { createPublicClient } from "@/lib/supabase/public";

export type Province = {
  id: number;
  name: string;
  slug: string;
  display_order: number;
};

export async function getProvinces() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("provinces")
    .select("id, name, slug, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    return [] as Province[];
  }

  return (data ?? []) as Province[];
}
