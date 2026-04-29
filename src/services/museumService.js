import { supabase } from "../lib/supabaseClient";

const mainMuseumSelectFields = `
  id,
  key,
  name,
  asset_url,
  asset_type,
  created_at
`;

const eraPreviewSelectFields = `
  id,
  slug,
  name_vi,
  name_en,
  description_vi,
  description_en,
  preview_model_url,
  environment_url,
  order_index
`;

export async function getMainMuseumAsset() {
  const { data, error } = await supabase
    .from("scene_assets")
    .select(mainMuseumSelectFields)
    .eq("key", "main_museum")
    .single();

  if (error) {
    console.error("Error fetching main museum asset:", error);
    throw error;
  }

  return data;
}

export async function getMuseumEraPreviews() {
  const { data, error } = await supabase
    .from("eras")
    .select(eraPreviewSelectFields)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching museum era previews:", error);
    throw error;
  }

  return data || [];
}

export async function getMainMuseumScene() {
  const [museumAsset, eraPreviews] = await Promise.all([
    getMainMuseumAsset(),
    getMuseumEraPreviews(),
  ]);

  return {
    museumAsset,
    eraPreviews,
  };
}