import { useState, useEffect } from "react"
import SignUp from "./SignUp"
import Login from "./Login"
import Dashboard from "./Dashboard"
import StorePage from "./StorePage"
import { supabase } from "./supabase"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const PURPLE_LIGHT = "#EEEDFE"
const CORAL_LIGHT = "#FAECE7"
const DARK = "#26215C"

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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "60px", marginBottom: "16px" }}>😕</div>
        <h2 style={{ color: DARK }}>Store not found</h2>
        <p style={{ color: "#888" }}>This store doesn't exist on Tajir</p>
      </div>
    </div>
  )
  if (page === "dashboard") return <Dashboard storeName={merchant.storeName} merchantName={merchant.name} />
  if (page === "signup") return <SignUp onSuccess={(data) => { setMerchant(data); setPage("dashboard") }} onLogin={() => setPage("login")} />
  if (page === "login") return <Login onSuccess={(data) => { setMerchant(data); setPage("dashboard") }} onSignUp={() => setPage("signup")} />
  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", margin: 0, padding: 0, color: DARK }}>

      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", background: "white", boxShadow: "0 1px 0 #ede9fe" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${PURPLE}, ${CORAL})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>T</span>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "20px", color: DARK }}>Tajir</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={() => setPage("login")} style={{ padding: "8px 20px", background: "transparent", border: `2px solid ${PURPLE}`, color: PURPLE, borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>Login</button>
          <button onClick={() => setPage("signup")} style={{ padding: "8px 20px", background: CORAL, border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "120px 20px 80px", background: `linear-gradient(160deg, ${PURPLE_LIGHT} 0%, white 50%, ${CORAL_LIGHT} 100%)` }}>
        <div style={{ display: "inline-block", background: CORAL_LIGHT, color: CORAL, padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", marginBottom: "24px" }}>
          🚀 The future of Arabic e-commerce
        </div>
        <h1 style={{ fontSize: "56px", fontWeight: "800", color: DARK, marginBottom: "20px", lineHeight: "1.15" }}>
          Build your store.<br />
          <span style={{ color: CORAL }}>Powered by AI.</span>
        </h1>
        <p style={{ fontSize: "20px", color: "#666", marginBottom: "48px", maxWidth: "560px", margin: "0 auto 48px" }}>
          The smartest e-commerce platform for Arab merchants — launch in minutes, sell everywhere.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("signup")} style={{ padding: "16px 40px", background: PURPLE, color: "white", border: "none", borderRadius: "12px", fontSize: "17px", cursor: "pointer", fontWeight: "700" }}>
            Create Your Store Free →
          </button>
          <button onClick={() => setPage("login")} style={{ padding: "16px 40px", background: "white", color: DARK, border: `2px solid #e0e0e0`, borderRadius: "12px", fontSize: "17px", cursor: "pointer", fontWeight: "600" }}>
            Log In
          </button>
        </div>
        <p style={{ color: "#aaa", marginTop: "16px", fontSize: "14px" }}>No credit card needed · Free forever plan</p>
      </div>

      {/* Features */}
      <div style={{ padding: "80px 60px", background: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "800", color: DARK, marginBottom: "56px" }}>
          Everything you need to sell online
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", maxWidth: "1100px", margin: "0 auto" }}>
          {[
            { icon: "🤖", title: "AI Powered", desc: "AI writes your product descriptions, builds your store, and helps you grow sales automatically.", color: PURPLE_LIGHT },
            { icon: "🛡️", title: "Buyer Protection", desc: "Every order is protected. Money only releases to merchants after the buyer confirms delivery.", color: CORAL_LIGHT },
            { icon: "🇸🇦", title: "Built for Saudi", desc: "Mada, STC Pay, Apple Pay, and Arabic — all built in from day one, not an afterthought.", color: PURPLE_LIGHT },
            { icon: "⚡", title: "Launch in Minutes", desc: "Sign up, add your products, and share your store link. No technical skills needed.", color: CORAL_LIGHT },
          ].map((f) => (
            <div key={f.title} style={{ background: f.color, borderRadius: "16px", padding: "32px", transition: "transform 0.2s" }}>
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ color: DARK, margin: "0 0 10px", fontSize: "18px", fontWeight: "700" }}>{f.title}</h3>
              <p style={{ color: "#666", lineHeight: "1.7", margin: 0, fontSize: "15px" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "80px 60px", background: DARK, textAlign: "center" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "800", color: "white", marginBottom: "16px" }}>
          Ready to build your store?
        </h2>
        <p style={{ color: "#aaa", fontSize: "18px", marginBottom: "40px" }}>Join thousands of merchants selling smarter with Tajir</p>
        <button onClick={() => setPage("signup")} style={{ padding: "16px 48px", background: CORAL, color: "white", border: "none", borderRadius: "12px", fontSize: "18px", cursor: "pointer", fontWeight: "700" }}>
          Start For Free →
        </button>
      </div>

      {/* Footer */}
      <div style={{ padding: "32px 60px", background: "#1a1530", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#666", fontSize: "14px" }}>© 2026 Tajir. All rights reserved.</span>
        <span style={{ color: "#666", fontSize: "14px" }}>Built with ❤️ for Arab merchants</span>
      </div>

    </div>
  )
}

export default App
