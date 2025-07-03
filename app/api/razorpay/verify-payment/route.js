import { NextResponse } from "next/server"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const body = await request.json()
    console.log(body)
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Update order in database
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "captured",
        order_status: "confirmed",
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        payment_captured_at: new Date().toISOString(),
        payment_gateway_response: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          verified_at: new Date().toISOString(),
        },
      })
      .eq("id", orderId)
      .eq("razorpay_order_id", razorpay_order_id)
      .select()

    console.log("This is the updated order",updatedOrder)
    if (updateError || !updatedOrder || updatedOrder.length === 0) {
      console.error("Supabase error updating order:", { 
        message: updateError?.message, 
        details: updateError?.details, 
        hint: updateError?.hint, 
        orderId, 
        razorpay_order_id 
      });
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder[0],
    })
  } catch (error) {
    console.error("Verify payment error:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
