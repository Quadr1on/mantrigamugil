"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Loader2, RefreshCw } from "lucide-react"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from("orders").update({ order_status: newStatus }).eq("id", orderId)

      if (error) throw error

      // Refresh orders
      fetchOrders()
    } catch (err) {
      alert("Error updating order: " + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={fetchOrders} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-600">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order #{order.id.slice(0, 8)}</span>
                  <span className="text-sm font-normal text-slate-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Details</h4>
                    <p>
                      <strong>Name:</strong> {order.full_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.pincode}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Order Details</h4>
                    <p>
                      <strong>Quantity:</strong> {order.quantity}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ₹{order.total_amount}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          order.order_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.order_status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : order.order_status === "shipped"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </p>
                    <div className="mt-3 space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "confirmed")}
                        disabled={order.order_status !== "pending"}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, "shipped")}
                        disabled={order.order_status !== "confirmed"}
                      >
                        Ship
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminOrders
