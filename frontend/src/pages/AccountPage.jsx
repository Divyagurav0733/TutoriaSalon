import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookingAPI } from "../utils/api";
import { C } from "../utils/constants";
import { formatDate, hoursUntil, formatCurrency } from "../utils/helpers";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [bookings,  setBookings]  = useState([]);
  const [tab,       setTab]       = useState("upcoming");
  const [loading,   setLoading]   = useState(true);
  const [cancelling,setCancelling]= useState(null);
  const [error,     setError]     = useState("");

  const load = () => {
    setLoading(true);
    bookingAPI.getMy()
      .then(r => setBookings(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id, date, timeSlot) => {
    if (hoursUntil(date, timeSlot) < 24) {
      setError(`Cancellation is only allowed 24+ hours before the appointment.\nPlease call us at +91 98765 43210.`);
      return;
    }
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(id);
    try {
      await bookingAPI.cancel(id);
      setBookings(prev => prev.map(b => b._id===id ? {...b,status:"cancelled"} : b));
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(null);
    }
  };

  const filtered = bookings.filter(b => {
    if (tab==="upcoming")  return b.status==="upcoming";
    if (tab==="past")      return b.status==="completed";
    if (tab==="cancelled") return b.status==="cancelled";
    return true;
  });

  const counts = {
    upcoming:  bookings.filter(b=>b.status==="upcoming").length,
    past:      bookings.filter(b=>b.status==="completed").length,
    cancelled: bookings.filter(b=>b.status==="cancelled").length,
  };

  return (
    <div style={{ paddingTop:80,minHeight:"100vh",background:C.cream }}>
      {/* Profile Header */}
      <div style={{ background:`linear-gradient(135deg,${C.purple},${C.navy})`,padding:"40px 24px" }}>
        <div style={{ maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:20 }}>
            <div style={{ width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,color:"white",fontFamily:"Cormorant Garamond",fontWeight:600 }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontFamily:"Cormorant Garamond",fontSize:28,color:"white",fontStyle:"italic" }}>{user?.name}</h1>
              <p style={{ color:"rgba(255,255,255,0.65)",fontSize:13,marginTop:2 }}>{user?.email}</p>
            </div>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <Link to="/book" className="btn-primary" style={{ background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",color:"white",textDecoration:"none",fontSize:13,padding:"9px 20px" }}>
              + New Booking
            </Link>
            <button onClick={logout} style={{ background:"none",border:"1px solid rgba(255,255,255,0.3)",color:"rgba(255,255,255,0.8)",padding:"9px 18px",borderRadius:30,cursor:"pointer",fontSize:13 }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:800,margin:"0 auto",padding:"32px 20px" }}>
        {error && (
          <div style={{ background:"#fff3e0",border:"1px solid #ff9800",borderRadius:12,padding:"12px 16px",fontSize:13,color:"#e65100",marginBottom:20,whiteSpace:"pre-line" }}>
            ⚠️ {error}
            <button onClick={() => setError("")} style={{ float:"right",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#e65100" }}>✕</button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:"flex",gap:8,marginBottom:24,background:"white",borderRadius:16,padding:6,flexWrap:"wrap" }}>
          {[["upcoming"," Upcoming"],["past"," Past"],["cancelled"," Cancelled"]].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1,padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"DM Sans",fontSize:13,fontWeight:500,background: tab===t ? C.purple : "transparent",color: tab===t ? "white" : C.navy,transition:"all 0.2s",whiteSpace:"nowrap",minWidth:100 }}>
              {l} ({counts[t]})
            </button>
          ))}
        </div>

        {/* Booking Cards */}
        {loading ? (
          <div style={{ textAlign:"center",padding:"60px 0" }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center",padding:"60px 20px",background:"white",borderRadius:20 }}>
            <div style={{ fontSize:48,marginBottom:16 }}>📋</div>
            <p style={{ color:C.navy,opacity:0.55,fontSize:15 }}>No {tab} appointments</p>
            {tab==="upcoming" && <Link to="/book" className="btn-primary" style={{ marginTop:16,display:"inline-block",textDecoration:"none" }}>Book Now ✦</Link>}
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            {filtered.map(b => {
              const stylist = b.stylist;
              const canCancel = b.status==="upcoming" && hoursUntil(b.date,b.timeSlot) >= 24;
              const pastDeadline = b.status==="upcoming" && hoursUntil(b.date,b.timeSlot) < 24;
              return (
                <div key={b._id} style={{ background:"white",borderRadius:18,padding:"20px 24px",boxShadow:"0 4px 16px rgba(0,0,0,0.05)",border:`1px solid ${C.lavender}` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:12,flexWrap:"wrap" }}>
                        <span style={{ fontFamily:"Cormorant Garamond",fontSize:22,color:C.navy }}>{b.serviceName}</span>
                        <span className={`badge badge-${b.status}`}>{b.status}</span>
                      </div>
                      <div style={{ display:"grid",gridTemplateColumns:"auto auto",gap:"5px 20px",fontSize:13 }}>
                        {[
                          [`Stylist: ${stylist?.name||"N/A"}`],
                          [formatDate(b.date)],
                          [b.timeSlot],
                          [`${formatCurrency(b.price)} — ${b.payment}`],
                        ].map(([ic,tx]) => (
                          <span key={tx} style={{ color:C.navy,opacity:0.7,display:"flex",alignItems:"center",gap:5 }}>{ic} {tx}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end" }}>
                      {canCancel && (
                        <button onClick={() => handleCancel(b._id,b.date,b.timeSlot)} disabled={cancelling===b._id} style={{ background:"#fdecea",border:"1px solid #f44336",color:"#c62828",padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:500 }}>
                          {cancelling===b._id ? "Cancelling…" : "Cancel Booking"}
                        </button>
                      )}
                      {pastDeadline && (
                        <div style={{ fontSize:11,color:"#e65100",maxWidth:190,textAlign:"right",lineHeight:1.6 }}>
                          ⚠️ Within 24h — to cancel, call<br />
                          <a href="tel:+919876543210" style={{ color:"#c62828",fontWeight:600,textDecoration:"none" }}>+91 98765 43210</a><br />
                          <a href="/contact" style={{ color:C.purple,fontSize:10,textDecoration:"none" }}>or Contact Us →</a>
                        </div>
                      )}
                    </div>
                  </div>

                  {b.adminNote && (
                    <div style={{ marginTop:12,background:"#fff8e1",borderLeft:`3px solid #ffc107`,padding:"8px 12px",borderRadius:"0 8px 8px 0",fontSize:12,color:"#5d4037" }}>
                       {b.adminNote}
                    </div>
                  )}

                  <div style={{ fontSize:11,color:C.navy,opacity:0.35,marginTop:12 }}>ID: {b._id?.slice(-8).toUpperCase()}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
