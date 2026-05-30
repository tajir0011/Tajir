import { useState } from "react"

const ANTHROPIC_API_KEY = "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"

function AIWriter({ onUseDescription }) {
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const generateDescription = async () => {
    if (!productName) {
      alert("Please enter a product name first")
      return
    }
    setLoading(true)
    setDescription("")

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `Write a short, attractive product description for an Arabic e-commerce store for this product: "${productName}". 
              Write it in English. Make it 2-3 sentences, exciting, and focused on benefits. No bullet points.`
            }
          ]
        })
      })

      const data = await response.json()
console.log("API response:", data)
if (data.content && data.content[0]) {
  setDescription(data.content[0].text)
} else {
  alert("API Error: " + JSON.stringify(data))
}
    } catch (error) {
      alert("Error generating description: " + error.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "32px", marginBottom: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "2px solid #6C63FF" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <span style={{ fontSize: "28px" }}>🤖</span>
        <h3 style={{ margin: 0, color: "#1a1a2e" }}>AI Description Writer</h3>
        <span style={{ background: "#ede9fe", color: "#6C63FF", fontSize: "12px", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>Powered by Claude</span>
      </div>

      <p style={{ color: "#888", marginBottom: "20px", fontSize: "14px" }}>Type your product name and let AI write a beautiful description for you!</p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="e.g. Handmade Leather Wallet"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{ flex: 1, padding: "12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "15px", outline: "none" }}
        />
        <button
          onClick={generateDescription}
          style={{ padding: "12px 24px", background: loading ? "#b0acf5" : "#6C63FF", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          {loading ? "Writing..." : "✨ Generate"}
        </button>
      </div>

      {description && (
        <div style={{ background: "#f8f7ff", borderRadius: "10px", padding: "16px", marginTop: "16px" }}>
          <p style={{ margin: "0 0 12px", color: "#1a1a2e", lineHeight: "1.7" }}>{description}</p>
          <button
            onClick={() => onUseDescription(productName, description)}
            style={{ padding: "8px 20px", background: "#6C63FF", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
          >
            Use This Description ✓
          </button>
        </div>
      )}
    </div>
  )
}

export default AIWriter