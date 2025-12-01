-- =============================================
-- Quick Setup: Admin + Sample Products
-- =============================================
-- Run this if you get "already exists" errors

-- 1. Set your email as admin
UPDATE auth.users
SET app_metadata = app_metadata || '{"role": "admin"}'::jsonb
WHERE email = 'ibehmichael55@gmail.com';

-- 2. Verify it worked (check the results below)
SELECT email, app_metadata 
FROM auth.users 
WHERE email = 'ibehmichael55@gmail.com';

-- 3. Insert sample electronics products
INSERT INTO products (name, description, price, category, stock, images) VALUES
('iPhone 16 Pro Max', 'Latest iPhone with A18 Pro chip, 256GB', 1200000, 'smartphones', 15, ARRAY['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400']),
('MacBook Pro M4', '14-inch, 16GB RAM, 512GB SSD', 1800000, 'laptops', 10, ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400']),
('Sony WH-1000XM5', 'Premium noise-cancelling headphones', 180000, 'headphones', 30, ARRAY['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400']),
('Canon EOS R6', 'Full-frame mirrorless camera', 2500000, 'cameras', 5, ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400']),
('PlayStation 5', 'Latest gaming console with controller', 650000, 'gaming', 20, ARRAY['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400']),
('iPad Air M2', '11-inch, 128GB, WiFi', 450000, 'tablets', 25, ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400']),
('Apple Watch Series 10', 'GPS + Cellular, 45mm', 350000, 'smartwatches', 40, ARRAY['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400']),
('Samsung 55" QLED TV', '4K Smart TV with HDR', 850000, 'tvs', 12, ARRAY['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400']),
('USB-C Cable 3-Pack', 'Fast charging cables, 6ft', 5000, 'accessories', 100, ARRAY['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400']),
('Logitech MX Master 3', 'Wireless mouse for productivity', 45000, 'accessories', 50, ARRAY['https://images.unsplash.com/photo-1527814050087-3793815479db?w=400']);

-- Done! Check the results to verify admin role was set
