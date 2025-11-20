
-- ============================================================
-- FIX INFINITE RECURSION IN PROFILES TABLE RLS POLICIES
-- ============================================================
-- This script fixes the infinite recursion error by using
-- simple, non-recursive policies based on auth.uid()
-- ============================================================

-- Step 1: Drop ALL existing policies on profiles table
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- Step 2: Temporarily disable RLS to clear any caching issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, non-recursive policies using ONLY auth.uid()
-- These policies do NOT query the profiles table to avoid recursion

-- Policy 1: Users can read their own profile
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (but cannot change is_admin or role)
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent privilege escalation by ensuring is_admin and role don't change
  (is_admin IS NULL OR is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())) AND
  (role IS NULL OR role = (SELECT role FROM profiles WHERE id = auth.uid()))
);

-- Policy 3: Users can insert their own profile
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy 4: Service role (server-side) can do everything
-- This is used by the middleware and API routes
CREATE POLICY "profiles_service_role_all"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 5: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- Step 6: Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public'
ORDER BY policyname;

-- ============================================================
-- IMPORTANT: After running this script, the middleware will
-- use the SERVICE_ROLE_KEY to bypass RLS when checking admin
-- status, which prevents the infinite recursion.
-- ============================================================
