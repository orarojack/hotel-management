"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Grid, List, Award, ChefHat, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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

interface Category {
  id: number
  name: string
  description: string
  image_url: string
  item_count: number
  icon: string
}

const iconOptions = [
  { value: "sparkles", label: "Sparkles", icon: Sparkles },
  { value: "chef-hat", label: "Chef Hat", icon: ChefHat },
  { value: "award", label: "Award", icon: Award },
  { value: "users", label: "Users", icon: Users },
]

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    imageUrl: "",
    icon: "sparkles",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/categories")
      const data = await response.json()

      if (data.success) {
        setCategories(data.data)
      } else {
        throw new Error(data.error || "Failed to fetch categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((option) => option.value === iconName)
    return iconOption ? iconOption.icon : Sparkles
  }

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          imageUrl: newCategory.imageUrl,
          icon: newCategory.icon,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create category")
      }

      await fetchCategories() // Refresh data
      setNewCategory({ name: "", description: "", imageUrl: "", icon: "sparkles" })
      setIsAddDialogOpen(false)

      toast({
        title: "Category Added",
        description: `${newCategory.name} has been added successfully.`,
      })
    } catch (error) {
      console.error("Add category error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category.",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory) return

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingCategory.name,
          description: editingCategory.description,
          imageUrl: editingCategory.image_url,
          icon: editingCategory.icon,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update category")
      }

      await fetchCategories() // Refresh data
      setIsEditDialogOpen(false)
      setEditingCategory(null)

      toast({
        title: "Category Updated",
        description: `${editingCategory.name} has been updated successfully.`,
      })
    } catch (error) {
      console.error("Update category error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: number) => {
    const category = categories.find((cat) => cat.id === id)
    if (category && category.item_count > 0) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete category with existing items. Move items first.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete category")
      }

      await fetchCategories() // Refresh data

      toast({
        title: "Category Deleted",
        description: `${category?.name} has been removed successfully.`,
      })
    } catch (error) {
      console.error("Delete category error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category.",
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
            <p className="text-lg text-gray-600">Loading categories...</p>
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
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Link
                      href="/admin"
                      className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      MunchHaven Admin
                    </Link>
                    <p className="text-xs text-gray-500">Category Management</p>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Category Management</h2>
              <p className="text-lg text-gray-600">Organize your menu items into categories</p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add New Category</DialogTitle>
                  <DialogDescription>Create a new category for your menu items</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Category Name *
                      </Label>
                      <Input
                        id="name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Appetizers"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe this category..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category Icon</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {iconOptions.map((option) => {
                          const IconComponent = option.icon
                          return (
                            <Button
                              key={option.value}
                              type="button"
                              variant={newCategory.icon === option.value ? "default" : "outline"}
                              onClick={() => setNewCategory((prev) => ({ ...prev, icon: option.value }))}
                              className="h-12 justify-start"
                            >
                              <IconComponent className="h-4 w-4 mr-2" />
                              {option.label}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category Image</Label>
                      <ImageUpload
                        value={newCategory.imageUrl}
                        onChange={(url) => setNewCategory((prev) => ({ ...prev, imageUrl: url }))}
                        className="h-48"
                        entityType="category"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-3">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} size="lg">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCategory}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    Add Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and View Controls */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => {
                const IconComponent = getIconComponent(category.icon)
                return (
                  <Card
                    key={category.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white"
                  >
                    <div className="relative">
                      <img
                        src={category.image_url || "/placeholder.svg?height=192&width=400"}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-blue-500 text-white border-0">{category.item_count} items</Badge>
                      </div>
                      <div className="absolute top-3 left-3">
                        <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-gray-700" />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">{category.name}</CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={category.item_count > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Categories ({filteredCategories.length})</CardTitle>
                <CardDescription>Manage your menu categories and organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCategories.map((category) => {
                    const IconComponent = getIconComponent(category.icon)
                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={category.image_url || "/placeholder.svg?height=64&width=64"}
                            alt={category.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <IconComponent className="h-5 w-5 text-gray-700" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="font-semibold text-gray-900">{category.name}</h4>
                              <Badge className="bg-blue-100 text-blue-800 border-0">{category.item_count} items</Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={category.item_count > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Edit Category</DialogTitle>
                <DialogDescription>Update the details of this category</DialogDescription>
              </DialogHeader>

              {editingCategory && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name" className="text-sm font-medium">
                        Category Name *
                      </Label>
                      <Input
                        id="edit-name"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description" className="text-sm font-medium">
                        Description *
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={editingCategory.description}
                        onChange={(e) =>
                          setEditingCategory((prev) => (prev ? { ...prev, description: e.target.value } : null))
                        }
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category Icon</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {iconOptions.map((option) => {
                          const IconComponent = option.icon
                          return (
                            <Button
                              key={option.value}
                              type="button"
                              variant={editingCategory.icon === option.value ? "default" : "outline"}
                              onClick={() =>
                                setEditingCategory((prev) => (prev ? { ...prev, icon: option.value } : null))
                              }
                              className="h-12 justify-start"
                            >
                              <IconComponent className="h-4 w-4 mr-2" />
                              {option.label}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category Image</Label>
                      <ImageUpload
                        value={editingCategory.image_url}
                        onChange={(url) => setEditingCategory((prev) => (prev ? { ...prev, image_url: url } : null))}
                        className="h-48"
                        entityType="category"
                        entityId={editingCategory.id}
                      />
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} size="lg">
                  Cancel
                </Button>
                <Button onClick={handleEditCategory} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Update Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthGuard>
  )
}
