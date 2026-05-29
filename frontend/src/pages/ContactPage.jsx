import { useState } from "react";
import { C } from "../utils/constants";
import api from "../utils/api";

const SALON_EMAIL = "divyagurav7370@gmail.com";

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) { setError("Please enter a valid email address."); return; }

    setLoading(true);
    try {
      await api.post("/contact", form);
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send. Please email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${C.lavender},${C.cream})`, padding: "60px 24px 40px", textAlign: "center" }}>
        <h1 className="section-title">Get in Touch</h1>
        <p style={{ fontSize: 15, color: C.navy, opacity: 0.7 }}>We'd love to hear from you</p>
      </div>

      <div className="section">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, maxWidth: 900, margin: "0 auto" }}>

          {/* ── Contact Info ─────────────────────────────────────────── */}
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 32, color: C.purple, marginBottom: 28 }}>Visit Us</h2>

            {[
              { icon: "📍", label: "Address",  val: "Dukle Elite, St Inez Rd, next to Church,\nSt. Inez, Altinho, Panjim, Goa" },
              { icon: "📞", label: "Phone",    val: "+91 89998 85156" },
              { icon: "✉️", label: "Email",    val: SALON_EMAIL },
              { icon: "🕐", label: "Hours",    val: "Mon–Sun: 10 AM – 6 PM" },
            ].map((c) => (
              <div key={c.label} style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.purple, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.label}</div>
                  <div style={{ fontSize: 14, color: C.navy, opacity: 0.8, whiteSpace: "pre-line", lineHeight: 1.7 }}>{c.val}</div>
                </div>
              </div>
            ))}

            {/* Email Us button */}
            <a
              href={`mailto:${SALON_EMAIL}?subject=Enquiry from Website`}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 10, background: C.purple, color: "white",
                padding: "13px 28px", borderRadius: 30,
                textDecoration: "none", fontSize: 14, fontWeight: 600,
                boxShadow: `0 4px 14px ${C.purple}55`,
                transition: "transform 0.2s",
                marginTop: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
            >
              ✉️ &nbsp;Send us an Email
            </a>
          </div>

          {/* ── Contact Form ──────────────────────────────────────────── */}
          <div>
            {sent ? (
              <div style={{ background: `${C.pink}25`, borderRadius: 20, padding: "48px 40px", textAlign: "center" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 30, color: C.purple }}>Message Sent!</h3>
                <p style={{ color: C.navy, opacity: 0.7, marginTop: 8, lineHeight: 1.7 }}>
                  Thank you for reaching out!<br />
                  We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className="btn-outline"
                  style={{ marginTop: 20 }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Meera Sharma" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="meera@email.com" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} placeholder="How can we help you?" style={{ resize: "vertical" }} />
                </div>

                {error && (
                  <div style={{ background: "#fdecea", color: "#c62828", padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
                    {error}
                  </div>
                )}

                <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ padding: 14 }}>
                  {loading ? <span className="spinner-sm" /> : "Send Message ✉️"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
