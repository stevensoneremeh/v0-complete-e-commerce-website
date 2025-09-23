-- Seed initial data for ABL Natasha Enterprises

-- Insert default admin settings
INSERT INTO admin_settings (key, value, description) VALUES
('site_name', '"ABL Natasha Enterprises"', 'Website name'),
('site_description', '"Premium e-commerce platform and luxury apartment rentals"', 'Website description'),
('contact_email', '"info@ablnatasha.com"', 'Contact email'),
('contact_phone', '"+234-903-094-4943"', 'Contact phone'),
('currency', '"NGN"', 'Default currency'),
('tax_rate', '0.075', 'Default tax rate (7.5%)'),
('shipping_fee', '2500.00', 'Default shipping fee'),
('free_shipping_threshold', '50000.00', 'Free shipping threshold'),
('max_cart_items', '50', 'Maximum items in cart'),
('order_auto_cancel_hours', '24', 'Hours before auto-canceling unpaid orders')
ON CONFLICT (key) DO NOTHING;

-- Insert main categories
INSERT INTO categories (id, name, slug, description, image_url, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Perfumes', 'perfumes', 'Luxury fragrances and perfumes', '/images/categories/perfumes.jpg', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Wigs', 'wigs', 'Premium quality wigs and hair pieces', '/images/categories/wigs.jpg', 2),
('550e8400-e29b-41d4-a716-446655440003', 'Cars', 'cars', 'Luxury and premium vehicles', '/images/categories/cars.jpg', 3),
('550e8400-e29b-41d4-a716-446655440004', 'Wines', 'wines', 'Fine wines and premium beverages', '/images/categories/wines.jpg', 4),
('550e8400-e29b-41d4-a716-446655440005', 'Body Creams', 'body-creams', 'Premium skincare and body care products', '/images/categories/body-creams.jpg', 5)
ON CONFLICT (id) DO NOTHING;

