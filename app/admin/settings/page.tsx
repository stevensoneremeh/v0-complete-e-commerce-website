"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Store, Bell } from "lucide-react"

interface StoreSettings {
  storeName: string
  storeEmail: string
  storeAddress: string
  storeCurrency: string
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  lowStockThreshold: number
}

const defaultSettings: StoreSettings = {
  storeName: "My E-commerce Store",
  storeEmail: "support@example.com",
  storeAddress: "123 Main St, Anytown, USA",
  storeCurrency: "USD",
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  lowStockThreshold: 10,
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("admin_settings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }
  }, [])

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_settings", JSON.stringify(settings))
      toast({
        title: "Settings Saved",
        description: "Your store settings have been updated.",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setSettings((prevSettings) => ({
      ...prevSettings,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleNumberChange = (id: keyof StoreSettings, value: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [id]: Number(value),
    }))
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
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your store's general and notification settings</p>
              </div>
              <Button type="submit" form="settings-form">
                Save Settings
              </Button>
            </div>

            <form id="settings-form" onSubmit={handleSaveSettings} className="space-y-6">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" /> General Store Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
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
                    <Label htmlFor="storeCurrency">Default Currency</Label>
                    <Input
                      id="storeCurrency"
                      value={settings.storeCurrency}
                      onChange={handleChange}
                      placeholder="e.g., USD, EUR, GBP"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" /> Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                    <Switch
                      id="enableEmailNotifications"
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, enableEmailNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableSmsNotifications">Enable SMS Notifications</Label>
                    <Switch
                      id="enableSmsNotifications"
                      checked={settings.enableSmsNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, enableSmsNotifications: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => handleNumberChange("lowStockThreshold", e.target.value)}
                      placeholder="e.g., 10"
                    />
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when product stock falls below this number.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
