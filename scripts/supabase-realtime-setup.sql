-- Supabase Realtime Setup for Production
-- Run this script in your Supabase SQL Editor to enable realtime for specific tables

-- Add tables to the realtime publication (required for real-time subscriptions)
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories; 
ALTER PUBLICATION supabase_realtime ADD TABLE real_estate_properties;

-- Note: Orders and bookings are intentionally NOT added to realtime for security
-- These should only be updated via admin interfaces or polling mechanisms

-- Enable realtime on specific tables
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE categories REPLICA IDENTITY FULL;
ALTER TABLE real_estate_properties REPLICA IDENTITY FULL;

-- Create secure RLS policies for real-time access
-- Only allow public access to active/available items

-- Enhanced Products Policies
DROP POLICY IF EXISTS "Products realtime read" ON products;
CREATE POLICY "Products realtime read" ON products 
    FOR SELECT TO public 
    USING (is_active = true);

-- Enhanced Categories Policies  
DROP POLICY IF EXISTS "Categories realtime read" ON categories;
CREATE POLICY "Categories realtime read" ON categories 
    FOR SELECT TO public 
    USING (is_active = true);

-- Enhanced Properties Policies
DROP POLICY IF EXISTS "Properties realtime read" ON real_estate_properties;
CREATE POLICY "Properties realtime read" ON real_estate_properties 
    FOR SELECT TO public 
    USING (is_available = true);

-- Create admin-only policies for sensitive data
-- Admin users can access all data including inactive items

CREATE POLICY "Products admin access" ON products 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Categories admin access" ON categories 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Properties admin access" ON real_estate_properties 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Enhanced security for orders and bookings (no realtime, strict access)
DROP POLICY IF EXISTS "Orders user access" ON orders;
CREATE POLICY "Orders user access" ON orders 
    FOR SELECT TO authenticated 
    USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Orders admin access" ON orders;
CREATE POLICY "Orders admin access" ON orders 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Bookings user access" ON real_estate_bookings;
CREATE POLICY "Bookings user access" ON real_estate_bookings 
    FOR SELECT TO authenticated 
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Bookings admin access" ON real_estate_bookings;
CREATE POLICY "Bookings admin access" ON real_estate_bookings 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Add performance indexes for commonly filtered columns
CREATE INDEX IF NOT EXISTS idx_products_active_created ON products(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON categories(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_properties_available_created ON real_estate_properties(is_available, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_created ON orders(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_user_created ON real_estate_bookings(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_property_status ON real_estate_bookings(property_id, status);

-- Add updated_at triggers for automatic timestamp maintenance
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all relevant tables
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_real_estate_properties_updated_at ON real_estate_properties;
CREATE TRIGGER update_real_estate_properties_updated_at 
    BEFORE UPDATE ON real_estate_properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_real_estate_bookings_updated_at ON real_estate_bookings;
CREATE TRIGGER update_real_estate_bookings_updated_at 
    BEFORE UPDATE ON real_estate_bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT 'Realtime setup completed! Tables enabled for secure real-time updates.' AS status;