-- Insert subcategories for perfumes
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('Men''s Perfumes', 'mens-perfumes', 'Fragrances for men', '550e8400-e29b-41d4-a716-446655440001', 1),
('Women''s Perfumes', 'womens-perfumes', 'Fragrances for women', '550e8400-e29b-41d4-a716-446655440001', 2),
('Unisex Perfumes', 'unisex-perfumes', 'Fragrances for everyone', '550e8400-e29b-41d4-a716-446655440001', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for wigs
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('Human Hair Wigs', 'human-hair-wigs', 'Premium human hair wigs', '550e8400-e29b-41d4-a716-446655440002', 1),
('Synthetic Wigs', 'synthetic-wigs', 'High-quality synthetic wigs', '550e8400-e29b-41d4-a716-446655440002', 2),
('Lace Front Wigs', 'lace-front-wigs', 'Natural-looking lace front wigs', '550e8400-e29b-41d4-a716-446655440002', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, sku, price, compare_price, category_id, brand, tags, images, featured_image, is_featured, inventory_quantity) VALUES
('Chanel No. 5 Eau de Parfum', 'chanel-no-5-edp', 'The iconic fragrance that revolutionized the world of perfume', 'Timeless elegance in a bottle', 'PERF-001', 85000.00, 95000.00, '550e8400-e29b-41d4-a716-446655440001', 'Chanel', ARRAY['luxury', 'classic', 'womens'], ARRAY['/images/products/chanel-no5-1.jpg', '/images/products/chanel-no5-2.jpg'], '/images/products/chanel-no5-1.jpg', true, 25),
('Brazilian Body Wave Wig', 'brazilian-body-wave-wig', 'Premium 100% human hair wig with natural body wave texture', 'Luxurious Brazilian hair wig', 'WIG-001', 125000.00, 150000.00, '550e8400-e29b-41d4-a716-446655440002', 'Premium Hair', ARRAY['human-hair', 'brazilian', 'body-wave'], ARRAY['/images/products/brazilian-wig-1.jpg', '/images/products/brazilian-wig-2.jpg'], '/images/products/brazilian-wig-1.jpg', true, 15),
('Mercedes-Benz C-Class', 'mercedes-c-class', 'Luxury sedan with premium features and exceptional performance', 'Premium luxury sedan', 'CAR-001', 25000000.00, 28000000.00, '550e8400-e29b-41d4-a716-446655440003', 'Mercedes-Benz', ARRAY['luxury', 'sedan', 'premium'], ARRAY['/images/products/mercedes-c-class-1.jpg', '/images/products/mercedes-c-class-2.jpg'], '/images/products/mercedes-c-class-1.jpg', true, 3),
('Dom Pérignon Vintage 2012', 'dom-perignon-2012', 'Exceptional champagne from one of the world''s most prestigious houses', 'Luxury champagne', 'WINE-001', 180000.00, 200000.00, '550e8400-e29b-41d4-a716-446655440004', 'Dom Pérignon', ARRAY['champagne', 'luxury', 'vintage'], ARRAY['/images/products/dom-perignon-1.jpg', '/images/products/dom-perignon-2.jpg'], '/images/products/dom-perignon-1.jpg', true, 12),
('La Mer Moisturizing Cream', 'la-mer-moisturizing-cream', 'Legendary moisturizing cream with healing properties', 'Luxury skincare cream', 'CREAM-001', 95000.00, 110000.00, '550e8400-e29b-41d4-a716-446655440005', 'La Mer', ARRAY['luxury', 'skincare', 'moisturizer'], ARRAY['/images/products/la-mer-cream-1.jpg', '/images/products/la-mer-cream-2.jpg'], '/images/products/la-mer-cream-1.jpg', true, 30)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample properties
INSERT INTO properties (name, slug, description, short_description, property_type, bedrooms, bathrooms, max_guests, area_sqft, price_per_night, cleaning_fee, security_deposit, address, amenities, images, featured_image, is_featured, minimum_stay) VALUES
('Luxury Penthouse Suite', 'luxury-penthouse-suite', 'Stunning penthouse with panoramic city views, premium amenities, and world-class service', 'Luxury penthouse with city views', 'penthouse', 3, 3, 6, 2500, 150000.00, 25000.00, 300000.00, '{"street": "Victoria Island", "city": "Lagos", "state": "Lagos", "country": "Nigeria", "postal_code": "101241"}', ARRAY['wifi', 'air_conditioning', 'kitchen', 'parking', 'pool', 'gym', 'concierge', 'balcony', 'city_view'], ARRAY['/images/properties/penthouse-1.jpg', '/images/properties/penthouse-2.jpg', '/images/properties/penthouse-3.jpg'], '/images/properties/penthouse-1.jpg', true, 2),
('Executive Studio Apartment', 'executive-studio-apartment', 'Modern studio apartment perfect for business travelers and short stays', 'Modern executive studio', 'studio', 0, 1, 2, 800, 45000.00, 15000.00, 100000.00, '{"street": "Ikoyi", "city": "Lagos", "state": "Lagos", "country": "Nigeria", "postal_code": "101233"}', ARRAY['wifi', 'air_conditioning', 'kitchenette', 'workspace', 'parking'], ARRAY['/images/properties/studio-1.jpg', '/images/properties/studio-2.jpg'], '/images/properties/studio-1.jpg', false, 1),
('Family Villa with Pool', 'family-villa-pool', 'Spacious family villa with private pool, garden, and entertainment areas', 'Family villa with private pool', 'villa', 4, 4, 8, 3500, 200000.00, 35000.00, 500000.00, '{"street": "Lekki Phase 1", "city": "Lagos", "state": "Lagos", "country": "Nigeria", "postal_code": "101245"}', ARRAY['wifi', 'air_conditioning', 'full_kitchen', 'parking', 'private_pool', 'garden', 'bbq', 'playground'], ARRAY['/images/properties/villa-1.jpg', '/images/properties/villa-2.jpg', '/images/properties/villa-3.jpg'], '/images/properties/villa-1.jpg', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample coupons
INSERT INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, valid_until) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off your first order', 'percentage', 10.00, 20000.00, 1000, NOW() + INTERVAL '30 days'),
('LUXURY50', 'Luxury Items Discount', 'Save ₦50,000 on luxury items', 'fixed_amount', 50000.00, 200000.00, 100, NOW() + INTERVAL '14 days'),
('FREESHIP', 'Free Shipping', 'Free shipping on all orders', 'fixed_amount', 2500.00, 0.00, 500, NOW() + INTERVAL '7 days')
ON CONFLICT (code) DO NOTHING;
