# Electronics E-Commerce Store (Redesigned)

A modern, premium e-commerce platform built with React, Supabase, and Paystack featuring a clean UI, Google OAuth, and role-based admin access.

![Reference Design Screenshot](file:///C:/Users/uu/.gemini/antigravity/brain/7c2f0c1f-d807-4956-b072-313fec3b89c7/uploaded_image_1764616571806.jpg)

## ✨ Features

### User Experience
- **Modern UI**: Clean, white premium design matching modern e-commerce standards
- **Hero Banner Slider**: Auto-rotating promotional banners
- **Category Navigation**: Circular icons for popular categories
- **Search Functionality**: Central search bar with instant results
- **Google OAuth**: Quick sign-in with Google account
- **Shopping Cart**: Persistent cart with Zustand state management
- **Secure Checkout**: Paystack integration for NGN payments

### Admin Features
- **Role-Based Access**: Admin-only dashboard (hidden from regular users)
- **Product Management**: Full CRUD operations for products
- **Order Management**: View and update order statuses
- **Revenue Analytics**: Track total revenue, orders, and inventory

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM
- **State**: Zustand (cart management)
- **Backend**: Supabase (Auth, Database, RLS)
- **Payments**: Paystack (NGN/Naira)
- **Authentication**: Email/Password + Google OAuth

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### 3. Database Setup
1. Go to **Supabase Dashboard → SQL Editor**
2. Run the SQL in `supabase_schema.sql`
3. This creates `products` and `orders` tables with RLS policies

### 4. Google OAuth Setup (Optional but Recommended)
1. **Supabase**: Enable Google provider in Authentication → Providers
2. **Google Cloud Console**: Create OAuth 2.0 credentials
3. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`

See `ADMIN_SETUP_GUIDE.md` for detailed instructions.

### 5. Run Development Server
```bash
npm run dev
```

App will be available at **http://localhost:5174**

## 🔐 Admin Setup

To create an admin user:

### Quick Method (Supabase Dashboard):
1. Sign up through the app
2. Go to Supabase Dashboard → Authentication → Users
3. Click on your user
4. Edit **App Metadata** (not User Metadata)
5. Add: `"role": "admin"`
6. Save and re-login

### SQL Method:
```sql
UPDATE auth.users
SET app_metadata = app_metadata || '{"role": "admin"}'::jsonb
WHERE email = 'your@email.com';
```

**Full guide**: See `ADMIN_SETUP_GUIDE.md`

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Modern navbar with search & icons
│   ├── CategorySection.jsx  # Circular category icons
│   ├── HeroSlider.jsx       # Banner slider
│   └── ProtectedRoute.jsx   # Admin route protection
├── pages/
│   ├── Home.jsx             # Landing page with slider & products
│   ├── ProductDetails.jsx   # Single product view
│   ├── Cart.jsx             # Shopping cart
│   ├── Checkout.jsx         # Payment with Paystack
│   ├── Login.jsx            # Email/Google login
│   ├── Signup.jsx           # Email/Google signup
│   └── Admin/
│       ├── Dashboard.jsx    # Admin overview
│       ├── ManageProducts.jsx  # Product CRUD
│       └── Orders.jsx       # Order management
├── hooks/
│   └── useAuth.jsx          # Auth context with Google OAuth
├── store/
│   └── cartStore.js         # Zustand cart state
├── services/
│   └── supabase.js          # Supabase client
└── App.jsx                  # Main router
```

## 🎨 UI Components

### Navbar
- Logo with brand colors ("emax")
- Central search bar
- Location dropdown
- User menu with admin access
- Cart icon with badge
- Category navigation bar

### Home Page
- Hero banner slider (auto-rotating)
- "Explore Popular Categories" section
- Product grid with clean cards
- Responsive layout (2-5 columns)

### Product Cards
- Square aspect ratio images
- Clean white background
- Rounded corners
- Price in Naira (₦)
- Add to cart button
- Stock status indicator

## 🔒 Security

### Multi-Layer Protection

1. **Frontend**: Admin UI elements hidden via role check
```javascript
const isAdmin = user?.app_metadata?.role === 'admin';
```

2. **Route Protection**: ProtectedRoute wrapper
```javascript
<ProtectedRoute adminOnly={true}>
  <AdminDashboard />
</ProtectedRoute>
```

3. **Database**: RLS policies
```sql
(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
```

## 💳 Paystack Integration

Payment flow:
1. User fills billing info
2. Clicks "Pay with Paystack"
3. Paystack modal opens
4. Payment processed in NGN (Naira)
5. Order saved to database
6. Cart cleared on success

## 📱 Responsive Design

- **Mobile**: Single column, collapsible nav
- **Tablet**: 2-3 column grid
- **Desktop**: 4-5 column grid
- **Large**: 5+ column grid

All components built with Tailwind's responsive classes.

## 🧪 Testing

### User Flow
1. Sign up (email or Google)
2. Browse products
3. Search & filter by category
4. Add to cart
5. Checkout with Paystack (test mode)
6. View order confirmation

### Admin Flow
1. Set admin role in Supabase
2. Log in (email or Google)
3. See "Admin Dashboard" in user menu
4. Add/edit/delete products
5. View and manage orders

## 📚 Documentation

- **[UI_REDESIGN_SUMMARY.md](file:///c:/Users/uu/Desktop/Ecommerce/UI_REDESIGN_SUMMARY.md)**: Complete UI redesign details
- **[ADMIN_SETUP_GUIDE.md](file:///c:/Users/uu/Desktop/Ecommerce/ADMIN_SETUP_GUIDE.md)**: Step-by-step admin user setup
- **[supabase_schema.sql](file:///c:/Users/uu/Desktop/Ecommerce/supabase_schema.sql)**: Database schema with RLS policies

## 🆘 Troubleshooting

### Admin button not showing?
- Check **app_metadata** (not user_metadata)
- Log out and back in
- Verify role: `console.log(user.app_metadata)`

### Google OAuth not working?
- Enable Google provider in Supabase
- Add OAuth credentials from Google Cloud Console
- Check redirect URLs match

### Paystack payment failing?
- Use test public key for development
- Ensure amount is in kobo (multiply by 100)
- Check email matches order

## 🚀 Deployment

### Vercel/Netlify
```bash
npm run build
# Deploy the 'dist' folder
```

### Environment Variables
Add to your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PAYSTACK_PUBLIC_KEY`

## 📄 License

MIT

---

## 🎯 Key Differences from Original

### ✨ What's New
- Modern UI matching reference screenshot
- Google OAuth sign-in
- Hero banner slider
- Category section with circular icons
- Improved navbar with search
- app_metadata role detection
- Better responsive design

### ✅ What's Preserved
- All routing logic
- Database schema (products, orders)
- Supabase CRUD operations
- Paystack payment flow (NGN)
- Cart state management
- User authentication flow
- Admin CRUD functionality

**This is a VISUAL redesign with enhanced UX while maintaining 100% of the original business logic.**

---

Made with ❤️ using React, Supabase, and Paystack
