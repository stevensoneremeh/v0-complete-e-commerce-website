
-- Quick Admin Access Fix
-- Run this in Supabase SQL Editor if you're having trouble accessing /admin

-- First, check if your profile exists
SELECT id, email, is_admin, role 
FROM profiles 
WHERE email = 'talktostevenson@gmail.com';

-- If the profile exists, grant admin access
UPDATE profiles 
SET 
  is_admin = true,
  role = 'admin',
  updated_at = NOW()
WHERE email = 'talktostevenson@gmail.com';

-- If no profile exists, you need to create it first
-- Get your user ID from auth.users table
SELECT id, email 
FROM auth.users 
WHERE email = 'talktostevenson@gmail.com';

-- Then create the profile (replace YOUR_USER_ID with the actual ID from above)
-- INSERT INTO profiles (id, email, full_name, is_admin, role, created_at, updated_at)
-- VALUES (
--   'YOUR_USER_ID',
--   'talktostevenson@gmail.com',
--   'Admin User',
--   true,
--   'admin',
--   NOW(),
--   NOW()
-- );

-- Verify the fix worked
SELECT id, email, is_admin, role 
FROM profiles 
WHERE email = 'talktostevenson@gmail.com';
