"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "loading"
  message: string
  details?: string
}

export default function AdminTestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Admin API Connection", status: "loading", message: "Testing..." },
    { name: "Database Connection", status: "loading", message: "Testing..." },
    { name: "Environment Variables", status: "loading", message: "Testing..." },
    { name: "Paystack Integration", status: "loading", message: "Testing..." },
  ])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const newTests = [...tests]

    // Test Admin API
    try {
      const response = await fetch('/api/test-admin')
      const data = await response.json()

      if (response.ok && data.status === "success") {
        newTests[0] = { 
          name: "Admin API Connection", 
          status: "success", 
          message: "Admin API is functional",
          details: `Database: ${data.database}, Timestamp: ${data.timestamp}`
        }
      } else {
        newTests[0] = { 
          name: "Admin API Connection", 
          status: "error", 
          message: data.message || "API test failed"
        }
      }
    } catch (error) {
      newTests[0] = { 
        name: "Admin API Connection", 
        status: "error", 
        message: "Failed to connect to admin API"
      }
    }

    // Test Environment Variables
    const envVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY',
      'NEXT_PUBLIC_SITE_URL'
    ]

    const missingVars = envVars.filter(varName => !process.env[varName])

    if (missingVars.length === 0) {
      newTests[2] = { 
        name: "Environment Variables", 
        status: "success", 
        message: "All required environment variables are configured",
        details: `Checked: ${envVars.join(', ')}`
      }
    } else {
      newTests[2] = { 
        name: "Environment Variables", 
        status: "error", 
        message: `Missing environment variables: ${missingVars.join(', ')}`
      }
    }

    // Test Paystack
    if (process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      newTests[3] = { 
        name: "Paystack Integration", 
        status: "success", 
        message: "Paystack public key configured",
        details: `Key: ${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.substring(0, 20)}...`
      }
    } else {
      newTests[3] = { 
        name: "Paystack Integration", 
        status: "error", 
        message: "Paystack public key not configured"
      }
    }

    // Database test is handled by admin API test
    if (newTests[0].status === "success") {
      newTests[1] = { 
        name: "Database Connection", 
        status: "success", 
        message: "Database connection successful"
      }
    } else {
      newTests[1] = { 
        name: "Database Connection", 
        status: "error", 
        message: "Database connection failed"
      }
    }

    setTests(newTests)
    setIsRunning(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "loading":
        return <Badge variant="secondary">Testing...</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin System Test</h1>
        <p className="text-muted-foreground">
          Verify that all admin features and integrations are working correctly
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={runTests}
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            Run Tests Again
          </Button>
        </div>

        <div className="flex gap-2">
          {tests.every(t => t.status === "success") && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              All Tests Passed
            </Badge>
          )}
          {tests.some(t => t.status === "error") && (
            <Badge variant="destructive">
              Some Tests Failed
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {tests.map((test, index) => (
          <Card key={index}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                </div>
                {getStatusBadge(test.status)}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">
                {test.message}
              </CardDescription>
              {test.details && (
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {test.details}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
