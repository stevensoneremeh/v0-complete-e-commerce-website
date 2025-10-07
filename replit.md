# ABL Natasha Enterprises - Complete E-commerce & Property Booking Platform

## Overview

ABL Natasha Enterprises is a luxury e-commerce platform that combines online shopping with property booking services. The application offers premium products across five main categories (perfumes, wigs, cars, wines, and body creams) alongside an apartment rental booking system. Built as a comprehensive business solution, it features a customer-facing storefront, admin management dashboard, and integrated payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.
Package manager: pnpm (not npm)

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router for modern React development
- **UI System**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Styling**: Custom luxury color palette with dark mode support via next-themes
- **State Management**: React Context providers for cart, wishlist, authentication, reviews, coupons, and orders
- **Type Safety**: Full TypeScript implementation with strict type checking

### Backend Architecture  
- **Database**: Supabase (PostgreSQL) for user authentication, product data, and property listings
- **Authentication**: Supabase Auth with JWT tokens and session management
- **File Storage**: Vercel Blob for media assets and product images
- **API Layer**: Next.js API routes with server-side rendering capabilities

### Data Storage Solutions
- **Primary Database**: Supabase PostgreSQL for structured data (users, products, properties, bookings)
- **Local Storage**: Browser localStorage for cart persistence, admin settings, and temporary data
- **Media Storage**: Vercel Blob for optimized image delivery and media assets
- **Session Storage**: Supabase session management for user authentication state

### Authentication & Authorization
- **User Authentication**: Supabase Auth with email/password and social login options
- **Role-Based Access**: User and admin role separation for dashboard access
- **Session Management**: Middleware-based session validation across protected routes
- **Guest Support**: Anonymous cart and wishlist functionality for non-authenticated users

### Payment Processing
- **Primary Gateway**: Paystack integration for Nigerian and international payments
- **Currency Support**: Dual currency display (USD/NGN) with real-time conversion
- **Payment Methods**: Credit cards, bank transfers, USSD, and cash on delivery
- **Security**: PCI compliant payment processing with encrypted transaction data

### E-commerce Features
- **Product Management**: Full CRUD operations with categories, brands, and inventory tracking
- **Shopping Cart**: Persistent cart with quantity management and guest session support
- **Wishlist System**: Save items for later with persistent storage
- **Review System**: Customer ratings and reviews with moderation capabilities
- **Coupon Engine**: Discount codes with usage limits and expiration dates

### Property Booking System
- **Listing Management**: Property details with amenities, pricing, and availability
- **Booking Engine**: Date selection, guest capacity, and pricing calculations
- **Calendar Integration**: Availability tracking and booking conflict prevention
- **Property Categories**: Penthouses, villas, apartments, and beachfront properties

## External Dependencies

### Third-Party Services
- **Supabase**: Backend-as-a-Service providing PostgreSQL database, authentication, and real-time subscriptions
- **Vercel**: Hosting platform with edge functions, image optimization, and global CDN
- **Paystack**: Payment gateway for secure transaction processing
- **WhatsApp Business API**: Direct customer communication integration (+2349030944943)

### Payment Integration
- **Paystack Public API**: Client-side payment initialization and transaction handling
- **Currency Exchange**: Real-time USD to NGN conversion for dual pricing
- **Payment Methods**: Support for cards, bank transfers, USSD, and mobile money

### Media & Storage
- **Vercel Blob**: Optimized media storage with automatic image compression
- **Next.js Image**: Automatic image optimization with lazy loading and responsive sizing
- **Placeholder Services**: Fallback images for development and missing assets

### Analytics & Monitoring  
- **Vercel Analytics**: Performance monitoring and web vitals tracking
- **Error Boundary**: Global error handling with user-friendly fallbacks
- **Performance Monitor**: Client-side performance tracking and reporting

### Development Dependencies
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Accessible component primitives for consistent UI behavior
- **Lucide Icons**: Modern icon set for consistent visual design
- **Date-fns**: Date manipulation and formatting utilities
- **React Hook Form**: Form validation and state management

## Recent Changes

### 2025-10-04: Production-Ready Replit Setup Completed
- **Full Environment Configuration**: Supabase credentials configured in .env.local
- **Database Setup**: All 13 tables verified and ready (profiles, categories, products, orders, order_items, cart_items, wishlist_items, product_reviews, real_estate_properties, real_estate_bookings, coupons, notifications, hire_bookings)
- **Admin User**: talktostevenson@gmail.com configured as admin with is_admin = true
- **Workflow Configuration**: Frontend Server running on port 5000 with Next.js 15.2.4
- **Deployment Setup**: Autoscale deployment configured with pnpm build and start commands
- **Production Status**: ✅ READY - All systems operational

### 2025-10-02: Admin Dashboard Complete Migration to Supabase
- **Admin System Overhaul**: Migrated all admin functionality from localStorage to Supabase database
- **New Database Tables**: Created coupons and notifications tables with full RLS policies
- **API Routes Created**: 
  - Coupons management (GET, POST, PUT, DELETE, PATCH)
  - Notifications management (GET, POST, PATCH, DELETE)
  - Analytics aggregation (GET - real-time data from database)
  - Public coupon API for frontend (GET, POST validation)
- **Admin Pages Updated**:
  - Coupons page now uses Supabase API instead of localStorage
  - Notifications page now uses Supabase API instead of localStorage
  - Analytics page now aggregates real data from orders, products, and customers
- **Package Manager**: Switched from npm to pnpm for faster dependency management
- **Workflow Configuration**: Updated to use pnpm with proper port and hostname settings
- **Documentation**: Created comprehensive SETUP_INSTRUCTIONS.md for Supabase configuration
- **Environment Variables**: Created .env.local template with all required configuration keys
- **Status**: Admin dashboard fully functional with real Supabase data (requires user to configure their Supabase credentials)

### Admin Dashboard Features (Complete)
- **Products**: Full CRUD with Supabase (existing)
- **Categories**: Full CRUD with Supabase (existing)
- **Orders**: Full CRUD with Supabase (existing)
- **Customers**: Full CRUD with Supabase and role management (existing)
- **Properties**: Full CRUD with Supabase (existing)
- **Bookings**: Full CRUD with Supabase (existing)
- **Coupons**: Full CRUD with Supabase (NEW - migrated from localStorage)
- **Notifications**: Full CRUD with Supabase (NEW - migrated from localStorage)
- **Analytics**: Real-time analytics from Supabase (NEW - migrated from localStorage)

### Authentication & Security
- **Middleware Protection**: All /admin routes protected by middleware checking is_admin flag
- **Row Level Security**: All tables have proper RLS policies for admin and user access
- **Session Management**: Supabase Auth handles all authentication and session validation
- **Role-Based Access**: Admin users identified by is_admin = true in profiles table

### Environment Configuration
- **Frontend Server**: Running on port 5000 with pnpm and Next.js 15.2.4
- **Database**: Fully configured for Supabase PostgreSQL (requires user credentials)
- **Host Configuration**: Properly configured for Replit's proxy environment (0.0.0.0:5000)
- **Build System**: TypeScript and ESLint validation enabled for production builds
- **Package Manager**: pnpm for improved dependency management and performance

### Accessing the Admin Dashboard
1. **Sign Up**: Visit `/auth` and create an account with talktostevenson@gmail.com
2. **Admin Access**: The system will automatically grant admin privileges to this email
3. **Dashboard**: Access the full admin dashboard at `/admin`
4. **Features**: Manage products, categories, orders, customers, properties, bookings, coupons, notifications, and view analytics

### Optional Enhancements
- **Payment Processing**: Add Paystack credentials to enable payment processing
- **Media Storage**: Configure Vercel Blob token for optimized image uploads
- **Custom Domain**: Deploy and configure custom domain through Replit deployment

See SETUP_INSTRUCTIONS.md and ADMIN_GUIDE.md for detailed documentation.
