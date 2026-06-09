import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Fetch tất cả bảo tàng khủng long từ Supabase
 * @returns {{ data: Array, source: string }}
 */
export const getMuseumLocations = async () => {
  if (!isSupabaseConfigured) {
    console.warn('[museums] Supabase chưa cấu hình — trả về mảng rỗng');
    return { data: [], source: 'fallback-no-config' };
  }

  try {
    const { data, error } = await supabase
      .from('museum_locations')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return { data: data || [], source: 'supabase' };
  } catch (err) {
    console.error('[museums] Lỗi fetch:', err.message);
    return { data: [], source: 'fallback-error' };
  }
};