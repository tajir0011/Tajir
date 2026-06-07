import { useState, useEffect } from "react"
import { supabase } from "./supabase"

const PURPLE = "#534AB7"
const CORAL = "#D85A30"
const DARK = "#26215C"
const PURPLE_LIGHT = "#EEEDFE"
const CORAL_LIGHT = "#FAECE7"

const PRODUCT_TYPES = [
  {
    key: "physical",
    icon: "📦",
    title: "Physical Product",
    subtitle: "Ships to customer",
    color: PURPLE_LIGHT,
    border: PURPLE,
  },
  {
    key: "digital",
    icon: "💻",
    title: "Digital Product",
    subtitle: "Instant download",
    color: CORAL_LIGHT,
    border: CORAL,
  },
  {
    key: "service",
    icon: "📅",
    title: "Service / Appointment",
    subtitle: "Customer books a time",
    color: "#E1F5EE",
    border: "#1D9E75",
  },
]

function Products({ storeName }) {
  const [products, setProducts] = useState([])
  const [step, setStep] = useState("list")
  const [productType, setProductType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    imagePreview: null,
    stock: "",
    weight: "",
    downloadUrl: "",
    digitalFile: null,
    duration: "",
    availableDays: [],
  })

  useEffect(() => {
    loadProducts()
  }, [storeName])

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_name", storeName)
      .order("created_at", { ascending: false })
    if (!error) setProducts(data)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setForm({ ...form, image: file, imagePreview: URL.createObjectURL(file) })
  }

  const toggleDay = (day) => {
    const days = form.availableDays.includes(day)
      ? form.availableDays.filter(d => d !== day)
      : [...form.availableDays, day]
    setForm({ ...form, availableDays: days })
  }

  const handleSave = async () => {
    if (!form.name || !form.price) {
      alert("Please fill in product name and price")
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

    let digitalFileUrl = null
    if (form.digitalFile) {
      const fileName = `${storeName}-${Date.now()}-${form.digitalFile.name}`
      const { error: digitalUploadError } = await supabase.storage
        .from("digital-files")
        .upload(fileName, form.digitalFile)
      if (!digitalUploadError) {
        const { data: digitalUrlData } = supabase.storage
          .from("digital-files")
          .getPublicUrl(fileName)
        digitalFileUrl = digitalUrlData.publicUrl
      }
    }

    const { error } = await supabase
      .from("products")
      .insert([{
        store_name: storeName,
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        product_type: productType,
        image_url: imageUrl,
        stock: form.stock ? parseInt(form.stock) : null,
        weight: form.weight || null,
        download_url: digitalFileUrl || form.downloadUrl || null,
        duration: form.duration || null,
        available_days: form.availableDays.length > 0 ? form.availableDays.join(",") : null,
      }])

    setLoading(false)

    if (error) {
      alert("Error: " + error.message)
    } else {
      setStep("list")
      setForm({ name: "", price: "", description: "", image: null, imagePreview: null, stock: "", weight: "", downloadUrl: "", digitalFile: null, duration: "", availableDays: [] })
      loadProducts()
    }
  }

  const typeColor = (type) => {
    if (type === "physical") return { bg: PURPLE_LIGHT, color: PURPLE }
    if (type === "digital") return { bg: CORAL_LIGHT, color: CORAL }
    if (type === "service") return { bg: "#E1F5EE", color: "#1D9E75" }
    return { bg: "#f0f0f0", color: "#888" }
  }

  // STEP: LIST
  if (step === "list") return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ color: DARK, margin: "0 0 4px", fontSize: "26px", fontWeight: "800" }}>Products</h1>
          <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>{products.length} products in your store</p>
        </div>
        <button
          onClick={() => setStep("pick-type")}
          style={{ padding: "12px 28px", background: CORAL, color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", border: `2px dashed #EEEDFE` }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>📦</div>
          <h3 style={{ color: DARK, marginBottom: "8px", fontWeight: "700" }}>No products yet</h3>
          <p style={{ color: "#888", marginBottom: "24px" }}>Add your first product to start selling</p>
          <button
            onClick={() => setStep("pick-type")}
            style={{ padding: "12px 28px", background: PURPLE, color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
          >
            + Add Your First Product
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
        {products.map((product) => {
          const tc = typeColor(product.product_type)
          return (
            <div key={product.id} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0eeff" }}>
              <div style={{ background: "#EEEDFE", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "56px" }}>
                    {product.product_type === "physical" ? "📦" : product.product_type === "digital" ? "💻" : "📅"}
                  </span>
                )}
                <div style={{ position: "absolute", top: "12px", right: "12px", background: tc.bg, color: tc.color, padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                  {product.product_type}
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                <h3 style={{ color: DARK, margin: "0 0 6px", fontWeight: "700", fontSize: "16px" }}>{product.name}</h3>
                {product.description && <p style={{ color: "#888", fontSize: "13px", margin: "0 0 12px", lineHeight: "1.5" }}>{product.description}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: CORAL, fontWeight: "800", fontSize: "20px", margin: 0 }}>SAR {product.price}</p>
                  {product.stock !== null && (
                    <span style={{ color: product.stock > 0 ? "#1D9E75" : "#E24B4A", fontSize: "13px", fontWeight: "600" }}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  )}
                </div>
                {product.product_type === "service" && product.duration && (
                  <p style={{ color: "#888", fontSize: "13px", margin: "8px 0 0" }}>⏱ {product.duration} min</p>
                )}
                <button style={{ width: "100%", padding: "8px", background: PURPLE_LIGHT, color: PURPLE, border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginTop: "12px" }}>
                  Edit Product
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // STEP: PICK TYPE
  if (step === "pick-type") return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <button onClick={() => setStep("list")} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "15px" }}>
          ← Back
        </button>
        <h1 style={{ color: DARK, margin: 0, fontSize: "26px", fontWeight: "800" }}>What are you selling?</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", maxWidth: "800px" }}>
        {PRODUCT_TYPES.map((type) => (
          <div
            key={type.key}
            onClick={() => { setProductType(type.key); setStep("add-form") }}
            style={{ background: "white", border: `2px solid #f0eeff`, borderRadius: "16px", padding: "32px 24px", cursor: "pointer", textAlign: "center" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = type.border}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#f0eeff"}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>{type.icon}</div>
            <h3 style={{ color: DARK, margin: "0 0 8px", fontWeight: "700", fontSize: "18px" }}>{type.title}</h3>
            <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>{type.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  )

  // STEP: ADD FORM
  if (step === "add-form") {
    const currentType = PRODUCT_TYPES.find(t => t.key === productType)
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <button onClick={() => setStep("pick-type")} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "15px" }}>
            ← Back
          </button>
          <div>
            <h1 style={{ color: DARK, margin: "0 0 4px", fontSize: "26px", fontWeight: "800" }}>
              {currentType.icon} Add {currentType.title}
            </h1>
            <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>{currentType.subtitle}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "900px" }}>

          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1.5px solid #f0eeff" }}>
              <h3 style={{ color: DARK, margin: "0 0 16px", fontWeight: "700", fontSize: "15px" }}>Product Image</h3>
              <div style={{ border: "2px dashed #EEEDFE", borderRadius: "12px", padding: "32px", textAlign: "center", background: "#fafafa" }}>
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt="preview" style={{ maxHeight: "160px", borderRadius: "8px", objectFit: "cover" }} />
                ) : (
                  <div>
                    <div style={{ fontSize: "40px", marginBottom: "8px" }}>📸</div>
                    <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Upload a photo</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "12px", width: "100%" }} />
            </div>

            <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1.5px solid #f0eeff" }}>
              <h3 style={{ color: DARK, margin: "0 0 16px", fontWeight: "700", fontSize: "15px" }}>Basic Info</h3>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Handmade Abaya" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your product..." rows={4} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>Price (SAR) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 299" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {productType === "physical" && (
              <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1.5px solid #f0eeff" }}>
                <h3 style={{ color: DARK, margin: "0 0 16px", fontWeight: "700", fontSize: "15px" }}>📦 Shipping & Inventory</h3>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>Stock Quantity</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="e.g. 50" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>Weight (kg)</label>
                  <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 0.5" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
            )}

            {productType === "digital" && (
              <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1.5px solid #f0eeff" }}>
                <h3 style={{ color: DARK, margin: "0 0 16px", fontWeight: "700", fontSize: "15px" }}>💻 Digital Delivery</h3>
                <div style={{ border: "2px dashed #FAECE7", borderRadius: "12px", padding: "24px", textAlign: "center", background: "#fafafa" }}>
                  {form.digitalFile ? (
                    <div>
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
                      <p style={{ color: "#1D9E75", fontWeight: "600", margin: 0, fontSize: "14px" }}>{form.digitalFile.name}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: "4px 0 0" }}>{(form.digitalFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: "40px", marginBottom: "8px" }}>📁</div>
                      <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Upload your file</p>
                      <p style={{ color: "#aaa", margin: "4px 0 0", fontSize: "12px" }}>PDF, video, audio, zip — any format</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) setForm({ ...form, digitalFile: file })
                  }}
                  style={{ marginTop: "12px", width: "100%" }}
                />
                <p style={{ color: "#888", fontSize: "12px", margin: "8px 0 0" }}>Customer gets instant access after purchase</p>
              </div>
            )}

            {productType === "service" && (
              <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1.5px solid #f0eeff" }}>
                <h3 style={{ color: DARK, margin: "0 0 16px", fontWeight: "700", fontSize: "15px" }}>📅 Appointment Settings</h3>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>Duration (minutes)</label>
                  <input name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="e.g. 60" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "10px", fontWeight: "600" }}>Available Days</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        style={{
                          padding: "6px 14px",
                          background: form.availableDays.includes(day) ? "#1D9E75" : "transparent",
                          color: form.availableDays.includes(day) ? "white" : "#888",
                          border: `1.5px solid ${form.availableDays.includes(day) ? "#1D9E75" : "#e0e0e0"}`,
                          borderRadius: "20px",
                          fontSize: "13px",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              style={{ padding: "16px", background: loading ? "#b0acf5" : PURPLE, color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}
            >
              {loading ? "Saving..." : `Save ${currentType.title} →`}
            </button>

          </div>
        </div>
      </div>
    )
  }
}

export default Products