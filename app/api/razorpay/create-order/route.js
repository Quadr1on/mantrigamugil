//app/api/razorpay/create-order/route.js
import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { supabase } from "@/lib/supabase"

function generateReceiptId() {
  return `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export async function POST(request) {
  try {
    console.log("=== Create Order API Called ===")

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay credentials missing" }, { status: 500 })
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const { orderData } = await request.json()
    console.log("Order data received:", orderData)

    // Validate required fields
    const requiredFields = ["fullName", "email", "phone", "address", "city", "state", "pincode", "quantity"]
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
      }
    }

    // Calculate amounts
    const bookPrice = 350
    const shippingCost = 50
    const totalAmount = bookPrice * orderData.quantity + shippingCost

    console.log("Creating Razorpay order for amount:", totalAmount)

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: generateReceiptId(),
      notes: {
        customer_name: orderData.fullName,
        customer_email: orderData.email,
        book_title: "മാത്രുതികമുകിൽ",
        quantity: orderData.quantity.toString(),
      },
    })

    console.log("✅ Razorpay order created:", razorpayOrder.id)

    // Save to database
    const { data: dbOrder, error: dbError } = await supabase
      .from("orders")
      .insert([
        {
          full_name: orderData.fullName.trim(),
          email: orderData.email.trim().toLowerCase(),
          phone: orderData.phone.trim(),
          address: orderData.address.trim(),
          city: orderData.city.trim(),
          state: orderData.state.trim(),
          pincode: orderData.pincode.trim(),
          quantity: Number.parseInt(orderData.quantity),
          book_price: bookPrice,
          shipping_cost: shippingCost,
          total_amount: totalAmount,
          order_status: "pending",
          payment_status: "pending",
          razorpay_order_id: razorpayOrder.id,
        },
      ])
      .select()
      // .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save order: " + dbError.message }, { status: 500 })
    }

    console.log("✅ Order saved to database:", dbOrder.id)

    return NextResponse.json({
      success: true,
      orderId: dbOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR",
      customerDetails: {
        name: orderData.fullName,
        email: orderData.email,
        contact: orderData.phone,
      },
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order: " + error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
