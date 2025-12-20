-- Add missing product fields to match admin form
ALTER TABLE products
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS weight NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);

-- Update RLS policies to be simpler and not reference missing functions
-- Drop existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Create new simple policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can do everything"
  ON profiles FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Ensure all admin users have both is_admin=true and role='admin'
UPDATE profiles
SET is_admin = true, role = 'admin'
WHERE email IN (
  SELECT email FROM auth.users
  WHERE email LIKE '%admin%' OR email LIKE '%abl%'
);

-- Add comment for documentation
COMMENT ON COLUMN products.features IS 'JSON array of product features';
COMMENT ON COLUMN products.specifications IS 'JSON object of product specifications (key-value pairs)';
