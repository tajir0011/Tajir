import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Checkout from "./Checkout"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"
const PURPLE_LIGHT = "#EEEDFE"
const CORAL_LIGHT = "#FAECE7"

function StorePage({ storeName }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [page, setPage] = useState("store")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_name", storeName)
      if (!error) setProducts(data)
    }
    loadProducts()
  }, [storeName])

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const physicalProducts = products.filter(p => p.product_type === "physical" || !p.product_type)
  const digitalProducts = products.filter(p => p.product_type === "digital")
  const services = products.filter(p => p.product_type === "service")

  const filteredProducts = filter === "all" ? products :
    filter === "physical" ? physicalProducts :
    filter === "digital" ? digitalProducts : services

  if (page === "checkout") return (
    <Checkout cart={cart} storeName={storeName} onSuccess={() => setPage("success")} />
  )

  if (page === "success") return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${PURPLE_LIGHT}, ${CORAL_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "48px", textAlign: "center", maxWidth: "420px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ color: DARK, fontWeight: "800", marginBottom: "12px" }}>Order Placed!</h2>
        <p style={{ color: "#888", lineHeight: "1.7", marginBottom: "32px" }}>Thank you for your order from <strong style={{ color: PURPLE }}>{storeName}</strong>. We will contact you soon!</p>
        <button
          onClick={() => { setPage("store"); setCart([]) }}
          style={{ padding: "12px 32px", background: PURPLE, color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
        >
          Back to Store
        </button>
      </div>
    </div>
  )

  if (page === "booking" && selectedProduct) return (
    <BookingPage product={selectedProduct} storeName={storeName} onSuccess={() => setPage("booking-success")} onBack={() => setPage("store")} />
  )

  if (page === "booking-success") return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, #E1F5EE, white)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "48px", textAlign: "center", maxWidth: "420px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📅</div>
        <h2 style={{ color: DARK, fontWeight: "800", marginBottom: "12px" }}>Booking Confirmed!</h2>
        <p style={{ color: "#888", lineHeight: "1.7", marginBottom: "32px" }}>Your appointment at <strong style={{ color: "#1D9E75" }}>{storeName}</strong> has been booked. We'll contact you to confirm!</p>
        <button
          onClick={() => setPage("store")}
          style={{ padding: "12px 32px", background: "#1D9E75", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
        >
          Back to Store
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: "100vh", background: "#f8f7ff" }}>

      {/* Store Header */}
      <div style={{ background: DARK, padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "white", margin: "0 0 4px", fontSize: "22px", fontWeight: "800" }}>{storeName}</h1>
          <p style={{ color: "#aaa", margin: 0, fontSize: "13px" }}>Powered by Tajir</p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={() => setShowCart(!showCart)}
            style={{ padding: "10px 20px", background: CORAL, color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}
          >
            🛒 Cart ({totalItems})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {(digitalProducts.length > 0 || services.length > 0) && (
        <div style={{ background: "white", padding: "0 40px", borderBottom: "1px solid #f0f0f0", display: "flex", gap: "4px" }}>
          {[
            { key: "all", label: "All" },
            { key: "physical", label: "📦 Products" },
            ...(digitalProducts.length > 0 ? [{ key: "digital", label: "💻 Digital" }] : []),
            ...(services.length > 0 ? [{ key: "service", label: "📅 Services" }] : []),
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "14px 20px",
                background: "transparent",
                border: "none",
                borderBottom: filter === tab.key ? `2px solid ${PURPLE}` : "2px solid transparent",
                color: filter === tab.key ? PURPLE : "#888",
                fontWeight: filter === tab.key ? "700" : "400",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "24px", padding: "40px" }}>

        {/* Products Grid */}
        <div style={{ flex: 1 }}>
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
              <p style={{ color: "#888" }}>No products in this category yet</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0eeff" }}>
                
                <div style={{ background: PURPLE_LIGHT, height: "200px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "56px" }}>
                      {product.product_type === "digital" ? "💻" : product.product_type === "service" ? "📅" : "📦"}
                    </span>
                  )}
                </div>

                <div style={{ padding: "20px" }}>
                  <h3 style={{ color: DARK, margin: "0 0 6px", fontWeight: "700", fontSize: "16px" }}>{product.name}</h3>
                  {product.description && (
                    <p style={{ color: "#888", fontSize: "13px", margin: "0 0 12px", lineHeight: "1.5" }}>{product.description}</p>
                  )}
                  
                  {product.product_type === "service" && product.duration && (
                    <p style={{ color: "#1D9E75", fontSize: "13px", fontWeight: "600", margin: "0 0 8px" }}>⏱ {product.duration} min session</p>
                  )}

                  {product.stock === 0 && (
                    <p style={{ color: "#E24B4A", fontSize: "13px", fontWeight: "600", margin: "0 0 8px" }}>Out of stock</p>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <p style={{ color: CORAL, fontWeight: "800", fontSize: "20px", margin: 0 }}>SAR {product.price}</p>
                  </div>

                  {product.product_type === "service" ? (
                    <button
                      onClick={() => { setSelectedProduct(product); setPage("booking") }}
                      style={{ width: "100%", padding: "12px", background: "#1D9E75", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
                    >
                      📅 Book Appointment
                    </button>
                  ) : product.product_type === "digital" ? (
                    <button
                      onClick={() => addToCart(product)}
                      style={{ width: "100%", padding: "12px", background: CORAL, color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
                    >
                      💻 Buy Now
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      style={{ width: "100%", padding: "12px", background: product.stock === 0 ? "#ccc" : PURPLE, color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: product.stock === 0 ? "not-allowed" : "pointer" }}
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        {showCart && (
          <div style={{ width: "320px", background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "fit-content", border: "1.5px solid #f0eeff" }}>
            <h3 style={{ color: DARK, margin: "0 0 24px", fontWeight: "800" }}>Your Cart 🛒</h3>

            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <p style={{ margin: "0 0 4px", color: DARK, fontWeight: "600", fontSize: "14px" }}>{item.name}</p>
                  <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>x{item.qty}</p>
                </div>
                <p style={{ color: CORAL, fontWeight: "700", margin: 0 }}>SAR {item.price * item.qty}</p>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", paddingTop: "8px" }}>
              <strong style={{ color: DARK }}>Total</strong>
              <strong style={{ color: CORAL, fontSize: "18px" }}>SAR {totalPrice}</strong>
            </div>
            <button
              onClick={() => setPage("checkout")}
              style={{ width: "100%", padding: "14px", background: CORAL, color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
            >
              Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Booking Page Component
function BookingPage({ product, storeName, onSuccess, onBack }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "" })
  const [loading, setLoading] = useState(false)

  const days = product.available_days ? product.available_days.split(",") : []

  const handleBook = async () => {
    if (!form.name || !form.phone || !form.date || !form.time) {
      alert("Please fill in all fields")
      return
    }
    setLoading(true)
    const { error } = await supabase
      .from("appointments")
      .insert([{
        store_name: storeName,
        customer_name: form.name,
        customer_phone: form.phone,
        service_name: product.name,
        service_price: product.price,
        appointment_date: form.date,
        appointment_time: form.time,
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
      <div style={{ width: "45%", background: "linear-gradient(160deg, #E1F5EE, white)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "15px", marginBottom: "32px", textAlign: "left" }}>← Back</button>
        <h2 style={{ fontSize: "36px", fontWeight: "800", color: DARK, marginBottom: "16px" }}>{product.name}</h2>
        <p style={{ color: "#666", fontSize: "16px", marginBottom: "24px" }}>{product.description}</p>
        <div style={{ background: "white", borderRadius: "12px", padding: "20px" }}>
          <p style={{ color: "#1D9E75", fontWeight: "700", fontSize: "18px", margin: "0 0 8px" }}>SAR {product.price}</p>
          {product.duration && <p style={{ color: "#888", margin: "0 0 8px", fontSize: "14px" }}>⏱ {product.duration} minutes</p>}
          {days.length > 0 && <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>📅 Available: {days.join(", ")}</p>}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", background: "white" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: DARK, margin: "0 0 8px" }}>Book Appointment</h2>
          <p style={{ color: "#888", margin: "0 0 32px" }}>Fill in your details to book</p>

          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "e.g. Mohammed Al-Rashid" },
            { label: "Phone Number", name: "phone", type: "tel", placeholder: "e.g. 0512345678" },
            { label: "Preferred Date", name: "date", type: "date", placeholder: "" },
            { label: "Preferred Time", name: "time", type: "time", placeholder: "" },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          ))}

          <button
            onClick={handleBook}
            style={{ width: "100%", padding: "14px", background: loading ? "#aaa" : "#1D9E75", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}
          >
            {loading ? "Booking..." : "Confirm Booking →"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StorePage