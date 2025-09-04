-- Adding sample products for new categories
WITH category_ids AS (
  SELECT id, slug FROM categories WHERE slug IN ('wigs', 'perfumes', 'cars', 'bags')
)
INSERT INTO products (
  id, name, slug, description, short_description, price, compare_at_price, 
  category_id, sku, stock_quantity, low_stock_threshold, weight, dimensions,
  images, features, specifications, is_featured, is_active, status,
  meta_title, meta_description
) VALUES
  -- Wigs
  (gen_random_uuid(), 'Premium Lace Front Wig', 'premium-lace-front-wig', 
   'High-quality human hair lace front wig with natural hairline', 
   'Premium human hair wig with lace front construction',
   299.99, 399.99, (SELECT id FROM category_ids WHERE slug = 'wigs'), 
   'WIG-LF-001', 25, 5, 0.3, '16 inches length',
   ARRAY['/placeholder.svg?height=300&width=300&text=Lace+Front+Wig'],
   ARRAY['100% Human Hair', 'Lace Front', 'Natural Hairline', 'Heat Resistant'],
   '{"Hair Type": "Human Hair", "Length": "16 inches", "Color": "Natural Black"}',
   true, true, 'active',
   'Premium Lace Front Wig - Natural Human Hair',
   'High-quality human hair lace front wig with natural hairline. Perfect for everyday wear.'
  ),
  
  -- Perfumes
  (gen_random_uuid(), 'Luxury Designer Perfume', 'luxury-designer-perfume',
   'Exquisite fragrance with notes of jasmine, vanilla, and sandalwood',
   'Luxury fragrance with floral and oriental notes',
   149.99, 199.99, (SELECT id FROM category_ids WHERE slug = 'perfumes'),
   'PERF-LUX-001', 40, 10, 0.1, '100ml bottle',
   ARRAY['/placeholder.svg?height=300&width=300&text=Designer+Perfume'],
   ARRAY['Long-lasting', 'Premium Ingredients', 'Elegant Bottle', 'Gift Box Included'],
   '{"Volume": "100ml", "Fragrance Family": "Floral Oriental", "Top Notes": "Jasmine"}',
   true, true, 'active',
   'Luxury Designer Perfume - Premium Fragrance',
   'Exquisite designer perfume with jasmine, vanilla, and sandalwood notes. Long-lasting luxury fragrance.'
  ),
  
  -- Cars
  (gen_random_uuid(), '2024 BMW X5 SUV', '2024-bmw-x5-suv',
   'Luxury SUV with advanced safety features and premium interior',
   'Premium luxury SUV with cutting-edge technology',
   65999.99, NULL, (SELECT id FROM category_ids WHERE slug = 'cars'),
   'CAR-BMW-X5-2024', 5, 1, 2000.0, '4922 x 2004 x 1745 mm',
   ARRAY['/placeholder.svg?height=300&width=300&text=BMW+X5'],
   ARRAY['All-Wheel Drive', 'Leather Interior', 'Navigation System', 'Backup Camera'],
   '{"Engine": "3.0L Turbo", "Transmission": "Automatic", "Fuel Type": "Gasoline", "Year": "2024"}',
   true, true, 'active',
   '2024 BMW X5 SUV - Luxury Vehicle',
   'Premium BMW X5 SUV with advanced safety features, luxury interior, and cutting-edge technology.'
  ),
  
  -- Bags
  (gen_random_uuid(), 'Designer Leather Handbag', 'designer-leather-handbag',
   'Elegant leather handbag perfect for any occasion',
   'Premium leather handbag with timeless design',
   399.99, 499.99, (SELECT id FROM category_ids WHERE slug = 'bags'),
   'BAG-LV-001', 15, 3, 0.8, '12 x 8 x 4 inches',
   ARRAY['/placeholder.svg?height=300&width=300&text=Designer+Handbag'],
   ARRAY['Genuine Leather', 'Multiple Compartments', 'Adjustable Strap', 'Dust Bag Included'],
   '{"Material": "Genuine Leather", "Dimensions": "12x8x4 inches", "Color": "Black"}',
   true, true, 'active',
   'Designer Leather Handbag - Premium Accessory',
   'Elegant designer leather handbag with multiple compartments. Perfect for any occasion.'
  );
