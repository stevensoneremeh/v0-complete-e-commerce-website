
-- Complete Production Database Schema for ABL Natasha Enterprises
-- This script creates all necessary tables, RLS policies, and admin setup

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'Nigeria',
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    last_sign_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    compare_at_price DECIMAL(10,2),
    category_id UUID REFERENCES categories(id),
    sku TEXT UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    inventory_quantity INTEGER DEFAULT 0, -- For backward compatibility
    low_stock_threshold INTEGER DEFAULT 5,
    weight DECIMAL(8,2),
    dimensions TEXT,
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id),
    customer_id UUID REFERENCES profiles(id),
    guest_id UUID,
    guest_email TEXT,
    guest_name TEXT,
    guest_phone TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    payment_reference TEXT,
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'NGN',
    shipping_name TEXT,
    shipping_email TEXT,
    shipping_phone TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_country TEXT,
    shipping_postal_code TEXT,
    billing_name TEXT,
    billing_email TEXT,
    billing_phone TEXT,
    billing_address TEXT,
    billing_city TEXT,
    billing_country TEXT,
    billing_postal_code TEXT,
    tracking_number TEXT,
    notes TEXT,
    admin_notes TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    variant_name TEXT,
    sku TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    product_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    guest_id TEXT,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id),
    UNIQUE(guest_id, product_id)
);

-- Create real_estate_properties table
CREATE TABLE IF NOT EXISTS real_estate_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'apartment',
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'Nigeria',
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    square_feet INTEGER,
    lot_size INTEGER,
    year_built INTEGER,
    price_per_night DECIMAL(10,2),
    booking_price_per_night DECIMAL(10,2),
    price_per_month DECIMAL(10,2),
    cleaning_fee DECIMAL(10,2) DEFAULT 0,
    security_deposit DECIMAL(10,2) DEFAULT 0,
    amenities TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    rules TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    featured_image TEXT,
    virtual_tour_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_available_for_booking BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    min_stay_nights INTEGER DEFAULT 1,
    max_stay_nights INTEGER,
    max_guests INTEGER DEFAULT 2,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active',
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    location_details JSONB,
    minimum_stay_nights INTEGER DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create real_estate_bookings table
CREATE TABLE IF NOT EXISTS real_estate_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_reference TEXT NOT NULL UNIQUE,
    property_id UUID REFERENCES real_estate_properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    check_in_date TIMESTAMPTZ NOT NULL,
    check_out_date TIMESTAMPTZ NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    nights INTEGER NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    cleaning_fee DECIMAL(10,2) DEFAULT 0,
    service_fee DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_reference TEXT,
    special_requests TEXT,
    admin_notes TEXT,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hire_bookings table
CREATE TABLE IF NOT EXISTS hire_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_reference TEXT NOT NULL UNIQUE,
    service_type TEXT NOT NULL DEFAULT 'car',
    service_name TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    duration_hours INTEGER,
    pickup_location TEXT,
    dropoff_location TEXT,
    passengers INTEGER DEFAULT 1,
    price_per_hour DECIMAL(10,2),
    price_per_day DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_reference TEXT,
    special_requests TEXT,
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Create admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.is_admin = true OR profiles.role = 'admin')
  ) OR EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simple, effective RLS policies

-- Profiles policies
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (
  id = auth.uid() OR is_admin()
);

CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (
  id = auth.uid()
);

CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (
  id = auth.uid() OR is_admin()
);

-- Public read policies
CREATE POLICY "categories_select" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "products_select" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "properties_select" ON real_estate_properties FOR SELECT USING (is_available = true);

-- Admin policies
CREATE POLICY "categories_admin" ON categories FOR ALL USING (is_admin());
CREATE POLICY "products_admin" ON products FOR ALL USING (is_admin());
CREATE POLICY "properties_admin" ON real_estate_properties FOR ALL USING (is_admin());
CREATE POLICY "orders_admin" ON orders FOR ALL USING (is_admin());
CREATE POLICY "bookings_admin" ON real_estate_bookings FOR ALL USING (is_admin());
CREATE POLICY "hire_bookings_admin" ON hire_bookings FOR ALL USING (is_admin());

-- User-specific policies
CREATE POLICY "orders_user" ON orders FOR SELECT USING (
  user_id = auth.uid() OR customer_id = auth.uid() OR is_admin()
);

CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (
  user_id = auth.uid() OR user_id IS NULL
);

CREATE POLICY "cart_items_user" ON cart_items FOR ALL USING (
  user_id = auth.uid() OR user_id IS NULL OR is_admin()
);

CREATE POLICY "bookings_user_select" ON real_estate_bookings FOR SELECT USING (
  user_id = auth.uid() OR is_admin()
);

CREATE POLICY "bookings_user_insert" ON real_estate_bookings FOR INSERT WITH CHECK (
  user_id = auth.uid() OR user_id IS NULL
);

CREATE POLICY "hire_bookings_user_select" ON hire_bookings FOR SELECT USING (
  user_id = auth.uid() OR is_admin()
);

CREATE POLICY "hire_bookings_user_insert" ON hire_bookings FOR INSERT WITH CHECK (
  user_id = auth.uid() OR user_id IS NULL
);

-- Order items policies
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_id 
    AND (orders.user_id = auth.uid() OR orders.customer_id = auth.uid())
  ) OR is_admin()
);

CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_id 
    AND orders.user_id = auth.uid()
  ) OR is_admin()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_type ON real_estate_properties(type);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_city ON real_estate_properties(city);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_available ON real_estate_properties(is_available);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_property_id ON real_estate_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_user_id ON real_estate_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_user_id ON hire_bookings(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_real_estate_properties_updated_at ON real_estate_properties;
CREATE TRIGGER update_real_estate_properties_updated_at 
    BEFORE UPDATE ON real_estate_properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_real_estate_bookings_updated_at ON real_estate_bookings;
CREATE TRIGGER update_real_estate_bookings_updated_at 
    BEFORE UPDATE ON real_estate_bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hire_bookings_updated_at ON hire_bookings;
CREATE TRIGGER update_hire_bookings_updated_at 
    BEFORE UPDATE ON hire_bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE WHEN NEW.email = 'talktostevenson@gmail.com' THEN true ELSE false END,
    CASE WHEN NEW.email = 'talktostevenson@gmail.com' THEN 'admin' ELSE 'customer' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create admin profile if auth user exists
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'talktostevenson@gmail.com' 
  LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, full_name, is_admin, role, created_at, updated_at)
    VALUES (
      admin_user_id,
      'talktostevenson@gmail.com',
      'Admin User',
      true,
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      is_admin = true,
      role = 'admin',
      updated_at = NOW();
  END IF;
END $$;

-- Insert default categories
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Perfumes', 'perfumes', 'Luxury fragrances and designer perfumes', true, 1),
('Wigs', 'wigs', 'Premium hair wigs and extensions', true, 2),
('Cars', 'cars', 'Luxury vehicles and automotive', true, 3),
('Wines', 'wines', 'Fine wines and premium beverages', true, 4),
('Body Creams', 'body-creams', 'Skincare and beauty products', true, 5),
('Jewelry', 'jewelry', 'Fine jewelry and luxury accessories', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

SELECT 'Production database schema setup completed successfully!' as status;
