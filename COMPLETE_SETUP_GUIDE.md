# ABL Natasha Enterprises - Complete Setup Guide

## Overview

This is a comprehensive e-commerce and property rental platform built with Next.js, Supabase, and Tailwind CSS. The platform includes:

- **E-Commerce**: Products, categories, shopping cart, orders, and reviews
- **Property Rentals**: Luxury apartment listings with booking system
- **Hire Services**: Car hire and boat cruise services
- **Admin Dashboard**: Complete management system for all features
- **User Authentication**: Secure login and registration with role-based access

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (https://supabase.com)
- Vercel account (optional, for deployment)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd v0-complete-e-commerce-website
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to Project Settings → API to find your credentials:
   - `SUPABASE_URL` (Project URL)
   - `SUPABASE_ANON_KEY` (Anon Key)
   - `SUPABASE_SERVICE_ROLE_KEY` (Service Role Key)

### 3. Create Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY=your_anon_key
SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_POSTGRES_URL=your_postgres_url
SUPABASE_POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: For development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### 4. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query and paste the contents of `scripts/01-create-schema.sql`
4. Execute the query to create all tables and policies

### 5. Run the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

## Admin Access

### Default Admin Email

The system automatically grants admin access to: `talktostevenson@gmail.com`

To change this, edit `/components/auth-provider.tsx` and update the `ADMIN_EMAIL` constant.

### Admin Dashboard

Access the admin dashboard at: http://localhost:3000/admin

Admin features include:
- **Products**: Add, edit, delete products with categories
- **Categories**: Manage product categories
- **Properties**: Manage luxury apartment listings
- **Hire Items**: Manage car hire and boat cruise services
- **Orders**: View and manage customer orders
- **Customers**: View customer profiles and history
- **Bookings**: Manage property and hire service bookings
- **Analytics**: View sales and business metrics
- **Settings**: Configure store settings

## Database Schema

### Core Tables

#### `profiles`
- User profiles with admin role management
- Stores user information and preferences

#### `categories`
- Product categories with display ordering
- Supports active/inactive status

#### `products`
- Product listings with pricing and inventory
- Supports featured products and ratings

#### `properties`
- Luxury apartment listings
- Includes amenities, pricing, and booking information

#### `hire_items`
- Car hire and boat cruise services
- Tracks availability and pricing

#### `orders`
- Customer orders with status tracking
- Links to order items and payment information

#### `bookings`
- Property and hire service bookings
- Tracks check-in/check-out dates and pricing

#### `reviews`
- Product and property reviews
- Supports verified purchase tracking

#### `coupons`
- Discount codes with usage tracking
- Supports percentage and fixed discounts

#### `wishlists`
- User wishlists for products
- Tracks user preferences

## API Routes

### Admin Routes

All admin routes require authentication and admin role:

- `GET/POST /api/admin/products` - Manage products
- `GET/POST /api/admin/categories` - Manage categories
- `GET/POST /api/admin/properties` - Manage properties
- `GET/POST /api/admin/hire-services` - Manage hire items
- `GET/POST /api/admin/orders` - Manage orders
- `GET/POST /api/admin/bookings` - Manage bookings
- `GET/POST /api/admin/coupons` - Manage coupons
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/dashboard-stats` - Get dashboard statistics

### Public Routes

- `GET /api/products` - Get products
- `GET /api/categories` - Get categories
- `GET /api/properties` - Get properties
- `GET /api/hire-items` - Get hire items
- `POST /api/orders` - Create orders
- `POST /api/reviews` - Create reviews

## Authentication

### Sign Up

1. Navigate to the sign-up page
2. Enter email and password
3. Verify email (if email confirmation is enabled)
4. User account is created with "user" role

### Admin Access

Users with the admin email automatically receive admin role on signup/login.

### Session Management

- Sessions are managed by Supabase Auth
- Tokens are automatically refreshed
- Middleware handles token refresh on each request

## Features

### E-Commerce

- Browse products by category
- Add products to cart
- Apply discount coupons
- Place orders
- Track order status
- Leave product reviews
- Add products to wishlist

### Property Rentals

- Browse luxury apartments
- View property details and amenities
- Book properties for specific dates
- Track booking status
- Leave property reviews

### Hire Services

- Browse car hire and boat cruise services
- View service details and pricing
- Book services
- Track booking status

### Admin Dashboard

- Real-time analytics and metrics
- Inventory management
- Order management
- Customer management
- Booking management
- Coupon management
- Settings configuration

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

```bash
vercel deploy
```

### Environment Variables for Production

Make sure to set all environment variables in your Vercel project:
- `SUPABASE_NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production URL)

## Troubleshooting

### Supabase Connection Error

If you see "Your project's URL and API key are required to create a Supabase client!":

1. Check that environment variables are correctly set in `.env.local`
2. Verify the values match your Supabase project settings
3. Restart the development server

### Database Schema Not Created

If tables don't exist:

1. Go to Supabase SQL Editor
2. Run the SQL script from `scripts/01-create-schema.sql`
3. Verify all tables are created

### Admin Access Not Working

If you can't access the admin dashboard:

1. Verify you're logged in with the admin email
2. Check the `profiles` table to ensure `is_admin` is `true`
3. Clear browser cache and cookies
4. Try logging out and back in

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js documentation: https://nextjs.org/docs

## License

This project is proprietary to ABL Natasha Enterprises.
