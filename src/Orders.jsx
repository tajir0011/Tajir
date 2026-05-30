import { useState, useEffect } from "react"
import { supabase } from "./supabase"

function Orders({ storeName }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("store_name", storeName)
        .order("created_at", { ascending: false })
      if (!error) setOrders(data)
      setLoading(false)
    }
    loadOrders()
  }, [storeName])

  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)

    if (!error) {
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order))
    }
  }

  const statusColor = (status) => {
    if (status === "pending") return { bg: "#fff3cd", color: "#856404" }
    if (status === "processing") return { bg: "#cce5ff", color: "#004085" }
    if (status === "shipped") return { bg: "#d4edda", color: "#155724" }
    if (status === "delivered") return { bg: "#d1e7dd", color: "#0f5132" }
    return { bg: "#f8f9fa", color: "#555" }
  }

  if (loading) return <p style={{ color: "#888" }}>Loading orders...</p>

  return (
    <div>
      <h1 style={{ color: "#1a1a2e", marginBottom: "32px" }}>Orders</h1>

      {orders.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
          <h3 style={{ color: "#1a1a2e", marginBottom: "8px" }}>No orders yet</h3>
          <p style={{ color: "#888" }}>When customers place orders they will appear here</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {orders.map((order) => {
          const items = JSON.parse(order.items)
          const colors = statusColor(order.status)
          return (
            <div key={order.id} style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", color: "#1a1a2e" }}>{order.customer_name}</h3>
                  <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>📞 {order.customer_phone}</p>
                  <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>📍 {order.customer_address}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ background: colors.bg, color: colors.color, padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>
                    {order.status}
                  </span>
                  <p style={{ margin: "8px 0 0", color: "#6C63FF", fontWeight: "bold", fontSize: "18px" }}>SAR {order.total}</p>
                </div>
              </div>

              <div style={{ background: "#f8f7ff", borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
                {items.map((item, i) => (
                  <p key={i} style={{ margin: "4px 0", color: "#555", fontSize: "14px" }}>
                    {item.name} x{item.qty} — SAR {item.price * item.qty}
                  </p>
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["pending", "processing", "shipped", "delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(order.id, status)}
                    style={{
                      padding: "6px 16px",
                      background: order.status === status ? "#6C63FF" : "transparent",
                      color: order.status === status ? "white" : "#888",
                      border: "1.5px solid",
                      borderColor: order.status === status ? "#6C63FF" : "#e0e0e0",
                      borderRadius: "20px",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: order.status === status ? "bold" : "normal"
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders
