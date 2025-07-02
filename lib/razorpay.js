import Razorpay from "razorpay"
import crypto from "crypto"

// Server-side Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Verify payment signature
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const body = orderId + "|" + paymentId
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex")

  return expectedSignature === signature
}

// Generate receipt ID
export const generateReceiptId = () => {
  return `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}
