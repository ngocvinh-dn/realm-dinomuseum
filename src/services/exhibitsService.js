import { supabase } from "../lib/supabaseClient";

export async function getExhibitsByEraSlug(eraSlug) {
  if (!eraSlug) {
    throw new Error("Missing eraSlug");
  }

  const { data, error } = await supabase
    .from("exhibits")
    .select(
      `
      id,
      era_id,
      dinosaur_id,
      object_name,
      is_interactive,
      order_index,
      dinosaurs (
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
        is_featured,
        created_at,
        dinosaur_facts (
          id,
          dinosaur_id,
          fact_type_vi,
          fact_type_en,
          content_vi,
          content_en,
          order_index
        )
      ),
      eras!inner (
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
        environment_map_url,
        music_url,
        ambient_sound_url
      )
    `,
    )
    .eq("eras.slug", eraSlug)
    .eq("is_interactive", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("getExhibitsByEraSlug error:", error);
    throw error;
  }

  return (data || []).map((exhibit) => ({
    id: exhibit.id,
    era_id: exhibit.era_id,
    dinosaur_id: exhibit.dinosaur_id,
    object_name: exhibit.object_name,
    is_interactive: exhibit.is_interactive,
    order_index: exhibit.order_index,

    dinosaur: {
      ...exhibit.dinosaurs,
      facts: (exhibit.dinosaurs?.dinosaur_facts || []).sort(
        (a, b) => (a.order_index || 0) - (b.order_index || 0),
      ),
    },

    era: exhibit.eras,
  }));
}

export async function getExhibitByObjectName(objectName) {
  if (!objectName) {
    throw new Error("Missing objectName");
  }

  const { data, error } = await supabase
    .from("exhibits")
    .select(
      `
      id,
      era_id,
      dinosaur_id,
      object_name,
      is_interactive,
      order_index,
      dinosaurs (
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
        is_featured,
        created_at,
        dinosaur_facts (
          id,
          dinosaur_id,
          fact_type,
          content_vi,
          content_en,
          order_index
        )
      )
    `,
    )
    .eq("object_name", objectName)
    .maybeSingle();

  if (error) {
    console.error("getExhibitByObjectName error:", error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    era_id: data.era_id,
    dinosaur_id: data.dinosaur_id,
    object_name: data.object_name,
    is_interactive: data.is_interactive,
    order_index: data.order_index,

    dinosaur: {
      ...data.dinosaurs,
      facts: (data.dinosaurs?.dinosaur_facts || []).sort(
        (a, b) => (a.order_index || 0) - (b.order_index || 0),
      ),
    },
  };
}
