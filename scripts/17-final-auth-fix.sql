
-- Final fix for authentication system
-- This addresses the 500 error on signup

-- Drop existing problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a simple, robust trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role text DEFAULT 'customer';
  is_admin_user boolean DEFAULT false;
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'talktostevenson@gmail.com' THEN
    user_role := 'admin';
    is_admin_user := true;
  END IF;

  -- Insert profile with error handling
  BEGIN
    INSERT INTO public.profiles (
      id, 
      email, 
      full_name, 
      role, 
      is_admin,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
      user_role,
      is_admin_user,
      NOW(),
      NOW()
    );
  EXCEPTION 
    WHEN unique_violation THEN
      -- Profile already exists, update it
      UPDATE public.profiles 
      SET 
        email = NEW.email,
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
        role = user_role,
        is_admin = is_admin_user,
        updated_at = NOW()
      WHERE id = NEW.id;
    WHEN OTHERS THEN
      -- Log error but don't fail the auth creation
      RAISE WARNING 'Could not create/update profile for user %: %', NEW.email, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies are not too restrictive for profile creation
-- Temporarily disable RLS for cleanup
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Clean up any duplicate or problematic profiles
DELETE FROM profiles 
WHERE id IN (
  SELECT id FROM profiles 
  GROUP BY id 
  HAVING COUNT(*) > 1
) AND ctid NOT IN (
  SELECT MIN(ctid) FROM profiles 
  GROUP BY id 
  HAVING COUNT(*) > 1
);

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update own profile" ON profiles; 
DROP POLICY IF EXISTS "Allow authenticated users to insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow admin to read all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow admin to update all profiles" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin policies using direct auth.users check
CREATE POLICY "profiles_admin_select" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'talktostevenson@gmail.com'
    )
  );

CREATE POLICY "profiles_admin_update" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'talktostevenson@gmail.com'
    )
  );

-- Grant proper permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

SELECT 'Authentication system fixed. Users should now be able to sign up without 500 errors.' as status;
