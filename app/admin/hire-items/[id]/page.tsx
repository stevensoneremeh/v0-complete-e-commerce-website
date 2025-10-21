"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"

interface HireItem {
  id: string
  name: string
  description: string
  category: string
  price_per_day: number
  price_per_week: number
  price_per_month: number
  availability: boolean
  images: string[]
  created_at: string
}

export default function HireItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hireItemId = params.id as string

  const [hireItem, setHireItem] = useState<HireItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHireItem()
  }, [hireItemId])

  const fetchHireItem = async () => {
    try {
      const response = await fetch(`/api/admin/hire-services/${hireItemId}`)
      if (response.ok) {
        const data = await response.json()
        setHireItem(data.hire_item || data)
      } else {
        toast.error("Hire item not found")
        router.push("/admin/hire-items")
      }
    } catch (error) {
      toast.error("Failed to fetch hire item")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this hire item?")) {
      try {
        const response = await fetch(`/api/admin/hire-services/${hireItemId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success("Hire item deleted successfully")
          router.push("/admin/hire-items")
        }
      } catch (error) {
        toast.error("Failed to delete hire item")
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading hire item...</div>
  }

  if (!hireItem) {
    return <div className="text-center py-12">Hire item not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/hire-items")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{hireItem.name}</h1>
            <p className="text-muted-foreground">{hireItem.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open(`/hire/${hireItem.id}`, "_blank")}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" onClick={() => router.push(`/admin/hire-items/${hireItem.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="flex gap-2">
        <Badge variant={hireItem.availability ? "default" : "destructive"}>
          {hireItem.availability ? "Available" : "Unavailable"}
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hire Item Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-base">{hireItem.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Category</p>
                <p className="text-base">{hireItem.category}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {hireItem.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Hire item ${index + 1}`}
                    className="w-full h-48 object-cover rounded border"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Per Day</p>
                  <p className="text-2xl font-bold">${hireItem.price_per_day.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Per Week</p>
                  <p className="text-2xl font-bold">${hireItem.price_per_week.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Per Month</p>
                  <p className="text-2xl font-bold">${hireItem.price_per_month.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
