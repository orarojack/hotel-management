import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const query = `
      SELECT c.*, COUNT(mi.id) as item_count
      FROM categories c
      LEFT JOIN menu_items mi ON c.id = mi.category_id AND mi.available = TRUE
      GROUP BY c.id
      ORDER BY c.name
    `

    const categories = await executeQuery(query)

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, description, imageUrl, icon } = await request.json()

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    const insertQuery = `
      INSERT INTO categories (name, description, image_url, icon)
      VALUES (?, ?, ?, ?)
    `

    const result = await executeQuery(insertQuery, [name, description, imageUrl, icon])

    return NextResponse.json({
      success: true,
      data: { id: result.insertId, name, description, imageUrl, icon },
    })
  } catch (error) {
    console.error("Category creation error:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
