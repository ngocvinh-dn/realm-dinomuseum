import { supabase } from "../lib/supabaseClient";

export async function getDinosaurs() {
  const { data, error } = await supabase
    .from("dinosaurs")
    .select(`
      id,
      era_id,
      scientific_name,
      slug,
      common_name_vi,
      common_name_en,
      diet,
      length_m,
      height_m,
      weight_kg,
      habitat_vi,
      habitat_en,
      description_vi,
      description_en,
      discovery_location,
      image_url,
      fossil_model_url,
      revived_model_url,
      eras (
        slug,
        name_vi,
        name_en
      ),
      dinosaur_facts (
        id,
        fact_type,
        content_vi,
        content_en,
        order_index
      )
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching dinosaurs:", error);
    throw error;
  }

  return data.map((dino) => ({
    ...dino,
    dinosaur_facts: [...(dino.dinosaur_facts || [])].sort(
      (a, b) => a.order_index - b.order_index
    ),
  }));
}