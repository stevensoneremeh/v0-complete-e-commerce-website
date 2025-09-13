"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Shield, Users, UserPlus, Settings, Eye, UserCheck, UserX, Database, Key, AlertTriangle } from "lucide-react"

export function UserManagementGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management Guide</h1>
        <p className="text-muted-foreground">
          Complete guide to managing users and admin access in ABL Natasha Enterprises
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="h-5 w-5" />
              Create Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Add new customers or admin users to the system</p>
            <Badge variant="outline">/admin/customers → Add Customer</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Manage Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Toggle between user and admin roles</p>
            <Badge variant="outline">Shield icon in actions</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5" />
              Database Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Direct database role management</p>
            <Badge variant="outline">Supabase profiles table</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Making Users Admin */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            How to Make a User Admin
          </CardTitle>
          <CardDescription>Multiple methods to grant admin privileges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Method 1: Admin Dashboard (Recommended)
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm ml-6">
              <li>
                Go to{" "}
                <Badge variant="outline" className="mx-1">
                  /admin/customers
                </Badge>
              </li>
              <li>Find the user you want to make admin</li>
              <li>
                Click the <Shield className="h-3 w-3 inline mx-1" /> (Shield) icon in the Actions column
              </li>
              <li>The user's role will toggle between "User" and "Admin"</li>
              <li>Admin users get a shield icon next to their role badge</li>
            </ol>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Method 2: Direct Database Update
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm ml-6">
              <li>Access your Supabase dashboard</li>
              <li>
                Navigate to Table Editor → <code className="bg-muted px-1 rounded">profiles</code> table
              </li>
              <li>Find the user by email</li>
              <li>
                Set <code className="bg-muted px-1 rounded">is_admin = true</code>
              </li>
              <li>
                Set <code className="bg-muted px-1 rounded">role = 'admin'</code>
              </li>
              <li>Save changes</li>
            </ol>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Method 3: SQL Query
            </h4>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm">
                UPDATE profiles <br />
                SET is_admin = true, role = 'admin' <br />
                WHERE email = 'user@example.com';
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Available User Management Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">User Actions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>View detailed user information</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Edit user profile and details</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Toggle admin/user role</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <span>Activate user account</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-red-600" />
                  <span>Deactivate user account</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">User Information</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Personal details (name, email, phone)</p>
                <p>• Address information</p>
                <p>• Account status and role</p>
                <p>• Order history and statistics</p>
                <p>• Total spent and average order value</p>
                <p>• Account creation and last login dates</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Dashboard Access */}
      <Card>
        <CardHeader>
          <CardTitle>Accessing the Admin Dashboard</CardTitle>
          <CardDescription>How admin users can access the management interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Step 1: User Authentication</h4>
            <p className="text-sm text-muted-foreground">
              Users must first create an account or sign in at <Badge variant="outline">/auth</Badge>
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Step 2: Admin Privileges</h4>
            <p className="text-sm text-muted-foreground">
              Ensure the user has admin privileges using one of the methods above
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Step 3: Access Dashboard</h4>
            <p className="text-sm text-muted-foreground">
              Navigate to <Badge variant="outline">/admin</Badge> to access the full admin interface
            </p>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> Admin access is protected by middleware. Users without admin privileges
              will be redirected to the login page when trying to access admin routes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Database Schema */}
      <Card>
        <CardHeader>
          <CardTitle>Database Schema Reference</CardTitle>
          <CardDescription>Understanding the user data structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-semibold mb-2">profiles table</h4>
            <div className="grid gap-2 text-sm font-mono">
              <div>id: uuid (Primary Key)</div>
              <div>email: text</div>
              <div>full_name: text</div>
              <div>phone: text</div>
              <div>address: text</div>
              <div>city: text</div>
              <div>country: text</div>
              <div className="text-blue-600">is_admin: boolean</div>
              <div className="text-blue-600">role: text ('user' | 'admin')</div>
              <div>created_at: timestamp</div>
              <div>updated_at: timestamp</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
