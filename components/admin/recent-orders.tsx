import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const recentOrders = [
  {
    id: "#3210",
    customer: "John Doe",
    amount: "$129.99",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "#3209",
    customer: "Jane Smith",
    amount: "$89.99",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "#3208",
    customer: "Bob Johnson",
    amount: "$199.99",
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "#3207",
    customer: "Alice Brown",
    amount: "$59.99",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "#3206",
    customer: "Charlie Wilson",
    amount: "$149.99",
    status: "completed",
    date: "2024-01-13",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{order.id}</span>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
