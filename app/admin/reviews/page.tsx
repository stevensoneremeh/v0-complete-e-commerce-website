"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Check, X, Filter } from "lucide-react"
import { toast } from "sonner"

interface Review {
  id: string
  product_id: string
  customer_id: string
  rating: number
  title: string
  comment: string
  is_approved: boolean
  is_verified: boolean
  created_at: string
  products?: { name: string }
  profiles?: { full_name: string; email: string }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRating, setFilterRating] = useState("all")

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/admin/reviews")
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      toast.error("Failed to fetch reviews")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: approved }),
      })

      if (response.ok) {
        await fetchReviews()
        toast.success(`Review ${approved ? "approved" : "rejected"}`)
      }
    } catch (error) {
      toast.error("Failed to update review")
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        const response = await fetch(`/api/admin/reviews/${reviewId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchReviews()
          toast.success("Review deleted successfully")
        }
      } catch (error) {
        toast.error("Failed to delete review")
      }
    }
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "approved" && review.is_approved) ||
      (filterStatus === "pending" && !review.is_approved)
    const matchesRating = filterRating === "all" || review.rating === Number.parseInt(filterRating)
    return matchesStatus && matchesRating
  })

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Review Management</h1>
                <p className="text-muted-foreground">Manage product reviews and ratings</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reviews</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reviews ({filteredReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading reviews...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Review</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="font-medium">{review.products?.name || "Unknown Product"}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{review.profiles?.full_name || "Anonymous"}</div>
                              <div className="text-sm text-muted-foreground">{review.profiles?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{renderStars(review.rating)}</TableCell>
                          <TableCell>
                            <div className="max-w-md">
                              <div className="font-medium">{review.title}</div>
                              <div className="text-sm text-muted-foreground truncate">{review.comment}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant={review.is_approved ? "default" : "secondary"}>
                                {review.is_approved ? "Approved" : "Pending"}
                              </Badge>
                              {review.is_verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {!review.is_approved && (
                                <Button variant="outline" size="sm" onClick={() => handleApprove(review.id, true)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              {review.is_approved && (
                                <Button variant="outline" size="sm" onClick={() => handleApprove(review.id, false)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="outline" size="sm" onClick={() => handleDelete(review.id)}>
                                <X className="h-4 w-4 text-destructive" />
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
          </div>
        </main>
      </div>
    </div>
  )
}
