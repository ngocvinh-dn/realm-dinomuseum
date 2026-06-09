import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { getDinosaurImage } from "../utils/dinosaurImage";

// ─── NORMALIZE ────────────────────────────────────────────────────────────────
// Cột Supabase → object chuẩn dùng trong app
//
//   name             tên khoa học   (Eoraptor lunensis)
//   common_name      tên VI         (Kẻ trộm bình minh)
//   common_name_en   tên EN         (Dawn Plunderer)
//   period           kỷ VI          (Tam Điệp)
//   period_en        kỷ EN          (Late Triassic)
//   age              niên đại VI    (231–228 triệu năm)
//   age_en           niên đại EN    (231–228 million years ago)
//   country          quốc gia
//   country_en       quốc gia EN
//   fossil_parts     hóa thạch VI
//   fossil_parts_en  hóa thạch EN
//   fun_fact         fun fact VI
//   fun_fact_en      fun fact EN

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeFossilLocation(row) {
  const latitude  = toNumber(row.latitude  ?? row.lat);
  const longitude = toNumber(row.longitude ?? row.lng ?? row.lon);
  if (latitude == null || longitude == null) return null;

  const scientificName = row.name || row.scientific_name || "";

  return {
    ...row,
    id:              row.id ?? `${scientificName}-${latitude}-${longitude}`,
    scientific_name: scientificName || null,

    // Tên hiển thị theo ngôn ngữ
    name:    row.common_name    || row.common_name_vi || scientificName || "Hóa thạch",
    name_en: row.common_name_en || row.name_en        || scientificName || "Fossil",

    latitude,
    longitude,
    image_url: row.image_url || getDinosaurImage(row) || null,

    country:    row.country    || null,
    country_en: row.country_en || row.country || null,

    location_province: row.location_province || row.province || row.state || null,

    period:    row.period    || null,
    period_en: row.period_en || null,

    age:    row.age    || null,
    age_en: row.age_en || null,

    discovery_year: row.discovery_year || null,

    fossil_parts:    row.fossil_parts    || null,
    fossil_parts_en: row.fossil_parts_en || null,

    description:    row.description    || null,
    description_en: row.description_en || null,

    fun_fact:    row.fun_fact    || null,
    fun_fact_en: row.fun_fact_en || null,
  };
}

// ─── SERVICE ──────────────────────────────────────────────────────────────────
export async function getFossilLocations() {
  if (!isSupabaseConfigured) {
    console.warn("[fossilLocations] Supabase chưa được cấu hình.");
    return { data: [], source: "no-env" };
  }

  const { data, error } = await supabase
    .from("fossil_locations")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("[fossilLocations] Lỗi fetch:", error);
    return { data: [], source: "error" };
  }

  const normalized = (data ?? []).map(normalizeFossilLocation).filter(Boolean);
  return { data: normalized, source: "supabase" };
}