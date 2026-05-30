import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Products from "./Products"
import Orders from "./Orders"
import StorePage from "./StorePage"

function Dashboard({ storeName, merchantName }) {
  const [page, setPage] = useState("home")
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 })

  useEffect(() => {
    const loadStats = async () => {
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("store_name", storeName)

      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("store_name", storeName)

      const revenue = orders ? orders.reduce((sum, o) => sum + o.total, 0) : 0
      const customers = orders ? new Set(orders.map(o => o.customer_phone)).size : 0

      setStats({
        products: products ? products.length : 0,
        orders: orders ? orders.length : 0,
        revenue: revenue,
        customers: customers
      })
    }
    loadStats()
  }, [storeName])

  if (page === "storepage") return <StorePage storeName={storeName} />

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>

      <div style={{ width: "240px", background: "#1a1a2e", padding: "32px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <h2 style={{ color: "#6C63FF", margin: "0 0 32px", paddingLeft: "12px" }}>Tajir</h2>

        {[
          { icon: "🏠", label: "Home", key: "home" },
          { icon: "📦", label: "Products", key: "products" },
          { icon: "🛒", label: "Orders", key: "orders" },
          { icon: "🛍️", label: "View Store", key: "storepage" },
          { icon: "⚙️", label: "Settings", key: "settings" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px", borderRadius: "10px", border: "none",
              background: page === item.key ? "#6C63FF" : "transparent",
              color: page === item.key ? "white" : "#aaa",
              cursor: "pointer", fontSize: "15px", textAlign: "left"
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, background: "#f8f7ff", padding: "40px" }}>

        {page === "home" && (
          <div>
            <h1 style={{ color: "#1a1a2e", marginBottom: "8px" }}>
              Welcome back, {merchantName}! 👋
            </h1>
            <p style={{ color: "#888", marginBottom: "40px" }}>Here's how your store <strong>{storeName}</strong> is doing</p>

            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[
                { icon: "📦", label: "Products", value: stats.products },
                { icon: "🛒", label: "Orders", value: stats.orders },
                { icon: "💰", label: "Revenue", value: `SAR ${stats.revenue}` },
                { icon: "👥", label: "Customers", value: stats.customers },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "white", borderRadius: "16px", padding: "24px", minWidth: "160px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
                  <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1a1a2e" }}>{stat.value}</div>
                  <div style={{ color: "#888", fontSize: "14px" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "40px", background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ color: "#1a1a2e", margin: "0 0 8px" }}>🔗 Your Store Link</h3>
              <p style={{ color: "#888", margin: "0 0 12px", fontSize: "14px" }}>Share this link with your customers</p>
              <div style={{ background: "#f8f7ff", borderRadius: "8px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#6C63FF", fontWeight: "500" }}>
                  tajir.com/store/{storeName.toLowerCase().replace(/\s+/g, "-")}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(`tajir.com/store/${storeName.toLowerCase().replace(/\s+/g, "-")}`)}
                  style={{ padding: "6px 16px", background: "#6C63FF", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {page === "products" && <Products storeName={storeName} />}
        {page === "orders" && <Orders storeName={storeName} />}
        {page === "settings" && (
          <div>
            <h1 style={{ color: "#1a1a2e", marginBottom: "32px" }}>Settings</h1>
            <p style={{ color: "#888" }}>Store settings coming soon.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard