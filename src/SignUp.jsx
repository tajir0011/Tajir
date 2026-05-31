import { useState } from "react"
import { supabase } from "./supabase"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"

function SignUp({ onSuccess, onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", storeName: "" })
  const [loading, setLoading] = useState(false)

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
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* Left Side */}
      <div style={{ width: "45%", background: `linear-gradient(160deg, #EEEDFE, #FAECE7)`, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "48px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `linear-gradient(135deg, ${PURPLE}, ${CORAL})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>T</span>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "22px", color: DARK }}>Tajir</span>
        </div>
        <h2 style={{ fontSize: "36px", fontWeight: "800", color: DARK, marginBottom: "16px", lineHeight: "1.2" }}>
          Start selling online today
        </h2>
        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.8", marginBottom: "40px" }}>
          Join thousands of merchants who use Tajir to build beautiful stores and grow their business.
        </p>
        {[
          "✓ Free forever plan",
          "✓ AI product descriptions",
          "✓ Your own store link",
          "✓ Saudi payments ready",
        ].map(item => (
          <p key={item} style={{ color: PURPLE, fontWeight: "600", fontSize: "15px", margin: "0 0 10px" }}>{item}</p>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", background: "white" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: DARK, margin: "0 0 8px" }}>Create your account</h2>
          <p style={{ color: "#888", margin: "0 0 32px", fontSize: "15px" }}>Get your store live in minutes</p>

          {[
            { label: "Your Name", name: "name", type: "text", placeholder: "e.g. Mohammed Al-Rashid" },
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
            { label: "Store Name", name: "storeName", type: "text", placeholder: "e.g. Luxe Abayas" },
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
            {loading ? "Creating your store..." : "Create My Store — It's Free →"}
          </button>

          <p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginTop: "20px" }}>
            Already have an account?{" "}
<span onClick={onLogin} style={{ color: PURPLE, cursor: "pointer", fontWeight: "600" }}>Log in</span>          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp