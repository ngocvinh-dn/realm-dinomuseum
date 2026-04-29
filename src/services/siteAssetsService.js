import { supabase } from '../lib/supabaseClient';

const TABLE_CANDIDATES = ['site_assets', 'museum_assets', 'media_assets'];

export async function getSiteAssets() {
  for (const table of TABLE_CANDIDATES) {
    const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true }).limit(100);
    if (!error) return { table, data: data || [] };
  }
  return { table: null, data: [] };
}

export function pickAsset(items, key, fallback = null) {
  return items.find((item) => item.asset_key === key || item.slug === key || item.name === key)?.public_url || fallback;
}
