import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { C } from "../utils/constants";
import { stylistAPI } from "../utils/api";

export default function HomePage() {
  const [stylists, setStylists] = useState([]);

  useEffect(() => {
    stylistAPI.getAll().then(r => setStylists(r.data.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div style={{ background: "#f5ede9" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        background: `linear-gradient(150deg, ${C.dark} 0%, #2d1f3d 45%, #3d2035 100%)`,
        display: "flex", alignItems: "center",
        padding: "100px 24px 60px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Ambient blobs */}
        <div style={{ position:"absolute", top:"10%", right:"8%", width:440, height:440, borderRadius:"50%", background:`radial-gradient(circle,${C.rose}22,transparent 65%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"5%", left:"5%", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle,${C.mauve}28,transparent 65%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle,rgba(183,93,105,0.06),transparent 60%)`, pointerEvents:"none" }} />

        <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"flex", alignItems:"center", gap:60, flexWrap:"wrap", position:"relative", zIndex:1 }}>

          {/* Left copy */}
          <div style={{ flex:"1 1 420px" }} className="fade-in-up">
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(183,93,105,0.15)", border:"1px solid rgba(183,93,105,0.3)", borderRadius:50, padding:"7px 18px", marginBottom:28 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:C.rose }} />
              <span style={{ fontSize:11, color:C.blush, fontWeight:500, letterSpacing:2, textTransform:"uppercase" }}>Premium Salon Experience</span>
            </div>

            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(40px,5.5vw,72px)", fontWeight:400, lineHeight:1.1, color:"white", marginBottom:20 }}>
              Discover Your<br />
              <em style={{ fontWeight:600, color:C.blush }}>True Beauty</em>
            </h1>

            <p style={{ fontSize:16, lineHeight:1.9, color:"rgba(255,255,255,0.6)", maxWidth:440, marginBottom:38, fontFamily:"'Inter',sans-serif", fontWeight:300 }}>
              Experience luxury hair & beauty treatments crafted by our award-winning stylists. Book your personalised session today.
            </p>

            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <Link to="/book" style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:`linear-gradient(135deg,${C.rose},${C.mauve})`,
                color:"white", padding:"14px 32px", borderRadius:50,
                fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500,
                textDecoration:"none",
                boxShadow:`0 8px 28px rgba(183,93,105,0.45)`,
                transition:"all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 14px 36px rgba(183,93,105,0.55)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=`0 8px 28px rgba(183,93,105,0.45)`; }}>
                Book Appointment 
              </Link>
              <Link to="/services" style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.85)",
                border:"1px solid rgba(255,255,255,0.18)", padding:"14px 28px", borderRadius:50,
                fontFamily:"'Inter',sans-serif", fontSize:14,
                textDecoration:"none", transition:"all 0.3s", backdropFilter:"blur(8px)",
              }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}>
                Explore Services
              </Link>
            </div>

            {/* Stats */}
            <div style={{ marginTop:48, display:"flex", gap:0, flexWrap:"wrap" }}>
              {[["2500+","Happy Clients"],["15+","Expert Stylists"],["8+","Years of Excellence"]].map(([n,l], i) => (
                <div key={l} style={{ paddingRight:32, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none", paddingLeft: i > 0 ? 32 : 0 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:600, color:C.blush, lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:400, marginTop:5, fontFamily:"'Inter',sans-serif" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div style={{ flex:"1 1 340px", position:"relative" }} className="fade-in-up">
            <div style={{ borderRadius:"40% 60% 55% 45% / 45% 40% 60% 55%", overflow:"hidden", aspectRatio:"4/5", maxWidth:400, boxShadow:`0 40px 80px rgba(0,0,0,0.5)`, margin:"0 auto" }}>
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80" alt="Salon" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            {/* Floating rating card */}
            <div style={{ position:"absolute", bottom:32, left:-10, background:"rgba(26,20,35,0.85)", backdropFilter:"blur(20px)", borderRadius:16, padding:"14px 20px", boxShadow:`0 12px 40px rgba(0,0,0,0.4)`, display:"flex", gap:12, alignItems:"center", border:"1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.rose},${C.mauve})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⭐</div>
              <div>
                <div style={{ fontWeight:600, fontSize:14, color:"white", fontFamily:"'Inter',sans-serif" }}>4.9 / 5.0</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontFamily:"'Inter',sans-serif" }}>From 850+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Preview ─────────────────────────────────────────── */}
      <section style={{ padding:"88px 24px", background:"white" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <span style={{ fontSize:11, fontWeight:600, letterSpacing:2.5, color:C.rose, textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>What We Offer</span>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,46px)", color:C.deep, textAlign:"center", marginBottom:10, fontStyle:"italic" }}>
            Our Signature Services
          </h2>
          <p style={{ textAlign:"center", fontSize:15, color:C.dark, opacity:0.5, marginBottom:52, fontFamily:"'Inter',sans-serif" }}>
            Tailored treatments for every style and occasion
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
            {[
              {  title:"Hair Styling",     desc:"Cuts, colour, keratin & more by master stylists",         img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
              {  title:"Skin & Facial",    desc:"Glow-enhancing treatments for radiant skin",              img:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80" },
              {  title:"Nail Art",         desc:"Manicure, pedicure & creative nail art services",         img:"https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80" },
              {  title:"Bridal Packages",  desc:"Complete bridal beauty transformation packages",           img:"https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&q=80" },
            ].map((s) => (
              <Link to="/services" key={s.title}
                style={{ borderRadius:20, overflow:"hidden", cursor:"pointer", background:"#faf5f3", boxShadow:"0 2px 16px rgba(26,20,35,0.06)", transition:"transform 0.3s,box-shadow 0.3s", textDecoration:"none", display:"block" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow=`0 16px 40px rgba(183,93,105,0.18)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 16px rgba(26,20,35,0.06)"; }}>
                <div style={{ height:180, overflow:"hidden", position:"relative" }}>
                  <img src={s.img} alt={s.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }}
                    onMouseEnter={e => e.target.style.transform="scale(1.07)"}
                    onMouseLeave={e => e.target.style.transform="scale(1)"} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(26,20,35,0.3),transparent)" }} />
                </div>
                <div style={{ padding:"20px 22px" }}>
                  <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:C.deep, marginBottom:8 }}>{s.title}</h3>
                  <p style={{ fontSize:13, color:C.dark, opacity:0.6, lineHeight:1.65, fontFamily:"'Inter',sans-serif" }}>{s.desc}</p>
                  <div style={{ marginTop:14, fontSize:12, color:C.rose, fontWeight:500, fontFamily:"'Inter',sans-serif" }}>Explore →</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:44 }}>
            <Link to="/book" className="btn-primary" style={{ padding:"14px 40px", fontSize:14, textDecoration:"none" }}>Book Your Session ✦</Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────── */}
      <section style={{ padding:"88px 24px", background:`linear-gradient(135deg,${C.dark} 0%,#2a1a2e 100%)` }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <span style={{ fontSize:11, fontWeight:600, letterSpacing:2.5, color:C.rose, textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>Our Promise</span>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,46px)", color:C.blush, textAlign:"center", marginBottom:10, fontStyle:"italic" }}>
            Why Choose Tutoria
          </h2>
          <p style={{ textAlign:"center", fontSize:15, color:"rgba(255,255,255,0.4)", marginBottom:56, fontFamily:"'Inter',sans-serif" }}>Where artistry meets luxury</p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20 }}>
            {[
              {  title:"Expert Stylists",   desc:"Internationally trained professionals with years of expertise" },
              {  title:"Easy Booking",      desc:"Book online anytime, anywhere in just a few steps" },
              {  title:"Premium Products",  desc:"Only the finest hair & beauty brands used on every client" },
              {   title:"Eco-Friendly",      desc:"Sustainable beauty practices that care for you and the planet" },
            ].map((f) => (
              <div key={f.title} style={{ background:"rgba(255,255,255,0.04)", borderRadius:20, padding:"28px 24px", textAlign:"center", border:"1px solid rgba(255,255,255,0.07)", backdropFilter:"blur(8px)", transition:"all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(183,93,105,0.1)"; e.currentTarget.style.borderColor="rgba(183,93,105,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; }}>
                <div style={{ fontSize:34, marginBottom:16 }}>{f.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:19, color:C.blush, marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", lineHeight:1.75, fontFamily:"'Inter',sans-serif" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stylists Preview ─────────────────────────────────────────── */}
      {stylists.length > 0 && (
        <section style={{ padding:"88px 24px", background:"white" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:2.5, color:C.rose, textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>The Team</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,46px)", color:C.deep, textAlign:"center", marginBottom:10, fontStyle:"italic" }}>
              Meet Our Artists
            </h2>
            <p style={{ textAlign:"center", fontSize:15, color:C.dark, opacity:0.5, marginBottom:52, fontFamily:"'Inter',sans-serif" }}>Masters of their craft</p>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
              {stylists.map((s) => (
                <div key={s._id} style={{ borderRadius:20, overflow:"hidden", background:"#faf5f3", boxShadow:"0 2px 16px rgba(26,20,35,0.07)", transition:"transform 0.3s,box-shadow 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow=`0 16px 40px rgba(183,93,105,0.15)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 16px rgba(26,20,35,0.07)"; }}>
                  <div style={{ position:"relative", height:240, overflow:"hidden" }}>
                    <img src={s.photo} alt={s.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", transition:"transform 0.5s" }}
                      onMouseEnter={e => e.target.style.transform="scale(1.06)"}
                      onMouseLeave={e => e.target.style.transform="scale(1)"} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(26,20,35,0.5),transparent 50%)" }} />
                    <div style={{ position:"absolute", bottom:14, left:16, right:16 }}>
                      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"white", marginBottom:2 }}>{s.name}</p>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.65)", fontFamily:"'Inter',sans-serif" }}>{s.specialization}</p>
                    </div>
                  </div>
                  <div style={{ padding:"16px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:4 }}>
                      {[1,2,3,4,5].map(i => (
                        <span key={i} style={{ color: i <= Math.round(s.rating || 5) ? C.rose : "#e0d4d0", fontSize:13 }}>★</span>
                      ))}
                    </div>
                    <Link to="/book" style={{ fontSize:12, color:C.rose, fontWeight:500, fontFamily:"'Inter',sans-serif", textDecoration:"none" }}>Book →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:36 }}>
              <Link to="/stylists" className="btn-outline" style={{ textDecoration:"none" }}>View All Stylists</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Strip ────────────────────────────────────────────────── */}
      <section style={{ padding:"80px 24px", background:`linear-gradient(135deg,${C.rose},${C.mauve},${C.deep})`, textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"url('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=40') center/cover no-repeat", opacity:0.08 }} />
        <div style={{ position:"relative" }}>
          <span style={{ fontSize:11, fontWeight:600, letterSpacing:2.5, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>Limited Slots Available</span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,4vw,48px)", color:"white", marginTop:12, marginBottom:14, fontStyle:"italic" }}>
            Ready for a Transformation?
          </h2>
          <p style={{ color:"rgba(255,255,255,0.7)", marginBottom:32, fontSize:15, fontFamily:"'Inter',sans-serif", fontWeight:300 }}>
            Book your appointment today and let our experts craft your perfect look
          </p>
          <Link to="/book" style={{
            display:"inline-block",
            background:"white", color:C.deep,
            border:"none", padding:"14px 40px", borderRadius:50,
            fontSize:14, fontWeight:600, cursor:"pointer",
            textDecoration:"none", transition:"all 0.3s",
            fontFamily:"'Inter',sans-serif",
            boxShadow:"0 8px 28px rgba(0,0,0,0.2)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.2)"; }}>
            Book Appointment 
          </Link>
        </div>
      </section>
    </div>
  );
}
