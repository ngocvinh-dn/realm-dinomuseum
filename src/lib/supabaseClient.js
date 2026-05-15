// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

const emptyResult = { data: null, error: null };

const createMockQuery = () => {
  const query = {
    select: () => query,
    order: () => query,
    limit: () => query,
    eq: () => query,
    single: async () => emptyResult,
    maybeSingle: async () => emptyResult,
    then: (resolve, reject) =>
      Promise.resolve({ data: [], error: null }).then(resolve, reject),
    catch: (reject) => Promise.resolve({ data: [], error: null }).catch(reject),
  };

  return query;
};

const createMockSupabase = () => ({
  from: () => createMockQuery(),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({
      error: { message: 'Supabase is not configured' },
    }),
    signUp: async () => ({
      error: { message: 'Supabase is not configured' },
    }),
  },
});

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY/VITE_SUPABASE_ANON_KEY. Using a no-op client.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : createMockSupabase();
