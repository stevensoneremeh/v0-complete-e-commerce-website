-- Complete Production Setup for ABL Natasha Enterprises
-- This script sets up all necessary tables, policies, and admin account

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Nigeria',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  price_usd DECIMAL(10,2),
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  guest_email TEXT,
  guest_name TEXT,
  guest_phone TEXT,
  total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  guest_id TEXT,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id),
  UNIQUE(guest_id, product_id)
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  guest_id TEXT,
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id),
  UNIQUE(guest_id, product_id)
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create real_estate_properties table
CREATE TABLE IF NOT EXISTS public.real_estate_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('apartment', 'villa', 'penthouse', 'loft')),
  price DECIMAL(10,2) NOT NULL,
  price_usd DECIMAL(10,2),
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'Nigeria',
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm INTEGER,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create real_estate_bookings table
CREATE TABLE IF NOT EXISTS public.real_estate_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES real_estate_properties(id),
  user_id UUID REFERENCES auth.users(id),
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference TEXT,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('profiles', 'categories', 'products', 'orders', 'order_items', 'cart_items', 'wishlist_items', 'product_reviews', 'real_estate_properties', 'real_estate_bookings')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', policy_record.policyname, policy_record.schemaname, policy_record.tablename);
    END LOOP;
END $$;

-- Create profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin policies for profiles
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

-- Public read policies for main content
CREATE POLICY "categories_public_select" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "products_public_select" ON public.products FOR SELECT USING (true);
CREATE POLICY "properties_public_select" ON public.real_estate_properties FOR SELECT USING (is_available = true);

-- Admin policies for content management
CREATE POLICY "categories_admin_all" ON public.categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "products_admin_all" ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "properties_admin_all" ON public.real_estate_properties FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

-- User-specific policies
CREATE POLICY "orders_user_select" ON public.orders FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "orders_user_insert" ON public.orders FOR INSERT WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

CREATE POLICY "orders_admin_all" ON public.orders FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "cart_items_user_all" ON public.cart_items FOR ALL USING (
  auth.uid() = user_id OR user_id IS NULL OR
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "wishlist_items_user_all" ON public.wishlist_items FOR ALL USING (
  auth.uid() = user_id OR user_id IS NULL OR
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "bookings_user_select" ON public.real_estate_bookings FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "bookings_user_insert" ON public.real_estate_bookings FOR INSERT WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

CREATE POLICY "bookings_admin_all" ON public.real_estate_bookings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

-- Order items policies
CREATE POLICY "order_items_user_select" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id AND (user_id = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'talktostevenson@gmail.com'
      )
    )
  )
);

CREATE POLICY "order_items_user_insert" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id AND user_id = auth.uid()
  )
);

-- Reviews policies
CREATE POLICY "reviews_public_select" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "reviews_user_insert" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_user_update" ON public.product_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_admin_all" ON public.product_reviews FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

-- Create trigger for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE WHEN NEW.email = 'talktostevenson@gmail.com' THEN 'admin' ELSE 'user' END,
    CASE WHEN NEW.email = 'talktostevenson@gmail.com' THEN true ELSE false END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO public.categories (name, description, image_url, sort_order) VALUES
('Perfumes', 'Luxury fragrances and premium perfumes', '/luxury-perfume-bottles-elegant-display.jpg', 1),
('Wigs', 'Premium human hair wigs and extensions', '/premium-human-hair-wigs-luxury-salon-display.jpg', 2),
('Cars', 'Luxury vehicles and premium automobiles', '/luxury-sports-car-showroom-premium-vehicles.jpg', 3),
('Wines', 'Fine wines and premium spirits collection', '/premium-wine-collection-luxury-bottles-cellar.jpg', 4),
('Body Creams', 'Luxury skincare and premium cosmetics', '/luxury-skincare-products-premium-cosmetics-spa.jpg', 5),
('Jewelry', 'Fine jewelry and luxury accessories', '/luxury-jewelry-diamonds-gold-elegant-display.jpg', 6)
ON CONFLICT (name) DO NOTHING;

-- Ensure admin profile exists for the specified email
INSERT INTO public.profiles (id, email, full_name, role, is_admin)
VALUES (
  uuid_generate_v4(),
  'talktostevenson@gmail.com',
  'Admin User',
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_admin = true,
  updated_at = NOW();

COMMIT;
