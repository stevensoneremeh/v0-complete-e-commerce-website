import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const tests = []

    // Test 1: Check if categories exist
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .limit(5)
      
      tests.push({
        test: 'Categories table',
        status: error ? 'FAILED' : 'PASSED',
        count: categories?.length || 0,
        error: error?.message
      })
    } catch (error) {
      tests.push({
        test: 'Categories table',
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 2: Check if products exist
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .limit(5)
      
      tests.push({
        test: 'Products table',
        status: error ? 'FAILED' : 'PASSED',
        count: products?.length || 0,
        error: error?.message
      })
    } catch (error) {
      tests.push({
        test: 'Products table',
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 3: Check if profiles exist
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(5)
      
      tests.push({
        test: 'Profiles table',
        status: error ? 'FAILED' : 'PASSED',
        count: profiles?.length || 0,
        error: error?.message
      })
    } catch (error) {
      tests.push({
        test: 'Profiles table',
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 4: Check admin user exists
    try {
      const { data: admin, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'talktostevenson@gmail.com')
        .single()
      
      tests.push({
        test: 'Admin user exists',
        status: error ? 'FAILED' : (admin?.is_admin ? 'PASSED' : 'FAILED'),
        data: admin,
        error: error?.message
      })
    } catch (error) {
      tests.push({
        test: 'Admin user exists',
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 5: Check Paystack configuration
    const paystackTest = {
      test: 'Paystack configuration',
      status: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY && process.env.PAYSTACK_SECRET_KEY ? 'PASSED' : 'FAILED',
      public_key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ? 'SET' : 'MISSING',
      secret_key: process.env.PAYSTACK_SECRET_KEY ? 'SET' : 'MISSING'
    }
    tests.push(paystackTest)

    // Test 6: Check Supabase configuration
    const supabaseTest = {
      test: 'Supabase configuration',
      status: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'PASSED' : 'FAILED',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
    }
    tests.push(supabaseTest)

    const summary = {
      total_tests: tests.length,
      passed: tests.filter(t => t.status === 'PASSED').length,
      failed: tests.filter(t => t.status === 'FAILED').length,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      summary,
      tests,
      production_ready: summary.failed === 0
    })

  } catch (error) {
    return NextResponse.json({
      error: "Test failed",
      message: error instanceof Error ? error.message : 'Unknown error',
      production_ready: false
    }, { status: 500 })
  }
}
