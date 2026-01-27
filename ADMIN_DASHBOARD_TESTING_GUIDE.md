# Admin Dashboard Testing Guide

## Quick Start

This guide provides step-by-step instructions for testing all CRUD operations in the admin dashboard.

## Prerequisites

1. Application must be running: `npm run dev`
2. Admin user must be logged in
3. Database must be connected (Supabase)

## Test Scenarios

### 1. Products Management Testing

#### Test 1.1: Create a New Product
1. Navigate to `/admin/products`
2. Click "Add Product" button
3. Fill in the form:
   - **Name**: "Test Luxury Watch"
   - **Description**: "Premium gold watch"
   - **Price**: 599.99
   - **Category**: Select any category
   - **Stock**: 10
   - **Status**: Active
   - **Featured**: Checked
4. Upload an image or provide URL
5. Click "Create Product"
6. **Expected Result**: Success toast message, product appears in table

#### Test 1.2: Verify Product on User Side
1. Navigate to `/products` (user-facing page)
2. Search for "Test Luxury Watch"
3. **Expected Result**: Product appears in search results

#### Test 1.3: Edit Product
1. Go back to `/admin/products`
2. Click edit icon on "Test Luxury Watch"
3. Change price to 549.99
4. Click "Update Product"
5. **Expected Result**: Success toast, updated price shows in table

#### Test 1.4: Verify Update on User Side
1. Navigate to `/products`
2. Find "Test Luxury Watch"
3. **Expected Result**: Price shows as $549.99

#### Test 1.5: Deactivate Product
1. Go back to `/admin/products`
2. Edit "Test Luxury Watch"
3. Uncheck "Active" status
4. Click "Update Product"
5. Navigate to `/products`
6. **Expected Result**: Product no longer visible on user side

#### Test 1.6: Delete Product
1. Go back to `/admin/products`
2. Click delete icon on "Test Luxury Watch"
3. Confirm deletion
4. **Expected Result**: Product removed from admin table

### 2. Categories Management Testing

#### Test 2.1: Create a New Category
1. Navigate to `/admin/categories`
2. Click "Add Category" button
3. Fill in the form:
   - **Name**: "Test Electronics"
   - **Description**: "Electronic devices and gadgets"
   - **Active**: Checked
4. Upload category image (optional)
5. Click "Create Category"
6. **Expected Result**: Success toast, category appears in table

#### Test 2.2: Verify Category on User Side
1. Navigate to `/products`
2. Check filter sidebar
3. **Expected Result**: "Test Electronics" appears in category filter

#### Test 2.3: Edit Category
1. Go back to `/admin/categories`
2. Click edit icon on "Test Electronics"
3. Change description to "High-tech electronic devices"
4. Click "Update Category"
5. **Expected Result**: Success toast, updated description

#### Test 2.4: Toggle Category Status
1. On `/admin/categories`
2. Toggle the switch for "Test Electronics" to inactive
3. Navigate to `/products`
4. **Expected Result**: Category no longer appears in filters

#### Test 2.5: Delete Category
1. Go back to `/admin/categories`
2. Click delete icon on "Test Electronics"
3. Confirm deletion
4. **Expected Result**: Category removed from table

### 3. Hire Services Management Testing

#### Test 3.1: Create a New Hire Service
1. Navigate to `/admin/hire-services`
2. Click "Add Service" button
3. Fill in the form:
   - **Name**: "Test Luxury Sedan"
   - **Category**: Car Hire
   - **Description**: "Premium sedan with driver"
   - **Price Per Day**: 299.99
   - **Available**: Checked
   - **Active**: Checked
4. Upload service image
5. Click "Create Service"
6. **Expected Result**: Success toast, service appears in table

#### Test 3.2: Verify Service on User Side
1. Navigate to `/hire` (user-facing hire page)
2. Look for "Test Luxury Sedan"
3. **Expected Result**: Service is visible and bookable

