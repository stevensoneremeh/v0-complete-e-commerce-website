-- Adding new product categories: Wigs, Perfumes, Cars, Bags
INSERT INTO categories (id, name, slug, description, image_url, is_active, sort_order) VALUES
  (gen_random_uuid(), 'Wigs', 'wigs', 'Premium quality wigs and hair pieces', '/placeholder.svg?height=200&width=200&text=Wigs', true, 1),
  (gen_random_uuid(), 'Perfumes', 'perfumes', 'Luxury fragrances and perfumes', '/placeholder.svg?height=200&width=200&text=Perfumes', true, 2),
  (gen_random_uuid(), 'Cars', 'cars', 'Premium vehicles and automotive', '/placeholder.svg?height=200&width=200&text=Cars', true, 3),
  (gen_random_uuid(), 'Bags', 'bags', 'Designer bags and accessories', '/placeholder.svg?height=200&width=200&text=Bags', true, 4)
ON CONFLICT (slug) DO NOTHING;
