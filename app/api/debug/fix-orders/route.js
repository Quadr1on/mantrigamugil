import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    // Get the order
    const { data: order, error: findError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (findError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update the order
    const updateData = {
      payment_status: "captured",
      order_status: "confirmed",
      payment_captured_at: new Date().toISOString(),
    }

    if (razorpayPaymentId) {
      updateData.razorpay_payment_id = razorpayPaymentId
    }

    if (razorpayOrderId && !order.razorpay_order_id) {
      updateData.razorpay_order_id = razorpayOrderId
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Update failed: " + updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
