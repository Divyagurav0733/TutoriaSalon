import { useState } from "react";
import { Link } from "react-router-dom";
import { C, SERVICES, COMMON_SERVICE_IDS } from "../utils/constants";

export default function ServicesPage() {
  const [tab, setTab] = useState("female");
  const services = SERVICES[tab];

  return (
    <div style={{ paddingTop:80 }}>
      <div style={{ background:`linear-gradient(135deg,${C.lavender},${C.pink}40)`,padding:"60px 24px 40px",textAlign:"center" }}>
        <h1 className="section-title">Our Services</h1>
        <p style={{ fontSize:15,color:C.navy,opacity:0.7 }}>Professional treatments for every beauty need</p>
      </div>

      <div className="section">
        {/* Tab Toggle */}
        <div style={{ display:"flex",justifyContent:"center",gap:8,marginBottom:40,background:`${C.lavender}60`,borderRadius:40,padding:6,width:"fit-content",margin:"0 auto 40px" }}>
          {["female","male"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 32px",borderRadius:35,border:"none",cursor:"pointer",fontFamily:"DM Sans",fontSize:14,fontWeight:500,background: tab===t ? C.purple : "transparent",color: tab===t ? "white" : C.navy,transition:"all 0.3s" }}>
              {t === "female" ? "♀ Female" : "♂ Male"}
            </button>
          ))}
        </div>

        {/* Common services note */}
        <div style={{ background:`${C.pink}60`,border:`1px solid ${C.pink}`,borderRadius:12,padding:"12px 20px",marginBottom:32,fontSize:13,color:C.purple,display:"flex",alignItems:"center",gap:8 }}>
          <span>💫</span> Services marked with <strong>★ COMMON</strong> are available for both Male & Female
        </div>

        {/* Service Cards */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20 }}>
          {services.map((s) => (
            <div key={s.id} style={{ background:"white",borderRadius:18,padding:"24px",border:`1.5px solid ${COMMON_SERVICE_IDS.includes(s.id) ? C.pink : C.lavender}`,position:"relative",transition:"all 0.3s",boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${C.purple}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.04)"; }}>

              {COMMON_SERVICE_IDS.includes(s.id) && (
                <div style={{ position:"absolute",top:14,right:14,background:C.pink,color:C.purple,fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:20 }}>★ COMMON</div>
              )}

              <div style={{ fontSize:32,marginBottom:12 }}>{s.icon}</div>
              <h3 style={{ fontFamily:"Cormorant Garamond",fontSize:22,color:C.navy,marginBottom:8 }}>{s.name}</h3>
              <div style={{ display:"flex",gap:16,marginBottom:16 }}>
                <span style={{ fontSize:13,color:C.navy,opacity:0.55 }}>⏱ {s.duration} min</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <span style={{ fontFamily:"Cormorant Garamond",fontSize:30,fontWeight:600,color:C.purple }}>₹{s.price}</span>
                <Link to="/book" className="btn-primary" style={{ padding:"8px 20px",fontSize:13,textDecoration:"none" }}>Book</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
