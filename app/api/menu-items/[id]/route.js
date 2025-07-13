import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { name, description, price, imageUrl, categoryId, available, prepTime, isPopular, isNew } =
      await request.json()

    const updateQuery = `
      UPDATE menu_items 
      SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, 
          available = ?, prep_time = ?, is_popular = ?, is_new = ?, updated_at = NOW()
      WHERE id = ?
    `

    await executeQuery(updateQuery, [
      name,
      description,
      price,
      imageUrl,
      categoryId,
      available,
      prepTime,
      isPopular,
      isNew,
      id,
    ])

    return NextResponse.json({
      success: true,
      message: "Menu item updated successfully",
    })
  } catch (error) {
    console.error("Menu item update error:", error)
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await executeQuery("DELETE FROM menu_items WHERE id = ?", [id])

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully",
    })
  } catch (error) {
    console.error("Menu item deletion error:", error)
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 })
  }
}
