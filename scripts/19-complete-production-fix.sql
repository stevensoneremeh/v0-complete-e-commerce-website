-- Complete Production Fix for ABL Natasha Enterprises
-- This script will fix all database issues and make the admin fully functional

-- Drop all existing problematic policies to start fresh
DO $$
BEGIN
  -- Drop all existing RLS policies
  DROP POLICY IF EXISTS "Allow public read access to products" ON products;
  DROP POLICY IF EXISTS "Products are publicly readable" ON products;
  DROP POLICY IF EXISTS "Enable read access for all users" ON products;
  DROP POLICY IF EXISTS "products_public_read" ON products;
  DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
  DROP POLICY IF EXISTS "Categories are publicly readable" ON categories;
  DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
  DROP POLICY IF EXISTS "categories_public_read" ON categories;
  DROP POLICY IF EXISTS "Users can view own orders" ON orders;
  DROP POLICY IF EXISTS "orders_user_read" ON orders;
  DROP POLICY IF EXISTS "orders_admin_read" ON orders;
  
  -- Drop all profile policies
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
  DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
  DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
  DROP POLICY IF EXISTS "Allow authenticated users to read own profile" ON profiles;
  DROP POLICY IF EXISTS "Allow authenticated users to update own profile" ON profiles;
  DROP POLICY IF EXISTS "Allow authenticated users to insert own profile" ON profiles;
  DROP POLICY IF EXISTS "Allow admin to read all profiles" ON profiles;
  DROP POLICY IF EXISTS "Allow admin to update all profiles" ON profiles;
END $$;

-- Ensure all required tables exist with proper structure
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_at_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id),
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  weight DECIMAL(8,2),
  dimensions TEXT,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix orders table structure
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'NGN';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_country TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_country TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_postal_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Disable RLS temporarily to clean up
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive RLS policies for public access
-- Products - Allow public read, admin full access
CREATE POLICY "products_public_read" ON products
  FOR SELECT
  USING (true);

CREATE POLICY "products_admin_all" ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Categories - Allow public read, admin full access
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "categories_admin_all" ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Orders - Users can see own orders, admin can see all
CREATE POLICY "orders_user_read" ON orders
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "orders_admin_all" ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Profiles - Simple policies without recursion
CREATE POLICY "profiles_user_read" ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_user_update" ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_user_insert" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL
  TO authenticated
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'talktostevenson@gmail.com'
    )
  );

-- Grant necessary permissions
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON categories TO anon, authenticated;
GRANT ALL ON products TO authenticated;
GRANT ALL ON categories TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- Create or update admin profile
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
  -- Check if admin user exists in auth.users
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'talktostevenson@gmail.com' 
  LIMIT 1;
  
  -- Only insert profile if we have a valid user ID
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
      
    RAISE NOTICE 'Admin profile created/updated successfully for existing auth user';
  ELSE
    RAISE NOTICE 'Admin auth user does not exist yet. Profile will be created automatically when user signs up.';
  END IF;
END $$;

-- Insert default categories if they don't exist
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Perfumes', 'perfumes', 'Luxury fragrances and designer perfumes', true, 1),
('Wigs', 'wigs', 'Premium hair wigs and extensions', true, 2),
('Cars', 'cars', 'Luxury vehicles and automotive', true, 3),
('Wines', 'wines', 'Fine wines and premium beverages', true, 4),
('Body Creams', 'body-creams', 'Skincare and beauty products', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Create sample products for each category
WITH category_ids AS (
  SELECT id, slug FROM categories WHERE slug IN ('perfumes', 'wigs', 'cars', 'wines', 'body-creams')
)
INSERT INTO products (name, slug, description, price, category_id, sku, stock_quantity, is_featured, is_active, images, features)
SELECT 
  CASE 
    WHEN c.slug = 'perfumes' THEN 'Luxury Designer Perfume'
    WHEN c.slug = 'wigs' THEN 'Premium Lace Front Wig'
    WHEN c.slug = 'cars' THEN '2024 BMW X5 SUV'
    WHEN c.slug = 'wines' THEN 'Premium Red Wine Collection'
    WHEN c.slug = 'body-creams' THEN 'Luxury Anti-Aging Body Cream'
  END,
  CASE 
    WHEN c.slug = 'perfumes' THEN 'luxury-designer-perfume'
    WHEN c.slug = 'wigs' THEN 'premium-lace-front-wig'
    WHEN c.slug = 'cars' THEN '2024-bmw-x5-suv'
    WHEN c.slug = 'wines' THEN 'premium-red-wine-collection'
    WHEN c.slug = 'body-creams' THEN 'luxury-anti-aging-body-cream'
  END,
  CASE 
    WHEN c.slug = 'perfumes' THEN 'Exquisite designer fragrance with notes of bergamot, jasmine, and sandalwood'
    WHEN c.slug = 'wigs' THEN 'High-quality lace front wig made from 100% human hair'
    WHEN c.slug = 'cars' THEN 'Luxury SUV with premium features and advanced technology'
    WHEN c.slug = 'wines' THEN 'Carefully selected collection of premium red wines'
    WHEN c.slug = 'body-creams' THEN 'Advanced anti-aging formula with natural ingredients'
  END,
  CASE 
    WHEN c.slug = 'perfumes' THEN 149.99
    WHEN c.slug = 'wigs' THEN 299.99
    WHEN c.slug = 'cars' THEN 65999.99
    WHEN c.slug = 'wines' THEN 89.99
    WHEN c.slug = 'body-creams' THEN 79.99
  END,
  c.id,
  'PRD-' || UPPER(REPLACE(c.slug, '-', '')) || '-001',
  CASE WHEN c.slug = 'cars' THEN 1 ELSE 50 END,
  true,
  true,
  ARRAY['/placeholder.svg?height=300&width=300&text=' || REPLACE(INITCAP(REPLACE(c.slug, '-', ' ')), ' ', '+')],
  ARRAY['Premium Quality', 'Fast Shipping', 'Satisfaction Guaranteed']
FROM category_ids c
ON CONFLICT (slug) DO NOTHING;

SELECT 'Database completely fixed and production ready!' as status;
