# Admin Dashboard Guide for ABL Natasha Enterprises

## Accessing the Admin Dashboard

### Step 1: Sign In
1. Go to the website and click "Login" 
2. Sign in with your admin account: **talktostevenson@gmail.com**

### Step 2: Verify Admin Access
1. After signing in, go to: **`/admin/access`**
2. This diagnostic page will check if you have admin permissions
3. If your profile is missing or admin access is not set, click the **"Fix"** button to grant admin access
4. Once fixed, click "Go to Dashboard" to access the admin panel

### Step 3: Access the Admin Dashboard
- Direct URL: **`/admin`**
- After successful login with admin permissions, you'll see the dashboard with all management tools

---

## Admin Dashboard Features

The admin dashboard has been simplified to include only essential features:

### 1. **Dashboard** (`/admin`)
- Overview of your business metrics
- Total orders, revenue, customers, products, properties
- Sales trends and order status charts
- Recent orders and bookings
- Low stock alerts and pending order notifications

### 2. **Store Management**
- **Products** (`/admin/products`): Add, edit, delete products that appear on the user-facing store
- **Categories** (`/admin/categories`): Manage product categories
- **Orders** (`/admin/orders`): View and manage customer orders, update order status

### 3. **Property Management**
- **Properties** (`/admin/properties`): Add, edit, delete rental properties (apartments, houses, etc.)
- **Bookings** (`/admin/bookings`): View and manage property bookings

### 4. **Customer Management**
- **Customers** (`/admin/customers`): View customer information
- **Coupons** (`/admin/coupons`): Create and manage discount coupons for promotions

---

## How Changes Reflect on the User Side

**All changes made in the admin dashboard automatically appear on the user-facing website immediately.**

### Products
- When you **add a product** in the admin panel → It appears in the shop immediately
- When you **edit a product** → Changes are visible to users right away
- When you **mark a product as inactive** → It's hidden from users
- When you **delete a product** → It's removed from the shop

### Categories
- When you **add a category** → It appears in navigation and filters
- When you **edit a category** → Changes reflect immediately
- When you **mark as inactive** → Category is hidden from users

### Properties
- When you **add a property** → It appears in the properties section
- When you **edit a property** → Changes are live immediately
- When you **mark as inactive** → Property is hidden

### Orders & Bookings
- When you **update order status** → Customer sees the updated status
- Order changes are reflected in customer's order history

---

## Important Notes

1. **No manual refresh needed**: All changes are instant via the database
2. **Active/Inactive toggle**: Use this to hide items without deleting them
3. **Images**: Upload images when adding products/properties for better presentation
4. **Stock management**: Keep product stock updated to prevent overselling
5. **Simple workflow**: Add → Save → Changes are live

---

## Troubleshooting

### Cannot access admin dashboard?
1. Go to `/admin/access` to run diagnostics
2. Make sure you're logged in with `talktostevenson@gmail.com`
3. Click the "Fix" button if admin access is missing
4. Contact support if issues persist

### Changes not appearing?
1. Verify the item is marked as "Active"
2. Check that all required fields are filled
3. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)

### Need help?
The admin panel is designed to be intuitive. Each page has forms with clear labels showing what information is needed.

---

## Quick Start Checklist

- [ ] Sign in with admin account
- [ ] Run diagnostic at `/admin/access` to verify admin access
- [ ] Add your first product in Products section
- [ ] Add a category for organization
- [ ] Add a property if offering rentals
- [ ] Test by viewing the user-facing website
- [ ] Create a coupon for promotions (optional)

---

**Your admin account email: talktostevenson@gmail.com**
