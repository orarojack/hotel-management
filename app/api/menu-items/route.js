import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const available = searchParams.get("available")
    const search = searchParams.get("search")

    let query = `
      SELECT mi.*, c.name as category_name
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE 1=1
    `
    const params = []

    if (category && category !== "all") {
      query += " AND c.name = ?"
      params.push(category)
    }

    if (available === "true") {
      query += " AND mi.available = TRUE"
    }

    if (search) {
      query += " AND (mi.name LIKE ? OR mi.description LIKE ?)"
      params.push(`%${search}%`, `%${search}%`)
    }

    query += " ORDER BY mi.created_at DESC"

    const menuItems = await executeQuery(query, params)

    return NextResponse.json({
      success: true,
      data: menuItems,
    })
  } catch (error) {
    console.error("Menu items fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, description, price, imageUrl, categoryId, available, prepTime, isPopular, isNew } =
      await request.json()

    if (!name || !description || !price || !categoryId || !prepTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const insertQuery = `
      INSERT INTO menu_items (name, description, price, image_url, category_id, available, prep_time, is_popular, is_new)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result = await executeQuery(insertQuery, [
      name,
      description,
      price,
      imageUrl,
      categoryId,
      available,
      prepTime,
      isPopular,
      isNew,
    ])

    return NextResponse.json({
      success: true,
      data: { id: result.insertId },
    })
  } catch (error) {
    console.error("Menu item creation error:", error)
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
  }
}
