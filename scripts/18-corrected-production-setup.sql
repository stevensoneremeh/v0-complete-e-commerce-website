-- Final production setup script with correct column names
-- This script ensures all tables have proper indexes and constraints for production

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_guest_id ON cart_items(guest_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

CREATE INDEX IF NOT EXISTS idx_hire_bookings_user_id ON hire_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_status ON hire_bookings(status);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_booking_date ON hire_bookings(booking_date);

CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_property_id ON real_estate_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_user_id ON real_estate_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_status ON real_estate_bookings(status);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Ensure admin user exists with correct permissions
INSERT INTO profiles (id, email, full_name, role, is_admin, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'talktostevenson@gmail.com',
  'Admin User',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_admin = true,
  updated_at = NOW();

-- Add some sample data if tables are empty (for demo purposes)
INSERT INTO categories (id, name, slug, description, is_active, sort_order, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Electronics', 'electronics', 'Electronic devices and gadgets', true, 1, NOW(), NOW()),
  (gen_random_uuid(), 'Clothing', 'clothing', 'Fashion and apparel', true, 2, NOW(), NOW()),
  (gen_random_uuid(), 'Home & Garden', 'home-garden', 'Home improvement and garden supplies', true, 3, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Add sample hero slides if none exist
INSERT INTO hero_slides (id, title, subtitle, description, image_url, cta_primary, cta_primary_url, is_active, sort_order, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Welcome to Our Store', 'Quality Products', 'Discover amazing products at great prices', '/placeholder.svg?height=600&width=1200', 'Shop Now', '/products', true, 1, NOW(), NOW()),
  (gen_random_uuid(), 'Special Offers', 'Limited Time', 'Don''t miss out on our exclusive deals', '/placeholder.svg?height=600&width=1200', 'View Deals', '/products?sale=true', true, 2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Update site settings
INSERT INTO site_settings (id, key, value, updated_at)
VALUES 
  (gen_random_uuid(), 'site_name', '"ABL Natasha Enterprises"', NOW()),
  (gen_random_uuid(), 'site_description', '"Your trusted partner for quality products and services"', NOW()),
  (gen_random_uuid(), 'contact_email', '"talktostevenson@gmail.com"', NOW()),
  (gen_random_uuid(), 'contact_phone', '"+1-234-567-8900"', NOW())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Ensure RLS policies are properly set
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create simple, non-recursive RLS policies
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to products" ON products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "Users can view own bookings" ON hire_bookings FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "Users can create bookings" ON hire_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Simple profile policies using direct email check
CREATE POLICY "Allow profile read access" ON profiles FOR SELECT USING (
  auth.uid()::text = id::text OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "Allow profile updates" ON profiles FOR UPDATE USING (
  auth.uid()::text = id::text OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "Allow profile creation" ON profiles FOR INSERT WITH CHECK (
  auth.uid()::text = id::text OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Production optimization
ANALYZE;
