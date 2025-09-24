-- Enable required extensions
create extension if not exists pgcrypto;

-- Updated_at trigger helper
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1. Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  slug text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_categories_updated
before update on categories
for each row execute procedure set_updated_at();

-- 2. Subcategories
create table if not exists subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  description text,
  slug text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(category_id, slug)
);
create index if not exists idx_subcategories_category on subcategories(category_id);
create trigger trg_subcategories_updated
before update on subcategories
for each row execute procedure set_updated_at();

-- 3. Sections
create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  subcategory_id uuid references subcategories(id) on delete cascade,
  name text not null,
  description text,
  slug text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(subcategory_id, slug)
);
create index if not exists idx_sections_subcategory on sections(subcategory_id);
create trigger trg_sections_updated
before update on sections
for each row execute procedure set_updated_at();

-- 4. Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references sections(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  sku text unique,
  in_stock boolean default true,
  images text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_products_section on products(section_id);
create index if not exists idx_products_price on products(price);
create index if not exists idx_products_in_stock on products(in_stock);
create trigger trg_products_updated
before update on products
for each row execute procedure set_updated_at();

-- 5. Filters
create table if not exists filters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('text','number','boolean','select')),
  created_at timestamptz default now()
);

-- 6. Product_Filters
create table if not exists product_filters (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  filter_id uuid references filters(id) on delete cascade,
  value text not null
);
create index if not exists idx_product_filters_product on product_filters(product_id);
create index if not exists idx_product_filters_filter on product_filters(filter_id);


