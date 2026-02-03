"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { Eye, EyeOff, ArrowLeft, Home } from "lucide-react"

export default function AuthPage() {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [signupError, setSignupError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState("")
  const { login, signup, isLoading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [user, router])

  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "callback_error") {
      setLoginError("Authentication failed. Please try again.")
    } else if (error === "unexpected_error") {
      setLoginError("An unexpected error occurred. Please try again.")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    try {
      await login(loginEmail, loginPassword)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid email or password"
      setLoginError(errorMessage)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError("")
    setSignupSuccess("")

    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords do not match")
      return
    }

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters")
      return
    }

    try {
      await signup(signupName, signupEmail, signupPassword)
      setSignupSuccess("Account created successfully! Please check your email to verify your account.")
      // Clear form
      setSignupName("")
      setSignupEmail("")
      setSignupPassword("")
      setConfirmPassword("")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create account"
      setSignupError(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="responsive-container flex items-center justify-between h-16 sm:h-18">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
              <Image
                src="/abl-natasha-logo.png"
                alt="ABL Natasha Enterprises"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col gap-0">
              <span className="font-bold text-xs sm:text-sm leading-tight">ABL</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold">NATASHA</span>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="h-9 px-2 text-xs sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="hidden sm:block h-5 w-px bg-border" />
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-xs sm:text-sm hidden sm:flex"
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12 sm:py-16">
        <Card className="w-full max-w-md luxury-card-premium border-border/50">
          <CardHeader className="text-center space-y-4 pt-6 sm:pt-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                <Image
                  src="/abl-natasha-logo.png"
                  alt="ABL Natasha Enterprises"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <h1 className="font-bold text-base sm:text-lg leading-tight">ABL Natasha</h1>
                <p className="text-xs text-muted-foreground font-semibold">Premium Portal</p>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-2 text-muted-foreground">
                Sign in or create an account to continue
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pb-6 sm:pb-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/40 p-1 rounded-lg h-10">
                <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm rounded-md">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm rounded-md">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive" className="border-destructive/30 bg-destructive/5 rounded-lg">
                      <AlertDescription className="text-xs sm:text-sm">{loginError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-xs sm:text-sm font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-10 sm:h-11 bg-secondary/30 border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-lg text-sm"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-xs sm:text-sm font-semibold">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-10 sm:h-11 bg-secondary/30 border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 pr-10 rounded-lg text-sm"
                        autoComplete="current-password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-secondary/50"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <Link href="/auth/forgot-password" className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full h-10 sm:h-11 luxury-button text-sm sm:text-base font-semibold" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  {signupError && (
                    <Alert variant="destructive" className="border-destructive/30 bg-destructive/5 rounded-lg">
                      <AlertDescription className="text-xs sm:text-sm">{signupError}</AlertDescription>
                    </Alert>
                  )}

                  {signupSuccess && (
                    <Alert className="border-accent/30 bg-accent/5 text-accent rounded-lg">
                      <AlertDescription className="text-xs sm:text-sm">{signupSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-xs sm:text-sm font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="h-10 sm:h-11 bg-secondary/30 border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-lg text-sm"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-xs sm:text-sm font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="h-10 sm:h-11 bg-secondary/30 border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-lg text-sm"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-xs sm:text-sm font-semibold">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="h-10 sm:h-11 bg-secondary/30 border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 pr-10 rounded-lg text-sm"
                        autoComplete="new-password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-secondary/50"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                      >
                        {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-xs sm:text-sm font-semibold">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-10 sm:h-11 bg-secondary/30 border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 pr-10 rounded-lg text-sm"
                        autoComplete="new-password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-secondary/50"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-10 sm:h-11 luxury-button text-sm sm:text-base font-semibold mt-2" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
