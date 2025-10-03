# Admin Dashboard Setup Instructions

## Overview
Your admin dashboard has been successfully configured to manage real data from Supabase. All admin functionality now uses the Supabase database instead of localStorage.

## What's Been Updated

### 1. Database Tables Created
The following SQL scripts have been created to set up your database tables:
- `scripts/create-coupons-table.sql` - Coupons and discount codes
- `scripts/create-notifications-table.sql` - User notifications

### 2. API Routes Created
All admin operations now use proper API routes that connect to Supabase:
- **Coupons**: `/api/admin/coupons` (GET, POST, PUT, DELETE)
- **Notifications**: `/api/admin/notifications` (GET, POST, PATCH, DELETE)
- **Analytics**: `/api/admin/analytics` (GET - aggregates real data from orders, products, customers)
- **Public Coupons**: `/api/coupons` (GET - for frontend)
- **Coupon Validation**: `/api/coupons/validate` (POST - for checkout)

### 3. Admin Pages Updated
The following admin pages now fetch data from Supabase instead of localStorage:
- `/admin/coupons` - Create, edit, delete, and manage discount coupons
- `/admin/notifications` - Send and manage user notifications
- `/admin/analytics` - View real-time analytics from actual data

### 4. Existing Admin Pages (Already Using Supabase)
These pages were already using Supabase and continue to work:
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management
- `/admin/customers` - Customer and user management
- `/admin/properties` - Property listings management
- `/admin/bookings` - Booking management

## Required Setup Steps

### Step 1: Set Up Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account if you don't have one
2. Create a new project
3. Wait for the project to finish provisioning

### Step 2: Create Database Tables
1. In your Supabase project dashboard, go to **SQL Editor**
2. Run the following SQL scripts in order:
   - Open and execute `scripts/create-coupons-table.sql`
   - Open and execute `scripts/create-notifications-table.sql`
   - Also run any other setup scripts in the `scripts/` folder if you haven't already

### Step 3: Configure Environment Variables
1. In your Supabase project, go to **Settings** → **API**
2. Copy your project URL and API keys
3. Update the `.env.local` file in your project root with your actual Supabase credentials:

\`\`\`env
# Replace these with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: Payment and storage configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
BLOB_READ_WRITE_TOKEN=your-blob-token
NEXT_PUBLIC_SITE_URL=http://localhost:5000
\`\`\`

### Step 4: Create an Admin User
1. In Supabase, go to **Authentication** → **Users**
2. Create a new user (or use an existing one)
3. Copy the user's ID
4. Go to **SQL Editor** and run:
\`\`\`sql
UPDATE profiles SET is_admin = true WHERE id = 'your-user-id-here';
\`\`\`

### Step 5: Restart the Server
After updating the environment variables, restart the development server:
\`\`\`bash
pnpm run dev --port=5000 --hostname=0.0.0.0
\`\`\`

## Admin Dashboard Features

### Complete Management System
Your admin dashboard now provides full management of:

1. **Products** - Add, edit, delete products with images, pricing, inventory
2. **Categories** - Organize products into categories
3. **Orders** - Track and manage customer orders with status updates
4. **Customers** - Manage users, assign admin roles
5. **Properties** - Manage luxury apartment listings
6. **Bookings** - Handle property reservations
7. **Coupons** - Create discount codes with:
   - Percentage or fixed amount discounts
   - Minimum order requirements
   - Usage limits
   - Expiration dates
   - Active/inactive status
8. **Notifications** - Send system notifications to users
9. **Analytics** - View real-time performance metrics:
   - Total revenue and growth
   - Order statistics
   - Customer analytics
   - Top-performing products
   - Sales trends
   - Category performance

### Real-Time Updates
All changes made in the admin dashboard are immediately reflected on the user-facing website because they use the same Supabase database.

## Authentication & Security

### Admin Access Protection
- Admin routes are protected by middleware in `middleware.ts`
- Only users with `is_admin = true` in the `profiles` table can access `/admin/*` routes
- Unauthenticated users are redirected to `/auth`
- Non-admin users are redirected to the homepage

### Row Level Security (RLS)
All database tables have RLS policies that:
- Allow admins to manage all data
- Restrict regular users to their own data only
- Protect sensitive operations from unauthorized access

## Troubleshooting

### "Supabase URL and Key required" Error
- Make sure you've set the environment variables in `.env.local`
- Restart the development server after updating environment variables

### Can't Access Admin Dashboard
- Verify you're logged in with a user account
- Check that the user has `is_admin = true` in the profiles table
- Run: `SELECT id, email, is_admin FROM profiles WHERE email = 'your-email@example.com';`

### Data Not Showing Up
- Verify the Supabase tables were created successfully
- Check the browser console for API errors
- Ensure RLS policies are correctly configured

## Next Steps

1. Set up your Supabase project and configure environment variables
2. Run the database setup scripts
3. Create an admin user
4. Test all admin functionality:
   - Create a coupon
   - Send a notification
   - Add a product
   - Create a category
   - Manage orders
   - View analytics

## Support

For issues specific to:
- **Supabase**: Check the [Supabase Documentation](https://supabase.com/docs)
- **Next.js**: See the [Next.js Documentation](https://nextjs.org/docs)
- **This Application**: Review the README.md and ADMIN_GUIDE.md files

The admin dashboard is now fully configured to manage real data. Once you complete the setup steps above, you'll have a complete, production-ready admin management system!
