# Admin Dashboard - Quick Access Guide

## ⚡ Instant Admin Access

Your admin dashboard is ready! Here's the fastest way to access it:

### Option 1: Simple Admin Login Page (EASIEST)
1. Go to: `/admin-quickstart`
2. Email is pre-filled: `talktostevenson@gmail.com`
3. Enter your password
4. Click "Sign In"
5. ✅ You'll instantly go to your admin dashboard

### Option 2: Direct Admin Dashboard
1. Go to: `/admin`
2. If not signed in, you'll be taken to login
3. Sign in with: `talktostevenson@gmail.com` + your password
4. ✅ You're in the admin dashboard!

## What You Can Manage

Once logged in, your admin dashboard lets you:
- ✅ **Products** - Add, edit, delete products
- ✅ **Categories** - Manage product categories
- ✅ **Orders** - View and manage customer orders
- ✅ **Properties** - Manage real estate properties
- ✅ **Bookings** - View property booking requests
- ✅ **Customers** - Manage customer accounts
- ✅ **Coupons** - Create discount codes

## Troubleshooting

### "Wrong email or password"
- Make sure you're using the correct password for `talktostevenson@gmail.com`
- If you forgot the password, you can reset it on the login page

### "Access Denied"
- Your account is already configured as admin
- Try clearing your browser cache and signing in again

### "Can't access /admin"
- Make sure you're signed in first
- Go to `/admin-quickstart` for the guided login

## Technical Details

Your admin system uses:
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Email + Password (Supabase Auth)
- **Admin Verification**: Automatic check of `is_admin` flag in profiles table
- **Security**: All admin routes require authentication + admin role verification

Your account `talktostevenson@gmail.com` is automatically configured with:
- ✅ `is_admin = true`
- ✅ `role = admin`
- ✅ Full database access through Row Level Security (RLS)

**That's it! Your admin dashboard is production-ready and fully secure.** 🚀
