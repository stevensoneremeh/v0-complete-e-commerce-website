-- Complete Admin Schema Setup for Full CRUD Operations
-- This script ensures all tables exist with proper structure for admin management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ensure product_variants table exists with all necessary columns
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    price DECIMAL(10,2),
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    inventory_quantity INTEGER DEFAULT 0,
    weight DECIMAL(8,2),
    dimensions JSONB DEFAULT '{}',
    options JSONB DEFAULT '{}', -- Stores variant attributes like {color: "red", size: "large"}
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to products table if they don't exist
DO $$ 
BEGIN
    -- Add specifications column for product attributes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='products' AND column_name='specifications') THEN
        ALTER TABLE products ADD COLUMN specifications JSONB DEFAULT '{}';
    END IF;
    
    -- Add cost_price for profit tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='products' AND column_name='cost_price') THEN
        ALTER TABLE products ADD COLUMN cost_price DECIMAL(10,2);
    END IF;
    
    -- Add barcode column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='products' AND column_name='barcode') THEN
        ALTER TABLE products ADD COLUMN barcode TEXT UNIQUE;
    END IF;
    
    -- Add track_inventory flag
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='products' AND column_name='track_inventory') THEN
        ALTER TABLE products ADD COLUMN track_inventory BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Create hire_services table for rental/hire options
CREATE TABLE IF NOT EXISTS hire_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    service_type TEXT NOT NULL CHECK (service_type IN ('car', 'boat', 'equipment', 'other')),
    price_per_hour DECIMAL(10,2),
    price_per_day DECIMAL(10,2),
    price_per_week DECIMAL(10,2),
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    max_capacity INTEGER,
    features TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    featured_image TEXT,
    terms_and_conditions TEXT,
    availability_schedule JSONB DEFAULT '{}', -- Store availability windows
    is_available BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_attributes table for managing custom attributes
CREATE TABLE IF NOT EXISTS product_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('text', 'select', 'multiselect', 'color', 'number')),
    values JSONB DEFAULT '[]', -- Array of possible values for select types
    is_variant_option BOOLEAN DEFAULT FALSE, -- If true, used for creating variants
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_attribute_values junction table
CREATE TABLE IF NOT EXISTS product_attribute_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, attribute_id)
);

-- Add missing columns to categories table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='categories' AND column_name='seo_title') THEN
        ALTER TABLE categories ADD COLUMN seo_title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='categories' AND column_name='seo_description') THEN
        ALTER TABLE categories ADD COLUMN seo_description TEXT;
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_is_active ON product_variants(is_active);

CREATE INDEX IF NOT EXISTS idx_hire_services_service_type ON hire_services(service_type);
CREATE INDEX IF NOT EXISTS idx_hire_services_is_available ON hire_services(is_available);
CREATE INDEX IF NOT EXISTS idx_hire_services_slug ON hire_services(slug);

CREATE INDEX IF NOT EXISTS idx_product_attributes_slug ON product_attributes(slug);
CREATE INDEX IF NOT EXISTS idx_product_attributes_is_variant_option ON product_attributes(is_variant_option);

CREATE INDEX IF NOT EXISTS idx_product_attribute_values_product_id ON product_attribute_values(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attribute_values_attribute_id ON product_attribute_values(attribute_id);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;

-- Enable RLS on new tables
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attribute_values ENABLE ROW LEVEL SECURITY;

-- Create admin helper function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.is_admin = true OR profiles.role IN ('admin', 'super_admin'))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for product_variants
DROP POLICY IF EXISTS "variants_public_read" ON product_variants;
CREATE POLICY "variants_public_read" ON product_variants 
    FOR SELECT USING (
        is_active = true AND 
        EXISTS (SELECT 1 FROM products WHERE id = product_id AND is_active = true)
    );

DROP POLICY IF EXISTS "variants_admin_all" ON product_variants;
CREATE POLICY "variants_admin_all" ON product_variants 
    FOR ALL USING (is_admin());

-- RLS Policies for hire_services
DROP POLICY IF EXISTS "hire_services_public_read" ON hire_services;
CREATE POLICY "hire_services_public_read" ON hire_services 
    FOR SELECT USING (is_available = true AND is_active = true);

DROP POLICY IF EXISTS "hire_services_admin_all" ON hire_services;
CREATE POLICY "hire_services_admin_all" ON hire_services 
    FOR ALL USING (is_admin());

-- RLS Policies for product_attributes
DROP POLICY IF EXISTS "attributes_public_read" ON product_attributes;
CREATE POLICY "attributes_public_read" ON product_attributes 
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "attributes_admin_all" ON product_attributes;
CREATE POLICY "attributes_admin_all" ON product_attributes 
    FOR ALL USING (is_admin());

-- RLS Policies for product_attribute_values
DROP POLICY IF EXISTS "attribute_values_public_read" ON product_attribute_values;
CREATE POLICY "attribute_values_public_read" ON product_attribute_values 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM products WHERE id = product_id AND is_active = true)
    );

DROP POLICY IF EXISTS "attribute_values_admin_all" ON product_attribute_values;
CREATE POLICY "attribute_values_admin_all" ON product_attribute_values 
    FOR ALL USING (is_admin());

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at 
    BEFORE UPDATE ON product_variants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hire_services_updated_at ON hire_services;
CREATE TRIGGER update_hire_services_updated_at 
    BEFORE UPDATE ON hire_services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_attributes_updated_at ON product_attributes;
CREATE TRIGGER update_product_attributes_updated_at 
    BEFORE UPDATE ON product_attributes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default product attributes
INSERT INTO product_attributes (name, slug, type, values, is_variant_option, sort_order) VALUES
('Size', 'size', 'select', '["Small", "Medium", "Large", "X-Large", "XX-Large"]'::jsonb, true, 1),
('Color', 'color', 'color', '["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple"]'::jsonb, true, 2),
('Material', 'material', 'select', '["Cotton", "Polyester", "Silk", "Leather", "Wool", "Linen"]'::jsonb, false, 3),
('Brand', 'brand', 'text', '[]'::jsonb, false, 4),
('Weight', 'weight', 'number', '[]'::jsonb, false, 5)
ON CONFLICT (slug) DO NOTHING;

-- Grant permissions
GRANT ALL ON product_variants TO authenticated;
GRANT ALL ON hire_services TO authenticated;
GRANT ALL ON product_attributes TO authenticated;
GRANT ALL ON product_attribute_values TO authenticated;

GRANT SELECT ON product_variants TO anon;
GRANT SELECT ON hire_services TO anon;
GRANT SELECT ON product_attributes TO anon;
GRANT SELECT ON product_attribute_values TO anon;

SELECT 'Admin schema setup complete! All tables ready for full CRUD operations.' AS status;
