# Admin Dashboard Implementation Guide

## Overview

This document provides a comprehensive overview of the admin dashboard implementation in the ABL Natasha Enterprises e-commerce platform. The admin dashboard enables full CRUD (Create, Read, Update, Delete) operations for products, services, categories, and hire requests.

## Architecture

### Technology Stack

- **Frontend**: Next.js 15.2.8 with React 19
- **Backend**: Next.js API Routes (Serverless Functions)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom admin guard
- **UI Components**: Radix UI with shadcn/ui components
- **State Management**: React Hooks (useState, useEffect)

### Real-Time Sync Mechanism

The application implements real-time synchronization between admin changes and user-facing pages through:

1. **Direct Database Queries**: Both admin and user-facing APIs query the same Supabase tables
2. **Active Status Filtering**: User-facing APIs filter by `is_active = true` to show only active items
3. **Immediate Visibility**: When admins create/update/delete items:
   - Changes are written directly to the database
   - User-facing pages query the database on each request
   - No caching delays ensure immediate visibility

## CRUD Operations Implementation

### 1. Products Management

#### Admin Dashboard Page
- **Location**: `/app/admin/products/page.tsx`
- **Features**:
  - View all products in a searchable, filterable table
  - Filter by category, status (active/draft/archived)
  - Add new products via dialog form
  - Edit existing products
  - Delete products with confirmation
  - View product details

#### Admin API Endpoints
- **GET** `/api/admin/products` - Fetch all products with categories
  - Supports filtering by category, featured status, limit, status
  - Returns products with related category data
  
- **POST** `/api/admin/products` - Create new product
  - Auto-generates slug from name if not provided
  - Auto-generates SKU if not provided
  - Revalidates `/products` path for immediate user-side updates

- **GET** `/api/admin/products/[id]` - Fetch single product
- **PUT/PATCH** `/api/admin/products/[id]` - Update product
  - Revalidates paths for cache invalidation
  
- **DELETE** `/api/admin/products/[id]` - Delete product

#### User-Facing API
- **GET** `/api/products` - Public endpoint
  - Only returns active products (`is_active = true`)
  - Supports category filtering, featured filtering
  - Real-time sync: Reflects admin changes immediately

### 2. Categories Management

#### Admin Dashboard Page
- **Location**: `/app/admin/categories/page.tsx`
- **Features**:
  - View all categories with product counts
  - Add new categories with images
  - Edit existing categories
  - Toggle category status (active/inactive)
  - Delete categories with confirmation
  - Upload category images via file upload component

#### Admin API Endpoints
- **GET** `/api/admin/categories` - Fetch all categories
  - Includes product counts for each category
  - Sorted by display order
  
- **POST** `/api/admin/categories` - Create new category
  - Auto-generates slug from name
  - Revalidates paths for immediate updates

- **GET** `/api/admin/categories/[id]` - Fetch single category
- **PUT/PATCH** `/api/admin/categories/[id]` - Update category
- **DELETE** `/api/admin/categories/[id]` - Delete category

#### User-Facing API
- **GET** `/api/categories` - Public endpoint
  - Only returns active categories (`is_active = true`)
  - Sorted by sort_order
  - Real-time sync: Reflects admin changes immediately

### 3. Hire Services Management

#### Admin Dashboard Page
- **Location**: `/app/admin/hire-services/page.tsx`
- **Features**:
  - View all hire services (cars and boats)
  - Filter by service type (car/boat)
  - Add new services with images
  - Edit existing services
  - Delete services with confirmation
  - Set availability and pricing

#### Admin API Endpoints
- **GET** `/api/admin/hire-services` - Fetch all hire services
  - Sorted by service type
  
- **POST** `/api/admin/hire-services` - Create new service
  - Auto-generates slug from name

- **GET** `/api/admin/hire-services/[id]` - Fetch single service
- **PUT/PATCH** `/api/admin/hire-services/[id]` - Update service
- **DELETE** `/api/admin/hire-services/[id]` - Delete service

#### User-Facing API
- **GET** `/api/hire-services` - Public endpoint
  - Only returns active services (`is_active = true`)
  - Real-time sync: Reflects admin changes immediately

### 4. Hire Bookings Management

#### Admin Dashboard Page
- **Location**: `/app/admin/hire-bookings/page.tsx`
- **Features**:
  - View all hire service bookings
  - Filter by status (pending/confirmed/completed/cancelled)
  - Update booking status via dropdown
  - View booking details in dialog
  - Add admin notes to bookings
  - View customer information

#### Admin API Endpoints
- **GET** `/api/admin/hire-bookings` - Fetch all bookings
  - Includes customer profile data
  - Sorted by creation date (newest first)
  
- **POST** `/api/admin/hire-bookings` - Create new booking
  - For admin-initiated bookings

- **GET** `/api/admin/hire-bookings/[id]` - Fetch single booking ✨ **NEW**
  - Returns booking with customer profile data
  
