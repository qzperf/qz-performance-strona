-- Uruchom w Supabase SQL Editor. Klucz service_role zostaje wyłącznie na serwerze.
create table if not exists public.zbs_settings (id text primary key, data jsonb not null);
create table if not exists public.zbs_products (id text primary key, data jsonb not null);
create table if not exists public.zbs_reviews (id uuid primary key, data jsonb not null);
create table if not exists public.zbs_messages (id uuid primary key, data jsonb not null);
create table if not exists public.zbs_rate_limits (key text primary key, count integer not null, expires_at timestamptz not null);
alter table public.zbs_settings enable row level security;
alter table public.zbs_products enable row level security;
alter table public.zbs_reviews enable row level security;
alter table public.zbs_messages enable row level security;
alter table public.zbs_rate_limits enable row level security;
create or replace function public.zbs_rate_limit(bucket_key text, max_count int, window_seconds int)
returns boolean language plpgsql security definer set search_path = public as $$
declare current_count integer;
begin
  delete from public.zbs_rate_limits where expires_at < now();
  insert into public.zbs_rate_limits(key, count, expires_at) values (bucket_key, 1, now() + make_interval(secs => window_seconds))
  on conflict (key) do update set count = zbs_rate_limits.count + 1
  returning count into current_count;
  return current_count <= max_count;
end; $$;
revoke all on function public.zbs_rate_limit(text,int,int) from public, anon, authenticated;
grant execute on function public.zbs_rate_limit(text,int,int) to service_role;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('publications', 'publications', false, 536870912, array['application/pdf','application/epub+zip','audio/mpeg','audio/mp4','audio/x-m4a','application/zip','application/x-zip-compressed']) on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 10485760, array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
