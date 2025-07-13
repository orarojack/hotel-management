import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { name, description, imageUrl, icon } = await request.json()

    const updateQuery = `
      UPDATE categories 
      SET name = ?, description = ?, image_url = ?, icon = ?, updated_at = NOW()
      WHERE id = ?
    `

    await executeQuery(updateQuery, [name, description, imageUrl, icon, id])

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
    })
  } catch (error) {
    console.error("Category update error:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Check if category has menu items
    const itemCount = await executeQuery("SELECT COUNT(*) as count FROM menu_items WHERE category_id = ?", [id])

    if (itemCount[0].count > 0) {
      return NextResponse.json({ error: "Cannot delete category with existing menu items" }, { status: 400 })
    }

    await executeQuery("DELETE FROM categories WHERE id = ?", [id])

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Category deletion error:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
