# Admin Setup Guide - ABL Natasha Enterprises

## How to Make a User Admin

### Method 1: Direct Database Update (Recommended)

1. **Access your Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project dashboard
   - Click on "Table Editor" in the sidebar

2. **Update User Profile**
   - Find the `profiles` table
   - Locate the user you want to make admin by their email
   - Edit the row and set:
     - `is_admin` = `true`
     - `role` = `admin`
   - Save the changes

### Method 2: SQL Query

Run this SQL query in your Supabase SQL Editor:

\`\`\`sql
UPDATE profiles 
SET is_admin = true, role = 'admin' 
WHERE email = 'user@example.com';
\`\`\`

Replace `user@example.com` with the actual user's email address.

### Method 3: Create Admin User Script

You can also create a new admin user directly:

\`\`\`sql
-- First, create the auth user (this should be done through the signup process)
-- Then update their profile to admin
INSERT INTO profiles (id, email, full_name, is_admin, role)
VALUES (
  'user-uuid-here',
  'admin@example.com',
  'Admin User',
  true,
  'admin'
);
\`\`\`

## Accessing the Admin Dashboard

### Step 1: Create User Account
1. Go to `/auth` on your website
2. Click "Sign Up" tab
3. Fill in your details:
   - Full Name
   - Email
   - Password
   - Confirm Password
4. Click "Create Account"
5. Check your email for verification (if email confirmation is enabled)

### Step 2: Make User Admin
Follow one of the methods above to grant admin privileges to your account.

### Step 3: Access Admin Panel
1. Sign in to your account at `/auth`
2. Once logged in, navigate to `/admin`
3. You should now see the admin dashboard

## Admin Dashboard Features

### Dashboard Overview (`/admin`)
- **Statistics Cards**: Total products, orders, customers, revenue
- **Sales Chart**: Visual representation of sales over time
- **Recent Orders**: Latest order activity
- **Quick Actions**: Access to main admin functions

### Product Management (`/admin/products`)
- Add new products
- Edit existing products
- Manage product categories
- Set pricing and inventory
- Upload product images
- Manage product features and specifications

### Property Management (`/admin/properties`)
- Add rental properties
- Manage property details (bedrooms, bathrooms, amenities)
- Set booking prices and availability
- Upload property images
- Manage property features

### Order Management (`/admin/orders`)
- View all orders
- Update order status
- Process payments
- Manage shipping information
- Generate order reports

### Customer Management (`/admin/customers`)
- View customer profiles
- Manage customer accounts
- View order history
- Handle customer support

### Category Management (`/admin/categories`)
- Create product categories
- Organize category hierarchy
- Set category images and descriptions

### Booking Management (`/admin/bookings`)
- View property bookings
- Manage booking status
- Handle booking payments
- Coordinate with guests

### Coupon Management (`/admin/coupons`)
- Create discount coupons
- Set coupon rules and restrictions
- Track coupon usage
- Manage expiration dates

### Analytics (`/admin/analytics`)
- Sales performance metrics
- Customer behavior analysis
- Product performance reports
- Revenue tracking

### Settings (`/admin/settings`)
- Site configuration
- Payment settings
- Email templates
- General preferences

### Notifications (`/admin/notifications`)
- System notifications
- Order alerts
- Customer messages
- Admin announcements

## Security Features

### Authentication Protection
- All admin routes are protected by middleware
- Users must be authenticated to access `/admin/*`
- Automatic redirect to login if not authenticated

### Role-Based Access Control
- Only users with `is_admin = true` can access admin features
- API endpoints verify admin status
- Client-side and server-side validation

### Session Management
- Secure session handling with Supabase Auth
- Automatic session refresh
- Secure logout functionality

## Troubleshooting

### Can't Access Admin Dashboard
1. **Check Authentication**: Ensure you're logged in
2. **Verify Admin Status**: Confirm `is_admin = true` in profiles table
3. **Clear Browser Cache**: Sometimes cached data causes issues
4. **Check Console**: Look for JavaScript errors in browser console

### Admin Features Not Working
1. **Database Connection**: Verify Supabase connection
2. **Environment Variables**: Check all required env vars are set
3. **Permissions**: Ensure database RLS policies allow admin operations

### Common Issues
- **403 Forbidden**: User doesn't have admin privileges
- **401 Unauthorized**: User not logged in
- **500 Server Error**: Database or server configuration issue

## Best Practices

### Security
- Use strong passwords for admin accounts
- Regularly review admin user list
- Monitor admin activity logs
- Keep admin access limited to necessary personnel

### Data Management
- Regular database backups
- Monitor system performance
- Keep product and property data updated
- Regular cleanup of old orders and logs

### User Experience
- Train admin users on dashboard features
- Document custom workflows
- Regular system updates and maintenance

## Support

If you encounter issues with the admin system:
1. Check this guide first
2. Review error messages in browser console
3. Check Supabase logs for database errors
4. Contact technical support if needed

---

**Note**: This admin system is built with Next.js, Supabase, and includes comprehensive role-based access control. All admin operations are logged and secured.
