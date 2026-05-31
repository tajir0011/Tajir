import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Checkout from "./Checkout"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"

function StorePage({ storeName }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [page, setPage] = useState("store")

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

  if (page === "checkout") return (
    <Checkout cart={cart} storeName={storeName} onSuccess={() => setPage("success")} />
  )

  if (page === "success") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #EEEDFE, #FAECE7)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
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

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: "100vh", background: "#f8f7ff" }}>

      {/* Store Header */}
      <div style={{ background: DARK, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "white", margin: "0 0 4px", fontSize: "22px", fontWeight: "800" }}>{storeName}</h1>
          <p style={{ color: "#aaa", margin: 0, fontSize: "13px" }}>Powered by Tajir</p>
        </div>
        <button
          onClick={() => setShowCart(!showCart)}
          style={{ padding: "10px 20px", background: CORAL, color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px", position: "relative" }}
        >
          🛒 Cart
          {totalItems > 0 && (
            <span style={{ background: "white", color: CORAL, borderRadius: "50%", width: "20px", height: "20px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", marginLeft: "8px" }}>
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div style={{ display: "flex", gap: "24px", padding: "40px" }}>

        {/* Products */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: DARK, marginBottom: "24px", fontWeight: "800" }}>Our Products</h2>

          {products.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
              <p style={{ color: "#888" }}>No products yet in this store</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {products.map((product) => (
              <div key={product.id} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0eeff" }}>
                <div style={{ background: "#EEEDFE", padding: "32px", textAlign: "center", fontSize: "48px" }}>📦</div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ color: DARK, margin: "0 0 8px", fontWeight: "700", fontSize: "16px" }}>{product.name}</h3>
                  <p style={{ color: CORAL, fontWeight: "800", fontSize: "20px", margin: "0 0 16px" }}>SAR {product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    style={{ width: "100%", padding: "10px", background: PURPLE, color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        {showCart && (
          <div style={{ width: "320px", background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "fit-content", border: "1.5px solid #f0eeff" }}>
            <h3 style={{ color: DARK, margin: "0 0 24px", fontWeight: "800" }}>Your Cart 🛒</h3>

            {cart.length === 0 && (
              <p style={{ color: "#888", textAlign: "center", padding: "20px 0" }}>Your cart is empty</p>
            )}

            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <p style={{ margin: "0 0 4px", color: DARK, fontWeight: "600", fontSize: "14px" }}>{item.name}</p>
                  <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>x{item.qty}</p>
                </div>
                <p style={{ color: CORAL, fontWeight: "700", margin: 0 }}>SAR {item.price * item.qty}</p>
              </div>
            ))}

            {cart.length > 0 && (
              <div>
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
        )}
      </div>
    </div>
  )
}

export default StorePage