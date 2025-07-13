import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    // Get total revenue (last 30 days)
    const revenueQuery = `
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND status != 'cancelled'
    `

    // Get total orders (last 30 days)
    const ordersQuery = `
      SELECT COUNT(*) as total_orders
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND status != 'cancelled'
    `

    // Get active customers (last 30 days)
    const customersQuery = `
      SELECT COUNT(DISTINCT customer_phone) as active_customers
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND status != 'cancelled'
    `

    // Get average order value
    const avgOrderQuery = `
      SELECT COALESCE(AVG(total_amount), 0) as avg_order_value
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND status != 'cancelled'
    `

    // Get daily sales for the last 7 days
    const dailySalesQuery = `
      SELECT 
        DATE(created_at) as date,
        DAYNAME(created_at) as day_name,
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      AND status != 'cancelled'
      GROUP BY DATE(created_at)
      ORDER BY date
    `

    // Get category performance
    const categoryStatsQuery = `
      SELECT 
        c.name,
        COUNT(oi.id) as total_orders,
        COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue
      FROM categories c
      LEFT JOIN menu_items mi ON c.id = mi.category_id
      LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND o.status != 'cancelled'
      GROUP BY c.id, c.name
      ORDER BY total_revenue DESC
    `

    // Get top menu items
    const topItemsQuery = `
      SELECT 
        mi.name,
        COUNT(oi.id) as order_count,
        COALESCE(SUM(oi.price * oi.quantity), 0) as revenue
      FROM menu_items mi
      LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND o.status != 'cancelled'
      GROUP BY mi.id, mi.name
      ORDER BY order_count DESC
      LIMIT 5
    `

    // Execute all queries
    const [revenueResult, ordersResult, customersResult, avgOrderResult, dailySales, categoryStats, topItems] =
      await Promise.all([
        executeQuery(revenueQuery),
        executeQuery(ordersQuery),
        executeQuery(customersQuery),
        executeQuery(avgOrderQuery),
        executeQuery(dailySalesQuery),
        executeQuery(categoryStatsQuery),
        executeQuery(topItemsQuery),
      ])

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: revenueResult[0].total_revenue,
        totalOrders: ordersResult[0].total_orders,
        activeCustomers: customersResult[0].active_customers,
        avgOrderValue: avgOrderResult[0].avg_order_value,
        dailySales,
        categoryStats,
        topItems,
      },
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
