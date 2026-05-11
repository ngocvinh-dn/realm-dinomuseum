// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createMockQuery = () => ({
  select: () => createMockQuery(),
  order: () => createMockQuery(),
  limit: () => createMockQuery(),
  then: (resolve) => resolve({ data: [], error: null }),
});

const createMockSupabase = () => ({
  from: () => createMockQuery(),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ error: { message: 'Supabase chưa cấu hình' } }),
    signUp: async () => ({ error: { message: 'Supabase chưa cấu hình' } }),
  },
});

