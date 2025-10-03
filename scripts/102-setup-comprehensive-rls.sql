-- Comprehensive Row Level Security (RLS) Policies
-- This script sets up RLS for all tables with admin and user access patterns

-- ============================================
-- PROFILES TABLE
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except admin fields)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (is_admin_user());

-- Admins can update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (is_admin_user());

-- ============================================
-- CATEGORIES TABLE
-- ============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view active categories
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true OR is_admin_user());

-- Only admins can insert categories
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (is_admin_user());

-- Only admins can update categories
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE USING (is_admin_user());

-- Only admins can delete categories
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE USING (is_admin_user());

-- ============================================
-- PRODUCTS TABLE
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view active products
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true OR is_admin_user());

-- Only admins can insert products
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (is_admin_user());

-- Only admins can update products
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (is_admin_user());

-- Only admins can delete products
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (is_admin_user());

-- ============================================
-- PROPERTIES TABLE
-- ============================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Anyone can view active properties
DROP POLICY IF EXISTS "Anyone can view active properties" ON public.properties;
CREATE POLICY "Anyone can view active properties" ON public.properties
  FOR SELECT USING (is_active = true OR is_admin_user());

-- Only admins can insert properties
DROP POLICY IF EXISTS "Admins can insert properties" ON public.properties;
CREATE POLICY "Admins can insert properties" ON public.properties
  FOR INSERT WITH CHECK (is_admin_user());

-- Only admins can update properties
DROP POLICY IF EXISTS "Admins can update properties" ON public.properties;
CREATE POLICY "Admins can update properties" ON public.properties
  FOR UPDATE USING (is_admin_user());

-- Only admins can delete properties
DROP POLICY IF EXISTS "Admins can delete properties" ON public.properties;
CREATE POLICY "Admins can delete properties" ON public.properties
  FOR DELETE USING (is_admin_user());

-- ============================================
-- ORDERS TABLE
-- ============================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id OR is_admin_user());

-- Users can insert their own orders
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Admins can view all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (is_admin_user());

-- Admins can update any order
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (is_admin_user());

-- ============================================
-- ORDER_ITEMS TABLE
-- ============================================
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own order items
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    ) OR is_admin_user()
  );

-- Admins can view all order items
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (is_admin_user());

-- ============================================
-- BOOKINGS TABLE (Property Bookings)
-- ============================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id OR is_admin_user());

-- Users can insert their own bookings
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Admins can view all bookings
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (is_admin_user());

-- Admins can update any booking
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings" ON public.bookings
  FOR UPDATE USING (is_admin_user());

-- ============================================
-- HIRE_BOOKINGS TABLE
-- ============================================
ALTER TABLE public.hire_bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own hire bookings
DROP POLICY IF EXISTS "Users can view own hire bookings" ON public.hire_bookings;
CREATE POLICY "Users can view own hire bookings" ON public.hire_bookings
  FOR SELECT USING (auth.uid() = customer_id OR is_admin_user());

-- Users can insert their own hire bookings
DROP POLICY IF EXISTS "Users can insert own hire bookings" ON public.hire_bookings;
CREATE POLICY "Users can insert own hire bookings" ON public.hire_bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Admins can manage all hire bookings
DROP POLICY IF EXISTS "Admins can manage hire bookings" ON public.hire_bookings;
CREATE POLICY "Admins can manage hire bookings" ON public.hire_bookings
  FOR ALL USING (is_admin_user());

-- ============================================
-- REAL_ESTATE_BOOKINGS TABLE
-- ============================================
ALTER TABLE public.real_estate_bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own real estate bookings
DROP POLICY IF EXISTS "Users can view own real estate bookings" ON public.real_estate_bookings;
CREATE POLICY "Users can view own real estate bookings" ON public.real_estate_bookings
  FOR SELECT USING (auth.uid() = customer_id OR is_admin_user());

-- Users can insert their own real estate bookings
DROP POLICY IF EXISTS "Users can insert own real estate bookings" ON public.real_estate_bookings;
CREATE POLICY "Users can insert own real estate bookings" ON public.real_estate_bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Admins can manage all real estate bookings
DROP POLICY IF EXISTS "Admins can manage real estate bookings" ON public.real_estate_bookings;
CREATE POLICY "Admins can manage real estate bookings" ON public.real_estate_bookings
  FOR ALL USING (is_admin_user());

-- ============================================
-- CART_ITEMS TABLE
-- ============================================
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can manage their own cart
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;
CREATE POLICY "Users can manage own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = customer_id);

-- Admins can view all carts
DROP POLICY IF EXISTS "Admins can view all carts" ON public.cart_items;
CREATE POLICY "Admins can view all carts" ON public.cart_items
  FOR SELECT USING (is_admin_user());

-- ============================================
-- WISHLIST_ITEMS TABLE
-- ============================================
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can manage their own wishlist
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlist_items;
CREATE POLICY "Users can manage own wishlist" ON public.wishlist_items
  FOR ALL USING (auth.uid() = customer_id);

-- Admins can view all wishlists
DROP POLICY IF EXISTS "Admins can view all wishlists" ON public.wishlist_items;
CREATE POLICY "Admins can view all wishlists" ON public.wishlist_items
  FOR SELECT USING (is_admin_user());

-- ============================================
-- PRODUCT_REVIEWS TABLE
-- ============================================
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved reviews
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.product_reviews;
CREATE POLICY "Anyone can view approved reviews" ON public.product_reviews
  FOR SELECT USING (is_approved = true OR auth.uid() = customer_id OR is_admin_user());

-- Users can insert their own reviews
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.product_reviews;
CREATE POLICY "Users can insert own reviews" ON public.product_reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Users can update their own reviews
DROP POLICY IF EXISTS "Users can update own reviews" ON public.product_reviews;
CREATE POLICY "Users can update own reviews" ON public.product_reviews
  FOR UPDATE USING (auth.uid() = customer_id);

-- Admins can manage all reviews
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.product_reviews;
CREATE POLICY "Admins can manage reviews" ON public.product_reviews
  FOR ALL USING (is_admin_user());

-- ============================================
-- COUPONS TABLE
-- ============================================
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Anyone can view active coupons
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = true OR is_admin_user());

-- Only admins can manage coupons
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL USING (is_admin_user());

-- ============================================
-- HIRE_ITEMS TABLE
-- ============================================
ALTER TABLE public.hire_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view available hire items
DROP POLICY IF EXISTS "Anyone can view available hire items" ON public.hire_items;
CREATE POLICY "Anyone can view available hire items" ON public.hire_items
  FOR SELECT USING (is_available = true OR is_admin_user());

-- Only admins can manage hire items
DROP POLICY IF EXISTS "Admins can manage hire items" ON public.hire_items;
CREATE POLICY "Admins can manage hire items" ON public.hire_items
  FOR ALL USING (is_admin_user());
