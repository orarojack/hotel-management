import { NextResponse } from "next/server"
import { executeQuery, executeTransaction } from "@/lib/database"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit")) || 50

    let query = `
      SELECT o.*, 
             COUNT(oi.id) as item_count,
             GROUP_CONCAT(CONCAT(mi.name, ' x', oi.quantity) SEPARATOR ', ') as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      query += " AND o.status = ?"
      params.push(status)
    }

    query += `
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `
    params.push(limit)

    const orders = await executeQuery(query, params)

    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { customerName, customerPhone, roomNumber, items, totalAmount, specialRequests } = await request.json()

    if (!customerName || !customerPhone || !roomNumber || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Prepare transaction queries
    const queries = []

    // Insert order
    queries.push({
      query: `
        INSERT INTO orders (order_number, customer_name, customer_phone, room_number, total_amount, special_requests)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      params: [orderNumber, customerName, customerPhone, roomNumber, totalAmount, specialRequests],
    })

    // We'll need to get the order ID after insertion, so we'll handle this separately
    const orderResult = await executeQuery(
      `INSERT INTO orders (order_number, customer_name, customer_phone, room_number, total_amount, special_requests)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderNumber, customerName, customerPhone, roomNumber, totalAmount, specialRequests],
    )

    const orderId = orderResult.insertId

    // Insert order items
    const itemQueries = items.map((item) => ({
      query: `
        INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions)
        VALUES (?, ?, ?, ?, ?)
      `,
      params: [orderId, item.id, item.quantity, item.price, item.specialInstructions || null],
    }))

    await executeTransaction(itemQueries)

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        orderNumber,
        message: "Order placed successfully",
      },
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
