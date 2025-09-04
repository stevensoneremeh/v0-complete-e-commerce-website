"use client"

// Local Storage utility functions for admin data management
export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  images: string[]
  inStock: boolean
  stockQuantity: number
  badge?: string
  features: string[]
  specifications: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description: string
  image: string
  productCount: number
  isActive: boolean
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  role: "user" | "admin"
  isActive: boolean
  totalOrders: number
  totalSpent: number
  createdAt: string
  lastLogin?: string
}

export interface AdminOrder {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  tracking?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  createdAt: string
}

export interface Coupon {
  id: string
  code: string
  description: string
  type: "percentage" | "fixed"
  value: number
  minOrderAmount?: number // Optional
  maxDiscount?: number // Optional
  usageLimit?: number // Optional
  usageCount: number // Renamed from usedCount for consistency
  expiresAt?: string // ISO date string, renamed from expiryDate for consistency
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Analytics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueGrowth: number
  orderGrowth: number
  customerGrowth: number
  productGrowth: number
  topProducts: Array<{
    id: number
    name: string
    sales: number
    revenue: number
  }>
  salesData: Array<{
    date: string
    revenue: number
    orders: number
  }>
  categoryStats: Array<{
    category: string
    sales: number
    revenue: number
  }>
}

// Initialize default data
const initializeDefaultData = () => {
  // Default products
  const defaultProducts: Product[] = [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      description: "Premium wireless headphones with noise cancellation",
      price: 99.99,
      originalPrice: 129.99,
      category: "Electronics",
      brand: "Sony",
      images: ["/placeholder.svg?height=300&width=300&text=Headphones"],
      inStock: true,
      stockQuantity: 50,
      badge: "Best Seller",
      features: ["Noise Cancellation", "30-hour battery", "Bluetooth 5.0"],
      specifications: { "Battery Life": "30 hours", Connectivity: "Bluetooth 5.0" },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      description: "Advanced fitness tracking with heart rate monitor",
      price: 199.99,
      originalPrice: 249.99,
      category: "Electronics",
      brand: "Apple",
      images: ["/placeholder.svg?height=300&width=300&text=Smart+Watch"],
      inStock: true,
      stockQuantity: 30,
      badge: "New",
      features: ["Heart Rate Monitor", "GPS", "Water Resistant"],
      specifications: { Display: "1.4 inch AMOLED", Battery: "7 days" },
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    },
    {
      id: 3,
      name: "Premium Lace Front Wig",
      description: "High-quality human hair lace front wig with natural hairline",
      price: 299.99,
      originalPrice: 399.99,
      category: "Wigs",
      brand: "LuxeHair",
      images: ["/placeholder.svg?height=300&width=300&text=Lace+Front+Wig"],
      inStock: true,
      stockQuantity: 25,
      badge: "Best Seller",
      features: ["100% Human Hair", "Lace Front", "Natural Hairline", "Heat Resistant"],
      specifications: { "Hair Type": "Human Hair", Length: "16 inches", Color: "Natural Black" },
      createdAt: "2024-01-03T00:00:00Z",
      updatedAt: "2024-01-03T00:00:00Z",
    },
    {
      id: 4,
      name: "Luxury Designer Perfume",
      description: "Exquisite fragrance with notes of jasmine, vanilla, and sandalwood",
      price: 149.99,
      originalPrice: 199.99,
      category: "Perfumes",
      brand: "Chanel",
      images: ["/placeholder.svg?height=300&width=300&text=Designer+Perfume"],
      inStock: true,
      stockQuantity: 40,
      badge: "New",
      features: ["Long-lasting", "Premium Ingredients", "Elegant Bottle", "Gift Box Included"],
      specifications: { Volume: "100ml", "Fragrance Family": "Floral Oriental", "Top Notes": "Jasmine" },
      createdAt: "2024-01-04T00:00:00Z",
      updatedAt: "2024-01-04T00:00:00Z",
    },
    {
      id: 5,
      name: "2024 BMW X5 SUV",
      description: "Luxury SUV with advanced safety features and premium interior",
      price: 65999.99,
      category: "Cars",
      brand: "BMW",
      images: ["/placeholder.svg?height=300&width=300&text=BMW+X5"],
      inStock: true,
      stockQuantity: 5,
      badge: "Premium",
      features: ["All-Wheel Drive", "Leather Interior", "Navigation System", "Backup Camera"],
      specifications: { Engine: "3.0L Turbo", Transmission: "Automatic", "Fuel Type": "Gasoline", Year: "2024" },
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-05T00:00:00Z",
    },
    {
      id: 6,
      name: "Designer Leather Handbag",
      description: "Elegant leather handbag perfect for any occasion",
      price: 399.99,
      originalPrice: 499.99,
      category: "Bags",
      brand: "Louis Vuitton",
      images: ["/placeholder.svg?height=300&width=300&text=Designer+Handbag"],
      inStock: true,
      stockQuantity: 15,
      badge: "Limited Edition",
      features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap", "Dust Bag Included"],
      specifications: { Material: "Genuine Leather", Dimensions: "12x8x4 inches", Color: "Black" },
      createdAt: "2024-01-06T00:00:00Z",
      updatedAt: "2024-01-06T00:00:00Z",
    },
  ]

  const defaultCategories: Category[] = [
    {
      id: 1,
      name: "Electronics",
      description: "Latest gadgets and electronic devices",
      image: "/placeholder.svg?height=200&width=200&text=Electronics",
      productCount: 2, // Updated to reflect default products
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "Fashion",
      description: "Trendy clothing and accessories",
      image: "/placeholder.svg?height=200&width=200&text=Fashion",
      productCount: 0,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 3,
      name: "Wigs",
      description: "Premium quality wigs and hair pieces",
      image: "/placeholder.svg?height=200&width=200&text=Wigs",
      productCount: 1,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 4,
      name: "Perfumes",
      description: "Luxury fragrances and perfumes",
      image: "/placeholder.svg?height=200&width=200&text=Perfumes",
      productCount: 1,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 5,
      name: "Cars",
      description: "Premium vehicles and automotive",
      image: "/placeholder.svg?height=200&width=200&text=Cars",
      productCount: 1,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 6,
      name: "Bags",
      description: "Designer bags and accessories",
      image: "/placeholder.svg?height=200&width=200&text=Bags",
      productCount: 1,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
  ]

  // Default customers
  const defaultCustomers: Customer[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      address: "123 Main St",
      city: "New York",
      country: "USA",
      role: "user",
      isActive: true,
      totalOrders: 5,
      totalSpent: 599.95,
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: "2024-01-15T00:00:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      isActive: true,
      totalOrders: 3,
      totalSpent: 299.97,
      createdAt: "2024-01-02T00:00:00Z",
      lastLogin: "2024-01-14T00:00:00Z",
    },
  ]

  // Default orders
  const defaultOrders: AdminOrder[] = [
    {
      id: "#3210",
      customerId: "1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      status: "delivered",
      items: [
        {
          id: 1,
          name: "Wireless Headphones Pro",
          price: 99.99,
          quantity: 1,
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
      total: 99.99,
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      tracking: "1Z999AA1234567890",
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ]

  // Default notifications
  const defaultNotifications: Notification[] = [
    {
      id: "1",
      title: "New Order Received",
      message: "Order #3211 has been placed by Jane Smith",
      type: "info",
      isRead: false,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Low Stock Alert",
      message: "Wireless Headphones Pro is running low on stock (5 remaining)",
      type: "warning",
      isRead: false,
      createdAt: "2024-01-14T14:30:00Z",
    },
  ]

  // Default coupons
  const defaultCoupons: Coupon[] = [
    {
      id: "coupon_1",
      code: "WELCOME10",
      description: "10% off your first order",
      type: "percentage",
      value: 10,
      minOrderAmount: 20,
      maxDiscount: 10,
      usageLimit: 100,
      usageCount: 5,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Expires in 7 days
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "coupon_2",
      code: "SAVE20",
      description: "Save $20 on orders over $100",
      type: "fixed",
      value: 20,
      minOrderAmount: 100,
      usageLimit: 50,
      usageCount: 10,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Expires in 30 days
      isActive: true,
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-05T00:00:00Z",
    },
    {
      id: "coupon_3",
      code: "FREESHIP",
      description: "Free shipping on all orders",
      type: "fixed",
      value: 0, // Value can be 0 for free shipping, or a specific amount if it's a shipping discount
      minOrderAmount: 0,
      usageLimit: undefined, // No limit
      usageCount: 20,
      expiresAt: undefined, // Never expires
      isActive: true,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "coupon_4",
      code: "EXPIRED15",
      description: "Expired 15% off coupon",
      type: "percentage",
      value: 15,
      minOrderAmount: 50,
      usageLimit: 10,
      usageCount: 10, // Usage limit reached
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Expired yesterday
      isActive: true,
      createdAt: "2023-12-01T00:00:00Z",
      updatedAt: "2023-12-01T00:00:00Z",
    },
  ]

  // Set default data if not exists
  if (!localStorage.getItem("admin_products")) {
    localStorage.setItem("admin_products", JSON.stringify(defaultProducts))
  }
  if (!localStorage.getItem("admin_categories")) {
    localStorage.setItem("admin_categories", JSON.stringify(defaultCategories))
  }
  if (!localStorage.getItem("admin_customers")) {
    localStorage.setItem("admin_customers", JSON.stringify(defaultCustomers))
  }
  if (!localStorage.getItem("admin_orders")) {
    localStorage.setItem("admin_orders", JSON.stringify(defaultOrders))
  }
  if (!localStorage.getItem("admin_notifications")) {
    localStorage.setItem("admin_notifications", JSON.stringify(defaultNotifications))
  }
  if (!localStorage.getItem("admin_coupons")) {
    localStorage.setItem("admin_coupons", JSON.stringify(defaultCoupons))
  }
}

// Products
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []
  initializeDefaultData()
  const products = localStorage.getItem("admin_products")
  return products ? JSON.parse(products) : []
}

export const saveProducts = (products: Product[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("admin_products", JSON.stringify(products))
}

export const addProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

export const updateProduct = (id: number, updates: Partial<Product>) => {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() }
    saveProducts(products)
    return products[index]
  }
  return null
}

