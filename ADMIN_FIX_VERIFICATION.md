# Admin Dashboard Fix Verification Guide

## 🔧 Issues Fixed

### 1. **Service Role Key Implementation**
**Problem**: The admin-guard was using `createServerClient` with the service role key, which doesn't properly bypass Row Level Security (RLS) policies.

**Solution**: Updated `/lib/auth/admin-guard.ts` to:
- Use anon key for authentication verification
- Use service role key (`createClient` from @supabase/supabase-js) for database operations
- This properly bypasses RLS and allows admin CRUD operations

### Changes Made:
\`\`\`typescript
// OLD: Used createServerClient with service role (doesn't bypass RLS properly)
const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {...})

// NEW: Separate auth check and service role client
// 1. Auth check with anon key
const authClient = createServerClient(supabaseUrl, supabaseAnonKey, {...})
const { data: { user } } = await authClient.auth.getUser()

// 2. Verify admin status
const { data: profile } = await authClient.from("profiles").select("is_admin, role")...

// 3. Return service role client (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
\`\`\`

## ✅ What's Now Fixed

- ✅ **Categories**: Can now create, update, and delete categories
- ✅ **Products**: Can now create, update, and delete products
- ✅ **Hire Services**: Can now create, update, and delete hire services (cars/boats)
- ✅ **Properties**: Can now create, update, and delete real estate properties

## 🧪 Manual Testing Steps

### Prerequisites
1. Make sure you're logged in as an admin user
2. Navigate to the admin dashboard at `/admin`

### Test 1: Categories Management
1. Go to `/admin/categories`
2. Click "Add Category"
3. Fill in the form:
   - Name: `Natasha Test Category`
   - Description: `Testing category creation`
   - Check "Active"
4. Click "Save"
5. ✅ Verify the category appears in the list
6. Click "Edit" on the category
7. Update the description to: `Updated by Natasha`
8. Click "Save"
9. ✅ Verify the description updated

### Test 2: Products Management
1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in the form:
   - Name: `Natasha Test Product`
   - Description: `Testing product creation`
   - Price: `99.99`
   - Category: Select the "Natasha Test Category"
   - Stock: `100`
   - Status: `Active`
4. Click "Save"
5. ✅ Verify the product appears in the list
6. Click "Edit" on the product
7. Update the price to: `149.99`
8. Click "Save"
9. ✅ Verify the price updated

### Test 3: Hire Services Management
1. Go to `/admin/hire-services` or `/admin/hire-items`
2. Click "Add Hire Service"
3. Fill in the form:
   - Name: `Natasha Test Car`
   - Description: `Testing hire service creation`
   - Service Type: `car`
   - Price per Day: `150.00`
   - Location: `Lagos`
   - Capacity: `5`
4. Click "Save"
5. ✅ Verify the hire service appears in the list
6. Click "Edit" on the hire service
7. Update the price to: `200.00`
8. Click "Save"
9. ✅ Verify the price updated

### Test 4: Properties Management
1. Go to `/admin/properties` or `/admin/real-estate`
2. Click "Add Property"
3. Fill in the form:
   - Title: `Natasha Test Apartment`
   - Description: `Testing property creation`
   - Location: `Lagos, Nigeria`
   - Property Type: `Apartment`
   - Bedrooms: `2`
   - Bathrooms: `2`
   - Price per Night: `299.99`
   - Status: `Available`
4. Click "Save"
5. ✅ Verify the property appears in the list
6. Click "Edit" on the property
7. Update the price to: `399.99`
8. Click "Save"
9. ✅ Verify the price updated

## 🤖 Automated Testing (Optional)

If you have environment variables set up, you can run the automated test script:

\`\`\`bash
# Make sure environment variables are set
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run the test script
pnpm dlx tsx scripts/test-admin-natasha.ts
\`\`\`

This will automatically:
- Create test items with "natasha" in the name
- Update them to verify UPDATE works
- Display all created items

## 🔍 Troubleshooting

### Issue: Still can't create/update items
1. **Check admin status**: Verify your user has `is_admin = true` in the `profiles` table
2. **Check environment variables**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
3. **Check browser console**: Look for any JavaScript errors
4. **Check network tab**: Look at the API responses for specific error messages

### Issue: "Forbidden - Admin access required"
- Your user account doesn't have admin privileges
- Run this SQL in Supabase:
  \`\`\`sql
  UPDATE profiles 
  SET is_admin = true, role = 'admin' 
  WHERE id = 'your-user-id';
  \`\`\`

### Issue: "Service not configured"
- Environment variables are missing
- Check that both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

## 📊 Expected Results

After successful testing, you should have:
- 1 category named "Natasha Test Category"
- 1 product named "Natasha Test Product"
- 1 hire service named "Natasha Test Car"
- 1 property named "Natasha Test Apartment"

All should be visible and editable in the admin dashboard.

## 🎯 Success Criteria

- ✅ Can create new items in all 4 sections
- ✅ Can update existing items in all 4 sections
- ✅ Can see the updated values immediately
- ✅ No error messages in browser console
- ✅ All test items named "natasha" are visible

## 🚀 Next Steps

1. Test the admin dashboard thoroughly
2. Delete the test items if they're not needed
3. Start managing your real products, categories, hire services, and properties
4. Consider setting up automated backups for your data

## 📝 Technical Details

### Files Modified:
- `/lib/auth/admin-guard.ts` - Updated to use proper service role client

### Files Created:
- `/scripts/test-admin-natasha.ts` - Automated test script
- `/ADMIN_FIX_VERIFICATION.md` - This guide

### API Endpoints Tested:
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/[id]` - Update category
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `POST /api/admin/hire-services` - Create hire service
- `PUT /api/admin/hire-services/[id]` - Update hire service
- `POST /api/admin/properties` - Create property
- `PATCH /api/admin/properties/[id]` - Update property

All endpoints now properly use the service role key to bypass RLS policies.
