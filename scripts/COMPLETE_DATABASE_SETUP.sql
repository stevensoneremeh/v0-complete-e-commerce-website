-- ============================================================
-- ABL NATASHA ENTERPRISES - COMPLETE DATABASE SETUP
-- ============================================================
-- Run this entire script in your Supabase SQL Editor to set up all tables
-- This script is safe to run multiple times (uses IF NOT EXISTS)
-- ============================================================

-- 1. COUPONS TABLE
-- For discount codes and promotional offers
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL CHECK (value > 0),
  min_order_amount DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_expires_at ON coupons(expires_at);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;
CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all coupons" ON coupons;
CREATE POLICY "Admins can view all coupons" ON coupons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can create coupons" ON coupons;
CREATE POLICY "Admins can create coupons" ON coupons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update coupons" ON coupons;
CREATE POLICY "Admins can update coupons" ON coupons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete coupons" ON coupons;
CREATE POLICY "Admins can delete coupons" ON coupons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 2. NOTIFICATIONS TABLE
-- For user notifications and system messages
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL
  );

DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
CREATE POLICY "Admins can view all notifications" ON notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;
CREATE POLICY "Admins can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (
    auth.uid() = user_id OR (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.is_admin = true
      )
    )
  );

DROP POLICY IF EXISTS "Admins can delete notifications" ON notifications;
CREATE POLICY "Admins can delete notifications" ON notifications
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 3. HIRE BOOKINGS TABLE
-- For car hire and boat cruise bookings
CREATE TABLE IF NOT EXISTS hire_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('car', 'boat')),
  service_name VARCHAR(255) NOT NULL,
  service_price DECIMAL(10,2) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  passengers INTEGER DEFAULT 1,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  pickup_address TEXT,
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hire_bookings_user_id ON hire_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_service_type ON hire_bookings(service_type);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_status ON hire_bookings(status);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_booking_date ON hire_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_created_at ON hire_bookings(created_at);

ALTER TABLE hire_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own hire bookings" ON hire_bookings;
CREATE POLICY "Users can view their own hire bookings" ON hire_bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own hire bookings" ON hire_bookings;
CREATE POLICY "Users can create their own hire bookings" ON hire_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own hire bookings" ON hire_bookings;
CREATE POLICY "Users can update their own hire bookings" ON hire_bookings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all hire bookings" ON hire_bookings;
CREATE POLICY "Admins can view all hire bookings" ON hire_bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update all hire bookings" ON hire_bookings;
CREATE POLICY "Admins can update all hire bookings" ON hire_bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete hire bookings" ON hire_bookings;
CREATE POLICY "Admins can delete hire bookings" ON hire_bookings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 4. HIRE SERVICES RLS SETUP
-- Row Level Security for hire_services table (if table already exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'hire_services') THEN
    ALTER TABLE hire_services ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public read access to active hire services" ON hire_services;
    CREATE POLICY "Allow public read access to active hire services"
    ON hire_services FOR SELECT
    USING (is_active = true);

    DROP POLICY IF EXISTS "Allow admins to view all hire services" ON hire_services;
    CREATE POLICY "Allow admins to view all hire services"
    ON hire_services FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    );

    DROP POLICY IF EXISTS "Allow admins to insert hire services" ON hire_services;
    CREATE POLICY "Allow admins to insert hire services"
    ON hire_services FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    );

    DROP POLICY IF EXISTS "Allow admins to update hire services" ON hire_services;
    CREATE POLICY "Allow admins to update hire services"
    ON hire_services FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    );

    DROP POLICY IF EXISTS "Allow admins to delete hire services" ON hire_services;
    CREATE POLICY "Allow admins to delete hire services"
    ON hire_services FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    );
  END IF;
END $$;

-- 5. CREATE UPDATE TRIGGERS
-- Triggers to automatically update the updated_at timestamp

-- Coupons trigger
DROP FUNCTION IF EXISTS update_coupons_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_coupons_updated_at();

-- Notifications trigger
DROP FUNCTION IF EXISTS update_notifications_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Hire bookings trigger
DROP FUNCTION IF EXISTS update_hire_bookings_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_hire_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_hire_bookings_updated_at ON hire_bookings;
CREATE TRIGGER update_hire_bookings_updated_at
  BEFORE UPDATE ON hire_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_hire_bookings_updated_at();

-- ============================================================
-- SETUP COMPLETE!
-- ============================================================
-- Verify your tables were created successfully by running:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- ============================================================