#### Test 3.3: Edit Service
1. Go back to `/admin/hire-services`
2. Click edit icon on "Test Luxury Sedan"
3. Change price to 279.99
4. Click "Update Service"
5. **Expected Result**: Success toast, updated price in table

#### Test 3.4: Verify Price Update
1. Navigate to `/hire`
2. Find "Test Luxury Sedan"
3. **Expected Result**: Price shows as $279.99/day

#### Test 3.5: Mark Service as Unavailable
1. Go back to `/admin/hire-services`
2. Edit "Test Luxury Sedan"
3. Uncheck "Available for Booking"
4. Update service
5. Navigate to `/hire`
6. **Expected Result**: Service shows as "Unavailable"

#### Test 3.6: Delete Service
1. Go back to `/admin/hire-services`
2. Click delete icon on "Test Luxury Sedan"
3. Confirm deletion
4. **Expected Result**: Service removed from admin table

### 4. Hire Bookings Management Testing

#### Test 4.1: View Bookings List
1. Navigate to `/admin/hire-bookings`
2. **Expected Result**: Table displays all hire bookings with:
   - Booking reference
   - Service name
   - Customer details
   - Dates
   - Amount
   - Payment status
   - Booking status

#### Test 4.2: Filter Bookings by Status
1. On `/admin/hire-bookings`
2. Select "Pending" from status filter
3. **Expected Result**: Only pending bookings shown
4. Select "Confirmed" from status filter
5. **Expected Result**: Only confirmed bookings shown

#### Test 4.3: View Booking Details
1. Click the eye icon on any booking
2. **Expected Result**: Dialog opens showing:
   - Full booking details
   - Customer information
   - Pickup/dropoff locations
   - Special requests
   - Admin notes field

#### Test 4.4: Update Booking Status
1. On the bookings table
2. Click status dropdown for a pending booking
3. Select "Confirmed"
4. **Expected Result**: Status updates immediately, success toast

#### Test 4.5: Add Admin Notes
1. Click eye icon on a booking
2. Add notes in the Admin Notes field
3. Click "Save Notes"
4. **Expected Result**: Success toast
5. Reopen booking details
6. **Expected Result**: Notes are saved and displayed

#### Test 4.6: Fetch Single Booking (API Test)
1. Note a booking ID from the table
2. Use API testing tool or browser:
   ```
   GET /api/admin/hire-bookings/[booking-id]
   ```
3. **Expected Result**: Returns booking with profile data

### 5. Real-Time Sync Testing

#### Test 5.1: Product Sync
1. Open two browser windows:
   - Window A: `/admin/products`
   - Window B: `/products`
2. In Window A, create a new active product
3. In Window B, refresh the page
4. **Expected Result**: New product appears immediately

#### Test 5.2: Category Sync
1. Open two browser windows:
   - Window A: `/admin/categories`
   - Window B: `/products` (filter sidebar)
2. In Window A, create a new active category
3. In Window B, refresh the page
4. **Expected Result**: New category appears in filter

#### Test 5.3: Hire Service Sync
1. Open two browser windows:
   - Window A: `/admin/hire-services`
   - Window B: `/hire`
2. In Window A, update a service price
3. In Window B, refresh the page
4. **Expected Result**: Price update is visible

### 6. Edge Cases and Error Handling

#### Test 6.1: Create Product Without Required Fields
1. Navigate to `/admin/products`
2. Click "Add Product"
3. Leave name field empty
4. Try to submit
5. **Expected Result**: Validation error, form not submitted

#### Test 6.2: Delete Non-Existent Item
1. Use API testing tool:
   ```
   DELETE /api/admin/products/invalid-id
   ```
2. **Expected Result**: Error response with appropriate status code

#### Test 6.3: Access Admin API Without Auth
1. Log out of admin
2. Try to access:
   ```
   GET /api/admin/products
   ```
3. **Expected Result**: 401 Unauthorized error

## API Testing with curl

