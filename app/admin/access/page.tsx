import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Package, BarChart3 } from "lucide-react"

export default function AdminAccessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Access Guide</h1>
        <p className="text-muted-foreground">
          Complete guide to accessing and using the ABL Natasha Enterprises admin panel
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Access
            </CardTitle>
            <CardDescription>How to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">URL Access:</h4>
              <Badge variant="outline" className="font-mono">
                /admin
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Admin account with is_admin = true in profiles table</li>
                <li>Valid authentication session</li>
                <li>Proper environment variables configured</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Management
            </CardTitle>
            <CardDescription>Manage products, categories, and inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Products</span>
              <Badge>/admin/products</Badge>
            </div>
            <div className="flex justify-between">
              <span>Categories</span>
              <Badge>/admin/categories</Badge>
            </div>
            <div className="flex justify-between">
              <span>Properties</span>
              <Badge>/admin/properties</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Management
            </CardTitle>
            <CardDescription>Manage customers and orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Customers</span>
              <Badge>/admin/customers</Badge>
            </div>
            <div className="flex justify-between">
              <span>Orders</span>
              <Badge>/admin/orders</Badge>
            </div>
            <div className="flex justify-between">
              <span>Reviews</span>
              <Badge>/admin/reviews</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics & Reports
            </CardTitle>
            <CardDescription>View analytics and generate reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Analytics</span>
              <Badge>/admin/analytics</Badge>
            </div>
            <div className="flex justify-between">
              <span>Reports</span>
              <Badge>/admin/reports</Badge>
            </div>
            <div className="flex justify-between">
              <span>Coupons</span>
              <Badge>/admin/coupons</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Required</CardTitle>
          <CardDescription>Ensure these environment variables are configured in your Vercel project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 font-mono text-sm">
            <div>NEXT_PUBLIC_SUPABASE_URL</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
            <div>SUPABASE_SERVICE_ROLE_KEY</div>
            <div>NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY</div>
            <div>PAYSTACK_SECRET_KEY</div>
            <div>BLOB_READ_WRITE_TOKEN</div>
            <div>NEXT_PUBLIC_SITE_URL</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
