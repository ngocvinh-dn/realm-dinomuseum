import { supabase } from "../lib/supabaseClient";

const environmentSelectFields = `
  id,
  slug,
  name_vi,
  name_en,
  description_vi,
  description_en,
  period_start_mya,
  period_end_mya,
  order_index,
  background_image_url,
  environment_map_url
`;

export async function getEnvironments() {
  const { data, error } = await supabase
    .from("eras")
    .select(environmentSelectFields)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching environments:", error);
    throw error;
  }

  return data || [];
}

export async function getEnvironmentById(id) {
  if (!id) {
    throw new Error("Environment id is required");
  }

  const { data, error } = await supabase
    .from("eras")
    .select(environmentSelectFields)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching environment by id:", error);
    throw error;
  }

  return data;
}

export async function getEnvironmentBySlug(slug) {
  if (!slug) {
    throw new Error("Environment slug is required");
  }

  const { data, error } = await supabase
    .from("eras")
    .select(environmentSelectFields)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching environment by slug:", error);
    throw error;
  }

  return data;
}