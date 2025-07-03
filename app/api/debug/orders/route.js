import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const razorpayOrderId = searchParams.get("razorpayOrderId")

    if (orderId || razorpayOrderId) {
      // Get specific order
      let query = supabase.from("orders").select("*")

      if (orderId) {
        query = query.eq("id", orderId)
      }

      if (razorpayOrderId) {
        query = query.eq("razorpay_order_id", razorpayOrderId)
      }

      const { data, error } = await query

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        orders: data,
        count: data?.length || 0,
        query: { orderId, razorpayOrderId },
      })
    }

    // Get recent orders
    const { data, error } = await supabase
      .from("orders")
      .select("id, razorpay_order_id, payment_status, order_status, created_at, total_amount")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      recent_orders: data,
      count: data?.length || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
