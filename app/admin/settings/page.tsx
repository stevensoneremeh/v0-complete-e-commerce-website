"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Store, Bell, Lock, Palette, Truck, Globe } from "lucide-react"

interface StoreSettings {
  storeName: string
  storeEmail: string
  storeAddress: string
  storeCurrency: string
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  lowStockThreshold: number
  taxRate: number
  shippingCost: number
  freeShippingThreshold: number
  enableGuestCheckout: boolean
  enableProductReviews: boolean
  maintenanceMode: boolean
  siteTitle: string
  siteDescription: string
  contactPhone: string
  businessHours: string
}

const defaultSettings: StoreSettings = {
  storeName: "My E-commerce Store",
  storeEmail: "support@example.com",
  storeAddress: "123 Main St, Anytown, USA",
  storeCurrency: "USD",
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  lowStockThreshold: 10,
  taxRate: 0,
  shippingCost: 0,
  freeShippingThreshold: 100,
  enableGuestCheckout: true,
  enableProductReviews: true,
  maintenanceMode: false,
  siteTitle: "My E-commerce Store",
  siteDescription: "Welcome to our online store",
  contactPhone: "+1 (555) 000-0000",
  businessHours: "Mon-Fri: 9AM-5PM EST",
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("admin_settings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_settings", JSON.stringify(settings))
        toast({
          title: "Settings Saved",
          description: "Your store settings have been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as HTMLInputElement
    setSettings((prevSettings) => ({
      ...prevSettings,
      [id]: type === "number" ? Number(value) : value,
    }))
  }

  const handleToggle = (id: keyof StoreSettings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [id]: !prevSettings[id as keyof typeof prevSettings],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your store configuration and preferences</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={settings.storeName}
                      onChange={handleChange}
                      placeholder="Your Store Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Store Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={settings.storeEmail}
                      onChange={handleChange}
                      placeholder="contact@yourstore.com"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeCurrency">Default Currency</Label>
                    <Input
                      id="storeCurrency"
                      value={settings.storeCurrency}
                      onChange={handleChange}
                      placeholder="e.g., USD, EUR, GBP"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State, Zip, Country"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Input
                    id="businessHours"
                    value={settings.businessHours}
                    onChange={handleChange}
                    placeholder="Mon-Fri: 9AM-5PM EST"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Website Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Site Title</Label>
                  <Input
                    id="siteTitle"
                    value={settings.siteTitle}
                    onChange={handleChange}
                    placeholder="My E-commerce Store"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    placeholder="Welcome to our online store"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCost">Standard Shipping Cost ($)</Label>
                    <Input
                      id="shippingCost"
                      type="number"
                      step="0.01"
                      value={settings.shippingCost}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      step="0.01"
                      value={settings.freeShippingThreshold}
                      onChange={handleChange}
                      placeholder="100.00"
                    />
                    <p className="text-sm text-muted-foreground">Orders above this amount qualify for free shipping</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Settings */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Feature Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Guest Checkout</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to checkout without an account</p>
                  </div>
                  <Switch
                    checked={settings.enableGuestCheckout}
                    onCheckedChange={() => handleToggle("enableGuestCheckout")}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Product Reviews</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to leave product reviews</p>
                  </div>
                  <Switch
                    checked={settings.enableProductReviews}
                    onCheckedChange={() => handleToggle("enableProductReviews")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts for orders and updates</p>
                  </div>
                  <Switch
                    checked={settings.enableEmailNotifications}
                    onCheckedChange={() => handleToggle("enableEmailNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive SMS alerts for critical events</p>
                  </div>
                  <Switch
                    checked={settings.enableSmsNotifications}
                    onCheckedChange={() => handleToggle("enableSmsNotifications")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={handleChange}
                    placeholder="10"
                  />
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when product stock falls below this number
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security & Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable store access for maintenance</p>
                  </div>
                  <Switch checked={settings.maintenanceMode} onCheckedChange={() => handleToggle("maintenanceMode")} />
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    When maintenance mode is enabled, only administrators can access the store. Customers will see a
                    maintenance message.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
