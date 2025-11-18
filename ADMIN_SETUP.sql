-- ============================================================
-- SETUP ADMIN USER: talktostevenson@gmail.com
-- ============================================================
-- Run this AFTER creating your user account in Supabase Auth
-- This will grant admin privileges to talktostevenson@gmail.com
-- ============================================================

-- Update the profile to admin if user exists
UPDATE profiles 
SET 
  is_admin = true, 
  role = 'admin',
  updated_at = NOW()
WHERE email = 'talktostevenson@gmail.com';

-- If no rows were updated, create a trigger to make this email admin on signup
CREATE OR REPLACE FUNCTION make_talktostevenson_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'talktostevenson@gmail.com' THEN
    UPDATE profiles 
    SET is_admin = true, role = 'admin', updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS make_talktostevenson_admin_trigger ON auth.users;
CREATE TRIGGER make_talktostevenson_admin_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION make_talktostevenson_admin();

-- Verify the admin setup
SELECT 
  id,
  email,
  full_name,
  is_admin,
  role
FROM profiles 
WHERE email = 'talktostevenson@gmail.com';

-- If no profile exists yet, you need to:
-- 1. Go to Supabase Auth → Users → Add user
-- 2. Create user with email: talktostevenson@gmail.com
-- 3. Run this script again to grant admin privileges
