-- ============================================================
-- Migration: Cho phép đọc công khai (anon + authenticated)
-- các bảng dữ liệu hiển thị ngoài web bảo tàng
-- ============================================================

-- ============================================================
-- Bảng: eras (các kỷ địa chất)
-- ============================================================
alter table public.eras enable row level security;

-- Xóa policy cũ nếu tồn tại để tránh lỗi
drop policy if exists "Đọc công khai bảng eras" on public.eras;

create policy "Đọc công khai bảng eras"
  on public.eras
  for select
  to anon, authenticated
  using (true);

-- ============================================================
-- Bảng: dinosaurs (danh sách khủng long)
-- ============================================================
alter table public.dinosaurs enable row level security;

drop policy if exists "Đọc công khai bảng dinosaurs" on public.dinosaurs;

create policy "Đọc công khai bảng dinosaurs"
  on public.dinosaurs
  for select
  to anon, authenticated
  using (true);

-- ============================================================
-- Bảng: dinosaur_facts (sự kiện/fact của từng khủng long)
-- ============================================================
alter table public.dinosaur_facts enable row level security;

drop policy if exists "Đọc công khai bảng dinosaur_facts" on public.dinosaur_facts;

create policy "Đọc công khai bảng dinosaur_facts"
  on public.dinosaur_facts
  for select
  to anon, authenticated
  using (true);

-- ============================================================
-- Bảng: site_assets (tài nguyên trang web: ảnh, video, audio)
-- ============================================================
alter table if exists public.site_assets enable row level security;

drop policy if exists "Đọc công khai bảng site_assets" on public.site_assets;

create policy "Đọc công khai bảng site_assets"
  on public.site_assets
  for select
  to anon, authenticated
  using (true);

-- ============================================================
-- Cấp quyền truy cập Data API (REST) cho các bảng trên
-- (cần thiết nếu bảng được tạo ngoài schema mặc định)
-- ============================================================
grant select on public.eras to anon, authenticated;
grant select on public.dinosaurs to anon, authenticated;
grant select on public.dinosaur_facts to anon, authenticated;
