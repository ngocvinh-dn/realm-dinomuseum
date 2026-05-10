// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

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

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();