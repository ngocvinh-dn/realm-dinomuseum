import { supabase } from '../lib/supabaseClient'

export async function getSceneAssets() {
  const { data, error } = await supabase
    .from('scene_assets')
    .select(`
      asset_url,
      triassic_fossil_url,
      jurassic_fossil_url,
      cretaceous_fossil_url
    `)
    .eq('key', 'main_museum')
    .single()

  if (error) {
    throw error
  }

  return data
}