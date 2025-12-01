-- =============================================
-- E-Commerce Store Database Schema
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PRODUCTS TABLE
-- =============================================
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category text,
  stock int default 0,
  images text[],
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  items jsonb not null,
  total_price numeric(10, 2) not null,
  payment_status text default 'pending',
  order_status text default 'pending',
  created_at timestamp default now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
alter table products enable row level security;
alter table orders enable row level security;

-- =============================================
-- PRODUCTS POLICIES
-- =============================================

-- Public products are viewable by everyone
create policy "Public products are viewable by everyone."
  on products for select
  using ( true );

-- Admins can insert products
create policy "Admins can insert products."
  on products for insert
  with check ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

-- Admins can update products
create policy "Admins can update products."
  on products for update
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

-- Admins can delete products
create policy "Admins can delete products."
  on products for delete
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

-- =============================================
-- ORDERS POLICIES
-- =============================================

-- Users can view their own orders
create policy "Users can view their own orders."
  on orders for select
  using ( auth.uid() = user_id );

-- Admins can view all orders
create policy "Admins can view all orders."
  on orders for select
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

-- Users can insert their own orders
create policy "Users can insert their own orders."
  on orders for insert
  with check ( auth.uid() = user_id );

-- =============================================
-- ADMIN ROLE SETUP
-- =============================================

-- To make a user an admin, run this query after they sign up:
-- Replace 'user@example.com' with the actual user's email

 UPDATE auth.users
 SET app_metadata = app_metadata || '{"role": "admin"}'::jsonb
 WHERE email = 'ibehmichael55@gmail.com';

 To verify admin status:
 SELECT email, app_metadata FROM auth.users WHERE email = 'ibehmichael55@gmail.com';

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Uncomment to insert sample electronics products:

INSERT INTO products (name, description, price, category, stock, images) VALUES
('iPhone 16 Pro Max', 'Latest iPhone with A18 Pro chip, 256GB', 1200000, 'smartphones', 15, ARRAY['https://example.com/iphone.jpg']),
('MacBook Pro M4', '14-inch, 16GB RAM, 512GB SSD', 1800000, 'laptops', 10, ARRAY['https://example.com/macbook.jpg']),
('Sony WH-1000XM5', 'Premium noise-cancelling headphones', 180000, 'headphones', 30, ARRAY['https://example.com/sony-headphones.jpg']),
('Canon EOS R6', 'Full-frame mirrorless camera', 2500000, 'cameras', 5, ARRAY['https://example.com/canon.jpg']),
('PlayStation 5', 'Latest gaming console with controller', 650000, 'gaming', 20, ARRAY['https://example.com/ps5.jpg']),
('iPad Air M2', '11-inch, 128GB, WiFi', 450000, 'tablets', 25, ARRAY['https://example.com/ipad.jpg']),
('Apple Watch Series 10', 'GPS + Cellular, 45mm', 350000, 'smartwatches', 40, ARRAY['https://example.com/apple-watch.jpg']),
('Samsung 55" QLED TV', '4K Smart TV with HDR', 850000, 'tvs', 12, ARRAY['https://example.com/samsung-tv.jpg']),
('USB-C Cable 3-Pack', 'Fast charging cables, 6ft', 5000, 'accessories', 100, ARRAY['https://example.com/cables.jpg']),
('Logitech MX Master 3', 'Wireless mouse for productivity', 45000, 'accessories', 50, ARRAY['https://example.com/mouse.jpg']);

