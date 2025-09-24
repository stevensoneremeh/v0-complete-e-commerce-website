
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  Database, 
  Users, 
  Package, 
  ShoppingCart,
  Building2,
  Calendar,
  Settings,
  BarChart3
} from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "pending"
  message: string
}

export default function AdminTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const tests = [
      {
        name: "Database Connection",
        test: async () => {
          const response = await fetch("/api/admin/analytics")
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return "Database connection successful"
        }
      },
      {
        name: "Customer Management",
        test: async () => {
          const response = await fetch("/api/admin/customers")
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return "Customer API accessible"
        }
      },
      {
        name: "Product Management",
        test: async () => {
          const response = await fetch("/api/admin/products")
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return "Product API accessible"
        }
      },
      {
        name: "Property Management",
        test: async () => {
          const response = await fetch("/api/admin/properties")
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return "Property API accessible"
        }
      },
      {
        name: "Booking Management",
        test: async () => {
          const response = await fetch("/api/admin/hire-bookings")
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return "Booking API accessible"
        }
      }
    ]

    for (const testCase of tests) {
      const result: TestResult = {
        name: testCase.name,
        status: "pending",
        message: "Running..."
      }
      
      setTestResults(prev => [...prev, result])

      try {
        const message = await testCase.test()
        result.status = "success"
        result.message = message
      } catch (error) {
        result.status = "error"
        result.message = error instanceof Error ? error.message : "Unknown error"
      }

      setTestResults(prev => 
        prev.map(r => r.name === result.name ? result : r)
      )

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin System Test</h1>
        <p className="text-muted-foreground">
          Test all admin functionality and API endpoints
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health Check</CardTitle>
          <CardDescription>
            Run comprehensive tests to verify admin functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="w-full mb-4"
          >
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {result.status === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {result.status === "error" && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    {result.status === "pending" && (
                      <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        result.status === "success" ? "default" : 
                        result.status === "error" ? "destructive" : "secondary"
                      }
                    >
                      {result.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Supabase connection and RLS policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customer profiles and admin roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Product CRUD and categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Property listings and availability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Order processing and tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sales reports and metrics
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Some tests may fail if Supabase environment variables are not configured. 
          This is expected in development mode. Use the Secrets tool to add your Supabase configuration.
        </AlertDescription>
      </Alert>
    </div>
  )
}
