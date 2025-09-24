-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  address TEXT,
  role TEXT CHECK (role IN ('customer','admin')) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sections table
CREATE TABLE public.sections (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fabrics table
CREATE TABLE public.fabrics (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  season TEXT CHECK (season IN ('summer','winter','all')) DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  discount_price NUMERIC(10,2),
  stock INT DEFAULT 0,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  section_id BIGINT REFERENCES sections(id) ON DELETE SET NULL,
  fabric_id BIGINT REFERENCES fabrics(id) ON DELETE SET NULL,
  gender TEXT CHECK (gender IN ('men','women','kids','unisex')),
  season TEXT CHECK (season IN ('summer','winter','all')) DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_images table
CREATE TABLE public.product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE
);

-- Create orders table
CREATE TABLE public.orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending','paid','shipped','completed','cancelled')) DEFAULT 'pending',
  total_amount NUMERIC(10,2),
  payment_method TEXT CHECK (payment_method IN ('cod','card','jazzcash','easypaisa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for public read access to catalog data
CREATE POLICY "Categories are viewable by everyone" ON public.categories
FOR SELECT USING (true);

CREATE POLICY "Sections are viewable by everyone" ON public.sections
FOR SELECT USING (true);

CREATE POLICY "Fabrics are viewable by everyone" ON public.fabrics
FOR SELECT USING (true);

CREATE POLICY "Products are viewable by everyone" ON public.products
FOR SELECT USING (true);

CREATE POLICY "Product images are viewable by everyone" ON public.product_images
FOR SELECT USING (true);

-- Create RLS policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for order_items (based on order ownership)
CREATE POLICY "Users can view their own order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create order items for their orders" ON public.order_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some initial data for categories, sections, and fabrics
INSERT INTO public.categories (name, slug) VALUES
('Men', 'men'),
('Women', 'women'),
('Kids', 'kids');

INSERT INTO public.sections (category_id, name, slug) VALUES
(1, 'Summer', 'men-summer'),
(1, 'Winter', 'men-winter'),
(1, 'Pret', 'men-pret'),
(1, 'Unstitched', 'men-unstitched'),
(2, 'Summer', 'women-summer'),
(2, 'Winter', 'women-winter'),
(2, 'Pret', 'women-pret'),
(2, 'Unstitched', 'women-unstitched'),
(3, 'Summer', 'kids-summer'),
(3, 'Winter', 'kids-winter');

INSERT INTO public.fabrics (name, season) VALUES
('Cotton', 'summer'),
('Lawn', 'summer'),
('Linen', 'summer'),
('Khaddar', 'winter'),
('Silk', 'all'),
('Chiffon', 'all'),
('Velvet', 'winter'),
('Wool', 'winter');