import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Products from "./Products"
import Orders from "./Orders"
import StorePage from "./StorePage"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"

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

  const navItems = [
    { icon: "🏠", label: "Home", key: "home" },
    { icon: "📦", label: "Products", key: "products" },
    { icon: "🛒", label: "Orders", key: "orders" },
    { icon: "🛍️", label: "View Store", key: "storepage" },
    { icon: "⚙️", label: "Settings", key: "settings" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* Sidebar */}
      <div style={{ width: "240px", background: DARK, padding: "32px 16px", display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px", paddingLeft: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${PURPLE}, ${CORAL})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>T</span>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "18px", color: "white" }}>Tajir</span>
        </div>

        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px", borderRadius: "10px", border: "none",
              background: page === item.key ? PURPLE : "transparent",
              color: page === item.key ? "white" : "#aaa",
              cursor: "pointer", fontSize: "14px", textAlign: "left",
              fontWeight: page === item.key ? "600" : "400"
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingLeft: "12px" }}>
          <p style={{ color: "#666", fontSize: "12px", margin: "0 0 4px" }}>Logged in as</p>
          <p style={{ color: "white", fontSize: "14px", fontWeight: "600", margin: 0 }}>{merchantName}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: "#f8f7ff", padding: "40px", overflowY: "auto" }}>

        {page === "home" && (
          <div>
            <h1 style={{ color: DARK, marginBottom: "4px", fontSize: "26px", fontWeight: "800" }}>
              Welcome back, {merchantName}! 👋
            </h1>
            <p style={{ color: "#888", marginBottom: "40px", fontSize: "15px" }}>
              Here's how <strong style={{ color: PURPLE }}>{storeName}</strong> is doing today
            </p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              {[
                { icon: "📦", label: "Products", value: stats.products, color: "#EEEDFE" },
                { icon: "🛒", label: "Orders", value: stats.orders, color: "#FAECE7" },
                { icon: "💰", label: "Revenue", value: `SAR ${stats.revenue}`, color: "#EEEDFE" },
                { icon: "👥", label: "Customers", value: stats.customers, color: "#FAECE7" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: stat.color, borderRadius: "16px", padding: "24px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>{stat.icon}</div>
                  <div style={{ fontSize: "28px", fontWeight: "800", color: DARK }}>{stat.value}</div>
                  <div style={{ color: "#666", fontSize: "14px", fontWeight: "500" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Store Link */}
            <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ color: DARK, margin: "0 0 4px", fontSize: "17px", fontWeight: "700" }}>🔗 Your Store Link</h3>
              <p style={{ color: "#888", margin: "0 0 16px", fontSize: "14px" }}>Share this with your customers</p>
              <div style={{ background: "#f8f7ff", borderRadius: "10px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1.5px solid #EEEDFE` }}>
                <span style={{ color: PURPLE, fontWeight: "600", fontSize: "14px" }}>
                  tajir.com/store/{storeName.toLowerCase().replace(/\s+/g, "-")}
                </span>
                <button
                  onClick={() => { navigator.clipboard.writeText(`tajir.com/store/${storeName.toLowerCase().replace(/\s+/g, "-")}`); alert("Copied!") }}
                  style={{ padding: "6px 16px", background: PURPLE, color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
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
            <h1 style={{ color: DARK, marginBottom: "32px", fontSize: "26px", fontWeight: "800" }}>Settings</h1>
            <p style={{ color: "#888" }}>Store settings coming soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard