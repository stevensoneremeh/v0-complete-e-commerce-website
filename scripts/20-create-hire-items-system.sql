/*
  # Hire Items Management System

  1. New Tables
    - `hire_items`
      - `id` (uuid, primary key)
      - `name` (text, item name)
      - `slug` (text, unique, URL-friendly)
      - `description` (text)
      - `service_type` (text: 'car' or 'boat')
      - `price` (decimal, price per duration)
      - `duration` (text, e.g., 'per day', '3 hours')
      - `capacity` (text, e.g., '4 passengers')
      - `features` (jsonb array)
      - `images` (jsonb array of URLs)
      - `rating` (decimal)
      - `review_count` (integer)
      - `is_active` (boolean)
      - `sort_order` (integer)
      - `specifications` (jsonb object)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `hire_items` table
    - Public can read active items
    - Only admins can create, update, delete items
*/

-- Create hire_items table
CREATE TABLE IF NOT EXISTS hire_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL CHECK (service_type IN ('car', 'boat')),
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT 'per day',
  capacity TEXT NOT NULL DEFAULT '1 passenger',
  features JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hire_items_service_type ON hire_items(service_type);
CREATE INDEX IF NOT EXISTS idx_hire_items_is_active ON hire_items(is_active);
CREATE INDEX IF NOT EXISTS idx_hire_items_slug ON hire_items(slug);
CREATE INDEX IF NOT EXISTS idx_hire_items_sort_order ON hire_items(sort_order);

-- Enable RLS
ALTER TABLE hire_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active hire items"
  ON hire_items
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all hire items"
  ON hire_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_admin = true OR profiles.role = 'admin')
    )
  );

CREATE POLICY "Admins can create hire items"
  ON hire_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_admin = true OR profiles.role = 'admin')
    )
  );

CREATE POLICY "Admins can update hire items"
  ON hire_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_admin = true OR profiles.role = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_admin = true OR profiles.role = 'admin')
    )
  );

CREATE POLICY "Admins can delete hire items"
  ON hire_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_admin = true OR profiles.role = 'admin')
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_hire_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hire_items_updated_at
  BEFORE UPDATE ON hire_items
  FOR EACH ROW
  EXECUTE FUNCTION update_hire_items_updated_at();

-- Insert sample data
INSERT INTO hire_items (name, slug, description, service_type, price, duration, capacity, features, images, rating, review_count)
VALUES
  (
    'Luxury Sedan',
    'luxury-sedan',
    'Experience comfort and elegance with our premium luxury sedan hire service.',
    'car',
    150.00,
    'per day',
    '4 passengers',
    '["Professional Driver", "Air Conditioning", "Premium Interior", "GPS Navigation"]'::jsonb,
    '["/luxury-sedan-hire-premium-car-rental.jpg", "/placeholder.svg?height=300&width=400"]'::jsonb,
    4.9,
    127
  ),
  (
    'Executive SUV',
    'executive-suv',
    'Travel in style with our spacious executive SUV, perfect for families or groups.',
    'car',
    200.00,
    'per day',
    '7 passengers',
    '["Chauffeur Service", "Leather Seats", "Entertainment System", "Refreshments"]'::jsonb,
    '["/executive-suv-hire-luxury-vehicle-rental.jpg", "/placeholder.svg?height=300&width=400"]'::jsonb,
    4.8,
    89
  ),
  (
    'Sports Car',
    'sports-car',
    'Feel the thrill of driving a high-performance sports car.',
    'car',
    350.00,
    'per day',
    '2 passengers',
    '["Self Drive Option", "Premium Sound", "Performance Package", "Insurance Included"]'::jsonb,
    '["/sports-car-hire-luxury-rental-premium.jpg", "/placeholder.svg?height=300&width=400"]'::jsonb,
    4.9,
    156
  ),
  (
    'Sunset Cruise',
    'sunset-cruise',
    'Enjoy a romantic sunset cruise with dinner and live entertainment.',
    'boat',
    120.00,
    '3 hours',
    '12 passengers',
    '["Dinner Included", "Live Music", "Open Bar", "Professional Crew"]'::jsonb,
    '["/sunset-cruise-luxury-boat-hire-premium.jpg", "/placeholder.svg?height=300&width=400"]'::jsonb,
    4.9,
    203
  ),
  (
    'Private Yacht',
    'private-yacht',
    'Experience ultimate luxury with our private yacht charter service.',
    'boat',
    500.00,
    '6 hours',
    '20 passengers',
    '["Private Chef", "Water Sports", "Premium Amenities", "Dedicated Staff"]'::jsonb,
    '["/private-yacht-hire-luxury-boat-cruise.jpg", "/placeholder.svg?height=300&width=400"]'::jsonb,
    5.0,
    78
  ),
  (
    'Island Hopping',
    'island-hopping',
    'Discover multiple islands with our guided island hopping tour.',
    'boat',
    180.00,
    '8 hours',
    '15 passengers',
    '["Multiple Stops", "Snorkeling Gear", "Lunch Included", "Tour Guide"]'::jsonb,
    '["/island-hopping-cruise-luxury-boat-tour.jpg", "/placeholder.svg?height=300&width=400"]'::jsonb,
    4.8,
    134
  )
ON CONFLICT (slug) DO NOTHING;
