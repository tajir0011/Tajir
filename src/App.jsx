import { useState, useEffect } from "react"
import SignUp from "./SignUp"
import Login from "./Login"
import Dashboard from "./Dashboard"
import StorePage from "./StorePage"
import { supabase } from "./supabase"

function App() {
  const [page, setPage] = useState("home")
  const [merchant, setMerchant] = useState(null)
  const [storeData, setStoreData] = useState(null)

  useEffect(() => {
    const path = window.location.pathname
    if (path.startsWith("/store/")) {
      const slug = path.replace("/store/", "")
      loadStore(slug)
    }
  }, [])

  const loadStore = async (slug) => {
    const { data, error } = await supabase
      .from("merchants")
      .select("*")
      .eq("slug", slug)
      .single()
    if (!error && data) {
      setStoreData(data)
      setPage("publicstore")
    } else {
      setPage("notfound")
    }
  }

  if (page === "publicstore" && storeData) return <StorePage storeName={storeData.store_name} />
  if (page === "notfound") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "60px", marginBottom: "16px" }}>😕</div>
        <h2 style={{ color: "#1a1a2e" }}>Store not found</h2>
        <p style={{ color: "#888" }}>This store doesn't exist on Tajir</p>
      </div>
    </div>
  )
  if (page === "dashboard") return <Dashboard storeName={merchant.storeName} merchantName={merchant.name} />
  if (page === "signup") return <SignUp onSuccess={(data) => { setMerchant(data); setPage("dashboard") }} />
  if (page === "login") return <Login onSuccess={(data) => { setMerchant(data); setPage("dashboard") }} />

  return (
    <div style={{ fontFamily: "Arial", margin: 0, padding: 0 }}>

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <h2 style={{ color: "#6C63FF", margin: 0 }}>Tajir</h2>
        <div style={{ display: "flex", gap: "16px" }}>
          <button onClick={() => setPage("login")} style={{ padding: "8px 20px", background: "transparent", border: "2px solid #6C63FF", color: "#6C63FF", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Login</button>
          <button onClick={() => setPage("signup")} style={{ padding: "8px 20px", background: "#6C63FF", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Sign Up Free</button>
        </div>
      </nav>

      <div style={{ textAlign: "center", padding: "100px 20px", background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
        <h1 style={{ fontSize: "48px", color: "#1a1a2e", marginBottom: "16px" }}>
          Build Your Online Store <br /> in Minutes
        </h1>
        <p style={{ fontSize: "20px", color: "#555", marginBottom: "40px" }}>
          The smartest Arabic e-commerce platform — powered by AI
        </p>
        <button onClick={() => setPage("signup")} style={{ padding: "16px 40px", background: "#6C63FF", color: "white", border: "none", borderRadius: "12px", fontSize: "18px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 15px rgba(108,99,255,0.4)" }}>
          Create Your Store — It's Free
        </button>
        <p style={{ color: "#888", marginTop: "16px" }}>No credit card needed</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "32px", padding: "80px 40px", flexWrap: "wrap" }}>
        {[
          { icon: "🤖", title: "AI Powered", desc: "AI builds your store, writes your products, and grows your sales" },
          { icon: "🛡️", title: "Buyer Protection", desc: "Every order is protected. Money releases only after delivery" },
          { icon: "🇸🇦", title: "Built for Saudi", desc: "Mada, STC Pay, Apple Pay, Arabic — all built in from day one" },
        ].map((f) => (
          <div key={f.title} style={{ background: "#fff", borderRadius: "16px", padding: "32px", width: "260px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>{f.icon}</div>
            <h3 style={{ color: "#1a1a2e", marginBottom: "8px" }}>{f.title}</h3>
            <p style={{ color: "#777", lineHeight: "1.6" }}>{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default App