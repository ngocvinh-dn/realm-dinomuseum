// import { createClient } from '@supabase/supabase-js'

// // Đọc cấu hình Supabase từ biến môi trường (file .env)
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// // Khởi tạo và xuất Supabase client để dùng trong toàn bộ ứng dụng
// export const supabase = createClient(supabaseUrl, supabaseKey)


// src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);