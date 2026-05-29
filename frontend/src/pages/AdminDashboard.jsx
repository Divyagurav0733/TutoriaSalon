import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../utils/api";
import { C } from "../utils/constants";
import { formatDate, formatCurrency } from "../utils/helpers";

/* Notify Modal  */
function NotifyModal({ booking, onClose }) {
  const [msg,     setMsg]     = useState("");
  const [subject, setSubject] = useState("Update from Tutoria Salon");
  const [channel, setChannel] = useState("email");
  const [sending, setSending] = useState(false);
  const [done,    setDone]    = useState(false);

  const send = async () => {
    if (!msg.trim()) return;
    setSending(true);
    try {
      await adminAPI.notify({ bookingId: booking._id, subject, message: msg, channel });
      setDone(true);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20 }}>
      <div style={{ background:"white",borderRadius:20,padding:32,maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        {done ? (
          <div style={{ textAlign:"center",padding:"20px 0" }}>
            <div style={{ fontSize:48,marginBottom:12 }}></div>
            <h3 style={{ fontFamily:"Cormorant Garamond",fontSize:24,color:C.purple }}>Sent!</h3>
            <p style={{ fontSize:13,color:C.navy,opacity:0.6,marginTop:6 }}>Notification delivered to {booking.customerName}</p>
            <button onClick={onClose} className="btn-primary" style={{ marginTop:20 }}>Close</button>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily:"Cormorant Garamond",fontSize:26,color:C.purple,marginBottom:4 }}>Send Notification</h3>
            <p style={{ fontSize:13,color:C.navy,opacity:0.6,marginBottom:20 }}>To: {booking.customerName} ({booking.email})</p>

            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <div className="form-group">
                <label>Channel</label>
                <select value={channel} onChange={e => setChannel(e.target.value)}>
                  <option value="email">Email</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject (email)</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Enter your message…" style={{ resize:"vertical" }} />
              </div>
            </div>

            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button onClick={send} disabled={sending||!msg.trim()} className="btn-primary" style={{ flex:2 }}>
                {sending ? <span className="spinner-sm" /> : "Send ✦"}
              </button>
              <button onClick={onClose} className="btn-outline" style={{ flex:1 }}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/*  Edit Modal */
function EditModal({ booking, onClose, onSaved }) {
  const [form, setForm]   = useState({ date: booking.date, timeSlot: booking.timeSlot, status: booking.status, adminNote: booking.adminNote||"" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await adminAPI.editBooking(booking._id, form);
      onSaved(res.data.data);
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20 }}>
      <div style={{ background:"white",borderRadius:20,padding:32,maxWidth:420,width:"100%" }}>
        <h3 style={{ fontFamily:"Cormorant Garamond",fontSize:26,color:C.purple,marginBottom:20 }}>Edit Booking</h3>
        <p style={{ fontSize:13,color:C.navy,opacity:0.6,marginBottom:20 }}>{booking.customerName} — {booking.serviceName}</p>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Time Slot</label>
            <input value={form.timeSlot} onChange={e => setForm({...form,timeSlot:e.target.value})} placeholder="HH:MM" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Admin Note (sent to customer)</label>
            <textarea value={form.adminNote} onChange={e => setForm({...form,adminNote:e.target.value})} rows={3} placeholder="Reason for change, special instructions…" style={{ resize:"vertical" }} />
          </div>
        </div>
        <div style={{ display:"flex",gap:10,marginTop:20 }}>
          <button onClick={save} disabled={saving} className="btn-primary" style={{ flex:2 }}>
            {saving ? <span className="spinner-sm" /> : "Save Changes"}
          </button>
          <button onClick={onClose} className="btn-outline" style={{ flex:1 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/*  Admin Dashboard  */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings,  setBookings]  = useState([]);
  const [stats,     setStats]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [filterDate,   setFilterDate]   = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notifyBk,  setNotifyBk]  = useState(null);
  const [editBk,    setEditBk]    = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDate   && filterDate !== "")   params.date   = filterDate;
      if (filterGender !== "all")              params.gender = filterGender;
      if (filterStatus !== "all")              params.status = filterStatus;

      const [bRes, sRes] = await Promise.all([
        adminAPI.getBookings(params),
        adminAPI.getStats(),
      ]);
      setBookings(bRes.data.data);
      setStats(sRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterDate, filterGender, filterStatus]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleCancel = async (id) => {
    const reason = window.prompt("Reason for cancellation (optional):");
    if (reason === null) return; // user pressed Cancel in prompt
    try {
      await adminAPI.cancelBooking(id, { message: reason });
      setBookings(prev => prev.map(b => b._id===id ? {...b,status:"cancelled"} : b));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleSaved = (updated) => {
    setBookings(prev => prev.map(b => b._id===updated._id ? updated : b));
  };

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div style={{ minHeight:"100vh",background:"#f5f3f8" }}>
      {/* Admin Navbar */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.purple})`,padding:"0 24px",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ maxWidth:1300,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",height:64 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontFamily:"Cormorant Garamond",fontSize:18,fontWeight:600 }}>T</div>
            <div>
              <span style={{ fontFamily:"Cormorant Garamond",fontSize:20,color:"white",fontWeight:600 }}>Tutoria</span>
              <span style={{ fontSize:11,color:"rgba(255,255,255,0.5)",marginLeft:10 }}>Admin Panel</span>
            </div>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <Link to="/" style={{ background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",color:"white",padding:"7px 16px",borderRadius:20,textDecoration:"none",fontSize:13 }}>← Website</Link>
            <button onClick={handleLogout} style={{ background:"none",border:"1px solid rgba(255,255,255,0.2)",color:"rgba(255,255,255,0.8)",padding:"7px 14px",borderRadius:20,cursor:"pointer",fontSize:13 }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1300,margin:"0 auto",padding:"28px 20px" }}>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:16,marginBottom:28 }}>
            {[
              ["Total Bookings",   stats.total],
              ["Upcoming",         stats.upcoming],
              ["Today",            stats.today],
              ["Cancelled",        stats.cancelled],
              ["Revenue",          formatCurrency(stats.revenue)],
            ].map(([ic,l,v]) => (
              <div key={l} style={{ background:"white",borderRadius:16,padding:"20px",textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:26,marginBottom:8 }}>{ic}</div>
                <div style={{ fontFamily:"Cormorant Garamond",fontSize:28,fontWeight:600,color:C.purple }}>{v}</div>
                <div style={{ fontSize:12,color:C.navy,opacity:0.55,marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Top Services */}
        {stats?.topServices?.length > 0 && (
          <div style={{ background:"white",borderRadius:16,padding:"20px 24px",marginBottom:20,boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontFamily:"Cormorant Garamond",fontSize:20,color:C.purple,marginBottom:16 }}>Top Services</h3>
            <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
              {stats.topServices.map((s,i) => (
                <div key={s._id} style={{ background:`${C.lavender}60`,borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontFamily:"Cormorant Garamond",fontSize:20,color:C.purple,fontWeight:600 }}>#{i+1}</span>
                  <div>
                    <div style={{ fontSize:13,fontWeight:500,color:C.navy }}>{s._id}</div>
                    <div style={{ fontSize:11,color:C.navy,opacity:0.55 }}>{s.count} bookings · {formatCurrency(s.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ background:"white",borderRadius:16,padding:"20px 24px",marginBottom:20,display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-end",boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ flex:"1 1 160px" }}>
            <label>Filter by Date</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          </div>
          <div style={{ flex:"1 1 130px" }}>
            <label>Gender</label>
            <select value={filterGender} onChange={e => setFilterGender(e.target.value)}>
              <option value="all">All Genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div style={{ flex:"1 1 130px" }}>
            <label>Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button onClick={() => { setFilterDate(""); setFilterGender("all"); setFilterStatus("all"); }} className="btn-outline" style={{ height:44,padding:"0 20px",flexShrink:0 }}>
            Clear Filters
          </button>
        </div>

        {/* Count */}
        <div style={{ marginBottom:12,fontSize:13,color:C.navy,opacity:0.6 }}>
          Showing <strong>{bookings.length}</strong> booking{bookings.length!==1?"s":""}
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div style={{ textAlign:"center",padding:"60px 0",background:"white",borderRadius:16 }}><div className="spinner" /></div>
        ) : (
          <div style={{ background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                <thead>
                  <tr style={{ background:C.purple,color:"white" }}>
                    {["ID","Customer","Gender","Service","Stylist","Date","Time","Amount","Payment","Status","Actions"].map(h => (
                      <th key={h} style={{ padding:"13px 12px",textAlign:"left",fontWeight:500,whiteSpace:"nowrap",fontSize:12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b,i) => (
                    <tr key={b._id} style={{ background: i%2===0 ? "white" : "#faf9ff",borderBottom:`1px solid ${C.lavender}` }}>
                      <td style={{ padding:"12px",color:C.navy,opacity:0.55,fontSize:11,fontFamily:"monospace" }}>{b._id?.slice(-8).toUpperCase()}</td>
                      <td style={{ padding:"12px" }}>
                        <div style={{ fontWeight:500,color:C.navy }}>{b.customerName}</div>
                        <div style={{ fontSize:11,opacity:0.55 }}>{b.email}</div>
                        <div style={{ fontSize:11,opacity:0.55 }}>{b.phone}</div>
                      </td>
                      <td style={{ padding:"12px" }}>
                        <span style={{ padding:"2px 10px",borderRadius:20,background: b.gender==="female" ? `${C.pink}80` : `${C.lavender}80`,color: b.gender==="female" ? C.purple : C.navy,fontSize:11,fontWeight:500 }}>
                          {b.gender==="female"?"♀":"♂"} {b.gender}
                        </span>
                      </td>
                      <td style={{ padding:"12px",whiteSpace:"nowrap" }}>{b.serviceName}</td>
                      <td style={{ padding:"12px",whiteSpace:"nowrap" }}>{b.stylist?.name||"—"}</td>
                      <td style={{ padding:"12px",whiteSpace:"nowrap",fontSize:12 }}>{b.date}</td>
                      <td style={{ padding:"12px" }}>{b.timeSlot}</td>
                      <td style={{ padding:"12px",fontWeight:600,color:C.purple }}>{formatCurrency(b.price)}</td>
                      <td style={{ padding:"12px",fontSize:11 }}>{b.payment}</td>
                      <td style={{ padding:"12px" }}>
                        <span className={`badge badge-${b.status}`}>{b.status}</span>
                      </td>
                      <td style={{ padding:"12px" }}>
                        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                          <button onClick={() => setEditBk(b)} style={{ background:`${C.lavender}`,border:"none",color:C.navy,padding:"5px 10px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:500 }}>Edit</button>
                          {b.status==="upcoming" && (
                            <button onClick={() => handleCancel(b._id)} style={{ background:"#fdecea",border:"1px solid #f44336",color:"#c62828",padding:"5px 10px",borderRadius:8,cursor:"pointer",fontSize:11 }}>Cancel</button>
                          )}
                          <button onClick={() => setNotifyBk(b)} style={{ background:`${C.purple}10`,border:`1px solid ${C.purple}`,color:C.purple,padding:"5px 10px",borderRadius:8,cursor:"pointer",fontSize:11 }}>Notify</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bookings.length===0 && (
              <div style={{ textAlign:"center",padding:"40px",color:C.navy,opacity:0.45 }}>No bookings match the current filters</div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {notifyBk && <NotifyModal booking={notifyBk} onClose={() => setNotifyBk(null)} />}
      {editBk   && <EditModal   booking={editBk}   onClose={() => setEditBk(null)}   onSaved={handleSaved} />}
    </div>
  );
}
