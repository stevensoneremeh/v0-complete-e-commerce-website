# Complete Medusa Migration Guide

## ⚠️ BEFORE YOU START

**Current State Analysis:**
- ✅ Frontend is built: 80+ components, responsive design
- ✅ Database schema is solid: 28 well-designed tables
- ❌ Admin dashboard is custom-built (37 pages)
- ❌ E-commerce logic is scattered across API routes
- ⚠️ Real estate & hire services are mixed with e-commerce

**Time Investment:** 3-4 weeks of focused development

---

## 🎯 MEDUSA OVERVIEW

**What is Medusa?**
An open-source headless e-commerce platform built on Node.js:
- Pre-built admin dashboard (no coding needed)
- 50+ payment providers (Paystack, Stripe, etc.)
- Inventory management system
- Order fulfillment workflows
- Multi-currency support
- Extensible plugin system

**Key Difference:** Medusa handles e-commerce backend; you keep your Next.js frontend.

---

## 📊 DATA MAPPING: SUPABASE → MEDUSA

### **Products**
```
Supabase Table: products
├── id → product.id
├── name → product.title
├── description → product.description
├── price → variant.prices[]
├── images → product.images[]
├── stock_quantity → variant.manage_inventory
├── category_id → product_type.id
├── is_featured → product.metadata.featured
├── is_active → product.status (active)
├── created_at → product.created_at
└── updated_at → product.updated_at

Medusa Concepts:
- Product: The item itself
- ProductVariant: Size, color, etc.
- ProductType: Categorization
- Price: Per currency/region
```

### **Orders**
```
Supabase Table: orders
├── id → order.id
├── customer_id → order.customer_id
├── total_amount → order.total
├── items (via order_items) → order.items
├── status → order.status
├── payment_status → order.payment_status
├── created_at → order.created_at
└── shipping_* → order.shipping_address

Medusa Also Provides:
- Automatic fulfillment tracking
- Return/exchange management
- Order timeline
- Payment capture workflows
```

### **Customers**
```
Supabase Table: profiles (users)
├── id → customer.id
├── email → customer.email
├── full_name → customer.first_name + last_name
├── phone → customer.phone
├── address → customer.addresses[]
├── avatar_url → customer.metadata.avatar
└── is_admin → customer.metadata.is_admin

Note: Medusa separates customers from admin users
```

### **Categories**
```
Supabase Table: categories
├── id → product_category.id
├── name → product_category.name
├── description → product_category.description
├── slug → product_category.handle
├── parent_id → product_category.parent_category_id
└── is_active → product_category.is_active
```

### **Coupons/Discounts**
```
Supabase Table: coupons
├── code → discount.code
├── discount_value → discount.rule.value
├── discount_type → discount.rule.type (percentage/fixed)
├── usage_limit → discount.usage_limit
├── expires_at → discount.ends_at
└── is_active → discount.is_disabled (inverted)

Medusa Enhancement:
- Automatic usage tracking
- Region-specific discounts
- Advanced allocation rules
```

---

## 🔄 MIGRATION STEP-BY-STEP

### **Step 1: Set Up Medusa Backend**

```bash
# Install Medusa CLI
npm install -g @medusajs/medusa-cli

# Create new Medusa project
medusa new my-store --seed

# Install dependencies
cd my-store
npm install

# Start development server
npm run dev
# Admin panel: http://localhost:7001
# API: http://localhost:9000
```

### **Step 2: Database Setup**

```bash
# Medusa uses PostgreSQL by default
# Update .env.local
DATABASE_URL=postgres://user:password@localhost:5432/medusa_store

# Run migrations
npm run migrations run
```

### **Step 3: Export Data from Supabase**

```typescript
// scripts/export-supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function exportData() {
  // Export products
  const { data: products } = await supabase
    .from('products')
    .select('*')
  
  // Export orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
  
  // Export customers
  const { data: customers } = await supabase
    .from('profiles')
    .select('*')

  // Save to JSON files for import
  console.log('Data exported successfully')
}

exportData()
```

