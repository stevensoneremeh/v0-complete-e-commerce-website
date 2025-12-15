-- ============================================================
-- ADD MISSING PRODUCT FIELDS TO MATCH ADMIN FORM
-- ============================================================
-- Run this script to add missing columns to products table
-- This ensures the admin form fields are properly stored
-- ============================================================

-- Add missing product fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Add index for better performance on features and specifications
CREATE INDEX IF NOT EXISTS idx_products_features ON products USING GIN (features);
CREATE INDEX IF NOT EXISTS idx_products_specifications ON products USING GIN (specifications);

-- Add comment to document the fields
COMMENT ON COLUMN products.short_description IS 'Brief product description for listings';
COMMENT ON COLUMN products.low_stock_threshold IS 'Alert threshold when stock is low';
COMMENT ON COLUMN products.weight IS 'Product weight in kg';
COMMENT ON COLUMN products.dimensions IS 'Product dimensions (L x W x H)';
COMMENT ON COLUMN products.features IS 'Array of product feature strings';
COMMENT ON COLUMN products.specifications IS 'Key-value pairs of product specifications';
COMMENT ON COLUMN products.meta_title IS 'SEO meta title for product page';
COMMENT ON COLUMN products.meta_description IS 'SEO meta description for product page';
