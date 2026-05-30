import { useState } from "react"
import { supabase } from "./supabase"

function Checkout({ cart, storeName, onSuccess }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" })
  const [loading, setLoading] = useState(false)

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill in all fields")
      return
    }
    setLoading(true)

    const { error } = await supabase
      .from("orders")
      .insert([{
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        store_name: storeName,
        items: JSON.stringify(cart),
        total: totalPrice,
        status: "pending"
      }])

    setLoading(false)

    if (error) {
      alert("Error: " + error.message)
    } else {
      onSuccess()
    }
  }

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff, #ede9fe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "480px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        
        <h2 style={{ color: "#1a1a2e", margin: "0 0 8px" }}>Complete Your Order</h2>
        <p style={{ color: "#888", margin: "0 0 32px" }}>from <strong>{storeName}</strong></p>

        {/* Order Summary */}
        <div style={{ background: "#f8f7ff", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <h4 style={{ margin: "0 0 12px", color: "#1a1a2e" }}>Order Summary</h4>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#555" }}>{item.name} x{item.qty}</span>
              <span style={{ color: "#6C63FF", fontWeight: "bold" }}>SAR {item.price * item.qty}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e0e0e0", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
            <strong>Total</strong>
            <strong style={{ color: "#6C63FF" }}>SAR {totalPrice}</strong>
          </div>
        </div>

        {/* Customer Info */}
        {[
          { label: "Full Name", name: "name", type: "text", placeholder: "e.g. Mohammed Al-Rashid" },
          { label: "Phone Number", name: "phone", type: "tel", placeholder: "e.g. 0512345678" },
          { label: "Delivery Address", name: "address", type: "text", placeholder: "e.g. Riyadh, Al Olaya, Street 5" },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "16px" }}>
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
          onClick={handleOrder}
          style={{ width: "100%", padding: "14px", background: loading ? "#b0acf5" : "#6C63FF", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}
        >
          {loading ? "Placing Order..." : "Place Order 🎉"}
        </button>

        <p style={{ textAlign: "center", color: "#888", fontSize: "12px", marginTop: "16px" }}>
          Payment on delivery — you will pay when your order arrives
        </p>

      </div>
    </div>
  )
}

export default Checkout