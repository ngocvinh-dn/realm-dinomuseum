import { supabase } from "../lib/supabaseClient";

const dinosaurSelectFields = `
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
    id,
    slug,
    name_vi,
    name_en,
    description_vi,
    description_en
  ),
  dinosaur_facts (
    id,
    fact_type,
    content_vi,
    content_en,
    order_index
  )
`;

function sortDinosaurFacts(dinosaur) {
  return {
    ...dinosaur,
    dinosaur_facts: [...(dinosaur.dinosaur_facts || [])].sort(
      (a, b) => a.order_index - b.order_index
    ),
  };
}

export async function getDinosaurs() {
  const { data, error } = await supabase
    .from("dinosaurs")
    .select(dinosaurSelectFields)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching dinosaurs:", error);
    return [];
  }

  return (data || []).map(sortDinosaurFacts);
}

export async function getDinosaurById(id) {
  if (!id) {
    throw new Error("Dinosaur id is required");
  }

  const { data, error } = await supabase
    .from("dinosaurs")
    .select(dinosaurSelectFields)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching dinosaur by id:", error);
    throw error;
  }

  return sortDinosaurFacts(data);
}

export async function getDinosaurBySlug(slug) {
  if (!slug) {
    throw new Error("Dinosaur slug is required");
  }

  const { data, error } = await supabase
    .from("dinosaurs")
    .select(dinosaurSelectFields)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching dinosaur by slug:", error);
    throw error;
  }

  return sortDinosaurFacts(data);
} 