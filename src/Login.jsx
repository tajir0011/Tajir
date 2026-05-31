import { useState } from "react"
import { supabase } from "./supabase"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"

function Login({ onSuccess, onSignUp }) {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please fill in all fields")
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from("merchants")
      .select("*")
      .eq("email", form.email)
      .eq("password", form.password)
      .single()
    setLoading(false)
    if (error || !data) {
      alert("Wrong email or password. Please try again!")
    } else {
      onSuccess({ name: data.name, storeName: data.store_name })
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* Left Side */}
      <div style={{ width: "45%", background: "linear-gradient(160deg, #EEEDFE, #FAECE7)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "48px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg, #534AB7, #D85A30)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>T</span>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "22px", color: DARK }}>Tajir</span>
        </div>
        <h2 style={{ fontSize: "36px", fontWeight: "800", color: DARK, marginBottom: "16px", lineHeight: "1.2" }}>
          Welcome back to Tajir
        </h2>
        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.8" }}>
          Log in to manage your store, view your orders, and grow your business.
        </p>
      </div>

      {/* Right Side */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", background: "white" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: DARK, margin: "0 0 8px" }}>Log in to your store</h2>
          <p style={{ color: "#888", margin: "0 0 32px", fontSize: "15px" }}>Enter your details below</p>

          {[
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
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
            onClick={handleLogin}
            style={{ width: "100%", padding: "14px", background: loading ? "#b0acf5" : PURPLE, color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "8px" }}
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>

          <p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginTop: "20px" }}>
            Don't have an account?{" "}
            <span onClick={onSignUp} style={{ color: CORAL, cursor: "pointer", fontWeight: "600" }}>Sign up free</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login