import { C } from "../utils/constants";

const EVENTS = [
  { year:"2016", title:"The Beginning",       desc:"Tutoria Salon opened its doors in Panjim Goa with 3 stylists and a vision for luxury beauty." },
  { year:"2018", title:"Award Recognition",   desc:"Received 'Best Salon in Panjim' award from Goa Beauty Association for two consecutive years." },
  { year:"2019", title:"Expansion",           desc:"Expanded to a larger flagship studio, adding dedicated bridal makeup suites and nail art stations." },
  { year:"2021", title:"Going Digital",       desc:"Launched our online booking platform, making premium salon experiences accessible at the tap of a button." },
  { year:"2023", title:"Celebrity Clientele", desc:"Became the official grooming partner for two major  film productions and regional TV shows." },
  { year:"2024", title:"Sustainability Pledge",desc:"Switched to 100% eco-friendly product lines and introduced zero-waste styling practices." },
  { year:"2026", title:"Today",               desc:"2500+ satisfied clients, 15 expert stylists and still crafting extraordinary beauty experiences every single day." },
];

export default function HistoryPage() {
  return (
    <div style={{ paddingTop:80 }}>
      <div style={{ background:`linear-gradient(135deg,${C.pink}40,${C.lavender})`,padding:"60px 24px 40px",textAlign:"center" }}>
        <h1 className="section-title">Our Journey</h1>
        <p style={{ fontSize:15,color:C.navy,opacity:0.7 }}>A decade of crafting beauty and building confidence</p>
      </div>

      <div className="section">
        <div style={{ position:"relative",maxWidth:700,margin:"0 auto" }}>
          {/* Centre line */}
          <div style={{ position:"absolute",left:"50%",top:0,bottom:0,width:2,background:`linear-gradient(${C.purple},${C.pink})`,transform:"translateX(-50%)" }} />

          {EVENTS.map((e,i) => (
            <div key={e.year} style={{ display:"flex",gap:24,marginBottom:40,flexDirection: i%2===0 ? "row" : "row-reverse",alignItems:"center" }} className="fade-in-up">
              <div style={{ flex:1,background:"white",borderRadius:16,padding:"20px 24px",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",textAlign: i%2===0 ? "right" : "left" }}>
                <span style={{ fontFamily:"Cormorant Garamond",fontSize:36,fontWeight:600,color:C.purple }}>{e.year}</span>
                <h3 style={{ fontFamily:"Cormorant Garamond",fontSize:20,color:C.navy,marginTop:4,marginBottom:8 }}>{e.title}</h3>
                <p style={{ fontSize:13,color:C.navy,opacity:0.65,lineHeight:1.7 }}>{e.desc}</p>
              </div>
              <div style={{ width:16,height:16,borderRadius:"50%",background:C.purple,border:"3px solid white",boxShadow:`0 0 0 3px ${C.purple}40`,flexShrink:0 }} />
              <div style={{ flex:1 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
