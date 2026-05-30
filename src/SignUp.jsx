import { useState } from "react"
import { supabase } from "./supabase"

function SignUp({ onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", storeName: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff, #ede9fe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h2 style={{ color: "#6C63FF", margin: "0 0 4px", fontSize: "28px" }}>Tajir</h2>
        <p style={{ color: "#888", margin: "0 0 32px" }}>Create your free store in minutes</p>

        {[
          { label: "Your Name", name: "name", type: "text", placeholder: "e.g. Mohammed Al-Rashid" },
          { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
          { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
          { label: "Store Name", name: "storeName", type: "text", placeholder: "e.g. Luxe Abayas" },
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
          onClick={handleSubmit}
          style={{ width: "100%", padding: "14px", background: loading ? "#b0acf5" : "#6C63FF", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}
        >
          {loading ? "Creating your store..." : "Create My Store — Its Free"}
        </button>

        <p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginTop: "20px" }}>
          Already have an account? <span style={{ color: "#6C63FF", cursor: "pointer" }}>Log in</span>
        </p>
      </div>
    </div>
  )
}

export default SignUp