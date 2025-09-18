# ABL Natasha Enterprises - Complete E-commerce & Property Booking Platform

## Overview

ABL Natasha Enterprises is a luxury e-commerce platform that combines online shopping with property booking services. The application offers premium products across five main categories (perfumes, wigs, cars, wines, and body creams) alongside an apartment rental booking system. Built as a comprehensive business solution, it features a customer-facing storefront, admin management dashboard, and integrated payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

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

### 2025-09-18: Replit Environment Setup Completed
- **Dependencies Installed**: All npm packages successfully installed from package.json
- **Next.js Configuration**: Updated next.config.mjs to work with Replit's proxy environment
- **Environment Variables**: Created .env.local with temporary development variables for Supabase, Paystack, and other services
- **Development Server**: Configured workflow on port 5000 with proper hostname binding (0.0.0.0)
- **Deployment Config**: Set up autoscale deployment with npm build and start commands
- **Status**: Application successfully running and accessible through Replit's web interface

### Environment Configuration
- **Frontend Server**: Running on port 5000 with Next.js development server
- **Database**: Configured with temporary Supabase credentials (requires real credentials for full functionality)
- **Host Configuration**: Properly configured for Replit's proxy environment
- **Build System**: TypeScript and ESLint validation enabled for production builds

### Next Steps for Production
- Replace temporary Supabase credentials with real project credentials
- Configure actual Paystack payment keys for payment processing
- Set up Vercel Blob token for media storage functionality
- Test all features with real database connections
