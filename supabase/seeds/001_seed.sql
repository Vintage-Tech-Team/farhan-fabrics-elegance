-- Seed categories
insert into categories (name, description, slug) values
  ('Men', 'Men''s clothing and fabrics', 'men'),
  ('Women', 'Women''s clothing and fabrics', 'women'),
  ('Kids', 'Kids'' clothing and fabrics', 'kids')
on conflict do nothing;

-- Create subcategories: Summer, Winter for each category
with cat as (
  select id, slug from categories where slug in ('men','women','kids')
)
insert into subcategories (category_id, name, description, slug)
select id, 'Summer', 'Summer collection', 'summer' from cat
union all
select id, 'Winter', 'Winter collection', 'winter' from cat
on conflict do nothing;

-- Create sections: Cotton, Lawn for each subcategory
with sub as (
  select id from subcategories
)
insert into sections (subcategory_id, name, description, slug)
select id, 'Cotton', 'Cotton section', 'cotton' from sub
union all
select id, 'Lawn', 'Lawn section', 'lawn' from sub
on conflict do nothing;

-- Create basic filters
insert into filters (name, type) values
  ('Color', 'select'),
  ('Size', 'select'),
  ('Fabric Material', 'text')
on conflict do nothing;

-- Create 5 products per section with random-like data
do $$
declare
  s record;
  i int;
  product_id uuid;
  colors text[] := array['Red','Blue','Green','Black','White','Brown'];
  sizes text[] := array['XS','S','M','L','XL'];
  materials text[] := array['Cotton','Lawn','Khaddar','Silk'];
  color_filter uuid;
  size_filter uuid;
  material_filter uuid;
begin
  select id into color_filter from filters where name = 'Color' limit 1;
  select id into size_filter from filters where name = 'Size' limit 1;
  select id into material_filter from filters where name = 'Fabric Material' limit 1;

  for s in select id, name from sections loop
    for i in 1..5 loop
      insert into products (section_id, name, description, price, sku, in_stock, images)
      values (
        s.id,
        s.name || ' Fabric ' || i,
        'High quality ' || s.name || ' fabric product ' || i,
        round( (random()*4000 + 1000)::numeric, 2),
        'SKU-' || substr(md5(random()::text), 1, 8),
        (random() > 0.2),
        array['/images/sample-' || ((random()*5)::int + 1) || '.jpg']
      ) returning id into product_id;

      -- Assign at least 2 filters per product
      insert into product_filters (product_id, filter_id, value) values
        (product_id, color_filter, colors[ (random()* (array_length(colors,1)-1) + 1)::int ]),
        (product_id, size_filter, sizes[ (random()* (array_length(sizes,1)-1) + 1)::int ]),
        (product_id, material_filter, materials[ (random()* (array_length(materials,1)-1) + 1)::int ]);
    end loop;
  end loop;
end $$;


