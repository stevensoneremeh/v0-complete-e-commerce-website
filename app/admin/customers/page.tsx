"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getCustomers, updateCustomer, saveCustomers, type Customer } from "@/lib/local-storage"
import {
  Search,
  Eye,
  UserCheck,
  UserX,
  Users,
  DollarSign,
  ShoppingCart,
  UserPlus,
  Shield,
  Settings,
} from "lucide-react"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    role: "user" as "user" | "admin",
  })

  const { toast } = useToast()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = () => {
    const customersData = getCustomers()
    setCustomers(customersData)
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && customer.isActive) ||
      (statusFilter === "inactive" && !customer.isActive)

    const matchesRole = roleFilter === "all" || customer.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleToggleStatus = async (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return

    const updatedCustomer = updateCustomer(customerId, { isActive: !customer.isActive })
    if (updatedCustomer) {
      setCustomers(customers.map((c) => (c.id === customerId ? updatedCustomer : c)))
      toast({
        title: "Customer Updated",
        description: `Customer has been ${updatedCustomer.isActive ? "activated" : "deactivated"}`,
      })
    }
  }

  const handleToggleRole = async (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return

    const newRole = customer.role === "admin" ? "user" : "admin"
    const updatedCustomer = updateCustomer(customerId, { role: newRole })

    if (updatedCustomer) {
      setCustomers(customers.map((c) => (c.id === customerId ? updatedCustomer : c)))
      toast({
        title: "Role Updated",
        description: `Customer role changed to ${newRole}`,
      })
    }
  }

  const handleCreateCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast({
        title: "Missing Information",
        description: "Name and email are required fields.",
        variant: "destructive",
      })
      return
    }

    // Check if email already exists
    if (customers.some((c) => c.email === newCustomer.email)) {
      toast({
        title: "Email Already Exists",
        description: "A customer with this email already exists.",
        variant: "destructive",
      })
      return
    }

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      isActive: true,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    }

    const updatedCustomers = [...customers, customer]
    setCustomers(updatedCustomers)
    saveCustomers(updatedCustomers)

    toast({
      title: "Customer Created",
      description: `${customer.name} has been added successfully.`,
    })

    // Reset form
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      role: "user",
    })
    setIsCreateDialogOpen(false)
  }

  const handleUpdateCustomer = () => {
    if (!selectedCustomer) return

    const updatedCustomer = updateCustomer(selectedCustomer.id, {
      name: selectedCustomer.name,
      email: selectedCustomer.email,
      phone: selectedCustomer.phone,
      address: selectedCustomer.address,
      city: selectedCustomer.city,
      country: selectedCustomer.country,
      role: selectedCustomer.role,
    })

    if (updatedCustomer) {
      setCustomers(customers.map((c) => (c.id === selectedCustomer.id ? updatedCustomer : c)))
      toast({
        title: "Customer Updated",
        description: "Customer information has been updated successfully.",
      })
      setIsEditDialogOpen(false)
    }
  }

  const openViewDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsViewDialogOpen(true)
  }

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer({ ...customer })
    setIsEditDialogOpen(true)
  }

  // Calculate stats
  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.isActive).length
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const totalOrders = customers.reduce((sum, customer) => sum + customer.totalOrders, 0)

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
                <h1 className="text-3xl font-bold">Customers</h1>
                <p className="text-muted-foreground">Manage your customers and user accounts</p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Customer</DialogTitle>
                    <DialogDescription>Add a new customer to the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={newCustomer.role}
                          onValueChange={(value: "user" | "admin") => setNewCustomer({ ...newCustomer, role: value })}
                        >
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
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newCustomer.city}
                          onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={newCustomer.country}
                          onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCustomer}>Create Customer</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                      <p className="text-2xl font-bold">{totalCustomers}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                      <p className="text-2xl font-bold">{activeCustomers}</p>
                    </div>
                    <div className="h-3 w-3 bg-green-500 rounded-full" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{totalOrders}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={customer.role === "admin" ? "default" : "secondary"}>
                            {customer.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                            {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{customer.totalOrders}</TableCell>
                        <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={customer.isActive ? "default" : "destructive"}>
                            {customer.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString() : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => openViewDialog(customer)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(customer)}>
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleRole(customer.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(customer.id)}
                              className={
                                customer.isActive
                                  ? "text-red-600 hover:text-red-700"
                                  : "text-green-600 hover:text-green-700"
                              }
                            >
                              {customer.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Complete customer information</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedCustomer.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedCustomer.email}
                    </p>
                    {selectedCustomer.phone && (
                      <p>
                        <strong>Phone:</strong> {selectedCustomer.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Account Status</h4>
                  <div className="space-y-2">
                    <Badge variant={selectedCustomer.role === "admin" ? "default" : "secondary"}>
                      {selectedCustomer.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                      {selectedCustomer.role.charAt(0).toUpperCase() + selectedCustomer.role.slice(1)}
                    </Badge>
                    <Badge variant={selectedCustomer.isActive ? "default" : "destructive"}>
                      {selectedCustomer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Address */}
              {(selectedCustomer.address || selectedCustomer.city || selectedCustomer.country) && (
                <div>
                  <h4 className="font-semibold mb-2">Address</h4>
                  <div className="text-sm text-muted-foreground">
                    {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                    {selectedCustomer.city && <p>{selectedCustomer.city}</p>}
                    {selectedCustomer.country && <p>{selectedCustomer.country}</p>}
                  </div>
                </div>
              )}

              {/* Order Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold">
                    $
                    {selectedCustomer.totalOrders > 0
                      ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)
                      : "0.00"}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                </div>
              </div>

              {/* Account Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Member Since</h4>
                  <p className="text-sm">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Last Login</h4>
                  <p className="text-sm">
                    {selectedCustomer.lastLogin
                      ? new Date(selectedCustomer.lastLogin).toLocaleDateString()
                      : "Never logged in"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedCustomer.name}
                    onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedCustomer.email}
                    onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={selectedCustomer.phone || ""}
                    onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={selectedCustomer.role}
                    onValueChange={(value: "user" | "admin") =>
                      setSelectedCustomer({ ...selectedCustomer, role: value })
                    }
                  >
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
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={selectedCustomer.address || ""}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={selectedCustomer.city || ""}
                    onChange={(e) => setSelectedCustomer({ ...selectedCustomer, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    value={selectedCustomer.country || ""}
                    onChange={(e) => setSelectedCustomer({ ...selectedCustomer, country: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCustomer}>Update Customer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
