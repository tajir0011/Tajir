import { useState } from "react"
import { supabase } from "./supabase"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"

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
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* Left Side - Order Summary */}
      <div style={{ width: "45%", background: "linear-gradient(160deg, #EEEDFE, #FAECE7)", padding: "60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "48px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `linear-gradient(135deg, ${PURPLE}, ${CORAL})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>T</span>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "22px", color: DARK }}>Tajir</span>
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: "800", color: DARK, margin: "0 0 8px" }}>Order Summary</h2>
        <p style={{ color: "#666", margin: "0 0 32px", fontSize: "15px" }}>from <strong style={{ color: PURPLE }}>{storeName}</strong></p>

        <div style={{ background: "white", borderRadius: "16px", padding: "24px" }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
              <div>
                <p style={{ margin: "0 0 4px", color: DARK, fontWeight: "600", fontSize: "15px" }}>{item.name}</p>
                <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>Qty: {item.qty}</p>
              </div>
              <p style={{ color: CORAL, fontWeight: "700", margin: 0, fontSize: "16px" }}>SAR {item.price * item.qty}</p>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px" }}>
            <strong style={{ color: DARK, fontSize: "17px" }}>Total</strong>
            <strong style={{ color: CORAL, fontSize: "22px" }}>SAR {totalPrice}</strong>
          </div>
        </div>
      </div>

      {/* Right Side - Customer Info */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", background: "white" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: DARK, margin: "0 0 8px" }}>Complete Your Order</h2>
          <p style={{ color: "#888", margin: "0 0 32px", fontSize: "15px" }}>Enter your delivery details</p>

          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "e.g. Mohammed Al-Rashid" },
            { label: "Phone Number", name: "phone", type: "tel", placeholder: "e.g. 0512345678" },
            { label: "Delivery Address", name: "address", type: "text", placeholder: "e.g. Riyadh, Al Olaya, Street 5" },
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
            onClick={handleOrder}
            style={{ width: "100%", padding: "14px", background: loading ? "#b0acf5" : CORAL, color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "8px" }}
          >
            {loading ? "Placing Order..." : "Place Order 🎉"}
          </button>

          <p style={{ textAlign: "center", color: "#aaa", fontSize: "13px", marginTop: "16px" }}>
            🛡️ Payment on delivery — you pay when your order arrives
          </p>
        </div>
      </div>
    </div>
  )
}

export default Checkout