### **Step 4: Create Data Import Scripts**

```typescript
// scripts/import-to-medusa.ts
import medusaRequest from "@medusajs/medusa-js"

const medusa = new medusaRequest.default()

async function importProducts(products: any[]) {
  for (const product of products) {
    try {
      await medusa.admin.products.create({
        title: product.name,
        description: product.description,
        images: product.images?.map((url) => ({ url })) || [],
        collection_id: product.category_id,
        type_id: "default",
        is_giftcard: false,
        variants: [
          {
            title: "Default Variant",
            sku: product.sku,
            ean: product.sku,
            prices: [
              {
                currency_code: "usd",
                amount: Math.round(product.price * 100),
              },
            ],
            manage_inventory: true,
            inventory_quantity: product.stock_quantity,
          },
        ],
        metadata: {
          featured: product.is_featured,
          original_id: product.id,
        },
      })
    } catch (error) {
      console.error(`Failed to import product ${product.id}:`, error)
    }
  }
}

async function importCustomers(customers: any[]) {
  for (const customer of customers) {
    try {
      await medusa.admin.customers.create({
        email: customer.email,
        first_name: customer.full_name?.split(' ')[0],
        last_name: customer.full_name?.split(' ')[1] || '',
        phone: customer.phone,
        metadata: {
          avatar: customer.avatar_url,
          original_id: customer.id,
        },
      })
    } catch (error) {
      console.error(`Failed to import customer ${customer.id}:`, error)
    }
  }
}

async function runImport() {
  const products = require('./exported-products.json')
  const customers = require('./exported-customers.json')
  
  console.log('Importing products...')
  await importProducts(products)
  
  console.log('Importing customers...')
  await importCustomers(customers)
  
  console.log('Import complete!')
}

runImport()
```

### **Step 5: Update Frontend API Routes**

**Before (Supabase):**
```typescript
// app/api/products/route.ts
import { supabase } from '@/lib/supabase/server'

export async function GET() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
  
  return Response.json(data)
}
```

**After (Medusa):**
```typescript
// app/api/products/route.ts
export async function GET() {
  const response = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/admin/products`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.MEDUSA_API_TOKEN}`,
      },
    }
  )
  
  const { products } = await response.json()
  return Response.json(products)
}
```

### **Step 6: Authentication Changes**

