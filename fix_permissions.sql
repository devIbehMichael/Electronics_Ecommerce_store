-- =============================================
-- FIX PERMISSIONS (Robust Version)
-- =============================================

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert products." ON products;
DROP POLICY IF EXISTS "Admins can update products." ON products;
DROP POLICY IF EXISTS "Admins can delete products." ON products;

-- 2. Create new policies that allow BOTH 'admin' role AND your specific email
-- This ensures you can edit even if the role setup is flaky

-- INSERT Policy
CREATE POLICY "Admins can insert products"
ON products FOR INSERT
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
  (auth.jwt() ->> 'email') = 'ibehmichael55@gmail.com'
);

-- UPDATE Policy
CREATE POLICY "Admins can update products"
ON products FOR UPDATE
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
  (auth.jwt() ->> 'email') = 'ibehmichael55@gmail.com'
);

-- DELETE Policy
CREATE POLICY "Admins can delete products"
ON products FOR DELETE
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
  (auth.jwt() ->> 'email') = 'ibehmichael55@gmail.com'
);

-- 3. Verify your user data (just to see what's in the DB)
SELECT email, raw_app_meta_data 
FROM auth.users 
WHERE email = 'ibehmichael55@gmail.com';
