#!/usr/bin/env tsx
/**
 * Test Script: Add "Natasha" test items to verify admin CRUD operations
 * This script adds test categories, products, hire services, and properties with "natasha" in the name
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testCategories() {
  console.log('\n📁 Testing Categories...')
  
  const categoryData = {
    name: 'Natasha Test Category',
    slug: 'natasha-test-category',
    description: 'Test category created by Natasha test script',
    is_active: true,
    sort_order: 999
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select()
    .single()

  if (error) {
    console.error('❌ Failed to create category:', error.message)
    return null
  }

  console.log('✅ Category created:', data.name, '(ID:', data.id, ')')
  return data
}

async function testProducts(categoryId: string | null) {
  console.log('\n📦 Testing Products...')
  
  const productData = {
    name: 'Natasha Test Product',
    slug: 'natasha-test-product',
    description: 'Test product created by Natasha test script',
    price: 99.99,
    category_id: categoryId,
    stock_quantity: 100,
    sku: `NATASHA-${Date.now()}`,
    status: 'active',
    is_active: true,
    is_featured: false,
    images: ['https://via.placeholder.com/400x400?text=Natasha+Product']
  }

  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()

  if (error) {
    console.error('❌ Failed to create product:', error.message)
    return null
  }

  console.log('✅ Product created:', data.name, '(ID:', data.id, ')')
  return data
}

async function testHireServices() {
  console.log('\n🚗 Testing Hire Services...')
  
  const hireServiceData = {
    name: 'Natasha Test Car Hire',
    slug: 'natasha-test-car-hire',
    description: 'Test hire service created by Natasha test script',
    service_type: 'car',
    price_per_hour: 25.00,
    price_per_day: 150.00,
    capacity: 5,
    location: 'Natasha Test Location',
    is_active: true,
    images: ['https://via.placeholder.com/400x400?text=Natasha+Car'],
    amenities: ['GPS', 'Bluetooth', 'Air Conditioning']
  }

  const { data, error } = await supabase
    .from('hire_services')
    .insert([hireServiceData])
    .select()
    .single()

  if (error) {
    console.error('❌ Failed to create hire service:', error.message)
    return null
  }

  console.log('✅ Hire Service created:', data.name, '(ID:', data.id, ')')
  return data
}

async function testProperties() {
  console.log('\n🏠 Testing Properties...')
  
  // First create a product for the property
  const productData = {
    name: 'Natasha Test Property',
    slug: 'natasha-test-property',
    description: 'Test property listing',
    price: 299.99,
    category_id: null,
    stock_quantity: 1,
    sku: `NATASHA-PROP-${Date.now()}`,
    status: 'active',
    is_active: true,
    images: ['https://via.placeholder.com/800x600?text=Natasha+Property']
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()

  if (productError) {
    console.error('❌ Failed to create product for property:', productError.message)
    return null
  }

  // Then create the property
  const propertyData = {
    product_id: product.id,
    title: 'Natasha Test Property',
    description: 'Test property created by Natasha test script',
    property_type: 'apartment',
    location: 'Natasha Test City',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    booking_price_per_night: 299.99,
    is_available_for_booking: true,
    status: 'available',
    images: ['https://via.placeholder.com/800x600?text=Natasha+Property'],
    amenities: ['WiFi', 'Parking', 'Kitchen', 'Pool']
  }

  const { data, error } = await supabase
    .from('real_estate_properties')
    .insert([propertyData])
    .select()
    .single()

  if (error) {
    console.error('❌ Failed to create property:', error.message)
    return null
  }

  console.log('✅ Property created:', data.title, '(ID:', data.id, ')')
  return data
}

async function testUpdates() {
  console.log('\n🔄 Testing Updates...')
  
  // Find and update the category
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .ilike('name', '%natasha%')
    .limit(1)
    .single()

  if (categories) {
    const { error } = await supabase
      .from('categories')
      .update({ description: 'Updated by Natasha test script at ' + new Date().toISOString() })
      .eq('id', categories.id)

    if (error) {
      console.error('❌ Failed to update category:', error.message)
    } else {
      console.log('✅ Category updated successfully')
    }
  }

  // Find and update the product
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .ilike('name', '%natasha%')
    .limit(1)
    .single()

  if (products) {
    const { error } = await supabase
      .from('products')
      .update({ price: 149.99 })
      .eq('id', products.id)

    if (error) {
      console.error('❌ Failed to update product:', error.message)
    } else {
      console.log('✅ Product updated successfully')
    }
  }

  // Find and update the hire service
  const { data: hireServices } = await supabase
    .from('hire_services')
    .select('*')
    .ilike('name', '%natasha%')
    .limit(1)
    .single()

  if (hireServices) {
    const { error } = await supabase
      .from('hire_services')
      .update({ price_per_day: 199.99 })
      .eq('id', hireServices.id)

    if (error) {
      console.error('❌ Failed to update hire service:', error.message)
    } else {
      console.log('✅ Hire Service updated successfully')
    }
  }

  // Find and update the property
  const { data: properties } = await supabase
    .from('real_estate_properties')
    .select('*')
    .ilike('title', '%natasha%')
    .limit(1)
    .single()

  if (properties) {
    const { error } = await supabase
      .from('real_estate_properties')
      .update({ booking_price_per_night: 399.99 })
      .eq('id', properties.id)

    if (error) {
      console.error('❌ Failed to update property:', error.message)
    } else {
      console.log('✅ Property updated successfully')
    }
  }
}

async function verifyResults() {
  console.log('\n✨ Verification Results:')
  
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .ilike('name', '%natasha%')

  console.log(`\n📁 Categories with "natasha": ${categories?.length || 0}`)
  if (catError) console.error('  Error:', catError.message)
  categories?.forEach(cat => console.log(`   - ${cat.name} (${cat.id})`))

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .ilike('name', '%natasha%')

  console.log(`\n📦 Products with "natasha": ${products?.length || 0}`)
  if (prodError) console.error('  Error:', prodError.message)
  products?.forEach(prod => console.log(`   - ${prod.name} (${prod.id}) - $${prod.price}`))

  const { data: hireServices, error: hireError } = await supabase
    .from('hire_services')
    .select('*')
    .ilike('name', '%natasha%')

  console.log(`\n🚗 Hire Services with "natasha": ${hireServices?.length || 0}`)
  if (hireError) console.error('  Error:', hireError.message)
  hireServices?.forEach(hire => console.log(`   - ${hire.name} (${hire.id}) - $${hire.price_per_day}/day`))

  const { data: properties, error: propError } = await supabase
    .from('real_estate_properties')
    .select('*')
    .ilike('title', '%natasha%')

  console.log(`\n🏠 Properties with "natasha": ${properties?.length || 0}`)
  if (propError) console.error('  Error:', propError.message)
  properties?.forEach(prop => console.log(`   - ${prop.title} (${prop.id}) - $${prop.booking_price_per_night}/night`))
}

async function main() {
  console.log('🚀 Starting Natasha Test Script...')
  console.log('=' .repeat(60))

  try {
    // Test CREATE operations
    const category = await testCategories()
    const product = await testProducts(category?.id || null)
    const hireService = await testHireServices()
    const property = await testProperties()

    // Test UPDATE operations
    await testUpdates()

    // Verify all results
    await verifyResults()

    console.log('\n' + '=' .repeat(60))
    console.log('✅ Test completed successfully!')
    console.log('\n💡 Next steps:')
    console.log('   1. Check the admin dashboard to see these items')
    console.log('   2. Try editing them through the UI')
    console.log('   3. Search for "natasha" to find all test items')
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error)
    process.exit(1)
  }
}

main()
