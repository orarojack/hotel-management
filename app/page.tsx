"use client"

import { useState, useEffect } from "react"
import {
  ShoppingCart,
  Star,
  Clock,
  Users,
  MessageCircle,
  Search,
  Filter,
  ChefHat,
  Award,
  Sparkles,
  Zap,
  Shield,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { HelpWidget } from "@/components/help-widget"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category_id: number
  category_name: string
  available: boolean
  rating: number
  prep_time: string
  is_popular: boolean
  is_new: boolean
}

interface CartItem extends MenuItem {
  quantity: number
  specialInstructions?: string
}

interface Category {
  id: number
  name: string
  description: string
  image_url: string
  icon: string
  item_count: number
}

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    room: "",
    specialRequests: "",
  })

  // Fetch categories and menu items on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch categories
      const categoriesResponse = await fetch("/api/categories")
      const categoriesData = await categoriesResponse.json()

      if (categoriesData.success) {
        setCategories(categoriesData.data)
      }

      // Fetch menu items
      const menuResponse = await fetch("/api/menu-items?available=true")
      const menuData = await menuResponse.json()

      if (menuData.success) {
        setMenuItems(menuData.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load menu data. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category_name.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && item.available
  })

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const sendOrderToWhatsApp = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.room) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // Save order to database
      const orderData = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        roomNumber: customerInfo.room,
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          specialInstructions: item.specialInstructions,
        })),
        totalAmount: getTotalPrice(),
        specialRequests: customerInfo.specialRequests,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order")
      }

      // Create WhatsApp message
      let message = `🏨 *MunchHaven Order*\n\n`
      message += `📋 *Order #:* ${result.data.orderNumber}\n`
      message += `👤 *Customer:* ${customerInfo.name}\n`
      message += `📞 *Phone:* ${customerInfo.phone}\n`
      message += `🏠 *Room:* ${customerInfo.room}\n\n`
      message += `🍽️ *Order Details:*\n`

      cart.forEach((item) => {
        message += `• ${item.name} x${item.quantity} - KSh ${(item.price * item.quantity).toLocaleString()}\n`
        if (item.specialInstructions) {
          message += `  📝 Special: ${item.specialInstructions}\n`
        }
      })

      message += `\n💰 *Total: KSh ${getTotalPrice().toLocaleString()}*\n`

      if (customerInfo.specialRequests) {
        message += `\n📋 *Special Requests:* ${customerInfo.specialRequests}\n`
      }

      message += `\n⏰ Order placed at: ${new Date().toLocaleString()}`

      const whatsappNumber = "254703781668"
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

      window.open(whatsappUrl, "_blank")

      // Clear cart and form after sending
      setCart([])
      setCustomerInfo({ name: "", phone: "", room: "", specialRequests: "" })
      setIsCartOpen(false)

      toast({
        title: "Order Placed!",
        description: `Order ${result.data.orderNumber} has been sent via WhatsApp. We'll prepare it shortly!`,
      })
    } catch (error) {
      console.error("Order error:", error)
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "sparkles":
        return <Sparkles className="h-5 w-5" />
      case "chef-hat":
        return <ChefHat className="h-5 w-5" />
      case "award":
        return <Award className="h-5 w-5" />
      case "users":
        return <Users className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading delicious menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    MunchHaven
                  </h1>
                  <p className="text-xs text-gray-500">munchhaven.co.ke</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search delicious food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 h-12 border-0 bg-gray-100/80 focus:bg-white transition-all duration-200"
                />
              </div>

              <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="relative h-12 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-yellow-400 text-yellow-900 animate-pulse">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Your Order</DialogTitle>
                    <DialogDescription>Review your items and provide delivery details</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg text-gray-500">Your cart is empty</p>
                        <p className="text-sm text-gray-400">Add some delicious items to get started!</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                            >
                              <div className="flex items-center space-x-4 flex-1">
                                <img
                                  src={item.image_url || "/placeholder.svg?height=64&width=64"}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-500">KSh {item.price.toLocaleString()} each</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  +
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-2"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Full Name *
                              </Label>
                              <Input
                                id="name"
                                value={customerInfo.name}
                                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter your full name"
                                className="mt-1 h-12"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                Phone Number *
                              </Label>
                              <Input
                                id="phone"
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                                placeholder="+254 703 781 668"
                                className="mt-1 h-12"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label htmlFor="room" className="text-sm font-medium text-gray-700">
                              Room Number *
                            </Label>
                            <Input
                              id="room"
                              value={customerInfo.room}
                              onChange={(e) => setCustomerInfo((prev) => ({ ...prev, room: e.target.value }))}
                              placeholder="e.g., 205, 312A"
                              className="mt-1 h-12"
                            />
                          </div>
                          <div className="mt-4">
                            <Label htmlFor="requests" className="text-sm font-medium text-gray-700">
                              Special Requests
                            </Label>
                            <Textarea
                              id="requests"
                              value={customerInfo.specialRequests}
                              onChange={(e) =>
                                setCustomerInfo((prev) => ({ ...prev, specialRequests: e.target.value }))
                              }
                              placeholder="Any special requests, dietary requirements, or delivery instructions..."
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="border-t pt-6 bg-gradient-to-r from-orange-50 to-red-50 -mx-6 px-6 py-4 rounded-lg">
                          <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total Amount:</span>
                            <span className="text-orange-600">KSh {getTotalPrice().toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Including all taxes and fees</p>
                        </div>
                      </>
                    )}
                  </div>

                  <DialogFooter className="gap-3">
                    <Button variant="outline" onClick={() => setIsCartOpen(false)} size="lg">
                      Continue Shopping
                    </Button>
                    {cart.length > 0 && (
                      <Button
                        onClick={sendOrderToWhatsApp}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Send Order via WhatsApp
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                MunchHaven
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              Exquisite dining delivered to your room with premium quality and exceptional service. Experience culinary
              excellence at munchhaven.co.ke
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Zap className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm opacity-80">Quick service to your room</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Shield className="h-8 w-8 mx-auto mb-3 text-blue-300" />
                <h3 className="font-semibold mb-2">Premium Quality</h3>
                <p className="text-sm opacity-80">Finest ingredients & preparation</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Heart className="h-8 w-8 mx-auto mb-3 text-pink-300" />
                <h3 className="font-semibold mb-2">Made with Love</h3>
                <p className="text-sm opacity-80">Crafted with passion & care</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Clock className="h-8 w-8 mx-auto mb-3 text-green-300" />
                <h3 className="font-semibold mb-2">24/7 Service</h3>
                <p className="text-sm opacity-80">Always here when you need us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Our Exquisite Menu</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Crafted with passion, served with excellence. Every dish tells a story of culinary artistry.
            </p>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-12 h-14 bg-gray-100 rounded-2xl p-1">
              <TabsTrigger value="all" className="rounded-xl font-medium">
                All Items
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.name} className="rounded-xl font-medium">
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{getIconComponent(category.icon)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image_url || "/placeholder.svg?height=224&width=400"}
                        alt={item.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {item.is_popular && (
                          <Badge className="bg-orange-500 text-white border-0">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {item.is_new && (
                          <Badge className="bg-green-500 text-white border-0">
                            <Sparkles className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-gray-800 border-0">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {item.rating || 0}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </CardTitle>
                        <Badge variant="outline" className="flex items-center space-x-1 bg-gray-50">
                          <Clock className="h-3 w-3" />
                          <span>{item.prep_time}</span>
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600 leading-relaxed">{item.description}</CardDescription>
                    </CardHeader>

                    <CardFooter className="flex justify-between items-center pt-0">
                      <div className="flex flex-col">
                        <span className="text-3xl font-bold text-orange-600">KSh {item.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">per serving</span>
                      </div>
                      <Button
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {item.available ? "Add to Cart" : "Unavailable"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-16">
                  <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col space-y-4">
        <HelpWidget />
        <Button
          size="lg"
          className="rounded-full bg-green-500 hover:bg-green-600 shadow-2xl animate-float h-16 w-16 p-0"
          onClick={() => window.open("https://wa.me/254703781668", "_blank")}
        >
          <MessageCircle className="h-8 w-8" />
          <span className="sr-only">Contact us on WhatsApp</span>
        </Button>
      </div>
    </div>
  )
}
