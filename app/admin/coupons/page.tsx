"use client"

import type React from "react"
import { useToast } from "@/hooks/use-toast"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash, Copy } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Tag, Percent, Calendar, Users } from "lucide-react"

interface Coupon {
  id: string
  code: string
  description: string
  type: "percentage" | "fixed"
  value: number
  min_order_amount?: number
  max_discount?: number
  usage_limit?: number
  usage_count: number
  expires_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      const response = await fetch("/api/admin/coupons")
      if (response.ok) {
        const data = await response.json()
        setCoupons(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch coupons",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    const now = new Date()
    const expiresAtDate = coupon.expires_at ? new Date(coupon.expires_at) : null
    const isExpired = expiresAtDate && expiresAtDate < now
    const isUsageLimitReached = coupon.usage_limit && coupon.usage_count >= coupon.usage_limit

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && coupon.is_active && !isExpired && !isUsageLimitReached) ||
      (statusFilter === "inactive" && !coupon.is_active) ||
      (statusFilter === "expired" && isExpired) ||
      (statusFilter === "usage-limit-reached" && isUsageLimitReached)

    return matchesSearch && matchesStatus
  })

  const handleAddEditCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const code = (formData.get("code") as string).toUpperCase()
    const description = formData.get("description") as string
    const type = formData.get("type") as "percentage" | "fixed"
    const value = Number.parseFloat(formData.get("value") as string)
    const min_order_amount = formData.get("minOrderAmount")
      ? Number.parseFloat(formData.get("minOrderAmount") as string)
      : undefined
    const max_discount = formData.get("maxDiscount")
      ? Number.parseFloat(formData.get("maxDiscount") as string)
      : undefined
    const usage_limit = formData.get("usageLimit") ? Number.parseInt(formData.get("usageLimit") as string) : undefined
    const expiresAt = (formData.get("expiresAt") as string) || undefined
    const is_active = formData.get("isActive") === "on"

    const couponData = {
      code,
      description,
      type,
      value,
      min_order_amount,
      max_discount,
      usage_limit,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      is_active,
    }

    try {
      const url = currentCoupon ? `/api/admin/coupons/${currentCoupon.id}` : "/api/admin/coupons"
      const method = currentCoupon ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponData),
      })

      if (response.ok) {
        await loadCoupons()
        setIsAddEditModalOpen(false)
        setCurrentCoupon(null)
        toast({
          title: currentCoupon ? "Coupon Updated" : "Coupon Added",
          description: `Coupon "${code}" has been ${currentCoupon ? "updated" : "added"}.`,
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save coupon",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save coupon",
        variant: "destructive",
      })
    }
  }

  const openAddModal = () => {
    setCurrentCoupon(null)
    setIsAddEditModalOpen(true)
  }

  const openEditModal = (coupon: Coupon) => {
    setCurrentCoupon(coupon)
    setIsAddEditModalOpen(true)
  }

  const openDeleteConfirmModal = (id: string) => {
    setCouponToDelete(id)
    setIsDeleteConfirmModalOpen(true)
  }

  const handleDeleteCoupon = async () => {
    if (couponToDelete !== null) {
      try {
        const response = await fetch(`/api/admin/coupons/${couponToDelete}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await loadCoupons()
          setIsDeleteConfirmModalOpen(false)
          setCouponToDelete(null)
          toast({
            title: "Coupon Deleted",
            description: "The coupon has been successfully deleted.",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to delete coupon",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete coupon",
          variant: "destructive",
        })
      }
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied!",
      description: `Coupon code "${code}" copied to clipboard.`,
    })
  }

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date()
    const expiresAtDate = coupon.expires_at ? new Date(coupon.expires_at) : null
    const isExpired = expiresAtDate && expiresAtDate < now
    const isUsageLimitReached = coupon.usage_limit && coupon.usage_count >= coupon.usage_limit

    if (!coupon.is_active) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>
    }
    if (isUsageLimitReached) {
      return <Badge variant="destructive">Usage Limit Reached</Badge>
    }
    return <Badge variant="default">Active</Badge>
  }

  const stats = {
    total: coupons.length,
    active: coupons.filter(
      (c) =>
        c.is_active &&
        (!c.expires_at || new Date(c.expires_at) > new Date()) &&
        (!c.usage_limit || c.usage_count < c.usage_limit),
    ).length,
    expired: coupons.filter((c) => c.expires_at && new Date(c.expires_at) < new Date()).length,
    totalUsage: coupons.reduce((sum, c) => sum + c.usage_count, 0),
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
            <div>Loading...</div>
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
                <h1 className="text-3xl font-bold">Coupons</h1>
                <p className="text-muted-foreground">Manage discount coupons and promotional codes</p>
              </div>
              <Button onClick={openAddModal}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Coupon
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <Percent className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expired</CardTitle>
                  <Calendar className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsage}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search coupons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="usage-limit-reached">Usage Limit Reached</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Coupons Table */}
            <Card>
              <CardHeader>
                <CardTitle>Coupons ({filteredCoupons.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCoupons.map((coupon) => {
                    const expiresAtDate = coupon.expires_at ? new Date(coupon.expires_at) : null
                    const isExpired = expiresAtDate && expiresAtDate < new Date()
                    const isUsageLimitReached = coupon.usage_limit && coupon.usage_count >= coupon.usage_limit

                    return (
                      <div key={coupon.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-mono">
                                {coupon.code}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCopyCode(coupon.code)}
                              >
                                <Copy className="h-3 w-3" />
                                <span className="sr-only">Copy code</span>
                              </Button>
                            </div>
                            {getStatusBadge(coupon)}
                            <Badge variant="outline">
                              {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{coupon.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              Expires: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : "Never"}
                            </span>
                            {coupon.min_order_amount !== undefined && (
                              <span>Min: ${coupon.min_order_amount.toFixed(2)}</span>
                            )}
                            {coupon.max_discount !== undefined && <span>Max: ${coupon.max_discount.toFixed(2)}</span>}
                            {coupon.usage_limit !== undefined && (
                              <span>
                                Used: {coupon.usage_count} / {coupon.usage_limit} (
                                {((coupon.usage_count / coupon.usage_limit) * 100).toFixed(0)}%)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditModal(coupon)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openDeleteConfirmModal(coupon.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                  {filteredCoupons.length === 0 && (
                    <div className="text-center py-8">
                      <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No coupons found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Add/Edit Coupon Modal */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentCoupon ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEditCoupon} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                name="code"
                defaultValue={currentCoupon?.code || ""}
                className="col-span-3"
                required
                maxLength={20}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={currentCoupon?.description || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select name="type" defaultValue={currentCoupon?.type || "percentage"} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select coupon type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Discount</SelectItem>
                  <SelectItem value="fixed">Fixed Amount Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                name="value"
                type="number"
                step="0.01"
                defaultValue={currentCoupon?.value || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minOrderAmount" className="text-right">
                Min Order Amount
              </Label>
              <Input
                id="minOrderAmount"
                name="minOrderAmount"
                type="number"
                step="0.01"
                defaultValue={currentCoupon?.min_order_amount || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxDiscount" className="text-right">
                Max Discount (for % type)
              </Label>
              <Input
                id="maxDiscount"
                name="maxDiscount"
                type="number"
                step="0.01"
                defaultValue={currentCoupon?.max_discount || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usageLimit" className="text-right">
                Usage Limit
              </Label>
              <Input
                id="usageLimit"
                name="usageLimit"
                type="number"
                step="1"
                defaultValue={currentCoupon?.usage_limit || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiresAt" className="text-right">
                Expires At
              </Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="date"
                defaultValue={
                  currentCoupon?.expires_at ? new Date(currentCoupon.expires_at).toISOString().split("T")[0] : ""
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <Checkbox
                id="isActive"
                name="isActive"
                defaultChecked={currentCoupon?.is_active ?? true}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit">{currentCoupon ? "Save Changes" : "Add Coupon"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to delete this coupon? This action cannot be undone.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoupon}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
