import { useState } from "react"
import { supabase } from "./supabase"
import { t } from "./translations"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"

function SignUp({ onSuccess, onLogin, lang = "en" }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", storeName: "" })
  const [loading, setLoading] = useState(false)
  const txt = t[lang]
  const isArabic = lang === "ar"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.storeName) {
      alert("Please fill in all fields")
      return
    }
    setLoading(true)
    const { error } = await supabase
      .from("merchants")
      .insert([{
        name: form.name,
        email: form.email,
        password: form.password,
        store_name: form.storeName,
        slug: form.storeName.toLowerCase().replace(/\s+/g, '-')
      }])
    setLoading(false)
    if (error) {
      alert("Something went wrong: " + error.message)
    } else {
      onSuccess({ name: form.name, storeName: form.storeName })
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Segoe UI', Arial, sans-serif", direction: isArabic ? "rtl" : "ltr" }}>

      {/* Left Side */}
      <div style={{ width: "45%", background: "linear-gradient(160deg, #EEEDFE, #FAECE7)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "48px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `linear-gradient(135deg, ${PURPLE}, ${CORAL})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>T</span>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "22px", color: DARK }}>Tajir</span>
        </div>
        <h2 style={{ fontSize: "36px", fontWeight: "800", color: DARK, marginBottom: "16px", lineHeight: "1.2" }}>
          {txt.signUpTitle}
        </h2>
        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.8", marginBottom: "40px" }}>
          {txt.signUpSubtitle}
        </p>
        {[txt.checkFree, txt.checkAI, txt.checkLink, txt.checkPayments].map(item => (
          <p key={item} style={{ color: PURPLE, fontWeight: "600", fontSize: "15px", margin: "0 0 10px" }}>{item}</p>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", background: "white" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: DARK, margin: "0 0 8px" }}>{txt.createAccount}</h2>
          <p style={{ color: "#888", margin: "0 0 32px", fontSize: "15px" }}>{txt.getStoreLive}</p>

          {[
            { label: txt.yourName, name: "name", type: "text", placeholder: txt.namePlaceholder },
            { label: txt.email, name: "email", type: "email", placeholder: txt.emailPlaceholder },
            { label: txt.password, name: "password", type: "password", placeholder: txt.passwordPlaceholder },
            { label: txt.storeName, name: "storeName", type: "text", placeholder: txt.storeNamePlaceholder },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box", color: DARK }}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            style={{ width: "100%", padding: "14px", background: loading ? "#b0acf5" : CORAL, color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "8px" }}
          >
            {loading ? txt.creating : txt.createMyStore}
          </button>

          <p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginTop: "20px" }}>
            {txt.alreadyAccount}{" "}
            <span onClick={onLogin} style={{ color: PURPLE, cursor: "pointer", fontWeight: "600" }}>{txt.loginLink}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp