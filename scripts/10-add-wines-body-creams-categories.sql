-- Adding Wines and Body creams categories to complete the new category set
INSERT INTO categories (id, name, slug, description, image_url, is_active, sort_order) VALUES
  (gen_random_uuid(), 'Wines', 'wines', 'Premium wines and beverages', '/placeholder.svg?height=200&width=200&text=Wines', true, 5),
  (gen_random_uuid(), 'Body Creams', 'body-creams', 'Luxury body creams and skincare products', '/placeholder.svg?height=200&width=200&text=Body+Creams', true, 6)
ON CONFLICT (slug) DO NOTHING;
