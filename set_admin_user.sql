-- Run this in Supabase SQL Editor to make a user an admin
-- Replace 'user@example.com' with the actual email address

UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'user@example.com';

-- To verify it worked, you can run:
SELECT email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'user@example.com';
