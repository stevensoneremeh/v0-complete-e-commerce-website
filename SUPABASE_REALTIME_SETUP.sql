-- =====================================================
-- SUPABASE REAL-TIME SETUP FOR ADMIN DASHBOARD
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to enable
-- real-time updates across your admin dashboard
-- =====================================================

-- Enable real-time for products table
-- This allows instant updates when products are added/edited/deleted
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Enable real-time for categories table
-- This allows instant updates when categories are added/edited/deleted
ALTER TABLE categories REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;

-- Enable real-time for real_estate_properties table
-- This allows instant updates when properties are added/edited/deleted
ALTER TABLE real_estate_properties REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE real_estate_properties;

-- Enable real-time for orders table
-- This allows instant updates when order status changes
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify real-time is properly configured
-- =====================================================

-- Check which tables have replication enabled
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN replica_identity = 'd' THEN 'DEFAULT'
        WHEN replica_identity = 'n' THEN 'NOTHING'
        WHEN replica_identity = 'f' THEN 'FULL'
        WHEN replica_identity = 'i' THEN 'INDEX'
    END as replica_identity
FROM pg_tables
JOIN pg_class ON pg_tables.tablename = pg_class.relname
WHERE schemaname = 'public'
AND tablename IN ('products', 'categories', 'real_estate_properties', 'orders');

-- Check which tables are in the supabase_realtime publication
SELECT 
    schemaname,
    tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND schemaname = 'public';

-- =====================================================
-- EXPECTED OUTPUT
-- =====================================================
-- You should see all four tables with:
-- - replica_identity = 'FULL'
-- - Listed in supabase_realtime publication
-- =====================================================

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================
-- If tables are not showing up, try:

-- 1. Drop and recreate the publication
-- DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;
-- CREATE PUBLICATION supabase_realtime;

-- 2. Then re-add all tables
-- ALTER PUBLICATION supabase_realtime ADD TABLE products;
-- ALTER PUBLICATION supabase_realtime ADD TABLE categories;
-- ALTER PUBLICATION supabase_realtime ADD TABLE real_estate_properties;
-- ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- 3. Verify again with the queries above

-- =====================================================
-- OPTIONAL: Enable for Additional Tables
-- =====================================================
-- If you want real-time for other tables, use this pattern:

-- ALTER TABLE your_table_name REPLICA IDENTITY FULL;
-- ALTER PUBLICATION supabase_realtime ADD TABLE your_table_name;

-- Examples:
-- ALTER TABLE order_items REPLICA IDENTITY FULL;
-- ALTER PUBLICATION supabase_realtime ADD TABLE order_items;

-- ALTER TABLE reviews REPLICA IDENTITY FULL;
-- ALTER PUBLICATION supabase_realtime ADD TABLE reviews;

-- ALTER TABLE bookings REPLICA IDENTITY FULL;
-- ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- =====================================================
-- PERFORMANCE NOTES
-- =====================================================
-- Real-time uses PostgreSQL's logical replication
-- This has minimal performance impact but consider:
-- 
-- 1. Each connected client maintains a WebSocket
-- 2. Large tables may need filtering in subscriptions
-- 3. Monitor your Supabase plan's connection limits
-- 4. Real-time events are sent to ALL subscribed clients
-- 
-- For production:
-- - Monitor real-time connection count
-- - Use filters in subscriptions when possible
-- - Consider rate limiting for high-frequency updates
-- =====================================================

-- =====================================================
-- SECURITY NOTES
-- =====================================================
-- Real-time respects Row Level Security (RLS) policies
-- Users can only receive updates for rows they have
-- permission to SELECT. Ensure your RLS policies are
-- properly configured:

-- Example: Allow all users to read active products
-- CREATE POLICY "Anyone can view active products"
-- ON products FOR SELECT
-- USING (is_active = true);

-- Example: Only admins can see all products
-- CREATE POLICY "Admins can view all products"
-- ON products FOR SELECT
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = auth.uid()
--     AND profiles.is_admin = true
--   )
-- );
-- =====================================================
