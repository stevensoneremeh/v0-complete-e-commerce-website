"use client"

import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface TestResult {
  test: string
  status: 'PASSED' | 'FAILED' | 'PENDING'
  count?: number
  error?: string
  data?: any
}

interface TestSummary {
  total_tests: number
  passed: number
  failed: number
  timestamp: string
  production_ready: boolean
}

export default function AdminTestPage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [summary, setSummary] = useState<TestSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-production')
      const data = await response.json()

      setTests(data.tests || [])
      setSummary(data.summary)
    } catch (error) {
      console.error('Failed to run tests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASSED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variant = status === 'PASSED' ? 'default' : status === 'FAILED' ? 'destructive' : 'secondary'
    return <Badge variant={variant}>{status}</Badge>
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Production Tests</h1>
              <p className="text-muted-foreground mt-2">
                Verify all systems are working correctly and ready for production deployment.
              </p>
            </div>

            {summary && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Test Summary
                    {summary.production_ready ? (
                      <Badge variant="default" className="bg-green-600">Production Ready</Badge>
                    ) : (
                      <Badge variant="destructive">Not Ready</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tests</p>
                      <p className="text-2xl font-bold">{summary.total_tests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Passed</p>
                      <p className="text-2xl font-bold text-green-600">{summary.passed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{summary.failed}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Last run: {new Date(summary.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Test Results</h2>
              <Button onClick={runTests} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Run Tests
              </Button>
            </div>

            <div className="grid gap-4">
              {tests.map((test, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <h3 className="font-medium">{test.test}</h3>
                          {test.count !== undefined && (
                            <p className="text-sm text-muted-foreground">
                              Records found: {test.count}
                            </p>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(test.status)}
                    </div>
                    {test.error && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-400">{test.error}</p>
                      </div>
                    )}
                    {test.data && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <pre className="text-sm overflow-x-auto">
                          {JSON.stringify(test.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
