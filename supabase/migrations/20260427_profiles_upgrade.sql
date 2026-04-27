-- 1. Xóa bảng leads cũ
drop table if exists leads;

-- 2. Thêm cột phone và has_ticket vào bảng profiles
alter table public.profiles
  add column if not exists phone text,
  add column if not exists has_ticket boolean not null default false;
