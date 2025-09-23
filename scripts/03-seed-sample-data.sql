-- Insert sample categories
INSERT INTO categories (name, description, slug, image_url) VALUES
('Electronics', 'Electronic devices and gadgets', 'electronics', '/images/categories/electronics.jpg'),
('Clothing', 'Fashion and apparel', 'clothing', '/images/categories/clothing.jpg'),
('Home & Garden', 'Home improvement and garden supplies', 'home-garden', '/images/categories/home-garden.jpg'),
('Books', 'Books and educational materials', 'books', '/images/categories/books.jpg'),
('Sports', 'Sports equipment and accessories', 'sports', '/images/categories/sports.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, short_description, slug, sku, price, compare_price, category_id, brand, tags, images, featured_image, is_featured) 
SELECT 
    'Wireless Bluetooth Headphones',
    'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    'Premium wireless headphones with noise cancellation',
    'wireless-bluetooth-headphones',
    'WBH-001',
    199.99,
    249.99,
    c.id,
    'AudioTech',
    ARRAY['wireless', 'bluetooth', 'headphones', 'audio'],
    ARRAY['/images/products/headphones-1.jpg', '/images/products/headphones-2.jpg'],
    '/images/products/headphones-1.jpg',
    true
FROM categories c WHERE c.slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, description, short_description, slug, sku, price, category_id, brand, tags, images, featured_image, is_featured)
SELECT 
    'Organic Cotton T-Shirt',
    'Comfortable and sustainable organic cotton t-shirt available in multiple colors and sizes.',
    'Sustainable organic cotton t-shirt',
    'organic-cotton-tshirt',
    'OCT-001',
    29.99,
    c.id,
    'EcoWear',
    ARRAY['organic', 'cotton', 'sustainable', 'clothing'],
    ARRAY['/images/products/tshirt-1.jpg', '/images/products/tshirt-2.jpg'],
    '/images/products/tshirt-1.jpg',
    true
FROM categories c WHERE c.slug = 'clothing'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, description, short_description, slug, sku, price, category_id, brand, tags, images, featured_image)
SELECT 
    'Smart Home Security Camera',
    'WiFi-enabled security camera with 4K recording, night vision, and mobile app control.',
    '4K WiFi security camera with night vision',
    'smart-security-camera',
    'SSC-001',
    149.99,
    c.id,
    'SecureHome',
    ARRAY['security', 'camera', 'smart home', 'wifi'],
    ARRAY['/images/products/camera-1.jpg', '/images/products/camera-2.jpg'],
    '/images/products/camera-1.jpg'
FROM categories c WHERE c.slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

-- Insert sample properties
INSERT INTO properties (title, description, property_type, address, city, country, bedrooms, bathrooms, square_feet, price_per_night, amenities, features, images, featured_image, is_available)
VALUES
('Luxury Downtown Apartment', 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views and modern amenities.', 'apartment', '123 Main Street', 'New York', 'USA', 2, 2, 1200, 250.00, ARRAY['wifi', 'kitchen', 'parking', 'gym'], ARRAY['city view', 'modern', 'central location'], ARRAY['/images/properties/apt-1.jpg', '/images/properties/apt-2.jpg'], '/images/properties/apt-1.jpg', true),
('Cozy Beach House', 'Charming beach house just steps from the ocean. Perfect for a relaxing getaway with family or friends.', 'house', '456 Ocean Drive', 'Miami', 'USA', 3, 2, 1800, 350.00, ARRAY['wifi', 'kitchen', 'parking', 'beach access'], ARRAY['ocean view', 'beach front', 'family friendly'], ARRAY['/images/properties/beach-1.jpg', '/images/properties/beach-2.jpg'], '/images/properties/beach-1.jpg', true),
('Modern Studio Loft', 'Stylish studio loft in trendy neighborhood with exposed brick walls and high ceilings.', 'studio', '789 Art District', 'Los Angeles', 'USA', 1, 1, 600, 180.00, ARRAY['wifi', 'kitchen', 'parking'], ARRAY['exposed brick', 'high ceilings', 'trendy area'], ARRAY['/images/properties/loft-1.jpg', '/images/properties/loft-2.jpg'], '/images/properties/loft-1.jpg', true)
ON CONFLICT DO NOTHING;

-- Create admin user profile (this will be created when the first admin signs up)
-- The auth.users entry will be created by Supabase Auth, we just need to ensure the profile is created with admin role

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_amount, usage_limit, is_active, expires_at)
VALUES
('WELCOME10', '10% off your first order', 'percentage', 10.00, 50.00, 100, true, NOW() + INTERVAL '30 days'),
('SAVE20', '$20 off orders over $100', 'fixed', 20.00, 100.00, 50, true, NOW() + INTERVAL '60 days'),
('FREESHIP', 'Free shipping on any order', 'fixed', 0.00, 0.00, 200, true, NOW() + INTERVAL '90 days')
ON CONFLICT (code) DO NOTHING;
