# ABL Natasha Enterprises - Complete E-commerce & Property Booking Platform

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/techcitybystevenson-4623s-projects/v0-complete-e-commerce-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/bUunNNZvqI1)

## 🏢 About ABL Natasha Enterprises

A comprehensive luxury e-commerce and property booking platform featuring premium products and apartment rentals. Built with Next.js 14, Supabase, and modern web technologies.

## ✨ Features

### 🛍️ E-commerce Platform
- **Product Categories**: Perfumes, Wigs, Cars (Sales & Hire), Wines, Body Creams
- **Shopping Cart & Wishlist**: Full cart management with guest sessions
- **Payment Integration**: Paystack payment gateway with NGN/USD currency support
- **Product Reviews**: Customer review system with ratings
- **WhatsApp Integration**: Direct product inquiries via WhatsApp (+2349030944943)

### 🏠 Property Booking System
- **Luxury Apartments**: Premium property listings with detailed amenities
- **Booking Management**: Complete reservation system with date selection
- **Property Search**: Advanced filtering by location, price, amenities
- **Virtual Tours**: Property showcase with image galleries

### 👨‍💼 Admin Dashboard
- **Product Management**: Full CRUD operations for products and categories
- **Property Management**: Manage apartment listings and bookings
- **Order Management**: Track and manage customer orders
- **Customer Management**: User profiles and admin controls
- **Analytics**: Sales reports and performance metrics

### 🎨 Premium UI/UX
- **Luxury Branding**: Professional ABL Natasha Enterprises design
- **Video Hero Section**: Cinematic homepage with luxury apartment footage
- **Responsive Design**: Mobile-first approach with modern aesthetics
- **Currency Conversion**: Real-time USD to NGN exchange rates

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Paystack Integration
- **Storage**: Vercel Blob for media files
- **Styling**: Tailwind CSS + shadcn/ui
- **TypeScript**: Full type safety
- **Deployment**: Vercel

## 📋 Environment Variables

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Site Configuration
NEXT_PUBLIC_SITE_URL=your_site_url
\`\`\`

## 🔧 Admin Access

### Accessing the Admin Panel
1. **URL**: Visit `/admin` on your deployed site
2. **Requirements**: 
   - Admin account with `is_admin = true` in profiles table
   - Valid Supabase authentication session

### Admin Features
- **Dashboard**: `/admin` - Overview and analytics
- **Products**: `/admin/products` - Manage product catalog
- **Categories**: `/admin/categories` - Category management
- **Properties**: `/admin/properties` - Apartment listings
- **Orders**: `/admin/orders` - Order management
- **Customers**: `/admin/customers` - User management
- **Analytics**: `/admin/analytics` - Sales reports

## 📊 Database Schema

### Core Tables
- `products` - Product catalog with specifications
- `categories` - Product categories (Perfumes, Wigs, Cars, Wines, Body Creams)
- `orders` & `order_items` - Order management
- `cart_items` - Shopping cart with guest support
- `profiles` - User profiles with admin flags
- `real_estate_properties` - Property listings
- `real_estate_bookings` - Booking management
- `product_reviews` - Customer reviews
- `wishlist_items` - User wishlists

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Supabase account
- Paystack account
- Vercel account

### Local Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations
5. Start development server: `npm run dev`

### Database Setup
Run the SQL scripts in order:
1. `scripts/01-create-tables.sql` - Create core tables
2. `scripts/02-setup-rls-policies.sql` - Security policies
3. `scripts/03-create-storage-buckets.sql` - File storage
4. `scripts/08-seed-new-categories.sql` - Product categories
5. `scripts/09-seed-new-products.sql` - Sample products
6. `scripts/10-add-wines-body-creams-categories.sql` - Additional categories
7. `scripts/11-seed-wines-body-creams-products.sql` - Additional products

## 🚀 Deployment

Your project is live at:
**[https://vercel.com/techcitybystevenson-4623s-projects/v0-complete-e-commerce-website](https://vercel.com/techcitybystevenson-4623s-projects/v0-complete-e-commerce-website)**

### Deployment Checklist
- ✅ Environment variables configured
- ✅ Database migrations executed
- ✅ Supabase RLS policies enabled
- ✅ Paystack webhooks configured
- ✅ Domain and SSL configured

## 📱 Features Overview

### Customer Features
- Browse products by category
- Advanced product search and filtering
- Shopping cart with guest checkout
- Wishlist management
- Property browsing and booking
- WhatsApp product inquiries
- Multi-currency support (USD/NGN)
- User account management

### Admin Features
- Complete product management
- Property listing management
- Order processing and tracking
- Customer management
- Sales analytics and reporting
- Category management
- Review moderation

## 🔗 Continue Building

Continue building your app on:
**[https://v0.app/chat/projects/bUunNNZvqI1](https://v0.app/chat/projects/bUunNNZvqI1)**

## 📞 Support

For WhatsApp inquiries: +2349030944943
For technical support: Contact through the admin panel

---

Built with ❤️ using [v0.app](https://v0.app) - The AI-powered development platform
