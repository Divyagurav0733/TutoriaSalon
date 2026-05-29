import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookingAPI, stylistAPI } from "../utils/api";
import { C, SERVICES, SERVICE_MAP } from "../utils/constants";
import { getUpcomingDates, dateStr, formatDate, formatCurrency } from "../utils/helpers";
import { DAY_NAMES, MONTH_NAMES } from "../utils/constants";

/* ── Booking Confirmation Screen ─────────────────────────────────────────── */
function BookingConfirmed({ booking, onGoHome, onMyBookings }) {
  const [secs, setSecs] = useState(15);
  const stylist = booking.stylist;

  useEffect(() => {
    const t = setInterval(() => setSecs(s => {
      if (s <= 1) { clearInterval(t); onGoHome(); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [onGoHome]);

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${C.lavender},${C.cream},${C.pink}40)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"white", borderRadius:28, padding:"clamp(28px,6vw,52px)", maxWidth:520, width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.12)" }} className="fade-in-up">
        <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#4CAF50,#66BB6A)", margin:"0 auto 24px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, animation:"pulse 2s infinite" }}>✓</div>
        <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"clamp(28px,5vw,42px)", color:C.purple, marginBottom:8, fontStyle:"italic" }}>Appointment Booked!</h1>
        <p style={{ color:C.navy, opacity:0.6, fontSize:14, marginBottom:32 }}>Here's a summary of your appointment</p>

        <div style={{ background:C.cream, borderRadius:16, padding:"20px 24px", textAlign:"left", marginBottom:24 }}>
          {[
            ["Booking ID", booking._id?.slice(-8).toUpperCase()],
            ["Customer",   booking.customerName],
            ["Service",    booking.serviceName],
            ["Stylist",    stylist?.name || "—"],
            ["Date",       formatDate(booking.date)],
            ["Time",       booking.timeSlot],
            ["Duration",   `${booking.duration} mins`],
            ["Amount",     formatCurrency(booking.price)],
            ["Payment",    booking.payment],
          ].map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.lavender}` }}>
              <span style={{ fontSize:13, color:C.navy, opacity:0.6 }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:500, color:C.navy }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ background:`${C.purple}10`, borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
          <p style={{ fontSize:13, color:C.purple }}>Redirecting to home in <strong>{secs}s</strong></p>
          <div style={{ height:4, background:`${C.purple}20`, borderRadius:2, marginTop:8, overflow:"hidden" }}>
            <div style={{ height:"100%", background:C.purple, borderRadius:2, width:`${(secs/15)*100}%`, transition:"width 1s linear" }} />
          </div>
        </div>

        <div style={{ display:"flex", gap:12 }}>
          <button onClick={onGoHome}     className="btn-outline" style={{ flex:1 }}>Go Home</button>
          <button onClick={onMyBookings} className="btn-primary" style={{ flex:1 }}>My Bookings</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Book Page ─────────────────────────────────────────────────────── */
export default function BookPage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [step,         setStep]         = useState(1);
  const [stylists,     setStylists]     = useState([]);
  const [stylistsLoading, setStylistsLoading] = useState(true);
  const [stylistsError, setStylistsError] = useState("");
  const [slots,        setSlots]        = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [errors,       setErrors]       = useState({});
  const [confirmed,    setConfirmed]    = useState(null);

  const [form, setForm] = useState({
    name:        user?.name  || "",
    email:       user?.email || "",
    phone:       "",
    age:         "",
    gender:      "female",
    serviceId:   "",
    serviceName: "",
    duration:    0,
    price:       0,
    stylistId:   "",
    date:        "",
    timeSlot:    "",
    payment:     "Cash",
  });

  // ── Load all stylists once on mount ────────────────────────────────────
  useEffect(() => {
    setStylistsLoading(true);
    stylistAPI.getAll()
      .then(r => {
        setStylists(r.data.data || []);
        setStylistsError("");
      })
      .catch(() => setStylistsError("Could not load stylists. Please refresh the page."))
      .finally(() => setStylistsLoading(false));
  }, []);

  // ── Fetch free/booked slots whenever stylist + date + duration are set ─
  useEffect(() => {
    if (!form.stylistId || !form.date || !form.duration) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    bookingAPI.getSlots(form.stylistId, form.date, form.duration)
      .then(r => setSlots(r.data.data))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [form.stylistId, form.date, form.duration]);

  // ── Controlled field updater — resets downstream fields when key changes
  const update = (key, val) => {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      // Changing gender resets everything from service onwards
      if (key === "gender") {
        next.serviceId   = "";
        next.serviceName = "";
        next.duration    = 0;
        next.price       = 0;
        next.stylistId   = "";
        next.date        = "";
        next.timeSlot    = "";
      }
      // Picking a new service resets stylist, date, slot (but NOT gender)
      if (key === "serviceId") {
        const svc        = SERVICE_MAP[val] || {};
        next.serviceName = svc.name     || "";
        next.duration    = svc.duration || 0;
        next.price       = svc.price    || 0;
        next.stylistId   = "";   // force re-pick stylist
        next.date        = "";
        next.timeSlot    = "";
      }
      // Picking a new stylist resets date + slot
      if (key === "stylistId") {
        next.date     = "";
        next.timeSlot = "";
      }
      // Picking a new date resets only the slot
      if (key === "date") {
        next.timeSlot = "";
      }
      return next;
    });
    setErrors(e => ({ ...e, [key]: "" }));
  };

  // ── Validation helpers ─────────────────────────────────────────────────
  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())                           e.name  = "Full name is required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/))  e.email = "Valid email required";
    if (!form.phone.match(/^\d{10}$/))               e.phone = "10-digit mobile number required";
    if (!form.age || form.age < 5 || form.age > 100) e.age   = "Please enter a valid age (5–100)";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.serviceId) e.serviceId = "Please select a service";
    if (!form.stylistId) e.stylistId = "Please select a stylist";
    return e;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.date)     e.date     = "Please select a date";
    if (!form.timeSlot) e.timeSlot = "Please select a time slot";
    return e;
  };

  const nextStep = (validateFn) => {
    const e = validateFn();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Submit booking ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = validateStep3();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      const res = await bookingAPI.create({
        customerName: form.name,
        email:        form.email,
        phone:        form.phone,
        age:          parseInt(form.age),
        gender:       form.gender,
        serviceId:    form.serviceId,
        serviceName:  form.serviceName,
        duration:     form.duration,
        price:        form.price,
        stylistId:    form.stylistId,
        date:         form.date,
        timeSlot:     form.timeSlot,
        payment:      form.payment,
      });
      setConfirmed(res.data.data);
    } catch (err) {
      // If token is invalid/expired, clear session and redirect to login
      if (err.message?.toLowerCase().includes("not authorised") ||
          err.message?.toLowerCase().includes("invalid token") ||
          err.message?.toLowerCase().includes("no token")) {
        localStorage.removeItem("tutoria_user");
        localStorage.removeItem("tutoria_token");
        navigate("/login", { state: { from: "/book", msg: "Your session expired. Please log in again." } });
        return;
      }
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Show confirmation screen after successful booking ──────────────────
  if (confirmed) {
    return (
      <BookingConfirmed
        booking={confirmed}
        onGoHome={() => navigate("/")}
        onMyBookings={() => navigate("/account")}
      />
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────
  const serviceList = SERVICES[form.gender] || [];

  // Filter stylists: must match gender AND handle the selected service
  const allStylists = stylists.filter(s => {
    // Must match selected gender (or have no gender field = legacy)
    if (s.gender && s.gender !== form.gender) return false;
    // If a service is selected and stylist has expertise array, must include it
    if (form.serviceId && s.expertise && s.expertise.length > 0) {
      return s.expertise.includes(form.serviceId);
    }
    return true;
  });

  // In Step 3: only show dates the chosen stylist actually works.
  const chosenStylist = stylists.find(s => s._id === form.stylistId);
  const upcomingDates = getUpcomingDates(7);
  const freeCount     = slots.filter(s => s.free).length;

  const STEPS = ["Personal Info", "Service & Stylist", "Date & Time"];

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", background:C.cream }}>

      {/* ── Step header bar ─────────────────────────────────────────── */}
      <div style={{ background:`linear-gradient(135deg,${C.purple},${C.navy})`, padding:"36px 24px" }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <h1 style={{ fontFamily:"Cormorant Garamond", fontSize:"clamp(26px,4vw,44px)", color:"white", fontStyle:"italic", marginBottom:24 }}>
            Book Your Appointment
          </h1>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:80 }}>
                  <div style={{
                    width:34, height:34, borderRadius:"50%",
                    background:   step > i+1 ? "#4CAF50" : step === i+1 ? "white" : "rgba(255,255,255,0.2)",
                    color:        step > i+1 ? "white"   : step === i+1 ? C.purple : "rgba(255,255,255,0.55)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, fontWeight:700, transition:"all 0.35s",
                    boxShadow: step === i+1 ? "0 0 0 4px rgba(255,255,255,0.2)" : "none",
                  }}>
                    {step > i+1 ? "✓" : i+1}
                  </div>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.75)", marginTop:6, whiteSpace:"nowrap" }}>{label}</span>
                </div>
                {i < 2 && (
                  <div style={{ width:48, height:2, background: step > i+1 ? "#4CAF50" : "rgba(255,255,255,0.2)", margin:"0 4px 20px", transition:"all 0.35s" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────────── */}
      <div style={{ maxWidth:700, margin:"0 auto", padding:"36px 20px 60px" }}>
        <div style={{ background:"white", borderRadius:24, padding:"clamp(22px,5vw,40px)", boxShadow:"0 8px 40px rgba(0,0,0,0.09)" }}>

          {/* ══════════════════════════════════════════════════════════
              STEP 1 — Personal Information
          ══════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="fade-in">
              <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:30, color:C.purple, marginBottom:28 }}>Personal Information</h2>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div className="form-group" style={{ gridColumn:"1/-1" }}>
                  <label>Full Name *</label>
                  <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Meera Sharma" />
                  {errors.name  && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="meera@email.com" />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Contact Number *</label>
                  <input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="9876543210" maxLength={10} />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input type="number" value={form.age} onChange={e => update("age", e.target.value)} placeholder="25" min={5} max={100} />
                  {errors.age   && <span className="error-text">{errors.age}</span>}
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select value={form.gender} onChange={e => update("gender", e.target.value)}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button onClick={() => nextStep(validateStep1)} className="btn-primary" style={{ marginTop:28, width:"100%", padding:14, fontSize:15 }}>
                Continue →
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 2 — Service (single select) + Stylist
          ══════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="fade-in">
              <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:30, color:C.purple, marginBottom:6 }}>Choose Service & Stylist</h2>
              <p style={{ fontSize:13, color:C.navy, opacity:0.55, marginBottom:24 }}>
                Select <strong>one</strong> service, then pick your preferred stylist
              </p>

              {/* ── Service grid — SINGLE SELECT (radio behaviour) ── */}
              <label style={{ marginBottom:10 }}>
                Service *
                <span style={{ fontSize:11, fontWeight:400, color:C.navy, opacity:0.45, marginLeft:8 }}>(tap to select one)</span>
              </label>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:6 }}>
                {serviceList.map(s => {
                  const isSelected = form.serviceId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => update("serviceId", s.id)}
                      style={{
                        border: `2px solid ${isSelected ? C.purple : "#e8e0e8"}`,
                        borderRadius: 14,
                        padding: "14px 16px",
                        cursor: "pointer",
                        background: isSelected ? `${C.purple}12` : "white",
                        transition: "all 0.2s",
                        position: "relative",
                        boxShadow: isSelected ? `0 4px 16px ${C.purple}25` : "none",
                      }}
                    >
                      {/* Selected tick */}
                      {isSelected && (
                        <div style={{ position:"absolute", top:10, right:10, width:20, height:20, borderRadius:"50%", background:C.purple, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:11, fontWeight:700 }}>
                          ✓
                        </div>
                      )}
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                        <span style={{ fontSize:20 }}>{s.icon}</span>
                        <span style={{ fontSize:13, fontWeight:600, color: isSelected ? C.purple : C.navy, lineHeight:1.3 }}>{s.name}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:12, color:C.navy, opacity:0.5, display:"flex", alignItems:"center", gap:3 }}>
                          <span style={{ fontSize:10 }}></span> {s.duration} min
                        </span>
                        <span style={{ fontSize:15, fontWeight:700, color: isSelected ? C.purple : C.navy }}>₹{s.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {errors.serviceId && (
                <div style={{ background:"#fdecea", border:"1px solid #f44336", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#c62828", marginBottom:16 }}>
                   {errors.serviceId}
                </div>
              )}

              {/* Selected service summary strip */}
              {form.serviceId && (
                <div style={{ background:`${C.lavender}50`, borderRadius:10, padding:"10px 16px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:C.navy, fontWeight:500 }}>
                     {form.serviceName}
                  </span>
                  <span style={{ fontSize:13, color:C.purple, fontWeight:600 }}>
                    ₹{form.price} · {form.duration} min
                  </span>
                </div>
              )}

              {/* ── Stylist list — only shown after service is chosen ── */}
              {form.serviceId && (
                <>
                  <label style={{ marginTop:8, marginBottom:12 }}>
                    Choose Stylist *
                    <span style={{ fontSize:11, fontWeight:400, color:C.navy, opacity:0.45, marginLeft:8 }}>
                      (availability shown per day)
                    </span>
                  </label>

                  {stylistsLoading ? (
                    <div style={{ padding:"24px 0", textAlign:"center" }}>
                      <div className="spinner" />
                      <p style={{ fontSize:13, color:C.navy, opacity:0.5, marginTop:10 }}>Loading stylists…</p>
                    </div>
                  ) : stylistsError ? (
                    <div style={{ background:"#fdecea", border:"1px solid #f44336", borderRadius:10, padding:"12px 16px", fontSize:13, color:"#c62828" }}>
                       {stylistsError}
                    </div>
                  ) : allStylists.length === 0 ? (
                    <div style={{ background:"#fff8e1", border:"1px solid #ffc107", borderRadius:10, padding:"12px 16px", fontSize:13, color:"#5d4037" }}>
                       No stylists available right now. Please try again later.
                    </div>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {allStylists.map(s => {
                        const isSelected = form.stylistId === s._id;
                        return (
                          <div
                            key={s._id}
                            onClick={() => update("stylistId", s._id)}
                            style={{
                              display:"flex", alignItems:"center", gap:14,
                              border: `2px solid ${isSelected ? C.purple : "#e8e0e8"}`,
                              borderRadius: 14, padding: "14px 16px",
                              cursor: "pointer",
                              background: isSelected ? `${C.purple}10` : "white",
                              transition: "all 0.2s",
                              boxShadow: isSelected ? `0 4px 16px ${C.purple}20` : "none",
                            }}
                          >
                            <img src={s.photo} alt={s.name} style={{ width:52, height:52, borderRadius:"50%", objectFit:"cover", flexShrink:0, border: isSelected ? `2px solid ${C.purple}` : "2px solid transparent" }} />
                            <div style={{ flex:1 }}>
                              <div style={{ fontWeight:600, fontSize:14, color: isSelected ? C.purple : C.navy }}>{s.name}</div>
                              <div style={{ fontSize:11, color:C.navy, opacity:0.55, marginBottom:6 }}>{s.specialization}</div>
                              {/* Day pills */}
                              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                                {DAY_NAMES.map((d, i) => (
                                  <span key={d} style={{
                                    fontSize:10, padding:"2px 7px", borderRadius:20,
                                    background: s.days.includes(i) ? (isSelected ? C.purple : `${C.purple}15`) : "#f0f0f0",
                                    color:      s.days.includes(i) ? (isSelected ? "white"   : C.purple)         : "#aaa",
                                    fontWeight: s.days.includes(i) ? 600 : 400,
                                  }}>{d}</span>
                                ))}
                              </div>
                            </div>
                            {isSelected && (
                              <div style={{ width:26, height:26, borderRadius:"50%", background:C.purple, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:12, fontWeight:700, flexShrink:0 }}>✓</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {errors.stylistId && (
                    <div style={{ background:"#fdecea", border:"1px solid #f44336", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#c62828", marginTop:10 }}>
                       {errors.stylistId}
                    </div>
                  )}
                </>
              )}

              <div style={{ display:"flex", gap:12, marginTop:28 }}>
                <button onClick={() => setStep(1)} className="btn-outline" style={{ flex:1, padding:14 }}>← Back</button>
                <button onClick={() => nextStep(validateStep2)} className="btn-primary" style={{ flex:2, padding:14 }}>Continue →</button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 3 — Date (filtered by stylist days) + Time Slots
          ══════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="fade-in">
              <h2 style={{ fontFamily:"Cormorant Garamond", fontSize:30, color:C.purple, marginBottom:6 }}>Select Date & Time</h2>
              <p style={{ fontSize:13, color:C.navy, opacity:0.55, marginBottom:24 }}>
                Showing {form.duration}-min slots for <strong>{chosenStylist?.name}</strong>
                {" · "}Green = free, Red = booked
              </p>

              {/* ── Date strip — greyed when stylist is off that day ── */}
              <label style={{ marginBottom:12 }}>Choose Date *</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6, marginBottom:8 }}>
                {upcomingDates.map(d => {
                  const ds        = dateStr(d);
                  const dayIdx    = d.getDay();
                  const available = chosenStylist ? chosenStylist.days.includes(dayIdx) : false;
                  const selected  = form.date === ds;
                  return (
                    <div
                      key={ds}
                      onClick={() => available && update("date", ds)}
                      style={{
                        borderRadius: 12, padding: "10px 4px", textAlign: "center",
                        cursor:     available ? "pointer" : "not-allowed",
                        background: selected  ? C.purple : available ? "white" : "#f5f5f5",
                        border:     `2px solid ${selected ? C.purple : available ? C.lavender : "#e8e8e8"}`,
                        opacity:    available ? 1 : 0.4,
                        transition: "all 0.2s",
                        boxShadow:  selected ? `0 4px 12px ${C.purple}35` : "none",
                      }}
                    >
                      <div style={{ fontSize:10, fontWeight:600, color: selected ? "rgba(255,255,255,0.8)" : C.navy, opacity:0.75, textTransform:"uppercase" }}>
                        {DAY_NAMES[dayIdx]}
                      </div>
                      <div style={{ fontFamily:"Cormorant Garamond", fontSize:20, fontWeight:700, color: selected ? "white" : C.purple }}>
                        {d.getDate()}
                      </div>
                      <div style={{ fontSize:9, color: selected ? "rgba(255,255,255,0.65)" : C.navy, opacity:0.55 }}>
                        {MONTH_NAMES[d.getMonth()]}
                      </div>
                      {!available && (
                        <div style={{ fontSize:8, color:"#bbb", marginTop:2 }}>Off</div>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.date && (
                <div style={{ background:"#fdecea", border:"1px solid #f44336", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#c62828", marginBottom:12 }}>
                   {errors.date}
                </div>
              )}

              {/* ── Time slot grid — only shown once a date is chosen ── */}
              {form.date && (
                <div style={{ marginTop:20 }}>
                  <label style={{ marginBottom:10 }}>
                    Choose Time Slot *
                    {!slotsLoading && slots.length > 0 && (
                      <span style={{ fontSize:11, fontWeight:400, color:C.navy, opacity:0.5, marginLeft:8 }}>
                        {freeCount} of {slots.length} free
                      </span>
                    )}
                  </label>

                  {slotsLoading ? (
                    <div style={{ padding:"30px 0", textAlign:"center" }}><div className="spinner" /></div>
                  ) : slots.length === 0 ? (
                    <div style={{ background:"#fff8e1", border:"1px solid #ffc107", borderRadius:10, padding:"14px 16px", fontSize:13, color:"#5d4037" }}>
                       No available slots on this date. Please select another day.
                    </div>
                  ) : (
                    <>
                      {/* Legend */}
                      <div style={{ display:"flex", gap:16, marginBottom:12, fontSize:12, color:C.navy, opacity:0.65 }}>
                        <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <span style={{ width:12, height:12, borderRadius:3, background:"#4CAF5018", border:"1.5px solid #4CAF50", display:"inline-block" }}/>
                          Free
                        </span>
                        <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <span style={{ width:12, height:12, borderRadius:3, background:"#f4433618", border:"1.5px solid #f44336", display:"inline-block" }}/>
                          Booked
                        </span>
                        <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <span style={{ width:12, height:12, borderRadius:3, background:C.purple, display:"inline-block" }}/>
                          Selected
                        </span>
                      </div>

                      {/* Slot grid */}
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:8, marginBottom:16 }}>
                        {slots.map(slot => {
                          const isChosen = form.timeSlot === slot.time;
                          return (
                            <div
                              key={slot.time}
                              onClick={() => slot.free && update("timeSlot", slot.time)}
                              style={{
                                padding: "10px 8px",
                                borderRadius: 10,
                                textAlign: "center",
                                border: `2px solid ${isChosen ? C.purple : slot.free ? "#4CAF50" : "#f44336"}`,
                                background:   isChosen ? C.purple : slot.free ? "#4CAF5012" : "#f4433610",
                                color:        isChosen ? "white"  : slot.free ? "#2E7D32"   : "#c62828",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: slot.free ? "pointer" : "not-allowed",
                                transition: "all 0.18s",
                                boxShadow: isChosen ? `0 3px 10px ${C.purple}40` : "none",
                                userSelect: "none",
                              }}
                            >
                              <div style={{ fontSize: 13, fontWeight: 700 }}>{slot.time}</div>
                              {slot.endTime && (
                                <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>→ {slot.endTime}</div>
                              )}
                              {slot.breakMins && (
                                <div style={{ fontSize: 9, opacity: 0.55, marginTop: 1 }}>+{slot.breakMins}m break</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {errors.timeSlot && (
                    <div style={{ background:"#fdecea", border:"1px solid #f44336", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#c62828", marginBottom:12 }}>
                       {errors.timeSlot}
                    </div>
                  )}
                </div>
              )}

              {/* ── Payment mode ─────────────────────────────────────── */}
              <div className="form-group" style={{ marginTop:20, marginBottom:16 }}>
                <label>Mode of Payment</label>
                <select value={form.payment} onChange={e => update("payment", e.target.value)}>
                  <option value="Cash"> Cash (Pay at Salon)</option>
                </select>
                <span style={{ fontSize:11, color:C.navy, opacity:0.45, marginTop:5, display:"block" }}>
                   Online payment options coming soon
                </span>
              </div>

              {/* ── Price summary ─────────────────────────────────────── */}
              {form.price > 0 && (
                <div style={{ background:`${C.lavender}55`, borderRadius:14, padding:"16px 20px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:14, color:C.navy, fontWeight:500 }}>{form.serviceName}</div>
                    <div style={{ fontSize:12, color:C.navy, opacity:0.55, marginTop:3 }}>Time: {form.duration} minutes · {chosenStylist?.name}</div>
                    {form.timeSlot && (
                      <div style={{ fontSize:12, color:C.purple, fontWeight:500, marginTop:3 }}>
                         {form.date} at {form.timeSlot}
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily:"Cormorant Garamond", fontSize:34, fontWeight:700, color:C.purple }}>
                    {formatCurrency(form.price)}
                  </div>
                </div>
              )}

              {/* Submit error */}
              {errors.submit && (
                <div style={{ background:"#fdecea", border:"1px solid #f44336", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#c62828", marginBottom:16 }}>
                   {errors.submit}
                </div>
              )}

              <div style={{ display:"flex", gap:12 }}>
                <button onClick={() => setStep(2)} className="btn-outline" style={{ flex:1, padding:14 }}>← Back</button>
                <button onClick={handleSubmit} className="btn-primary" disabled={submitting} style={{ flex:2, padding:14, fontSize:15 }}>
                  {submitting ? <span className="spinner-sm" /> : "Confirm Booking "}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
