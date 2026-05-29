import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { C } from "../utils/constants";
import { stylistAPI } from "../utils/api";
import { DAY_NAMES } from "../utils/constants";

export default function AboutPage() {
  const [stylists, setStylists] = useState([]);
  useEffect(() => { stylistAPI.getAll().then(r => setStylists(r.data.data)).catch(() => {}); }, []);

  return (
    <div style={{ paddingTop:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.lavender},${C.cream})`,padding:"60px 24px 0" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",display:"flex",gap:60,alignItems:"center",flexWrap:"wrap",paddingBottom:60 }}>
          <div style={{ flex:"1 1 400px" }} className="fade-in-up">
            <h1 className="section-title">About Tutoria</h1>
            <p style={{ fontSize:16,lineHeight:1.9,color:C.navy,opacity:0.8,marginBottom:20 }}>
              Founded in 2016, Tutoria Salon has been Panjim's premier destination for luxury hair and beauty services. Our philosophy is simple — every client deserves to feel extraordinary.
            </p>
            <p style={{ fontSize:15,lineHeight:1.9,color:C.navy,opacity:0.7,marginBottom:28 }}>
              With a team of internationally trained stylists and aestheticians, we blend global trends with personalised care to deliver results that go beyond expectations.
            </p>
            <Link to="/book" className="btn-primary" style={{ textDecoration:"none" }}>Book a Session </Link>
          </div>
          <div style={{ flex:"1 1 360px" }}>
            <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80" alt="Salon Interior" style={{ width:"100%",borderRadius:24,boxShadow:`0 24px 60px ${C.purple}25` }} />
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ padding:"80px 24px",background:"white" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <h2 className="section-title" style={{ textAlign:"center" }}>Our Values</h2>
          <p className="section-sub" style={{ textAlign:"center" }}>The principles that drive everything we do</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:24 }}>
            {[
              { title:"Excellence",desc:"Every service is delivered with meticulous attention to detail and the highest standards." },
              { title:"Personalisation",desc:"We listen to your unique needs and tailor every treatment to you." },
              { title:"Sustainability",desc:"Eco-friendly products and zero-waste practices are at our core." },
              { title:"Trust",desc:"Building lasting relationships with clients through honesty and consistency." },
            ].map((v) => (
              <div key={v.title} style={{ background:C.cream,borderRadius:20,padding:"28px 24px",textAlign:"center" }}>
                <div style={{ fontSize:36,marginBottom:14 }}>{v.icon}</div>
                <h3 style={{ fontFamily:"Cormorant Garamond",fontSize:20,color:C.purple,marginBottom:10 }}>{v.title}</h3>
                <p style={{ fontSize:13,color:C.navy,opacity:0.65,lineHeight:1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div style={{ padding:"80px 24px",background:`linear-gradient(135deg,${C.lavender},${C.cream})` }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <h2 className="section-title" style={{ textAlign:"center" }}>Meet Our Team</h2>
          <p className="section-sub" style={{ textAlign:"center" }}>Masters of their craft</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:24 }}>
            {stylists.map((s) => (
              <div key={s._id} style={{ background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
                <img src={s.photo} alt={s.name} style={{ width:"100%",height:240,objectFit:"cover" }} onError={e => { e.target.src = s.gender === "male" ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"; }} />
                <div style={{ padding:20 }}>
                  <h3 style={{ fontFamily:"Cormorant Garamond",fontSize:24,color:C.purple }}>{s.name}</h3>
                  <p style={{ fontSize:13,color:C.navy,opacity:0.6,marginTop:4,marginBottom:12 }}>{s.specialization}</p>
                  <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                    {DAY_NAMES.map((d,i) => (
                      <span key={d} style={{ fontSize:11,padding:"3px 8px",borderRadius:20,background: s.days.includes(i) ? `${C.purple}15` : `${C.lavender}50`,color: s.days.includes(i) ? C.purple : "#aaa",fontWeight: s.days.includes(i) ? 500 : 400 }}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
