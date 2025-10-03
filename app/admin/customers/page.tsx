"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserManagementGuide } from "@/components/admin/user-management-guide"
import { Eye, Edit, Shield, UserPlus, Search, Filter, Download, Users } from "lucide-react"
import { toast } from "sonner"

interface Customer {
  id: string
  email: string
  full_name: string
  phone?: string
  address?: string
  city?: string
  country?: string
  is_admin: boolean
  role: string
  created_at: string
  updated_at: string
  total_orders?: number
  total_spent?: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const [newCustomer, setNewCustomer] = useState({
    email: "",
    full_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    role: "user"
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      toast.error("Failed to fetch customers")
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminRole = async (customerId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin"
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: newRole,
          is_admin: newRole === "admin"
        })
      })

      if (response.ok) {
        await fetchCustomers()
        toast.success(`User role updated to ${newRole}`)
      }
    } catch (error) {
      toast.error("Failed to update user role")
    }
  }

  const addCustomer = async () => {
    try {
      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCustomer,
          is_admin: newCustomer.role === "admin"
        })
      })

      if (response.ok) {
        await fetchCustomers()
        setShowAddDialog(false)
        setNewCustomer({
          email: "",
          full_name: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          role: "user"
        })
        toast.success("Customer added successfully")
      }
    } catch (error) {
      toast.error("Failed to add customer")
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || customer.role === filterRole
    return matchesSearch && matchesRole
  })

  const exportCustomers = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Role", "Total Orders", "Total Spent", "Created At"],
      ...filteredCustomers.map(customer => [
        customer.full_name || "",
        customer.email || "",
        customer.phone || "",
        customer.role || "",
        customer.total_orders || 0,
        customer.total_spent || 0,
        new Date(customer.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "customers.csv"
    a.click()
  }

  if (showGuide) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button onClick={() => setShowGuide(false)}>
                  ← Back to Customers
                </Button>
              </div>
              <UserManagementGuide />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Customer Management</h1>
                <p className="text-muted-foreground">Manage your customers and their accounts</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowGuide(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  User Guide
                </Button>
                <Button variant="outline" onClick={exportCustomers}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={newCustomer.full_name}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, full_name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select value={newCustomer.role} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={newCustomer.address}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={newCustomer.city}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={newCustomer.country}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, country: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addCustomer}>
                          Add Customer
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">Users</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading customers...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{customer.full_name || "N/A"}</div>
                              <div className="text-sm text-muted-foreground">{customer.phone || "No phone"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={customer.role === "admin" ? "default" : "secondary"}>
                                {customer.role}
                              </Badge>
                              {customer.is_admin && <Shield className="h-4 w-4 text-blue-600" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{customer.city || "N/A"}</div>
                              <div className="text-muted-foreground">{customer.country || "N/A"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.total_orders || 0}</TableCell>
                          <TableCell>${customer.total_spent || 0}</TableCell>
                          <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCustomer(customer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAdminRole(customer.id, customer.role)}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Customer Details Dialog */}
            <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Customer Details</DialogTitle>
                </DialogHeader>
                {selectedCustomer && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <p className="text-sm">{selectedCustomer.full_name || "N/A"}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="text-sm">{selectedCustomer.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Phone</Label>
                        <p className="text-sm">{selectedCustomer.phone || "N/A"}</p>
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Badge variant={selectedCustomer.role === "admin" ? "default" : "secondary"}>
                          {selectedCustomer.role}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <p className="text-sm">{selectedCustomer.address || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City</Label>
                        <p className="text-sm">{selectedCustomer.city || "N/A"}</p>
                      </div>
                      <div>
                        <Label>Country</Label>
                        <p className="text-sm">{selectedCustomer.country || "N/A"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Account Created</Label>
                        <p className="text-sm">{new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label>Last Updated</Label>
                        <p className="text-sm">{new Date(selectedCustomer.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
}
