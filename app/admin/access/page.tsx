"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, User, Mail, Database, Shield } from "lucide-react"
import { toast } from "sonner"

interface DiagnosticResult {
  authenticated: boolean
  userId?: string
  email?: string
  profileExists: boolean
  isAdmin: boolean
  role?: string
  error?: string
  fixed?: boolean
}

export default function AdminAccessPage() {
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/verify-access", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
      if (data.fixed) {
        toast.success("Admin access has been granted!")
      }
    } catch (error) {
      console.error("Diagnostic error:", error)
      toast.error("Failed to run diagnostic")
    } finally {
      setLoading(false)
    }
  }

  const fixProfile = async () => {
    try {
      const response = await fetch("/api/admin/verify-access?fix=true", {
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        toast.success("Admin access granted! Redirecting to dashboard...")
        setTimeout(() => {
          window.location.href = "/admin"
        }, 1500)
      } else {
        const errorMessage = data.error || "Failed to update admin permissions"
        toast.error(errorMessage)
        setResult(data)
      }
    } catch (error) {
      console.error("Fix profile error:", error)
      toast.error("Error fixing profile. Please try again.")
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Access Diagnostic</CardTitle>
          <CardDescription>Check your account status and admin permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Running diagnostics...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Authentication Status
                </h3>
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                  {result?.authenticated ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">
                      {result?.authenticated ? "Logged In" : "Not Logged In"}
                    </p>
                    {result?.userId && (
                      <p className="text-sm text-muted-foreground font-mono">{result.userId.substring(0, 20)}...</p>
                    )}
                  </div>
                  <Badge variant={result?.authenticated ? "default" : "destructive"}>
                    {result?.authenticated ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {result?.email && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </h3>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <p className="font-mono text-sm">{result.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Profile Status
                </h3>
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                  {result?.profileExists ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">
                      {result?.profileExists ? "Profile Exists" : "Profile Missing"}
                    </p>
                    {result?.role && (
                      <p className="text-sm text-muted-foreground">Role: {result.role}</p>
                    )}
                  </div>
                  <Badge variant={result?.profileExists ? "default" : "destructive"}>
                    {result?.profileExists ? "Found" : "Not Found"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Permissions
                </h3>
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                  {result?.isAdmin ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">
                      {result?.isAdmin ? "Admin Access Granted" : "No Admin Access"}
                    </p>
                    {!result?.isAdmin && result?.email === "talktostevenson@gmail.com" && (
                      <p className="text-sm text-orange-600 font-medium">
                        Your email should have admin access!
                      </p>
                    )}
                  </div>
                  <Badge variant={result?.isAdmin ? "default" : "destructive"}>
                    {result?.isAdmin ? "Admin" : "User"}
                  </Badge>
                </div>
              </div>

              {result?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}

              {result?.email === "talktostevenson@gmail.com" && !result?.isAdmin && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="flex-1">
                      {result?.profileExists 
                        ? "Your profile exists but admin access is not set."
                        : "Your profile is missing."} Click to fix:
                    </span>
                    <Button onClick={fixProfile} size="sm">
                      {result?.profileExists ? "Grant Admin Access" : "Create Admin Profile"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {result?.isAdmin && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-green-700 dark:text-green-400">Admin access confirmed! You can access all admin features.</span>
                    <Button onClick={() => (window.location.href = "/admin")} size="sm">
                      Go to Dashboard
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={checkAccess} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Diagnostic Again
              </Button>

              {!result?.authenticated && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need to sign in first. Go to the{" "}
                    <a href="/auth" className="font-medium underline">
                      login page
                    </a>
                    .
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
