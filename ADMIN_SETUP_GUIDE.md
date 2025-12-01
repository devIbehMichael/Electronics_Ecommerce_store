# 🔐 Admin Setup Guide - Updated for app_metadata

## Step-by-Step: How to Create an Admin User

### Method 1: Via Supabase Dashboard (Recommended & Easiest)

#### Step 1: Sign up through your app
1. Go to http://localhost:5174
2. Click **"Sign Up"** or **"Create Account"**
3. Enter your email and password
4. Complete the signup process

#### Step 2: Access Supabase Dashboard
1. Open [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **"Authentication"** in the left sidebar
4. Click **"Users"**

#### Step 3: Edit User Metadata
1. Find your user in the list
2. Click on the user row to open details
3. Look for the **"App Metadata"** section (NOT "User Metadata")
4. Click the edit icon
5. Update the JSON to:

```json
{
  "provider": "email",
  "providers": ["email"],
  "role": "admin"
}
```

6. Click **"Save"**

#### Step 4: Verify Admin Access
1. Log out from your app
2. Log back in with your credentials
3. You should now see the **"Admin Dashboard"** button in the navbar
4. Click it to access `/admin/dashboard`

---

### Method 2: Via SQL Query (Alternative)

If you prefer using SQL directly in the Supabase SQL Editor:

```sql
-- Replace 'your-email@example.com' with the actual email
UPDATE auth.users
SET app_metadata = app_metadata || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';

-- Verify it worked:
SELECT email, app_metadata 
FROM auth.users 
WHERE email = 'your-email@example.com';
```

---

## 📝 Important Notes

### ✅ app_metadata vs user_metadata

- **app_metadata**: Used for roles and permissions (admin-only editable)
- **user_metadata**: Used for user profile data (user-editable)

This app uses **app_metadata.role** for admin detection as per requirements.

### 🔒 Security

The admin role is protected at multiple levels:

1. **Frontend**: Admin button only visible when `user?.app_metadata?.role === 'admin'`
2. **Routes**: ProtectedRoute component blocks non-admins
3. **Database**: RLS policies check `auth.jwt() -> 'app_metadata' ->> 'role'`

### 🌐 Google OAuth Users

If a user signs up via Google OAuth:

1. They will be created with default user role
2. You must manually set their admin role in Supabase Dashboard
3. Follow the same steps as Method 1 above

---

## 🧪 Testing Checklist

### As Regular User:
- [ ] Sign up via email/password
- [ ] Sign up via Google OAuth
- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout with Paystack
- [ ] Verify "Admin Dashboard" button is NOT visible

### As Admin User:
- [ ] Set role to admin in Supabase
- [ ] Log out and log back in
- [ ] Verify "Admin Dashboard" button IS visible
- [ ] Access /admin/dashboard
- [ ] Add/Edit/Delete products
- [ ] View all orders
- [ ] Update order statuses

---

## ⚡ Quick Reference

**Admin Detection Code:**
```javascript
const isAdmin = user?.app_metadata?.role === 'admin';
```

**Set Admin via Dashboard:**
```
Authentication → Users → Click User → Edit App Metadata → Add "role": "admin"
```

**Set Admin via SQL:**
```sql
UPDATE auth.users SET app_metadata = app_metadata || '{"role": "admin"}'::jsonb WHERE email = 'your@email.com';
```

---

## 🚨 Troubleshooting

**Problem**: Admin button not showing after setting role

**Solution**:
1. Make sure you edited **app_metadata** (not user_metadata)
2. Log out completely and log back in
3. Check browser console for user object: `console.log(user.app_metadata)`
4. Verify the role was saved: Check Supabase Dashboard → Authentication → Users

**Problem**: Can't access admin routes even with admin role

**Solution**:
1. Check that app_metadata.role === "admin" (exact match)
2. Clear browser cache and localStorage
3. Log out and log back in
4. Verify RLS policies are set up correctly in Supabase

---

Need help? Check the main README.md or the database schema in `supabase_schema.sql`.
