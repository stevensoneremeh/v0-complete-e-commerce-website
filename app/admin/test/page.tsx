"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, XCircle, AlertCircle, Database, User, ShoppingCart, RefreshCw } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: string
}

interface DbStats {
  categories: number
  products: number
  orders: number
  users: number
}

export default function AdminTestPage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [dbStats, setDbStats] = useState<DbStats>({ categories: 0, products: 0, orders: 0, users: 0 })
  const [isRunning, setIsRunning] = useState(false)
  const { user, isLoading } = useAuth()
  const supabase = createClient()

  const runTests = async () => {
    setIsRunning(true)
    const results: TestResult[] = []
    const stats = { categories: 0, products: 0, orders: 0, users: 0 }

    // Test 1: Supabase Connection
    try {
      const { data, error } = await supabase.from("categories").select("count")
      results.push({
        name: "Supabase Connection",
        status: error ? "error" : "success",
        message: error ? `Connection failed: ${error.message}` : "Successfully connected to Supabase",
        details: error ? error.details : "Database accessible"
      })
    } catch (err) {
      results.push({
        name: "Supabase Connection",
        status: "error",
        message: "Failed to connect to Supabase",
        details: err instanceof Error ? err.message : "Unknown error"
      })
    }

    // Test 2: User Authentication
    results.push({
      name: "User Authentication",
      status: user ? "success" : "warning",
      message: user ? `Authenticated as ${user.email}` : "No authenticated user",
      details: user ? `Role: ${user.role || 'user'}, Admin: ${user.is_admin ? 'Yes' : 'No'}` : "Please sign in to test admin features"
    })

    // Test 3: Admin Access
    if (user) {
      const isAdmin = user.is_admin || user.role === 'admin' || user.role === 'super_admin'
      results.push({
        name: "Admin Access",
        status: isAdmin ? "success" : "error",
        message: isAdmin ? "Admin access granted" : "Admin access denied",
        details: `Current role: ${user.role || 'user'}, Is Admin: ${user.is_admin ? 'Yes' : 'No'}`
      })
    }

    // Test 4: Categories Table
    try {
      const { data, error, count } = await supabase
        .from("categories")
        .select("*", { count: 'exact' })
        .limit(5)

      if (error) throw error

      stats.categories = count || 0
      results.push({
        name: "Categories Table",
        status: "success",
        message: `Found ${count || 0} categories`,
        details: data?.map(c => c.name).join(", ") || "No categories"
      })
    } catch (err) {
      results.push({
        name: "Categories Table",
        status: "error",
        message: "Failed to access categories",
        details: err instanceof Error ? err.message : "Unknown error"
      })
    }

    // Test 5: Products Table
    try {
      const { data, error, count } = await supabase
        .from("products")
        .select("*", { count: 'exact' })
        .limit(5)

      if (error) throw error

      stats.products = count || 0
      results.push({
        name: "Products Table",
        status: "success",
        message: `Found ${count || 0} products`,
        details: data?.map(p => p.name).join(", ") || "No products"
      })
    } catch (err) {
      results.push({
        name: "Products Table",
        status: "error",
        message: "Failed to access products",
        details: err instanceof Error ? err.message : "Unknown error"
      })
    }

    // Test 6: Orders Table
    try {
      const { count, error } = await supabase
        .from("orders")
        .select("*", { count: 'exact', head: true })

      if (error) throw error

      stats.orders = count || 0
      results.push({
        name: "Orders Table",
        status: "success",
        message: `Found ${count || 0} orders`,
        details: `Orders table accessible`
      })
    } catch (err) {
      results.push({
        name: "Orders Table",
        status: "error",
        message: "Failed to access orders",
        details: err instanceof Error ? err.message : "Unknown error"
      })
    }

    // Test 7: Profiles Table
    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true })

      if (error) throw error

      stats.users = count || 0
      results.push({
        name: "Profiles Table",
        status: "success",
        message: `Found ${count || 0} user profiles`,
        details: `Profiles table accessible`
      })
    } catch (err) {
      results.push({
        name: "Profiles Table",
        status: "error",
        message: "Failed to access profiles",
        details: err instanceof Error ? err.message : "Unknown error"
      })
    }

    // Test 8: Admin API Access
    if (user && (user.is_admin || user.role === 'admin' || user.role === 'super_admin')) {
      try {
        const response = await fetch('/api/test-admin')
        const data = await response.json()
        results.push({
          name: "Admin API Access",
          status: response.ok ? "success" : "error",
          message: response.ok ? "Admin API accessible" : "Admin API access denied",
          details: JSON.stringify(data)
        })
      } catch (err) {
        results.push({
          name: "Admin API Access",
          status: "error",
          message: "Failed to access admin API",
          details: err instanceof Error ? err.message : "Unknown error"
        })
      }
    }

    // Test 9: Payment System
    try {
      const response = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: 'test_ref' })
      })
      const data = await response.json()
      results.push({
        name: "Payment System",
        status: response.status === 400 ? "success" : "warning",
        message: response.status === 400 ? "Payment API configured" : "Payment API may need configuration",
        details: data.error || "Payment verification endpoint accessible"
      })
    } catch (err) {
      results.push({
        name: "Payment System",
        status: "error",
        message: "Payment system not accessible",
        details: err instanceof Error ? err.message : "Unknown error"
      })
    }

    setTests(results)
    setDbStats(stats)
    setIsRunning(false)
  }

  const createTestData = async () => {
    if (!user || !(user.is_admin || user.role === 'admin' || user.role === 'super_admin')) {
      alert('Admin access required')
      return
    }

    try {
      // Create test category
      const { data: category } = await supabase
        .from('categories')
        .insert({ name: 'Test Category', description: 'Test category for demo' })
        .select()
        .single()

      if (category) {
        // Create test product
        await supabase
          .from('products')
          .insert({
            name: 'Test Product',
            description: 'This is a test product',
            price: 99.99,
            price_usd: 120.00,
            category_id: category.id,
            in_stock: true,
            stock_quantity: 10
          })
      }

      alert('Test data created successfully!')
      runTests()
    } catch (err) {
      alert('Failed to create test data: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  useEffect(() => {
    if (!isLoading) {
      runTests()
    }
  }, [isLoading, user])

  const getIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getBadgeVariant = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "default"
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">Loading tests...</div>
      </div>
    )
  }

  const successCount = tests.filter(t => t.status === 'success').length
  const errorCount = tests.filter(t => t.status === 'error').length
  const warningCount = tests.filter(t => t.status === 'warning').length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin System Test Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive testing of all admin functionality and database connections.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={runTests} disabled={isRunning} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? "Running Tests..." : "Run Tests"}
        </Button>
        {user && (user.is_admin || user.role === 'admin' || user.role === 'super_admin') && (
          <Button onClick={createTestData} variant="outline" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Create Test Data
          </Button>
        )}
        <Badge variant={user && (user.is_admin || user.role === 'admin' || user.role === 'super_admin') ? "default" : "destructive"}>
          {user && (user.is_admin || user.role === 'admin' || user.role === 'super_admin') ? "Admin User" : "Regular User"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Test Results</p>
                <p className="text-lg font-bold text-green-600">{successCount} / {tests.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-lg font-bold">{dbStats.categories}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-lg font-bold">{dbStats.products}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Users</p>
                <p className="text-lg font-bold">{dbStats.users}</p>
              </div>
              <User className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid gap-4">
            {tests.map((test, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      {getIcon(test.status)}
                      {test.name}
                    </CardTitle>
                    <Badge variant={getBadgeVariant(test.status)}>
                      {test.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-2">
                    {test.message}
                  </CardDescription>
                  {test.details && (
                    <Alert>
                      <AlertDescription className="text-xs font-mono">
                        {test.details}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Admin Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">1. Create Admin Account</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Sign up with one of these admin emails:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <code>admin@ablnatashaenterprises.com</code></li>
                  <li>• <code>talktostevenson@gmail.com</code></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Database Setup</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  The database should be automatically configured. If you see errors, run the SQL script in Supabase.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Admin Features Available</h4>
                <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                  <li>• Product Management: Add, edit, delete products</li>
                  <li>• Category Management: Organize product categories</li>
                  <li>• Order Management: View and process orders</li>
                  <li>• User Management: View customer profiles</li>
                  <li>• Analytics: Sales and performance metrics</li>
                  <li>• Property Management: Real estate listings</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">4. Test User Signup</h4>
                <p className="text-sm text-muted-foreground">
                  Once admin setup is complete, test regular user signup and all features to ensure everything works properly.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}