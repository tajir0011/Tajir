import { useState, useEffect } from "react"
import SignUp from "./SignUp"
import Login from "./Login"
import Dashboard from "./Dashboard"
import StorePage from "./StorePage"
import { supabase } from "./supabase"
import { t } from "./translations"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const PURPLE_LIGHT = "#EEEDFE"
const CORAL_LIGHT = "#FAECE7"
const DARK = "#26215C"
const isMobile = window.innerWidth < 768

function App() {
  const [page, setPage] = useState("home")
  const [merchant, setMerchant] = useState(null)
  const [storeData, setStoreData] = useState(null)
  const [lang, setLang] = useState("en")
  const txt = t[lang]
  const isArabic = lang === "ar"

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
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", margin: 0, padding: 0, color: DARK, direction: isArabic ? "rtl" : "ltr" }}>

      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 20px" : "20px 60px", background: "white", boxShadow: "0 1px 0 #ede9fe" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${PURPLE}, ${CORAL})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>T</span>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "20px", color: DARK }}>Tajir</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{ padding: "7px 14px", background: isArabic ? PURPLE : "transparent", border: `2px solid ${PURPLE}`, color: isArabic ? "white" : PURPLE, borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
            {isArabic ? "EN" : "عربي"}
          </button>
          <button onClick={() => setPage("login")} style={{ padding: isMobile ? "7px 14px" : "8px 20px", background: "transparent", border: `2px solid ${PURPLE}`, color: PURPLE, borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>{txt.login}</button>
          <button onClick={() => setPage("signup")} style={{ padding: isMobile ? "7px 14px" : "8px 20px", background: CORAL, border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>{txt.getStarted}</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: isMobile ? "60px 24px 40px" : "120px 20px 80px", background: `linear-gradient(160deg, ${PURPLE_LIGHT} 0%, white 50%, ${CORAL_LIGHT} 100%)` }}>
        <div style={{ display: "inline-block", background: CORAL_LIGHT, color: CORAL, padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", marginBottom: "24px" }}>
          {txt.badge}
        </div>
        <h1 style={{ fontSize: isMobile ? "32px" : "56px", fontWeight: "800", color: DARK, marginBottom: "20px", lineHeight: "1.15" }}>
          {txt.heroTitle1}<br />
          <span style={{ color: CORAL }}>{txt.heroTitle2}</span>
        </h1>
        <p style={{ fontSize: isMobile ? "16px" : "20px", color: "#666", marginBottom: "48px", maxWidth: "560px", margin: "0 auto 48px" }}>
          {txt.heroSubtitle}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("signup")} style={{ padding: isMobile ? "14px 28px" : "16px 40px", background: PURPLE, color: "white", border: "none", borderRadius: "12px", fontSize: isMobile ? "15px" : "17px", cursor: "pointer", fontWeight: "700" }}>
            {txt.createStoreFree}
          </button>
          <button onClick={() => setPage("login")} style={{ padding: isMobile ? "14px 28px" : "16px 40px", background: "white", color: DARK, border: `2px solid #e0e0e0`, borderRadius: "12px", fontSize: isMobile ? "15px" : "17px", cursor: "pointer", fontWeight: "600" }}>
            {txt.logIn}
          </button>
        </div>
        <p style={{ color: "#aaa", marginTop: "16px", fontSize: "14px" }}>{txt.noCard}</p>
      </div>

      {/* Features */}
      <div style={{ padding: isMobile ? "40px 20px" : "80px 60px", background: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: isMobile ? "26px" : "36px", fontWeight: "800", color: DARK, marginBottom: "40px" }}>
          {txt.everythingYouNeed}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", maxWidth: "1100px", margin: "0 auto" }}>
          {[
            { icon: "🤖", title: txt.feature1Title, desc: txt.feature1Desc, color: PURPLE_LIGHT },
            { icon: "🛡️", title: txt.feature2Title, desc: txt.feature2Desc, color: CORAL_LIGHT },
            { icon: "🇸🇦", title: txt.feature3Title, desc: txt.feature3Desc, color: PURPLE_LIGHT },
            { icon: "⚡", title: txt.feature4Title, desc: txt.feature4Desc, color: CORAL_LIGHT },
          ].map((f) => (
            <div key={f.title} style={{ background: f.color, borderRadius: "16px", padding: "28px" }}>
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ color: DARK, margin: "0 0 10px", fontSize: "17px", fontWeight: "700" }}>{f.title}</h3>
              <p style={{ color: "#666", lineHeight: "1.7", margin: 0, fontSize: "15px" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: isMobile ? "40px 24px" : "80px 60px", background: DARK, textAlign: "center" }}>
        <h2 style={{ fontSize: isMobile ? "26px" : "40px", fontWeight: "800", color: "white", marginBottom: "16px" }}>
          {txt.readyToBuild}
        </h2>
        <p style={{ color: "#aaa", fontSize: isMobile ? "15px" : "18px", marginBottom: "40px" }}>{txt.joinMerchants}</p>
        <button onClick={() => setPage("signup")} style={{ padding: isMobile ? "14px 32px" : "16px 48px", background: CORAL, color: "white", border: "none", borderRadius: "12px", fontSize: isMobile ? "15px" : "18px", cursor: "pointer", fontWeight: "700" }}>
          {txt.startFree}
        </button>
      </div>

      {/* Footer */}
      <div style={{ padding: isMobile ? "24px 20px" : "32px 60px", background: "#1a1530", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ color: "#666", fontSize: "13px" }}>{txt.rights}</span>
        <span style={{ color: "#666", fontSize: "13px" }}>{txt.builtFor}</span>
      </div>

    </div>
  )
}

export default App