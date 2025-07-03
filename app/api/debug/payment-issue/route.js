import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const razorpayOrderId = searchParams.get("razorpayOrderId")

    if (razorpayOrderId) {
      // Search by razorpay_order_id (this is what we should use)
      const { data: orders, error } = await supabase.from("orders").select("*").eq("razorpay_order_id", razorpayOrderId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        searchType: "razorpay_order_id",
        searchValue: razorpayOrderId,
        ordersFound: orders?.length || 0,
        orders: orders || [],
      })
    }

    if (orderId) {
      // Only try UUID search if it looks like a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)

      if (!isUUID) {
        return NextResponse.json({
          error: "Invalid UUID format",
          orderId,
          suggestion: "Use razorpayOrderId parameter instead",
        })
      }

      const { data: orders, error } = await supabase.from("orders").select("*").eq("id", orderId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        searchType: "database_id",
        searchValue: orderId,
        ordersFound: orders?.length || 0,
        orders: orders || [],
      })
    }

    // Get recent orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("id, razorpay_order_id, payment_status, order_status, created_at, total_amount")
      .order("created_at", { ascending: false })
      .limit(5)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      searchType: "recent_orders",
      ordersFound: orders?.length || 0,
      orders: orders || [],
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
