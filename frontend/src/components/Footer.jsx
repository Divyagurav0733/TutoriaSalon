import { Link } from "react-router-dom";
import { C } from "../utils/constants";

const LINKS = ["about", "services", "stylists", "history", "contact"];

export default function Footer() {
  return (
    <footer style={{ background: C.dark, color: "white", padding: "56px 24px 28px", position: "relative", overflow: "hidden" }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle,${C.rose}18,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle,${C.mauve}20,transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: `linear-gradient(135deg,${C.rose},${C.mauve})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700,
              }}>T</div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: C.blush, letterSpacing: 0.5 }}>Tutoria</span>
            </div>
            <p style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.9, maxWidth: 220 }}>
              Your premier destination for luxury hair & beauty services in Panjim Goa. Where artistry meets excellence.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {["𝕏", "ƒ", "📸"].map((ic, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.rose; e.currentTarget.style.borderColor = C.rose; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >{ic}</div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p style={{ fontWeight: 600, marginBottom: 18, fontSize: 11, opacity: 0.45, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'Inter',sans-serif" }}>Quick Links</p>
            {LINKS.map((p) => (
              <Link key={p} to={`/${p}`}
                style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 12, textDecoration: "none", transition: "all 0.2s", fontFamily: "'Inter',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.color = C.blush; e.currentTarget.style.paddingLeft = "6px"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.paddingLeft = "0"; }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.rose, flexShrink: 0 }} />
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontWeight: 600, marginBottom: 18, fontSize: 11, opacity: 0.45, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'Inter',sans-serif" }}>Contact Us</p>
            {[
              { icon: "📍", text: "Dukle Elite, St Inez Rd, next to Church, St. Inez, Altinho,Panjim, Goa" },
              { icon: "📞", text: "+91 89998 85156" },
              { icon: "✉️", text: "divyagurav7370@gmail.com" },
              { icon: "🕐", text: "Mon–Sat: 9 AM – 8 PM" },
              { icon: "🕐", text: "Sunday: 10 AM – 6 PM" },
            ].map(({ icon, text }) => (
              <p key={text} style={{ fontSize: 13, opacity: 0.5, marginBottom: 10, lineHeight: 1.6, display: "flex", gap: 8, fontFamily: "'Inter',sans-serif" }}>
                <span>{icon}</span><span>{text}</span>
              </p>
            ))}
          </div>

          {/* Book CTA */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: C.blush, marginBottom: 8, fontStyle: "italic", lineHeight: 1.4 }}>
              Ready for your transformation?
            </p>
            <p style={{ fontSize: 13, opacity: 0.45, marginBottom: 20, fontFamily: "'Inter',sans-serif" }}>
              Book with our expert stylists today.
            </p>
            <Link to="/book" style={{
              background: `linear-gradient(135deg,${C.rose},${C.mauve})`,
              color: "white", padding: "13px 24px", borderRadius: 50,
              textAlign: "center", fontWeight: 500, fontSize: 14,
              textDecoration: "none", transition: "all 0.3s",
              display: "inline-block",
              boxShadow: `0 6px 20px rgba(183,93,105,0.4)`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 28px rgba(183,93,105,0.5)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 6px 20px rgba(183,93,105,0.4)`; }}>
              Book Appointment 
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, opacity: 0.3, fontFamily: "'Inter',sans-serif" }}>© 2026 Tutoria Salon, Panjim Goa. All rights reserved.</p>
          <p style={{ fontSize: 12, opacity: 0.3, fontFamily: "'Inter',sans-serif" }}>Crafted with ✦ for our valued clients</p>
        </div>
      </div>
    </footer>
  );
}
