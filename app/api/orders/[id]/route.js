import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request, { params }) {
  try {
    const { id } = params

    const orderQuery = `
      SELECT o.*, 
             oi.id as item_id, oi.quantity, oi.price as item_price, oi.special_instructions,
             mi.name as item_name, mi.description as item_description, mi.image_url as item_image
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.id = ?
      ORDER BY oi.id
    `

    const results = await executeQuery(orderQuery, [id])

    if (results.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Structure the response
    const order = {
      id: results[0].id,
      orderNumber: results[0].order_number,
      customerName: results[0].customer_name,
      customerPhone: results[0].customer_phone,
      roomNumber: results[0].room_number,
      totalAmount: results[0].total_amount,
      status: results[0].status,
      specialRequests: results[0].special_requests,
      whatsappSent: results[0].whatsapp_sent,
      createdAt: results[0].created_at,
      updatedAt: results[0].updated_at,
      items: results
        .filter((r) => r.item_id)
        .map((r) => ({
          id: r.item_id,
          name: r.item_name,
          description: r.item_description,
          image: r.item_image,
          quantity: r.quantity,
          price: r.item_price,
          specialInstructions: r.special_instructions,
        })),
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { status } = await request.json()

    const validStatuses = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await executeQuery("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?", [status, id])

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    })
  } catch (error) {
    console.error("Order update error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
