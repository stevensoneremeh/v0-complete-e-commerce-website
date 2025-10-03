-- Fix Missing Tables and Schema Issues for Production Environment
-- This script creates missing tables and ensures proper relationships

-- Create real_estate_properties table (separate from products)
CREATE TABLE IF NOT EXISTS real_estate_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('apartment', 'villa', 'penthouse', 'beachfront', 'urban-loft', 'modern-apartment')),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'Nigeria',
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bedrooms INTEGER,
  bathrooms INTEGER,
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
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create real_estate_bookings table
CREATE TABLE IF NOT EXISTS real_estate_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT NOT NULL UNIQUE,
  property_id UUID REFERENCES real_estate_properties(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  special_requests TEXT,
  admin_notes TEXT,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to existing tables if they don't exist
DO $$
BEGIN
    -- Add missing columns to products table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'status') THEN
        ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_quantity') THEN
        ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
        ALTER TABLE products ADD COLUMN rating DECIMAL(2,1) DEFAULT 0.0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
        ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;

    -- Add missing columns to categories table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'status') THEN
        ALTER TABLE categories ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
    END IF;
    
    -- Add is_featured to properties table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'is_featured') THEN
        ALTER TABLE properties ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'rating') THEN
        ALTER TABLE properties ADD COLUMN rating DECIMAL(2,1) DEFAULT 0.0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'review_count') THEN
        ALTER TABLE properties ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE real_estate_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for real_estate_properties
DROP POLICY IF EXISTS "Properties public read" ON real_estate_properties;
CREATE POLICY "Properties public read" ON real_estate_properties 
    FOR SELECT TO authenticated 
    USING (is_available = true);

DROP POLICY IF EXISTS "Properties anonymous read" ON real_estate_properties;
CREATE POLICY "Properties anonymous read" ON real_estate_properties 
    FOR SELECT TO anon 
    USING (is_available = true);

DROP POLICY IF EXISTS "Properties admin access" ON real_estate_properties;
CREATE POLICY "Properties admin access" ON real_estate_properties 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'talktostevenson@gmail.com'
        )
    );

-- Create RLS policies for real_estate_bookings
DROP POLICY IF EXISTS "Bookings customer access" ON real_estate_bookings;
CREATE POLICY "Bookings customer access" ON real_estate_bookings 
    FOR ALL TO authenticated 
    USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Bookings admin access" ON real_estate_bookings;
CREATE POLICY "Bookings admin access" ON real_estate_bookings 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'talktostevenson@gmail.com'
        )
    );

-- Add public read policies for products and categories
DROP POLICY IF EXISTS "Products public read" ON products;
CREATE POLICY "Products public read" ON products 
    FOR SELECT TO authenticated 
    USING (is_active = true);

DROP POLICY IF EXISTS "Products anonymous read" ON products;
CREATE POLICY "Products anonymous read" ON products 
    FOR SELECT TO anon 
    USING (is_active = true);

DROP POLICY IF EXISTS "Categories public read" ON categories;
CREATE POLICY "Categories public read" ON categories 
    FOR SELECT TO authenticated 
    USING (is_active = true);

DROP POLICY IF EXISTS "Categories anonymous read" ON categories;
CREATE POLICY "Categories anonymous read" ON categories 
    FOR SELECT TO anon 
    USING (is_active = true);

-- Create comprehensive admin policies
DROP POLICY IF EXISTS "Products admin access" ON products;
CREATE POLICY "Products admin access" ON products 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'talktostevenson@gmail.com'
        )
    );

DROP POLICY IF EXISTS "Categories admin access" ON categories;
CREATE POLICY "Categories admin access" ON categories 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'talktostevenson@gmail.com'
        )
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_type ON real_estate_properties(type);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_city ON real_estate_properties(city);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_available ON real_estate_properties(is_available);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_featured ON real_estate_properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_product_id ON real_estate_properties(product_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_owner ON real_estate_properties(owner_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_property ON real_estate_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_user ON real_estate_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_dates ON real_estate_bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_status ON real_estate_bookings(status);
CREATE INDEX IF NOT EXISTS idx_real_estate_bookings_reference ON real_estate_bookings(booking_reference);

-- Create GIN indexes for array fields
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_amenities_gin ON real_estate_properties USING gin (amenities);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_features_gin ON real_estate_properties USING gin (features);
CREATE INDEX IF NOT EXISTS idx_real_estate_properties_images_gin ON real_estate_properties USING gin (images);

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_real_estate_properties_updated_at ON real_estate_properties;
CREATE TRIGGER update_real_estate_properties_updated_at 
    BEFORE UPDATE ON real_estate_properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_real_estate_bookings_updated_at ON real_estate_bookings;
CREATE TRIGGER update_real_estate_bookings_updated_at 
    BEFORE UPDATE ON real_estate_bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON real_estate_properties TO authenticated;
GRANT ALL ON real_estate_bookings TO authenticated;
GRANT ALL ON real_estate_properties TO anon;
GRANT ALL ON real_estate_bookings TO anon;

-- Fix any existing data inconsistencies by updating inventory_quantity to stock_quantity
UPDATE products SET stock_quantity = inventory_quantity WHERE stock_quantity IS NULL AND inventory_quantity IS NOT NULL;

SELECT 'Database schema fixes completed! Missing tables created and admin access configured.' AS status;
