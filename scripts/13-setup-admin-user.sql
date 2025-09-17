-- Setup talktostevenson@gmail.com as admin user
-- This script ensures the admin user is properly configured

-- First, check if the user exists in auth.users and get their ID
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Try to find the user in auth.users
    SELECT id INTO user_id 
    FROM auth.users 
    WHERE email = 'talktostevenson@gmail.com' 
    LIMIT 1;
    
    IF user_id IS NOT NULL THEN
        -- User exists in auth, update their profile
        INSERT INTO profiles (id, email, full_name, is_admin, role, created_at, updated_at)
        VALUES (
            user_id,
            'talktostevenson@gmail.com',
            'Admin User',
            true,
            'admin',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) 
        DO UPDATE SET 
            is_admin = true,
            role = 'admin',
            updated_at = NOW();
            
        RAISE NOTICE 'Updated existing user profile for talktostevenson@gmail.com';
    ELSE
        -- User doesn't exist in auth yet, create a placeholder profile
        -- This will be updated when they sign up
        INSERT INTO profiles (id, email, full_name, is_admin, role, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'talktostevenson@gmail.com',
            'Admin User',
            true,
            'admin',
            NOW(),
            NOW()
        )
        ON CONFLICT (email) 
        DO UPDATE SET 
            is_admin = true,
            role = 'admin',
            updated_at = NOW();
            
        RAISE NOTICE 'Created placeholder profile for talktostevenson@gmail.com - will be linked when user signs up';
    END IF;
END $$;

-- Also create a trigger to automatically make this email admin when they sign up
CREATE OR REPLACE FUNCTION make_admin_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is the admin email
    IF NEW.email = 'talktostevenson@gmail.com' THEN
        -- Update the profile to admin
        UPDATE profiles 
        SET is_admin = true, role = 'admin', updated_at = NOW()
        WHERE id = NEW.id OR email = NEW.email;
        
        -- If no profile exists, create one
        INSERT INTO profiles (id, email, full_name, is_admin, role, created_at, updated_at)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'Admin User'),
            true,
            'admin',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            is_admin = true,
            role = 'admin',
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table (if it doesn't exist)
DROP TRIGGER IF EXISTS make_admin_on_signup_trigger ON auth.users;
CREATE TRIGGER make_admin_on_signup_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION make_admin_on_signup();

-- Verify the admin setup
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
