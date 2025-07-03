import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, action } = await request.json()

    if (!razorpayOrderId) {
      return NextResponse.json({ error: "razorpayOrderId required" }, { status: 400 })
    }

    // Find the order
    const { data: orders, error: findError } = await supabase
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", razorpayOrderId)

    if (findError || !orders || orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orders[0]

    if (action === "mark_paid") {
      // Update the order to mark as paid
      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "captured",
          order_status: "confirmed",
          razorpay_payment_id: razorpayPaymentId || "manual_fix_" + Date.now(),
          payment_captured_at: new Date().toISOString(),
          payment_gateway_response: {
            manual_fix: true,
            fixed_at: new Date().toISOString(),
            original_razorpay_order_id: razorpayOrderId,
          },
        })
        .eq("id", order.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({ error: "Update failed: " + updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Order marked as paid successfully",
        order: updatedOrder,
      })
    }

    return NextResponse.json({ error: "Invalid action. Use 'mark_paid'" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST with { razorpayOrderId, action: 'mark_paid' }",
    example: {
      razorpayOrderId: "order_QoFzqc6AYayJXF",
      action: "mark_paid",
      razorpayPaymentId: "pay_optional_payment_id",
    },
  })
}
