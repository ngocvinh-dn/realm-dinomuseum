import { createClient } from '@supabase/supabase-js'

// Đọc cấu hình Supabase từ biến môi trường (file .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Khởi tạo và xuất Supabase client để dùng trong toàn bộ ứng dụng
export const supabase = createClient(supabaseUrl, supabaseKey)