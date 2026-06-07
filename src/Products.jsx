import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import AIWriter from "./AIWriter"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"

function Products({ storeName }) {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", price: "", image: null, imagePreview: null })

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, image: file, imagePreview: URL.createObjectURL(file) })
    }
  }

  const handleAddProduct = async () => {
    if (!form.name || !form.price) {
      alert("Please fill in the product name and price")
      return
    }
    setLoading(true)

    let imageUrl = null

    if (form.image) {
      const fileName = `${storeName}-${Date.now()}-${form.image.name}`
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, form.image)

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName)
        imageUrl = urlData.publicUrl
      }
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{
        name: form.name,
        price: parseFloat(form.price),
        store_name: storeName,
        image_url: imageUrl
      }])
      .select()

    setLoading(false)

    if (error) {
      alert("Error: " + error.message)
    } else {
      setProducts([...products, data[0]])
      setForm({ name: "", price: "", image: null, imagePreview: null })
      setShowForm(false)
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ color: DARK, margin: "0 0 4px", fontSize: "26px", fontWeight: "800" }}>Products</h1>
          <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>{products.length} products in your store</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: "10px 24px", background: CORAL, color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
        >
          + Add Product
        </button>
      </div>

      <AIWriter onUseDescription={(name) => {
        setForm({ ...form, name: name })
        setShowForm(true)
      }} />

      {showForm && (
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", marginBottom: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: `1.5px solid #EEEDFE` }}>
          <h3 style={{ margin: "0 0 24px", color: DARK, fontWeight: "700" }}>New Product</h3>

          {/* Image Upload */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>
              Product Image
            </label>
            <div style={{ border: "2px dashed #EEEDFE", borderRadius: "12px", padding: "24px", textAlign: "center", background: form.imagePreview ? "transparent" : "#fafafa" }}>
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="preview" style={{ maxHeight: "160px", borderRadius: "8px", objectFit: "cover" }} />
              ) : (
                <div>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>📸</div>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Select a photo below</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: "10px", width: "100%" }}
            />
          </div>

          {[
            { label: "Product Name", name: "name", type: "text", placeholder: "e.g. Handmade Abaya" },
            { label: "Price (SAR)", name: "price", type: "number", placeholder: "e.g. 299" },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              onClick={handleAddProduct}
              style={{ padding: "12px 28px", background: loading ? "#b0acf5" : PURPLE, color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ padding: "12px 28px", background: "transparent", color: "#888", border: "1.5px solid #e0e0e0", borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {products.length === 0 && !showForm && (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
          <h3 style={{ color: DARK, marginBottom: "8px", fontWeight: "700" }}>No products yet</h3>
          <p style={{ color: "#888" }}>Click "Add Product" to add your first product</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0eeff" }}>
            <div style={{ background: "#EEEDFE", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "48px" }}>📦</span>
              )}
            </div>
            <div style={{ padding: "20px" }}>
              <h3 style={{ color: DARK, margin: "0 0 8px", fontWeight: "700", fontSize: "16px" }}>{product.name}</h3>
              <p style={{ color: CORAL, fontWeight: "800", fontSize: "20px", margin: "0 0 16px" }}>SAR {product.price}</p>
              <button style={{ width: "100%", padding: "8px", background: "#EEEDFE", color: PURPLE, border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Edit Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products