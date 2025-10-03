-- API Security Fix: Ensure RLS is enforced for all public endpoints
-- This script addresses the service role usage concern

-- Note: is_admin() function is now defined in the main production script

-- Create indexes on is_active fields for performance
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active) WHERE is_active = true;

-- Ensure is_active and status fields are in sync
CREATE OR REPLACE FUNCTION sync_status_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync is_active to status when status changes
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.is_active = (NEW.status = 'active');
  END IF;
  
  -- Sync status to is_active when is_active changes  
  IF TG_OP = 'UPDATE' AND OLD.is_active IS DISTINCT FROM NEW.is_active THEN
    NEW.status = CASE WHEN NEW.is_active THEN 'active' ELSE 'inactive' END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply sync triggers to keep fields consistent
DROP TRIGGER IF EXISTS sync_products_status ON products;
CREATE TRIGGER sync_products_status 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION sync_status_fields();

DROP TRIGGER IF EXISTS sync_categories_status ON categories;
CREATE TRIGGER sync_categories_status 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION sync_status_fields();

-- Enhanced RLS policies that work with both is_active and status
DROP POLICY IF EXISTS "Products public read" ON products;
CREATE POLICY "Products public read" ON products 
    FOR SELECT TO public 
    USING (is_active = true);

DROP POLICY IF EXISTS "Categories public read" ON categories;
CREATE POLICY "Categories public read" ON categories 
    FOR SELECT TO public 
    USING (is_active = true);

-- Create a view for public API endpoints that enforces RLS
CREATE OR REPLACE VIEW public_products AS
SELECT p.* FROM products p WHERE p.is_active = true;

CREATE OR REPLACE VIEW public_categories AS  
SELECT c.* FROM categories c WHERE c.is_active = true;

CREATE OR REPLACE VIEW public_properties AS
SELECT rp.* FROM real_estate_properties rp WHERE rp.is_available = true;

-- Grant access to views
GRANT SELECT ON public_products TO anon;
GRANT SELECT ON public_categories TO anon;
GRANT SELECT ON public_properties TO anon;

SELECT 'API security enhancement completed! Use views for public endpoints.' AS status;
