"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Filter, ChefHat, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { ImageUpload } from "@/components/image-upload"

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

interface Category {
  id: number
  name: string
  description: string
  image_url: string
  icon: string
  item_count: number
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: 0,
    available: true,
    prepTime: "",
    imageUrl: "",
    isPopular: false,
    isNew: false,
  })

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
      const menuResponse = await fetch("/api/menu-items")
      const menuData = await menuResponse.json()

      if (menuData.success) {
        setMenuItems(menuData.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === "all" || item.category_id.toString() === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.prepTime || !newItem.categoryId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItem.name,
          description: newItem.description,
          price: newItem.price,
          imageUrl: newItem.imageUrl,
          categoryId: newItem.categoryId,
          available: newItem.available,
          prepTime: newItem.prepTime,
          isPopular: newItem.isPopular,
          isNew: newItem.isNew,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create menu item")
      }

      await fetchData() // Refresh data
      setNewItem({
        name: "",
        description: "",
        price: 0,
        categoryId: 0,
        available: true,
        prepTime: "",
        imageUrl: "",
        isPopular: false,
        isNew: false,
      })
      setIsAddDialogOpen(false)

      toast({
        title: "Item Added",
        description: `${newItem.name} has been added to the menu.`,
      })
    } catch (error) {
      console.error("Add item error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add menu item.",
        variant: "destructive",
      })
    }
  }

  const handleEditItem = async () => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/menu-items/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingItem.name,
          description: editingItem.description,
          price: editingItem.price,
          imageUrl: editingItem.image_url,
          categoryId: editingItem.category_id,
          available: editingItem.available,
          prepTime: editingItem.prep_time,
          isPopular: editingItem.is_popular,
          isNew: editingItem.is_new,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update menu item")
      }

      await fetchData() // Refresh data
      setIsEditDialogOpen(false)
      setEditingItem(null)

      toast({
        title: "Item Updated",
        description: `${editingItem.name} has been updated.`,
      })
    } catch (error) {
      console.error("Update item error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update menu item.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete menu item")
      }

      await fetchData() // Refresh data

      toast({
        title: "Item Deleted",
        description: "Menu item has been removed from the menu.",
      })
    } catch (error) {
      console.error("Delete item error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete menu item.",
        variant: "destructive",
      })
    }
  }

  const toggleAvailability = async (id: number) => {
    const item = menuItems.find((item) => item.id === id)
    if (!item) return

    try {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...item,
          available: !item.available,
          imageUrl: item.image_url,
          categoryId: item.category_id,
          prepTime: item.prep_time,
          isPopular: item.is_popular,
          isNew: item.is_new,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update availability")
      }

      await fetchData() // Refresh data

      toast({
        title: "Availability Updated",
        description: `${item.name} is now ${item.available ? "unavailable" : "available"}.`,
      })
    } catch (error) {
      console.error("Toggle availability error:", error)
      toast({
        title: "Error",
        description: "Failed to update availability.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading menu items...</p>
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
                    <Link
                      href="/admin"
                      className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      MunchHaven Admin
                    </Link>
                    <p className="text-xs text-gray-500">Menu Management</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link href="/admin/categories">
                  <Button variant="outline" className="h-10 bg-transparent">
                    Categories
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" className="h-10 bg-transparent">
                    Dashboard
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Menu Management</h2>
              <p className="text-lg text-gray-600">Add, edit, and manage your menu items</p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add New Menu Item</DialogTitle>
                  <DialogDescription>Create a new item for your menu with all the details</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Item Name *
                      </Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter item name"
                        className="h-12"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium">
                          Price (KSh) *
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={newItem.price}
                          onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))
                          }
                          placeholder="0"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prepTime" className="text-sm font-medium">
                          Prep Time *
                        </Label>
                        <Input
                          id="prepTime"
                          value={newItem.prepTime}
                          onChange={(e) => setNewItem((prev) => ({ ...prev, prepTime: e.target.value }))}
                          placeholder="e.g., 15 min"
                          className="h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category *
                      </Label>
                      <Select
                        value={newItem.categoryId.toString()}
                        onValueChange={(value) =>
                          setNewItem((prev) => ({ ...prev, categoryId: Number.parseInt(value) }))
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the item in detail..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Switch
                          id="available"
                          checked={newItem.available}
                          onCheckedChange={(checked) => setNewItem((prev) => ({ ...prev, available: checked }))}
                        />
                        <Label htmlFor="available" className="font-medium">
                          Available for ordering
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Switch
                          id="popular"
                          checked={newItem.isPopular}
                          onCheckedChange={(checked) => setNewItem((prev) => ({ ...prev, isPopular: checked }))}
                        />
                        <Label htmlFor="popular" className="font-medium">
                          Mark as popular
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Switch
                          id="new"
                          checked={newItem.isNew}
                          onCheckedChange={(checked) => setNewItem((prev) => ({ ...prev, isNew: checked }))}
                        />
                        <Label htmlFor="new" className="font-medium">
                          Mark as new
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Item Image</Label>
                      <ImageUpload
                        value={newItem.imageUrl}
                        onChange={(url) => setNewItem((prev) => ({ ...prev, imageUrl: url }))}
                        className="h-64"
                        entityType="menu_item"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-3">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} size="lg">
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600">
                    Add Item
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters and Controls */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                  <div className="sm:w-48">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="h-12">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white"
                >
                  <div className="relative">
                    <img
                      src={item.image_url || "/placeholder.svg?height=192&width=400"}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge className={`${item.available ? "bg-green-500" : "bg-red-500"} text-white border-0`}>
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.is_popular && <Badge className="bg-orange-500 text-white border-0">Popular</Badge>}
                      {item.is_new && <Badge className="bg-blue-500 text-white border-0">New</Badge>}
                      <Badge className="bg-white/90 text-gray-800 border-0">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {item.rating || 0}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-bold text-gray-900">{item.name}</CardTitle>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.prep_time}</span>
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600 line-clamp-2">{item.description}</CardDescription>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-2xl font-bold text-blue-600">KSh {item.price.toLocaleString()}</span>
                      <Badge variant="outline">{item.category_name}</Badge>
                    </div>
                  </CardHeader>
                  <div className="px-6 pb-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} size="sm" />
                      <span className="text-sm text-gray-600">Available</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Menu Items ({filteredItems.length})</CardTitle>
                <CardDescription>Manage your menu items, prices, and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image_url || "/placeholder.svg?height=64&width=64"}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <Badge variant="outline">{item.category_name}</Badge>
                            <Badge className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.prep_time}</span>
                            </Badge>
                            {item.is_popular && (
                              <Badge className="bg-orange-100 text-orange-800 border-0">Popular</Badge>
                            )}
                            {item.is_new && <Badge className="bg-blue-100 text-blue-800 border-0">New</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.description}</p>
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-blue-600">KSh {item.price.toLocaleString()}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{item.rating || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} />
                          <Badge
                            className={`${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} border-0`}
                          >
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(item)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No menu items found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Edit Menu Item</DialogTitle>
                <DialogDescription>Update the details of this menu item</DialogDescription>
              </DialogHeader>

              {editingItem && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name" className="text-sm font-medium">
                        Item Name *
                      </Label>
                      <Input
                        id="edit-name"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                        className="h-12"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-price" className="text-sm font-medium">
                          Price (KSh) *
                        </Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={editingItem.price}
                          onChange={(e) =>
                            setEditingItem((prev) =>
                              prev ? { ...prev, price: Number.parseFloat(e.target.value) || 0 } : null,
                            )
                          }
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-prepTime" className="text-sm font-medium">
                          Prep Time *
                        </Label>
                        <Input
                          id="edit-prepTime"
                          value={editingItem.prep_time}
                          onChange={(e) =>
                            setEditingItem((prev) => (prev ? { ...prev, prep_time: e.target.value } : null))
                          }
                          className="h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category" className="text-sm font-medium">
                        Category *
                      </Label>
                      <Select
                        value={editingItem.category_id.toString()}
                        onValueChange={(value) =>
                          setEditingItem((prev) => (prev ? { ...prev, category_id: Number.parseInt(value) } : null))
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description" className="text-sm font-medium">
                        Description *
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={editingItem.description}
                        onChange={(e) =>
                          setEditingItem((prev) => (prev ? { ...prev, description: e.target.value } : null))
                        }
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Switch
                          id="edit-available"
                          checked={editingItem.available}
                          onCheckedChange={(checked) =>
                            setEditingItem((prev) => (prev ? { ...prev, available: checked } : null))
                          }
                        />
                        <Label htmlFor="edit-available" className="font-medium">
                          Available for ordering
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Switch
                          id="edit-popular"
                          checked={editingItem.is_popular}
                          onCheckedChange={(checked) =>
                            setEditingItem((prev) => (prev ? { ...prev, is_popular: checked } : null))
                          }
                        />
                        <Label htmlFor="edit-popular" className="font-medium">
                          Mark as popular
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Switch
                          id="edit-new"
                          checked={editingItem.is_new}
                          onCheckedChange={(checked) =>
                            setEditingItem((prev) => (prev ? { ...prev, is_new: checked } : null))
                          }
                        />
                        <Label htmlFor="edit-new" className="font-medium">
                          Mark as new
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Item Image</Label>
                      <ImageUpload
                        value={editingItem.image_url}
                        onChange={(url) => setEditingItem((prev) => (prev ? { ...prev, image_url: url } : null))}
                        className="h-64"
                        entityType="menu_item"
                        entityId={editingItem.id}
                      />
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} size="lg">
                  Cancel
                </Button>
                <Button onClick={handleEditItem} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Update Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthGuard>
  )
}
