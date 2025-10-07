-- Row Level Security (RLS) Policies for hire_services table
-- Run this in your Supabase SQL Editor after creating the hire_services table

-- Enable RLS on hire_services table
ALTER TABLE hire_services ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read active services (public access for hire page)
CREATE POLICY "Allow public read access to active hire services"
ON hire_services FOR SELECT
USING (is_active = true);

-- Policy: Allow admins to view all services (including inactive)
CREATE POLICY "Allow admins to view all hire services"
ON hire_services FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Policy: Allow admins to insert new services
CREATE POLICY "Allow admins to insert hire services"
ON hire_services FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Policy: Allow admins to update services
CREATE POLICY "Allow admins to update hire services"
ON hire_services FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Policy: Allow admins to delete services
CREATE POLICY "Allow admins to delete hire services"
ON hire_services FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
