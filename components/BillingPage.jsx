"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const BillingPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    quantity: 1,
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState("")
  const [orderDetails, setOrderDetails] = useState(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const requiredFields = ["fullName", "email", "phone", "address", "city", "state", "pincode"]

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        setErrorMessage(`Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field`)
        return false
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address")
      return false
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      setErrorMessage("Please enter a valid 10-digit phone number")
      return false
    }

    // Pincode validation
    const pincodeRegex = /^[0-9]{6}$/
    if (!pincodeRegex.test(formData.pincode)) {
      setErrorMessage("Please enter a valid 6-digit PIN code")
      return false
    }

    return true
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async (orderData) => {
    const isScriptLoaded = await loadRazorpayScript()

    if (!isScriptLoaded) {
      setErrorMessage("Failed to load payment gateway. Please try again.")
      setSubmitStatus("error")
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount * 100, // Amount in paise
      currency: orderData.currency,
      name: "മാത്രുതികമുകിൽ",
      description: "Malayalam Poetry Book by Marykutty Thomas",
      image: "/favicon.ico", // Add your logo here
      order_id: orderData.razorpayOrderId,
      prefill: {
        name: orderData.customerDetails.name,
        email: orderData.customerDetails.email,
        contact: orderData.customerDetails.contact,
      },
      theme: {
        color: "#3B82F6", // Blue color matching your theme
      },
      handler: async (response) => {
        try {
          setIsProcessing(true)

          // Verify payment on backend
          const verifyResponse = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId,
            }),
          })

          const verifyResult = await verifyResponse.json()

          if (verifyResult.success) {
            setOrderDetails(verifyResult.order)
            setSubmitStatus("success")
          } else {
            throw new Error(verifyResult.error || "Payment verification failed")
          }
        } catch (error) {
          console.error("Payment verification error:", error)
          setErrorMessage("Payment verification failed. Please contact support.")
          setSubmitStatus("error")
        } finally {
          setIsProcessing(false)
        }
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false)
          setErrorMessage("Payment was cancelled")
          setSubmitStatus("error")
        },
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus("error")
      return
    }

    setIsProcessing(true)
    setSubmitStatus(null)
    setErrorMessage("")

    try {
      // Create order on backend
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderData: formData,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Open Razorpay payment modal
        await handlePayment(result)
      } else {
        throw new Error(result.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Order creation error:", error)
      setErrorMessage(error.message || "Failed to create order. Please try again.")
      setSubmitStatus("error")
      setIsProcessing(false)
    }
  }

  const bookPrice = 350
  const shippingCost = 50
  const total = bookPrice * formData.quantity + shippingCost

  // Success state
  if (submitStatus === "success" && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <Card className="p-8">
              <CardContent className="pt-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Payment Successful!</h1>
                <p className="text-slate-600 mb-6">
                  Thank you for your purchase! Your order for "മാത്രുതികമുകിൽ" has been confirmed.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                  <h3 className="font-semibold mb-2">Order Details:</h3>
                  <p>
                    <strong>Order ID:</strong> #{orderDetails.id.slice(0, 8)}
                  </p>
                  <p>
                    <strong>Payment ID:</strong> {orderDetails.razorpay_payment_id}
                  </p>
                  <p>
                    <strong>Amount Paid:</strong> ₹{orderDetails.total_amount}
                  </p>
                  <p>
                    <strong>Status:</strong> <span className="text-green-600">Confirmed</span>
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-green-800">
                    <strong>What's next?</strong>
                    <br />• You'll receive a confirmation email shortly
                    <br />• Your book will be shipped within 3-5 business days
                    <br />• You can track your order status via email updates
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={onBack} variant="outline">
                    Place Another Order
                  </Button>
                  <Button onClick={() => (window.location.href = "mailto:contact@matrukamukil.com")}>Contact Us</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Button onClick={onBack} variant="ghost" className="mb-4 hover:bg-blue-50" disabled={isProcessing}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Book Details
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Order</h1>
          <p className="text-slate-600">Fill in your details to purchase മാത്രുതികമുകിൽ</p>
        </motion.div>

        {/* Error Message */}
        {submitStatus === "error" && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-semibold">Processing Payment...</p>
              <p className="text-sm text-slate-600">Please don't close this window</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="10-digit mobile number"
                      disabled={isProcessing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Complete Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="House/Flat No, Street, Area"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="6-digit PIN"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <div className="w-32">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="mt-1"
                      disabled={isProcessing}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${total} - Secure Payment`
                    )}
                  </Button>

                  <div className="text-center text-sm text-slate-600">
                    <p>🔒 Secured by Razorpay | All major cards accepted</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CoverFront.jpg-qjxECwx5vjleZ1ZMfIMA8NJVykm265.jpeg"
                    alt="മാത്രുതികമുകിൽ"
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">മാത്രുതികമുകിൽ</h3>
                    <p className="text-sm text-slate-600">by Marykutty Thomas</p>
                    <p className="text-sm text-slate-600">Qty: {formData.quantity}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Book Price ({formData.quantity}x)</span>
                    <span>₹{bookPrice * formData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shippingCost}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Free Delivery</p>
                      <p className="text-sm text-slate-600">5-7 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm text-slate-600">Powered by Razorpay</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BillingPage
