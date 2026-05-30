import { useState } from "react"
import { supabase } from "./supabase"

function Login({ onSuccess }) {
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff, #ede9fe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        
        <h2 style={{ color: "#6C63FF", margin: "0 0 4px", fontSize: "28px" }}>Tajir</h2>
        <p style={{ color: "#888", margin: "0 0 32px" }}>Welcome back! Log in to your store</p>

        {[
          { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
          { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", color: "#555", marginBottom: "6px", fontWeight: "500" }}>
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        ))}

        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: "14px", background: loading ? "#b0acf5" : "#6C63FF", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

      </div>
    </div>
  )
}

export default Login