-- Production Supabase Database Fix
-- Run this script in your Supabase SQL Editor to fix all missing tables and issues
-- This will create the missing real_estate_properties and other required tables

-- Standardized UUID generation using pgcrypto (more reliable across environments)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create real_estate_properties table (this is what your API expects)
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

-- Create real_estate_bookings table (this is what your API expects)
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

-- Create hire_bookings table (for car hire and boat cruise services)
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

-- Add missing columns to existing tables
DO $$
BEGIN
    -- Add is_active column to products and backfill from status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_active') THEN
        ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        -- Backfill from status if it exists
        UPDATE products SET is_active = (status = 'active') WHERE status IS NOT NULL;
    END IF;
    
    -- Add is_active column to categories and backfill from status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'is_active') THEN
        ALTER TABLE categories ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        -- Backfill from status if it exists
        UPDATE categories SET is_active = (status = 'active') WHERE status IS NOT NULL;
    END IF;
    
    -- Add stock_quantity column to products if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_quantity') THEN
        ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
        -- Copy inventory_quantity to stock_quantity if it exists
        UPDATE products SET stock_quantity = inventory_quantity WHERE inventory_quantity IS NOT NULL;
    END IF;
    
    -- Add rating and review_count to products if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
        ALTER TABLE products ADD COLUMN rating DECIMAL(2,1) DEFAULT 0.0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
        ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;

    -- Keep status columns for compatibility but ensure is_active is primary
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'status') THEN
        ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'status') THEN
        ALTER TABLE categories ADD COLUMN status TEXT DEFAULT 'active';
    END IF;

    -- Add last_sign_in_at to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_sign_in_at') THEN
        ALTER TABLE profiles ADD COLUMN last_sign_in_at TIMESTAMPTZ;
    END IF;
END $$;

-- Enable RLS on all new tables
ALTER TABLE real_estate_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_bookings ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies

-- Real Estate Properties Policies
DROP POLICY IF EXISTS "Properties public read" ON real_estate_properties;
CREATE POLICY "Properties public read" ON real_estate_properties 
    FOR SELECT TO public 
    USING (is_available = true);

DROP POLICY IF EXISTS "Properties admin access" ON real_estate_properties;
CREATE POLICY "Properties admin access" ON real_estate_properties 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.is_admin = true OR profiles.role = 'admin')
        )
    );

-- Real Estate Bookings Policies
DROP POLICY IF EXISTS "Bookings customer access" ON real_estate_bookings;
DROP POLICY IF EXISTS "Bookings customer insert" ON real_estate_bookings;
DROP POLICY IF EXISTS "Bookings admin access" ON real_estate_bookings;

-- Customer can read/update their own bookings
CREATE POLICY "Bookings customer access" ON real_estate_bookings 
    FOR SELECT, UPDATE TO authenticated 
    USING (user_id = auth.uid());

-- Customer can insert new bookings for themselves
CREATE POLICY "Bookings customer insert" ON real_estate_bookings 
    FOR INSERT TO authenticated 
    WITH CHECK (user_id = auth.uid());

-- Admin can do everything
CREATE POLICY "Bookings admin access" ON real_estate_bookings 
    FOR ALL TO authenticated 
    USING (is_admin())
    WITH CHECK (is_admin());

-- Hire Bookings Policies  
DROP POLICY IF EXISTS "Hire bookings customer access" ON hire_bookings;
DROP POLICY IF EXISTS "Hire bookings customer insert" ON hire_bookings;
DROP POLICY IF EXISTS "Hire bookings admin access" ON hire_bookings;

-- Customer can read/update their own hire bookings
CREATE POLICY "Hire bookings customer access" ON hire_bookings 
    FOR SELECT, UPDATE TO authenticated 
    USING (user_id = auth.uid());

-- Customer can insert new hire bookings for themselves  
CREATE POLICY "Hire bookings customer insert" ON hire_bookings 
    FOR INSERT TO authenticated 
    WITH CHECK (user_id = auth.uid());

-- Admin can do everything
CREATE POLICY "Hire bookings admin access" ON hire_bookings 
    FOR ALL TO authenticated 
    USING (is_admin())
    WITH CHECK (is_admin());

-- Enhanced public read policies for products and categories
DROP POLICY IF EXISTS "Products public read" ON products;
CREATE POLICY "Products public read" ON products 
    FOR SELECT TO public 
    USING (is_active = true);

DROP POLICY IF EXISTS "Categories public read" ON categories;
CREATE POLICY "Categories public read" ON categories 
    FOR SELECT TO public 
    USING (is_active = true);

-- Admin policies for existing tables
DROP POLICY IF EXISTS "Products admin access" ON products;
CREATE POLICY "Products admin access" ON products 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.is_admin = true OR profiles.role = 'admin')
        )
    );

DROP POLICY IF EXISTS "Categories admin access" ON categories;
CREATE POLICY "Categories admin access" ON categories 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.is_admin = true OR profiles.role = 'admin')
        )
    );

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_type ON real_estate_properties(type);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_city ON real_estate_properties(city);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_available ON real_estate_properties(is_available);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_featured ON real_estate_properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_product_id ON real_estate_properties(product_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_status ON real_estate_properties(status);

CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_property ON real_estate_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_user ON real_estate_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_dates ON real_estate_bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_status ON real_estate_bookings(status);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_reference ON real_estate_bookings(booking_reference);

CREATE INDEX IF NOT EXISTS idx_hire_bookings_user ON hire_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_type ON hire_bookings(service_type);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_dates ON hire_bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_status ON hire_bookings(status);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_reference ON hire_bookings(booking_reference);

-- GIN indexes for array fields
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_amenities_gin ON real_estate_properties USING gin (amenities);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_features_gin ON real_estate_properties USING gin (features);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_images_gin ON real_estate_properties USING gin (images);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_tags_gin ON real_estate_properties USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_images_gin ON hire_bookings USING gin (images);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_features_gin ON hire_bookings USING gin (features);

-- Create or update the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
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

-- Create storage buckets for file uploads if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('category-images', 'category-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('property-images', 'property-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('hire-images', 'hire-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[])
ON CONFLICT (id) DO NOTHING;

-- Create admin helper function first
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.is_admin = true OR profiles.role = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop any existing storage policies by exact names
DROP POLICY IF EXISTS "admin-upload-policy" ON storage.objects;
DROP POLICY IF EXISTS "admin-delete-policy" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for category images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for category images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for category images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for property images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for property images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for property images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for hire images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for hire images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for hire images" ON storage.objects;

-- Create secure role-based storage policies for file uploads
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload access for product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND is_admin()
);

CREATE POLICY "Admin delete access for product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND is_admin()
);

-- Category images policies
CREATE POLICY "Public read access for category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

CREATE POLICY "Admin upload access for category images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'category-images' 
  AND is_admin()
);

CREATE POLICY "Admin delete access for category images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'category-images' 
  AND is_admin()
);

-- Property images policies
CREATE POLICY "Public read access for property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Admin upload access for property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND is_admin()
);

CREATE POLICY "Admin delete access for property images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND is_admin()
);

-- Hire service images policies
CREATE POLICY "Public read access for hire images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hire-images');

CREATE POLICY "Admin upload access for hire images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hire-images' 
  AND is_admin()
);

CREATE POLICY "Admin delete access for hire images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hire-images' 
  AND is_admin()
);

-- Grant necessary permissions
GRANT ALL ON real_estate_properties TO authenticated;
GRANT ALL ON real_estate_bookings TO authenticated;
GRANT ALL ON hire_bookings TO authenticated;
GRANT SELECT ON real_estate_properties TO anon;
GRANT SELECT ON real_estate_bookings TO anon;

-- Create admin functions for better management
CREATE OR REPLACE FUNCTION get_admin_analytics(days_back INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
  start_date TIMESTAMP;
BEGIN
  start_date := NOW() - INTERVAL '1 day' * days_back;
  
  WITH analytics AS (
    SELECT 
      (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
      (SELECT COUNT(*) FROM real_estate_properties WHERE is_available = true) as total_properties,
      (SELECT COUNT(*) FROM profiles WHERE role = 'customer') as total_customers,
      (SELECT COUNT(*) FROM orders WHERE created_at >= start_date) as recent_orders,
      (SELECT COUNT(*) FROM real_estate_bookings WHERE created_at >= start_date) as recent_bookings,
      (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= start_date AND payment_status = 'completed') as total_revenue
  )
  SELECT row_to_json(analytics) INTO result FROM analytics;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'Database schema fixed successfully! All missing tables created and admin access configured.' AS status;