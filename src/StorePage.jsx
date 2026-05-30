import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Checkout from "./Checkout"

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
    <Checkout
      cart={cart}
      storeName={storeName}
      onSuccess={() => setPage("success")}
    />
  )

  if (page === "success") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff, #ede9fe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "40px", textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ color: "#6C63FF" }}>Order Placed!</h2>
        <p style={{ color: "#888" }}>Thank you for your order from <strong>{storeName}</strong>. We will contact you soon!</p>
        <button
          onClick={() => { setPage("store"); setCart([]) }}
          style={{ marginTop: "20px", padding: "12px 28px", background: "#6C63FF", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" }}
        >
          Back to Store
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#f8f7ff" }}>

      <div style={{ background: "#1a1a2e", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "white", margin: 0, fontSize: "24px" }}>{storeName}</h1>
        <button
          onClick={() => setShowCart(!showCart)}
          style={{ padding: "10px 20px", background: "#6C63FF", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}
        >
          🛒 Cart ({totalItems})
        </button>
      </div>

      <div style={{ display: "flex", gap: "24px", padding: "40px" }}>

        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#1a1a2e", marginBottom: "24px" }}>Our Products</h2>

          {products.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
              <p style={{ color: "#888" }}>No products yet in this store</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {products.map((product) => (
              <div key={product.id} style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px", textAlign: "center" }}>📦</div>
                <h3 style={{ color: "#1a1a2e", margin: "0 0 8px" }}>{product.name}</h3>
                <p style={{ color: "#6C63FF", fontWeight: "bold", fontSize: "18px", margin: "0 0 16px" }}>SAR {product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  style={{ width: "100%", padding: "10px", background: "#6C63FF", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {showCart && (
          <div style={{ width: "320px", background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "fit-content" }}>
            <h3 style={{ color: "#1a1a2e", margin: "0 0 24px" }}>Your Cart 🛒</h3>

            {cart.length === 0 && (
              <p style={{ color: "#888", textAlign: "center" }}>Your cart is empty</p>
            )}

            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <p style={{ margin: "0 0 4px", color: "#1a1a2e", fontWeight: "500" }}>{item.name}</p>
                  <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>x{item.qty}</p>
                </div>
                <p style={{ color: "#6C63FF", fontWeight: "bold", margin: 0 }}>SAR {item.price * item.qty}</p>
              </div>
            ))}

            {cart.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", paddingTop: "8px" }}>
                  <strong>Total</strong>
                  <strong style={{ color: "#6C63FF" }}>SAR {totalPrice}</strong>
                </div>
                <button
                  onClick={() => setPage("checkout")}
                  style={{ width: "100%", padding: "14px", background: "#6C63FF", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
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