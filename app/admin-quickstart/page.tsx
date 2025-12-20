'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react'

export default function AdminQuickStart() {
  const router = useRouter()
  const [email, setEmail] = useState('talktostevenson@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
      }
    }
    checkAuth()
  }, [supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      // Wait a moment for auth to settle
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAccessAdmin = () => {
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4">
            <Shield className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Access your ABL Natasha Enterprises administration panel
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 shadow-lg border-0">
          {isLoggedIn ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  You're Logged In!
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  You have admin access. Click below to go to your dashboard.
                </p>
              </div>

              <Button
                onClick={handleAccessAdmin}
                className="w-full h-12 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                Access Admin Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="talktostevenson@gmail.com"
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full h-11 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-lg"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                You'll be redirected to the admin dashboard after login.
              </p>
            </>
          )}
        </Card>

        {/* Instructions Card */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Instructions:</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 min-w-6">1</span>
              <span>
                {isLoggedIn ? (
                  <>Click "Access Admin Dashboard" above</>
                ) : (
                  <>
                    Enter your email (<code className="bg-white px-2 py-1 rounded text-xs">
                      talktostevenson@gmail.com
                    </code>)
                  </>
                )}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 min-w-6">2</span>
              <span>
                {isLoggedIn ? (
                  <>You'll be taken to the admin dashboard instantly</>
                ) : (
                  <>Enter your password and click "Sign In"</>
                )}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 min-w-6">3</span>
              <span>
                {isLoggedIn ? (
                  <>Manage your products, categories, orders, and more</>
                ) : (
                  <>You'll automatically access the admin dashboard</>
                )}
              </span>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  )
}
