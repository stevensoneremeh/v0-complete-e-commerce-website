
-- Fix database schema and RLS policy issues
-- This addresses the 403/400 errors in the console

-- First, let's check and fix the orders table structure
-- The error shows 'column orders.user_id does not exist'
-- We need to add this column if it's missing

DO $$
BEGIN
    -- Add user_id column to orders table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id);
        
        -- Add index for better performance
        CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
        
        RAISE NOTICE 'Added user_id column to orders table';
    END IF;
END $$;

-- Fix RLS policies for products table
-- The 403 error indicates RLS is blocking access to products

DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Products are publicly readable" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;

-- Create simple public read policy for products
CREATE POLICY "products_public_read" ON products
  FOR SELECT
  USING (is_active = true);

-- Fix RLS policies for categories (needed for products join)
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Categories are publicly readable" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;

CREATE POLICY "categories_public_read" ON categories
  FOR SELECT
  USING (is_active = true);

-- Fix RLS policies for orders table
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "orders_user_read" ON orders;

-- Create policy for users to read their own orders
CREATE POLICY "orders_user_read" ON orders
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    (user_id IS NULL AND guest_id IS NOT NULL)
  );

-- Allow admins to read all orders
CREATE POLICY "orders_admin_read" ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'talktostevenson@gmail.com'
    )
  );

-- Ensure proper grants for public access
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON orders TO authenticated;

-- Update any existing orders to link them to users if possible
-- This is a one-time migration for existing data
UPDATE orders 
SET user_id = (
  SELECT id FROM auth.users 
  WHERE email = orders.shipping_email 
  LIMIT 1
)
WHERE user_id IS NULL 
  AND shipping_email IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = orders.shipping_email
  );

SELECT 'Database schema and RLS policies fixed successfully' as status;
