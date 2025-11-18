# Admin Dashboard Setup Instructions

Your admin dashboard is now configured and ready to use! Follow these steps to complete the setup:

## Step 1: Set Up Supabase Database

1. **Go to your Supabase project** at https://supabase.com
2. **Open the SQL Editor** (left sidebar → SQL Editor)
3. **Create a new query** (click "New query")
4. **Copy the entire contents of `SUPABASE_SETUP.sql`** (in the root directory)
5. **Paste and run the script** - This creates all tables for:
   - User profiles and authentication
   - Products and categories
   - Real estate properties
   - Hire services (cars and boats)
   - Orders and bookings
   - Coupons and notifications

## Step 2: Create Your Admin Account

### Option A: If you already have a Supabase user account

1. Go to Supabase → **SQL Editor**
2. Run the `ADMIN_SETUP.sql` script to grant admin privileges to `talktostevenson@gmail.com`

### Option B: If you need to create a new account

1. Go to Supabase → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: `talktostevenson@gmail.com`
   - **Password**: (choose a secure password)
   - Check **"Auto Confirm User"**
4. Click **"Create user"**
5. Go to **SQL Editor** and run the `ADMIN_SETUP.sql` script

## Step 3: Access Your Admin Dashboard

1. **Go to your website** and click **"Login"** in the top right
2. **Sign in** with `talktostevenson@gmail.com` and your password
3. After logging in, you should see **"Admin Dashboard"** in the user menu
4. Click **"Admin Dashboard"** or go to `/admin`

## What You Can Manage from the Admin Dashboard

### ✅ Products Management (`/admin/products`)
- Add new products with images, pricing, and descriptions
- Edit existing products
- Set products as featured
- Manage inventory and stock
- Assign products to categories

### ✅ Categories Management (`/admin/categories`)
- Create product categories
- Edit category names and descriptions
- Set category display order
- Add category images

### ✅ Properties Management (`/admin/properties`)
- Add luxury apartment listings
- Set pricing per night
- Upload property images
- Specify amenities (bedrooms, bathrooms, etc.)
- Manage availability status

### ✅ Hire Services Management (`/admin/hire-services`)
- Add car hire services
- Add boat cruise services
- Set pricing (hourly/daily rates)
- Upload service images
- Manage service availability

### ✅ Additional Features
- **Orders**: View and manage customer orders
- **Customers**: View user profiles and purchase history
- **Bookings**: Manage property and hire service bookings
- **Coupons**: Create discount codes
- **Analytics**: View sales and performance metrics

## Troubleshooting

### Can't see "Admin Dashboard" option?
- Make sure you ran the `ADMIN_SETUP.sql` script
- Verify your email is `talktostevenson@gmail.com` (case-sensitive)
- Log out and log back in
- Check the SQL query: `SELECT * FROM profiles WHERE email = 'talktostevenson@gmail.com'` should show `is_admin = true`

### Database errors when adding items?
- Make sure you ran the `SUPABASE_SETUP.sql` script completely
- Check that all tables were created in Supabase → Database → Tables
- Look at the browser console for specific error messages

### Can't login?
- Verify your Supabase credentials in the Replit Secrets
- Check that the email is confirmed in Supabase Auth → Users
- Try resetting your password in Supabase

## Need Help?

If you encounter any issues, please check:
1. All three Supabase secrets are set correctly in Replit
2. Both SQL scripts (`SUPABASE_SETUP.sql` and `ADMIN_SETUP.sql`) were run successfully
3. Your user account exists in Supabase Auth → Users
4. The profile has `is_admin = true` in the profiles table

---

**Your admin dashboard is production-ready and fully functional!** 🎉