**Before (Supabase):**
```typescript
// JWT + Supabase Auth
const { data } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

**After (Medusa):**
```typescript
// Keep Supabase Auth for customers, but manage admin separately
export async function loginAdmin(email: string, password: string) {
  const response = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/admin/auth`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  )
  
  const { access_token } = await response.json()
  // Store token in HTTP-only cookie
  return access_token
}
```

### **Step 7: Replace Admin Dashboard**

**Before:**
- 37 custom pages in `/admin`
- Manual forms for each entity
- Custom API handling

**After:**
- Remove `/admin` pages
- Redirect admins to Medusa admin panel at `/medusa` or external URL
- Medusa provides:
  - Product management
  - Order fulfillment
  - Customer management
  - Payment processing
  - Reporting & analytics
  - User management

```typescript
// app/admin/redirect/page.tsx
'use client'

import { useEffect } from 'react'

export default function AdminRedirect() {
  useEffect(() => {
    window.location.href = process.env.NEXT_PUBLIC_MEDUSA_ADMIN_URL
  }, [])

  return <div>Redirecting to admin panel...</div>
}
```

### **Step 8: Handle Real Estate & Hire Services**

**Option A: Custom Plugins**
```typescript
// Create custom Medusa plugin for properties
// medusa-plugin-properties/index.ts

export default async (
  container,
  options
) => {
  // Register custom routes for properties
  const router = container.resolve("router")
  
  router.post("/admin/properties", async (req, res) => {
    // Handle property creation
  })
}
```

**Option B: Keep in Separate Supabase**
- Keep properties & hire services in Supabase
- Products & orders in Medusa
- Frontend talks to both

---

## ⚙️ ENVIRONMENT VARIABLES

```env
# Medusa
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_API_TOKEN=your_api_token
NEXT_PUBLIC_MEDUSA_ADMIN_URL=http://localhost:7001

# Supabase (for properties & hire services if kept)
SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Payment Providers
PAYSTACK_SECRET_KEY=your_key
PAYSTACK_PUBLIC_KEY=your_key
```

---

## 🔌 COMMON CUSTOMIZATIONS

### **Custom Product Attributes (for variants)**
```typescript
// medusa-plugin-custom-attributes/index.ts
const attributes = [
  { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
  { name: 'Color', values: ['Red', 'Blue', 'Green'] },
]

export const productOptions = attributes.map(attr => ({
  title: attr.name,
  option_values: attr.values,
}))
```

### **Multi-Currency Support**
```typescript
// Already built-in to Medusa
const price = {
  currency_code: 'usd',
  amount: 9999, // $99.99
}
```

### **Inventory Management**
```typescript
// Medusa handles this automatically
const variant = {
  manage_inventory: true,
  inventory_quantity: 100,
  sku: 'PROD-001',
}
```

---

## 🧪 TESTING CHECKLIST

- [ ] All products migrated and displaying correctly
- [ ] Product variants working properly
- [ ] Pricing correct across all currencies
- [ ] Customer accounts preserved
- [ ] Orders showing up in Medusa admin
- [ ] Payment processing working
- [ ] Coupons/discounts applying correctly
- [ ] Real estate bookings still working (if kept in Supabase)
- [ ] Hire services still functional
- [ ] File uploads working
- [ ] Email notifications configured
- [ ] Admin can create/edit/delete products
- [ ] Admin can manage orders and fulfillment
- [ ] Frontend responsive on mobile
- [ ] Performance acceptable

---

## 💰 COST COMPARISON

### **Current (Supabase):**
- PostgreSQL database: $5-25/month
- Authentication: Free (built-in)
- Storage: $5/month
- Realtime: Free/Paid
- **Total: ~$15-35/month**

### **With Medusa:**
- Medusa hosting (self-hosted): Free (but requires server)
- PostgreSQL database: $5-25/month
- Object storage: $5-10/month
- Payment processing: 2-3% per transaction
- **Total: $15-40/month + transaction fees**

---

## 🚨 RISKS & MITIGATION

| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Data loss during migration | Low | Backup Supabase, test import on staging |
| Downtime during switchover | Medium | Plan during off-hours, use feature flags |
| Real estate features break | High | Keep in Supabase or develop plugins |
| Payment processing issues | Low | Test thoroughly with Medusa + Paystack |
| Performance degradation | Low | Load test before launching |
| Admin confusion | Medium | Provide training documentation |

---

## ✅ FINAL RECOMMENDATION

### **Recommended Approach: Hybrid Solution**

**Phase 1 (Week 1-2): Set up Medusa for E-Commerce**
- Products management only
- Orders + fulfillment
- Built-in admin panel
- Keep admin pages simple redirects

**Phase 2 (Week 2-3): Keep Real Estate in Supabase**
- Properties + bookings stay in Supabase
- Hire services stay in Supabase
- Frontend talks to both backends
- Use API routes as unified interface

**Phase 3 (Week 4): Optimize & Launch**
- Performance testing
- Data verification
- Go live
- Monitor metrics

**Total Effort:** 3-4 weeks
**Risk Level:** Medium (can always rollback)
**Benefit:** Best admin experience + maximum flexibility

---

## 📚 RESOURCES

- **Medusa Docs:** https://docs.medusajs.com
- **Medusa Admin:** https://admin.medusajs.com
- **API Reference:** https://docs.medusajs.com/api
- **Community:** https://discord.gg/medusajs
- **Plugins:** https://medusajs.com/plugins

---
