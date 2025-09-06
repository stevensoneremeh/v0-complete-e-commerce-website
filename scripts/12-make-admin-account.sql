-- Make talktostevenson@gmail.com an admin account
-- This script updates the profiles table to set is_admin = true for the specified email

-- First, check if the profile exists and update it
UPDATE profiles 
SET 
  is_admin = true,
  role = 'admin',
  updated_at = NOW()
WHERE email = 'talktostevenson@gmail.com';

-- If no rows were affected, it means the user hasn't signed up yet
-- Insert a placeholder profile that will be updated when they sign up
INSERT INTO profiles (
  id,
  email,
  is_admin,
  role,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  'talktostevenson@gmail.com',
  true,
  'admin',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'talktostevenson@gmail.com'
);

-- Verify the admin account was created/updated
SELECT 
  id,
  email,
  full_name,
  is_admin,
  role,
  created_at,
  updated_at
FROM profiles 
WHERE email = 'talktostevenson@gmail.com';
