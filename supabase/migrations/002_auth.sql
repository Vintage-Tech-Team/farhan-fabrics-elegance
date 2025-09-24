-- Profiles table linked to auth.users
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','user')),
  created_at timestamptz default now()
);

-- Ensure RLS is enabled
alter table profiles enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table sections enable row level security;
alter table products enable row level security;
alter table filters enable row level security;
alter table product_filters enable row level security;

-- Helper function to check admin
create or replace function is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists (select 1 from profiles p where p.id = uid and p.role = 'admin');
$$;

-- Policies for profiles
drop policy if exists "Users can read own profile" on profiles;
create policy "Users can read own profile" on profiles
for select using (auth.uid() = id);

drop policy if exists "Admins manage profiles" on profiles;
create policy "Admins manage profiles" on profiles
for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Default role on signup = user (via SQL insert trigger alternative: upsert from app after auth)
-- If you want automatic insertion, you can use Supabase Auth hooks or a trigger on auth.users via Edge Functions.

-- Categories: admins full, others read
drop policy if exists "Public read categories" on categories;
create policy "Public read categories" on categories for select using (true);

drop policy if exists "Admins full categories" on categories;
create policy "Admins full categories" on categories for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Subcategories
drop policy if exists "Public read subcategories" on subcategories;
create policy "Public read subcategories" on subcategories for select using (true);

drop policy if exists "Admins full subcategories" on subcategories;
create policy "Admins full subcategories" on subcategories for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Sections
drop policy if exists "Public read sections" on sections;
create policy "Public read sections" on sections for select using (true);

drop policy if exists "Admins full sections" on sections;
create policy "Admins full sections" on sections for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Products
drop policy if exists "Users can read products" on products;
create policy "Users can read products" on products for select using (true);

drop policy if exists "Admins full products" on products;
create policy "Admins full products" on products for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Filters
drop policy if exists "Public read filters" on filters;
create policy "Public read filters" on filters for select using (true);

drop policy if exists "Admins full filters" on filters;
create policy "Admins full filters" on filters for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Product filters (mapping) - readable by all, modifiable by admins
drop policy if exists "Public read product_filters" on product_filters;
create policy "Public read product_filters" on product_filters for select using (true);

drop policy if exists "Admins full product_filters" on product_filters;
create policy "Admins full product_filters" on product_filters for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));


