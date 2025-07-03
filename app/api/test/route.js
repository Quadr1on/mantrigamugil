import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    env_check: {
      razorpay_key_id: !!process.env.RAZORPAY_KEY_ID,
      razorpay_key_secret: !!process.env.RAZORPAY_KEY_SECRET,
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  })
}

export async function POST() {
  return NextResponse.json({
    message: "POST method working!",
    timestamp: new Date().toISOString(),
  })
}
