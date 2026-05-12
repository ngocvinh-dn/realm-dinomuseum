import { supabase } from "../lib/supabaseClient";

const exhibitSelectFields = `
  id,
  dinosaur_id,
  era_id,
  position_x,
  position_y,
  position_z,
  rotation_y,
  scale,
  is_interactive,
  order_index,
  dinosaurs (
  id,
  scientific_name,
  slug,
  common_name_vi,
  common_name_en,
  fossil_model_url,
  revived_model_url,
  image_url,
  diet,
  length_m,
  height_m,
  weight_kg,
  description_vi,
  description_en,
  discovery_location,
  habitat_vi,
  habitat_en
)
`;

function normalizeExhibit(exhibit) {
  return {
    ...exhibit,
    position: [
      Number(exhibit.position_x ?? 0),
      Number(exhibit.position_y ?? 0),
      Number(exhibit.position_z ?? 0),
    ],
    rotation: [0, Number(exhibit.rotation_y ?? 0), 0],
    modelScale: Number(exhibit.scale ?? 1),
    isInteractive: Boolean(exhibit.is_interactive),
  };
}

export async function getExhibits() {
  const { data, error } = await supabase
    .from("exhibits")
    .select(exhibitSelectFields)
    .order("order_index", { ascending: true });

  if (error) throw error;

  return (data || []).map(normalizeExhibit);
}

export async function getExhibitsByEraId(eraId) {
  if (!eraId) {
    throw new Error("Era id is required");
  }

  const { data, error } = await supabase
    .from("exhibits")
    .select(exhibitSelectFields)
    .eq("era_id", eraId)
    .order("order_index", { ascending: true });

  if (error) throw error;

  return (data || []).map(normalizeExhibit);
}