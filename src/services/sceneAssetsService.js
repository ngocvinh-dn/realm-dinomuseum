import { supabase } from "../lib/supabaseClient";

const SCENE_ASSET_FIELDS = [
  "asset_url",
  "triassic_fossil_url",
  "jurassic_fossil_url",
  "cretaceous_fossil_url",
];

function normalizeSceneAssets(data) {
  if (!data?.asset_url) {
    throw new Error("Main museum asset is missing asset_url");
  }

  return {
    asset_url: data.asset_url,
    triassic_fossil_url: data.triassic_fossil_url || null,
    jurassic_fossil_url: data.jurassic_fossil_url || null,
    cretaceous_fossil_url: data.cretaceous_fossil_url || null,
  };
}

async function fetchSceneAssetsViaRest() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const params = new URLSearchParams({
    select: SCENE_ASSET_FIELDS.join(","),
    key: "eq.main_museum",
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/scene_assets?${params}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: "application/vnd.pgrst.object+json",
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to fetch museum scene assets");
  }

  const data = await response.json();
  return normalizeSceneAssets(data);
}

export async function getSceneAssets() {
  const selectFields = SCENE_ASSET_FIELDS.join(", ");

  try {
    const { data, error } = await supabase
      .from("scene_assets")
      .select(selectFields)
      .eq("key", "main_museum")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return normalizeSceneAssets(data);
    }
  } catch (error) {
    console.warn("Supabase client query for museum scene assets failed:", error);
  }

  return fetchSceneAssetsViaRest();
}
