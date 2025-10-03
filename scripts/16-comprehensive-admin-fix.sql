-- Comprehensive fix for admin authentication and RLS policies
-- This script will fix all authentication issues once and for all

-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- Disable RLS temporarily to clean up
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Clean up existing admin profiles to avoid conflicts
DELETE FROM profiles WHERE email = 'talktostevenson@gmail.com';

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive RLS policy structure
-- Simple policies that don't cause recursion
CREATE POLICY "Allow authenticated users to read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Admin policies using direct email check to avoid recursion
CREATE POLICY "Allow admin to read all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

CREATE POLICY "Allow admin to update all profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'talktostevenson@gmail.com'
  )
);

-- Update the trigger to handle admin creation properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE WHEN NEW.email = 'talktostevenson@gmail.com' THEN true ELSE false END,
    CASE WHEN NEW.email = 'talktostevenson@gmail.com' THEN 'admin' ELSE 'customer' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Only create admin profile if auth user already exists
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
  -- Check if admin user exists in auth.users
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'talktostevenson@gmail.com' 
  LIMIT 1;
  
  -- Only insert profile if we have a valid user ID
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, full_name, is_admin, role, created_at, updated_at)
    VALUES (
      admin_user_id,
      'talktostevenson@gmail.com',
      'Admin User',
      true,
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      is_admin = true,
      role = 'admin',
      updated_at = NOW();
      
    RAISE NOTICE 'Admin profile created/updated successfully for existing auth user';
  ELSE
    RAISE NOTICE 'Admin auth user does not exist yet. Profile will be created automatically when user signs up.';
  END IF;
END $$;

-- Verify setup
SELECT 
  'Setup completed. Admin profile will be created when talktostevenson@gmail.com signs up.' as status;
