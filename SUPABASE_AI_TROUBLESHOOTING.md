# Supabase AI Troubleshooting Prompt

## Quick Test First
Go to: `http://localhost:3000/api/test-connection`

If you see `"status": "success"`, your Supabase connection works.

---

## Prompt for Supabase AI

If the connection test fails or the admin dashboard buttons don't work, use this prompt with Supabase AI:

---

### **PROMPT TO USE:**

```
I have a Next.js e-commerce admin dashboard that's not saving data to Supabase. 

Here's my situation:
1. Users click "Create Category" button in the admin dashboard
2. The form submits to POST /api/test-admin/categories
3. The API tries to insert a record into the "categories" table using:
   - Supabase Service Role Key (SUPABASE_SERVICE_ROLE_KEY)
   - Direct insert with: { name, slug, description, is_active, status: "active" }
4. Nothing happens - no error, no record created

The categories table exists and has these columns:
- id (uuid, primary key)
- name (text)
- slug (text)
- description (text)
- is_active (boolean)
- status (text)
- created_at (timestamp)
- updated_at (timestamp)

Row Level Security (RLS) is enabled on the categories table.

Questions:
1. Does using Service Role Key bypass RLS? Should it work?
2. What RLS policies might block a service role INSERT?
3. How can I debug why the insert isn't working?
4. Should I disable RLS temporarily for testing or add a specific admin policy?

Please provide SQL to:
- Check current RLS policies on categories table
- Verify the Service Role has proper permissions
- Add or fix any policies needed for admin inserts
- Test an insert directly via SQL
```

---

### **WHAT SUPABASE AI WILL HELP YOU WITH:**

1. ✅ Check if RLS policies are blocking the insert
2. ✅ Verify Service Role permissions
3. ✅ Provide SQL to add proper admin policies
4. ✅ Test the insert directly in Supabase SQL editor
5. ✅ Debug any permission issues

---

## What I've Already Done

Added comprehensive logging to help debug:

### Client-side logging (in `/app/admin/quick-categories/page.tsx`):
- Logs when form is submitted
- Logs the request URL and method
- Logs the response status
- Logs any errors

### Server-side logging (in `/api/test-admin/categories/route.ts`):
- Logs when request is received
- Logs the request body
- Logs database query details
- Logs any errors from Supabase

### Connection test (in `/api/test-connection/route.ts`):
- Verifies Supabase URL is set
- Verifies Service Role Key is set
- Tests a simple SELECT query
- Returns detailed error messages

---

## Testing Steps

1. **Open browser DevTools Console** (F12)
2. **Go to** `/admin/quick-categories`
3. **Click** "Add Category"
4. **Enter** test name like "Furniture"
5. **Click** "Create"
6. **Check Console** for logs showing:
   - "[v0] Form submitted"
   - "[v0] Sending request to: /api/test-admin/categories"
   - "[v0] Response status: 201" (if successful) or error status

7. **If status is not 201**, check the error message
8. **Test the connection** at `/api/test-connection`
9. **Use Supabase AI prompt above** to troubleshoot database permissions

---

## Direct Supabase SQL Testing

You can also test directly in Supabase SQL Editor:

```sql
-- Test 1: Check RLS policies on categories table
SELECT tablename, policyname, qual, cmd 
FROM pg_policies 
WHERE tablename = 'categories';

-- Test 2: Try inserting as service role (this should work)
INSERT INTO categories (name, slug, description, is_active, status)
VALUES ('Test Category', 'test-category', 'Test description', true, 'active')
RETURNING *;

-- Test 3: Check if record was created
SELECT * FROM categories WHERE name = 'Test Category';
```

---

## Still Having Issues?

If after using Supabase AI the admin dashboard still doesn't work:

1. Share the exact error from `/api/test-connection` response
2. Share the browser console logs (paste them here)
3. Share any error messages from the database insert
4. I can then fix the API route or RLS policies directly