- **PATCH** `/api/admin/hire-bookings/[id]` - Update booking
  - For status updates and admin notes
  
- **DELETE** `/api/admin/hire-bookings/[id]` - Delete booking

## Security & Authentication

### Admin Guard
- **Location**: `/lib/auth/admin-guard.ts`
- **Purpose**: Verifies admin authentication before allowing CRUD operations
- **Implementation**: All admin API routes call `verifyAdmin()` before processing requests

### Access Control
- Admin routes are protected by authentication middleware
- Non-admin users cannot access `/admin/*` pages
- API endpoints validate admin status before returning data

## File Upload

The admin dashboard includes a file upload component for images:

- **Location**: `/components/admin/file-upload.tsx`
- **Supports**:
  - Single and multiple file uploads
  - Image preview
  - URL input as alternative
  - File deletion
- **Used in**: Products, Categories, Hire Services

## Enhanced Product Form

- **Location**: `/components/admin/enhanced-product-form.tsx`
- **Features**:
  - Multi-field product creation/editing
  - Category selection
  - Price and stock management
  - Image upload (multiple images)
  - Status control (active/draft/archived)
  - Featured product toggle
  - SEO fields (slug)

## Data Flow Diagram

```
┌─────────────────┐
│  Admin User     │
│  Dashboard      │
└────────┬────────┘
         │
         │ CRUD Operations
         ▼
┌─────────────────┐
│  Admin API      │
│  /api/admin/*   │
└────────┬────────┘
         │
         │ Write/Read
         ▼
┌─────────────────┐
│  Supabase DB    │
│  (PostgreSQL)   │
└────────┬────────┘
         │
         │ Read (is_active=true)
         ▼
┌─────────────────┐
│  Public API     │
│  /api/*         │
└────────┬────────┘
         │
         │ Fetch Data
         ▼
┌─────────────────┐
│  User-Facing    │
│  Pages          │
└─────────────────┘
```

## Testing

### Manual Testing Checklist

#### Products
- [ ] Create a new product via admin dashboard
- [ ] Verify product appears in user-facing product list
- [ ] Edit product details
- [ ] Verify changes reflect on user side
- [ ] Mark product as inactive
- [ ] Verify product no longer shows on user side
- [ ] Delete product
- [ ] Verify product is removed

#### Categories
- [ ] Create a new category
- [ ] Verify category appears in filters on user side
- [ ] Edit category name and image
- [ ] Verify changes reflect immediately
- [ ] Mark category as inactive
- [ ] Verify category is hidden on user side
- [ ] Delete category

#### Hire Services
- [ ] Add a new car hire service
- [ ] Verify service shows on hire page
- [ ] Edit service pricing
- [ ] Verify price update reflects immediately
- [ ] Mark service as unavailable
- [ ] Verify availability status updates
- [ ] Delete service

#### Hire Bookings
- [ ] View existing bookings
- [ ] Update booking status
- [ ] Add admin notes to booking
- [ ] View booking details
- [ ] Delete booking

### API Testing

You can test the API endpoints using curl or any API client:

```bash
# Get all products (user-facing)
curl http://localhost:3000/api/products

# Get all categories (user-facing)
curl http://localhost:3000/api/categories

# Get all hire services (user-facing)
curl http://localhost:3000/api/hire-services

# Admin endpoints require authentication
# Get all products (admin)
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/admin/products

# Get single hire booking (admin)
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/admin/hire-bookings/{id}
```

## Code Documentation

All API endpoints now include JSDoc comments explaining:
- Purpose and functionality
- Parameters and return values
- Real-time sync behavior (for user-facing endpoints)
- Special considerations (auto-generated fields, path revalidation)

## Future Enhancements

Potential improvements for the admin dashboard:

1. **Batch Operations**: Select and delete multiple items at once
2. **Advanced Filtering**: More granular filter options
3. **Export Functionality**: Export data as CSV/Excel
4. **Analytics Integration**: Track admin actions and changes
5. **Version History**: Track changes to products/categories over time
6. **Image Optimization**: Automatic image resizing and compression
7. **Webhooks**: Notify external systems of changes
8. **Scheduled Publishing**: Set future dates for product activation

## Troubleshooting

### Common Issues

1. **Changes not reflecting immediately**
   - Check if item is marked as active (`is_active = true`)
   - Verify API routes are not cached
   - Check browser cache (hard refresh)

2. **Permission denied errors**
   - Verify admin authentication is working
   - Check `verifyAdmin()` function in admin-guard.ts
   - Ensure user has admin role in Supabase

3. **Image upload failures**
   - Check Supabase storage bucket permissions
   - Verify file size limits
   - Check network connectivity

## Conclusion

The admin dashboard provides a complete CRUD interface for managing all aspects of the e-commerce platform. Changes made by admins are immediately visible to users through direct database queries and active status filtering. The implementation follows Next.js best practices and uses Supabase for scalable, real-time data management.

For additional support or questions, refer to the project's README.md or contact the development team.