export const deleteProduct = (id: number) => {
  const products = getProducts()
  const filtered = products.filter((p) => p.id !== id)
  saveProducts(filtered)
  return filtered.length < products.length
}

// Categories
export const getCategories = (): Category[] => {
  if (typeof window === "undefined") return []
  initializeDefaultData()
  const categories = localStorage.getItem("admin_categories")
  return categories ? JSON.parse(categories) : []
}

export const saveCategories = (categories: Category[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("admin_categories", JSON.stringify(categories))
}

export const addCategory = (category: Omit<Category, "id" | "createdAt">) => {
  const categories = getCategories()
  const newCategory: Category = {
    ...category,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  }
  categories.push(newCategory)
  saveCategories(categories)
  return newCategory
}

export const updateCategory = (id: number, updates: Partial<Category>) => {
  const categories = getCategories()
  const index = categories.findIndex((c) => c.id === id)
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates }
    saveCategories(categories)
    return categories[index]
  }
  return null
}

export const deleteCategory = (id: number) => {
  const categories = getCategories()
  const filtered = categories.filter((c) => c.id !== id)
  saveCategories(filtered)
  return filtered.length < categories.length
}

// Customers
export const getCustomers = (): Customer[] => {
  if (typeof window === "undefined") return []
  initializeDefaultData()
  const customers = localStorage.getItem("admin_customers")
  return customers ? JSON.parse(customers) : []
}

export const saveCustomers = (customers: Customer[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("admin_customers", JSON.stringify(customers))
}

export const updateCustomer = (id: string, updates: Partial<Customer>) => {
  const customers = getCustomers()
  const index = customers.findIndex((c) => c.id === id)
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updates }
    saveCustomers(customers)
    return customers[index]
  }
  return null
}

// Orders
export const getAdminOrders = (): AdminOrder[] => {
  if (typeof window === "undefined") return []
  initializeDefaultData()
  const orders = localStorage.getItem("admin_orders")
  return orders ? JSON.parse(orders) : []
}

export const saveAdminOrders = (orders: AdminOrder[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("admin_orders", JSON.stringify(orders))
}

export const updateOrderStatus = (id: string, status: AdminOrder["status"], tracking?: string) => {
  const orders = getAdminOrders()
  const index = orders.findIndex((o) => o.id === id)
  if (index !== -1) {
    orders[index] = {
      ...orders[index],
      status,
      tracking: tracking || orders[index].tracking,
      updatedAt: new Date().toISOString(),
    }
    saveAdminOrders(orders)
    return orders[index]
  }
  return null
}

// Notifications
export const getNotifications = (): Notification[] => {
  if (typeof window === "undefined") return []
  initializeDefaultData()
  const notifications = localStorage.getItem("admin_notifications")
  return notifications ? JSON.parse(notifications) : []
}

export const saveNotifications = (notifications: Notification[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("admin_notifications", JSON.stringify(notifications))
}

export const markNotificationAsRead = (id: string) => {
  const notifications = getNotifications()
  const index = notifications.findIndex((n) => n.id === id)
  if (index !== -1) {
    notifications[index].isRead = true
    saveNotifications(notifications)
  }
}

export const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => {
  const notifications = getNotifications()
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    isRead: false, // New notifications are unread by default
    createdAt: new Date().toISOString(),
  }
  notifications.unshift(newNotification) // Add to the beginning
  saveNotifications(notifications)
  return newNotification
}

// Coupons
export const getCoupons = (): Coupon[] => {
  if (typeof window === "undefined") return []
  initializeDefaultData()
  const coupons = localStorage.getItem("admin_coupons")
  return coupons ? JSON.parse(coupons) : []
}

export const saveCoupons = (coupons: Coupon[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("admin_coupons", JSON.stringify(coupons))
}

export const addCoupon = (coupon: Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usageCount">) => {
  const coupons = getCoupons()
  const newCoupon: Coupon = {
    ...coupon,
    id: `coupon_${Date.now()}`,
    usageCount: 0, // Initialize usageCount for new coupons
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  coupons.push(newCoupon)
  saveCoupons(coupons)
  return newCoupon
}

export const updateCoupon = (id: string, updates: Partial<Omit<Coupon, "id" | "createdAt" | "usageCount">>) => {
  const coupons = getCoupons()
  const index = coupons.findIndex((c) => c.id === id)
  if (index !== -1) {
    coupons[index] = { ...coupons[index], ...updates, updatedAt: new Date().toISOString() }
    saveCoupons(coupons)
    return coupons[index]
  }
  return null
}

export const deleteCoupon = (id: string) => {
  const coupons = getCoupons()
  const filtered = coupons.filter((c) => c.id !== id)
  saveCoupons(filtered)
  return filtered.length < coupons.length
}

export const incrementCouponUsage = (code: string) => {
  const coupons = getCoupons()
  const coupon = coupons.find((c) => c.code === code)
  if (coupon) {
    coupon.usageCount = (coupon.usageCount || 0) + 1
    saveCoupons(coupons)
  }
}

// Analytics
export const getAnalytics = (): Analytics => {
  const products = getProducts()
  const orders = getAdminOrders()
  const customers = getCustomers()

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalCustomers = customers.length
  const totalProducts = products.length

  // Mock growth data (in real app, this would be calculated from historical data)
  const revenueGrowth = 12.5
  const orderGrowth = 8.3
  const customerGrowth = 15.2
  const productGrowth = 5.1

  // Top products (mock data)
  const topProducts = products.slice(0, 5).map((product) => ({
    id: product.id,
    name: product.name,
    sales: Math.floor(Math.random() * 100) + 10,
    revenue: Math.floor(Math.random() * 5000) + 1000,
  }))

  // Sales data for chart (mock data)
  const salesData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    revenue: Math.floor(Math.random() * 2000) + 500,
    orders: Math.floor(Math.random() * 50) + 10,
  }))

  // Category stats (mock data)
  const categoryStats = getCategories().map((category) => ({
    category: category.name,
    sales: Math.floor(Math.random() * 200) + 50,
    revenue: Math.floor(Math.random() * 10000) + 2000,
  }))

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    revenueGrowth,
    orderGrowth,
    customerGrowth,
    productGrowth,
    topProducts,
    salesData,
    categoryStats,
  }
}