### Products
```bash
# List all products (admin)
curl -X GET http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create product (admin)
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Product","price":99.99,"category_id":"cat-id"}'

# Get single product (admin)
curl -X GET http://localhost:3000/api/admin/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update product (admin)
curl -X PUT http://localhost:3000/api/admin/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"price":89.99}'

# Delete product (admin)
curl -X DELETE http://localhost:3000/api/admin/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# List products (user-facing)
curl -X GET http://localhost:3000/api/products
```

### Categories
```bash
# List all categories (admin)
curl -X GET http://localhost:3000/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create category (admin)
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Category","is_active":true}'

# Update category (admin)
curl -X PUT http://localhost:3000/api/admin/categories/CATEGORY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Updated Category"}'

# Delete category (admin)
curl -X DELETE http://localhost:3000/api/admin/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# List categories (user-facing)
curl -X GET http://localhost:3000/api/categories
```

### Hire Services
```bash
# List all hire services (admin)
curl -X GET http://localhost:3000/api/admin/hire-services \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create hire service (admin)
curl -X POST http://localhost:3000/api/admin/hire-services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Luxury Car","category":"car","price_per_day":299.99}'

# Update hire service (admin)
curl -X PUT http://localhost:3000/api/admin/hire-services/SERVICE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"price_per_day":279.99}'

# Delete hire service (admin)
curl -X DELETE http://localhost:3000/api/admin/hire-services/SERVICE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# List hire services (user-facing)
curl -X GET http://localhost:3000/api/hire-services
```

### Hire Bookings
```bash
# List all hire bookings (admin)
curl -X GET http://localhost:3000/api/admin/hire-bookings \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get single hire booking (admin) - NEW ENDPOINT
curl -X GET http://localhost:3000/api/admin/hire-bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update hire booking (admin)
curl -X PATCH http://localhost:3000/api/admin/hire-bookings/BOOKING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status":"confirmed"}'

# Delete hire booking (admin)
curl -X DELETE http://localhost:3000/api/admin/hire-bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Test Results Template

Use this template to track your testing:

```
## Test Execution Report

Date: _______________
Tester: _______________

### Products Management
- [ ] Create product: PASS / FAIL
- [ ] Edit product: PASS / FAIL
- [ ] Delete product: PASS / FAIL
- [ ] User-side sync: PASS / FAIL

### Categories Management
- [ ] Create category: PASS / FAIL
- [ ] Edit category: PASS / FAIL
- [ ] Delete category: PASS / FAIL
- [ ] User-side sync: PASS / FAIL

### Hire Services Management
- [ ] Create service: PASS / FAIL
- [ ] Edit service: PASS / FAIL
- [ ] Delete service: PASS / FAIL
- [ ] User-side sync: PASS / FAIL

### Hire Bookings Management
- [ ] View bookings: PASS / FAIL
- [ ] Update status: PASS / FAIL
- [ ] Add notes: PASS / FAIL
- [ ] Fetch single booking: PASS / FAIL

### Real-Time Sync
- [ ] Product sync: PASS / FAIL
- [ ] Category sync: PASS / FAIL
- [ ] Service sync: PASS / FAIL

Notes:
_______________________________________
_______________________________________
```

## Troubleshooting

### Issue: Changes not reflecting on user side
**Solution**: 
1. Ensure item is marked as "Active" (`is_active = true`)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check if caching is enabled

### Issue: "Unauthorized" errors
**Solution**:
1. Verify you're logged in as admin
2. Check admin token in browser dev tools
3. Verify Supabase auth is working

### Issue: API returns 500 error
**Solution**:
1. Check browser console for details
2. Check Supabase connection
3. Verify database tables exist
4. Check server logs

## Conclusion

After completing all tests, the admin dashboard should demonstrate:
- ✅ Full CRUD operations for all entities
- ✅ Real-time synchronization between admin and user sides
- ✅ Proper error handling
- ✅ Authentication and authorization
- ✅ Data validation

For any issues or questions, refer to `ADMIN_DASHBOARD_IMPLEMENTATION.md` for detailed documentation.
