"use client"

import { useState, useEffect } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Star,
  Clock,
  ChefHat,
  Award,
  Activity,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  activeCustomers: number
  avgOrderValue: number
  dailySales: Array<{
    date: string
    day_name: string
    orders: number
    revenue: number
  }>
  categoryStats: Array<{
    name: string
    total_orders: number
    total_revenue: number
  }>
  topItems: Array<{
    name: string
    order_count: number
    revenue: number
  }>
}

interface Order {
  id: number
  order_number: string
  customer_name: string
  room_number: string
  total_amount: number
  status: string
  created_at: string
  item_count: number
  items_summary: string
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch dashboard statistics
      const statsResponse = await fetch("/api/dashboard/stats")
      const statsData = await statsResponse.json()

      if (statsData.success) {
        setStats(statsData.data)
      }

      // Fetch recent orders
      const ordersResponse = await fetch("/api/orders?limit=10")
      const ordersData = await ordersResponse.json()

      if (ordersData.success) {
        setRecentOrders(ordersData.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "preparing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <ChefHat className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      MunchHaven Admin
                    </h1>
                    <p className="text-xs text-gray-500">Dashboard Overview</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link href="/admin/menu">
                  <Button variant="outline" className="h-10 bg-transparent">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Menu
                  </Button>
                </Link>
                <Link href="/admin/categories">
                  <Button variant="outline" className="h-10 bg-transparent">
                    <Award className="h-4 w-4 mr-2" />
                    Categories
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    View Site
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem("adminAuth")
                    window.location.href = "/admin/login"
                  }}
                  className="h-10"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
            <p className="text-lg text-gray-600">Monitor your restaurant performance and manage operations</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-white rounded-xl shadow-sm border">
              <TabsTrigger value="overview" className="rounded-lg font-medium">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg font-medium">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg font-medium">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Key Metrics */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-green-700">Total Revenue</CardTitle>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        Last 30 days
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-700">Total Orders</CardTitle>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-900">{stats.totalOrders}</div>
                      <div className="flex items-center text-xs text-blue-600 mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        Last 30 days
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-purple-700">Active Customers</CardTitle>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-900">{stats.activeCustomers}</div>
                      <div className="flex items-center text-xs text-purple-600 mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        Last 30 days
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-orange-700">Avg. Order Value</CardTitle>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-900">{formatCurrency(stats.avgOrderValue)}</div>
                      <div className="flex items-center text-xs text-orange-600 mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        Last 30 days
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Charts */}
              {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Weekly Revenue</CardTitle>
                      <CardDescription>Revenue performance over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={stats.dailySales}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="day_name" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" tickFormatter={(value) => `KSh ${(value / 1000).toFixed(0)}K`} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #E5E7EB",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Sales by Category</CardTitle>
                      <CardDescription>Revenue distribution across menu categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={stats.categoryStats.map((cat, index) => ({
                              ...cat,
                              color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"][index % 4],
                            }))}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="total_revenue"
                            label={({ name, total_revenue }) => `${name}: ${formatCurrency(total_revenue)}`}
                          >
                            {stats.categoryStats.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"][index % 4]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #E5E7EB",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Top Performing Items */}
              {stats && stats.topItems.length > 0 && (
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Top Performing Items</CardTitle>
                    <CardDescription>Best selling menu items this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.topItems.map((item, index) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500">{item.order_count} orders this month</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-bold text-lg">{formatCurrency(item.revenue)}</p>
                              <p className="text-sm text-gray-500">Revenue</p>
                            </div>
                            <div className="flex items-center">
                              <ArrowUpRight className="h-4 w-4 text-green-500" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
                  <CardDescription>Latest orders from customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {order.order_number.split("-")[1]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{order.customer_name}</h4>
                            <p className="text-sm text-gray-500">
                              Room {order.room_number} • {order.item_count} items • {getTimeAgo(order.created_at)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{order.items_summary}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={`${getStatusColor(order.status)} border capitalize`}>{order.status}</Badge>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency(order.total_amount)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {recentOrders.length === 0 && (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No recent orders found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {stats && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Order Trends</CardTitle>
                      <CardDescription>Number of orders over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.dailySales}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="day_name" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #E5E7EB",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Average Preparation Time</span>
                      </div>
                      <span className="font-bold text-lg">18 minutes</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">Customer Satisfaction</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg">4.8/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Order Completion Rate</span>
                      </div>
                      <span className="font-bold text-lg">98.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Peak Hours</span>
                      </div>
                      <span className="font-bold text-lg">7-9 PM</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
