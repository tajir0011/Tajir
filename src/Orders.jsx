import { useState, useEffect } from "react"
import { supabase } from "./supabase"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"

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

  const statusStyle = (status) => {
    if (status === "pending") return { bg: "#FAEEDA", color: "#BA7517" }
    if (status === "processing") return { bg: "#EEEDFE", color: PURPLE }
    if (status === "shipped") return { bg: "#FAECE7", color: CORAL }
    if (status === "delivered") return { bg: "#E1F5EE", color: "#0F6E56" }
    return { bg: "#f0f0f0", color: "#888" }
  }

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px", color: "#888" }}>Loading orders...</div>
  )

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: DARK, margin: "0 0 4px", fontSize: "26px", fontWeight: "800" }}>Orders</h1>
        <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>{orders.length} total orders</p>
      </div>

      {orders.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
          <h3 style={{ color: DARK, marginBottom: "8px", fontWeight: "700" }}>No orders yet</h3>
          <p style={{ color: "#888" }}>When customers place orders they will appear here</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {orders.map((order) => {
          const items = JSON.parse(order.items)
          const s = statusStyle(order.status)
          return (
            <div key={order.id} style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0eeff" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ margin: "0 0 6px", color: DARK, fontWeight: "700", fontSize: "17px" }}>{order.customer_name}</h3>
                  <p style={{ margin: "0 0 4px", color: "#888", fontSize: "14px" }}>📞 {order.customer_phone}</p>
                  <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>📍 {order.customer_address}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ background: s.bg, color: s.color, padding: "5px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" }}>
                    {order.status}
                  </span>
                  <p style={{ margin: "10px 0 0", color: CORAL, fontWeight: "800", fontSize: "20px" }}>SAR {order.total}</p>
                </div>
              </div>

              <div style={{ background: "#f8f7ff", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px" }}>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < items.length - 1 ? "8px" : 0 }}>
                    <span style={{ color: "#555", fontSize: "14px" }}>{item.name} x{item.qty}</span>
                    <span style={{ color: PURPLE, fontWeight: "600", fontSize: "14px" }}>SAR {item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div>
                <p style={{ color: "#888", fontSize: "12px", margin: "0 0 10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Update Status</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["pending", "processing", "shipped", "delivered"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order.id, status)}
                      style={{
                        padding: "6px 16px",
                        background: order.status === status ? PURPLE : "transparent",
                        color: order.status === status ? "white" : "#888",
                        border: `1.5px solid ${order.status === status ? PURPLE : "#e0e0e0"}`,
                        borderRadius: "20px",
                        fontSize: "13px",
                        cursor: "pointer",
                        fontWeight: order.status === status ? "700" : "400"
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders