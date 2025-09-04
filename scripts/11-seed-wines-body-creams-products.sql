-- Adding sample products for Wines and Body creams categories
WITH category_ids AS (
  SELECT id, slug FROM categories WHERE slug IN ('wines', 'body-creams')
)
INSERT INTO products (
  id, name, slug, description, short_description, price, compare_at_price, 
  category_id, sku, stock_quantity, low_stock_threshold, weight, dimensions,
  images, features, specifications, is_featured, is_active, status,
  meta_title, meta_description
) VALUES
  -- Wines
  (gen_random_uuid(), 'Premium Red Wine Collection', 'premium-red-wine-collection',
   'Exquisite collection of aged red wines from renowned vineyards',
   'Premium aged red wine with rich flavor profile',
   89.99, 120.00, (SELECT id FROM category_ids WHERE slug = 'wines'),
   'WINE-RED-001', 30, 5, 0.75, '750ml bottle',
   ARRAY['/placeholder.svg?height=300&width=300&text=Premium+Red+Wine'],
   ARRAY['Aged 5 Years', 'Premium Vineyard', 'Rich Flavor', 'Gift Box Available'],
   '{"Volume": "750ml", "Alcohol Content": "13.5%", "Origin": "France", "Vintage": "2019"}',
   true, true, 'active',
   'Premium Red Wine Collection - Aged Wine',
   'Exquisite collection of aged red wines from renowned vineyards. Perfect for special occasions.'
  ),
  
  (gen_random_uuid(), 'Champagne Luxury Edition', 'champagne-luxury-edition',
   'Premium champagne with elegant bubbles and sophisticated taste',
   'Luxury champagne for celebrations and special moments',
   199.99, 250.00, (SELECT id FROM category_ids WHERE slug = 'wines'),
   'WINE-CHAMP-001', 20, 3, 0.75, '750ml bottle',
   ARRAY['/placeholder.svg?height=300&width=300&text=Luxury+Champagne'],
   ARRAY['Premium Bubbles', 'Elegant Taste', 'Limited Edition', 'Gift Packaging'],
   '{"Volume": "750ml", "Alcohol Content": "12%", "Origin": "France", "Type": "Brut"}',
   true, true, 'active',
   'Champagne Luxury Edition - Premium Sparkling Wine',
   'Premium champagne with elegant bubbles and sophisticated taste. Perfect for celebrations.'
  ),
  
  -- Body Creams
  (gen_random_uuid(), 'Luxury Anti-Aging Body Cream', 'luxury-anti-aging-body-cream',
   'Premium anti-aging body cream with natural ingredients and vitamins',
   'Luxury body cream with anti-aging properties',
   79.99, 99.99, (SELECT id FROM category_ids WHERE slug = 'body-creams'),
   'CREAM-ANTI-001', 50, 10, 0.2, '200ml jar',
   ARRAY['/placeholder.svg?height=300&width=300&text=Anti-Aging+Cream'],
   ARRAY['Anti-Aging Formula', 'Natural Ingredients', 'Vitamin E', 'Moisturizing'],
   '{"Volume": "200ml", "Key Ingredients": "Vitamin E, Collagen", "Skin Type": "All Types"}',
   true, true, 'active',
   'Luxury Anti-Aging Body Cream - Premium Skincare',
   'Premium anti-aging body cream with natural ingredients and vitamins for youthful skin.'
  ),
  
  (gen_random_uuid(), 'Organic Moisturizing Body Butter', 'organic-moisturizing-body-butter',
   'Rich organic body butter with shea and cocoa butter for deep moisturization',
   'Organic body butter for intense hydration',
   45.99, 59.99, (SELECT id FROM category_ids WHERE slug = 'body-creams'),
   'CREAM-ORG-001', 40, 8, 0.25, '250ml jar',
   ARRAY['/placeholder.svg?height=300&width=300&text=Organic+Body+Butter'],
   ARRAY['100% Organic', 'Shea Butter', 'Cocoa Butter', 'Deep Moisturizing'],
   '{"Volume": "250ml", "Key Ingredients": "Shea Butter, Cocoa Butter", "Certification": "Organic"}',
   true, true, 'active',
   'Organic Moisturizing Body Butter - Natural Skincare',
   'Rich organic body butter with shea and cocoa butter for deep moisturization and soft skin.'
  );
