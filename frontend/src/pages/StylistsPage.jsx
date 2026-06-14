import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { C, DAY_NAMES, SERVICES, SERVICE_MAP } from "../utils/constants";
import { stylistAPI } from "../utils/api";

// Star rating renderer
function Stars({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

// Expertise badge — maps service ID → label + icon
function ExpertiseBadge({ serviceId }) {
  const svc = SERVICE_MAP[serviceId];
  if (!svc) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, padding: "3px 10px", borderRadius: 20,
      background: `${C.lavender}70`, color: C.navy, fontWeight: 500,
    }}>
      {svc.icon} {svc.name}
    </span>
  );
}

export default function StylistsPage() {
  const [stylists, setStylists] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [tab,      setTab]      = useState("all"); // "all" | "female" | "male"

  useEffect(() => {
    stylistAPI.getAll()
      .then(r => setStylists(r.data.data || []))
      .catch(() => setError("Could not load stylists. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = stylists.filter(s =>
    tab === "all" ? true : s.gender === tab
  );

  const femaleCount = stylists.filter(s => s.gender === "female").length;
  const maleCount   = stylists.filter(s => s.gender === "male").length;

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: C.cream }}>

      {/*  Hero banner */}
      <div style={{
        background: `linear-gradient(135deg,${C.pink}50,${C.lavender},${C.purple}20)`,
        padding: "60px 24px 48px", textAlign: "center",
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 3, color: C.purple, textTransform: "uppercase", marginBottom: 12 }}>
          THE TEAM
        </p>
        <h1 style={{ fontFamily: "Cormorant Garamond", fontSize: "clamp(32px,5vw,56px)", color: C.purple, fontStyle: "italic", marginBottom: 14 }}>
          Our Expert Stylists
        </h1>
        <p style={{ fontSize: 15, color: C.navy, opacity: 0.65, maxWidth: 520, margin: "0 auto 32px" }}>
          Every stylist at Tutoria is handpicked for their craft, passion and dedication to making you look and feel your best.
        </p>

        {/* Stats strip */}
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px,5vw,60px)", flexWrap: "wrap" }}>
          {[
            ["6+", "Expert Stylists"],
            ["10+", "Years Combined"],
            ["5000+", "Happy Clients"],
            ["4.8★", "Average Rating"],
          ].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond", fontSize: 30, fontWeight: 700, color: C.purple }}>{n}</div>
              <div style={{ fontSize: 11, color: C.navy, opacity: 0.55, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/*  Gender filter tabs  */}
      <div style={{ background: "white", borderBottom: `1px solid ${C.lavender}`, position: "sticky", top: 68, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", gap: 4 }}>
          {[
            ["all",    " All Stylists",     stylists.length],
            ["female", " Female Stylists",  femaleCount],
            ["male",   " Male Stylists",    maleCount],
          ].map(([val, label, count]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              style={{
                padding: "14px 20px",
                background: "none",
                border: "none",
                borderBottom: `3px solid ${tab === val ? C.purple : "transparent"}`,
                color: tab === val ? C.purple : C.navy,
                opacity: tab === val ? 1 : 0.55,
                fontFamily: "DM Sans",
                fontSize: 13,
                fontWeight: tab === val ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {label}
              <span style={{
                marginLeft: 6, fontSize: 11,
                background: tab === val ? `${C.purple}15` : `${C.lavender}80`,
                color: tab === val ? C.purple : C.navy,
                padding: "1px 7px", borderRadius: 20,
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/*  Stylist grid  */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 60px" }}>

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="spinner" />
            <p style={{ fontSize: 13, color: C.navy, opacity: 0.5, marginTop: 14 }}>Loading our team…</p>
          </div>
        )}

        {error && (
          <div style={{ background: "#fdecea", border: "1px solid #f44336", borderRadius: 12, padding: "16px 20px", fontSize: 14, color: "#c62828", textAlign: "center" }}>
             {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ color: C.navy, opacity: 0.55, fontSize: 15 }}>No stylists found in this category.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 28 }}>
            {filtered.map(s => (
              <StylistCard key={s._id} stylist={s} />
            ))}
          </div>
        )}
      </div>

      {/*  Bottom CTA  */}
      <div style={{ background: `linear-gradient(135deg,${C.purple},${C.navy})`, padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: "clamp(24px,4vw,38px)", color: "white", fontStyle: "italic", marginBottom: 10 }}>
          Ready for your transformation?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginBottom: 24 }}>
          Book with any of our experts and experience the Tutoria difference.
        </p>
        <Link to="/book" className="btn-primary" style={{
          display: "inline-block", textDecoration: "none",
          background: "white", color: C.purple, fontWeight: 700,
          padding: "13px 36px", borderRadius: 30, fontSize: 15,
        }}>
          Book an Appointment
        </Link>
      </div>

    </div>
  );
}

/*  Individual Stylist Card  */
function StylistCard({ stylist: s }) {
  const [expanded, setExpanded] = useState(false);

  const genderLabel  = s.gender === "male" ? "Male Stylist" : "Female Stylist";
  const genderColor  = s.gender === "male" ? "#1a73e8" : C.purple;
  const genderBg     = s.gender === "male" ? "#e8f0fe" : `${C.pink}60`;

  // Services this stylist covers
  const expertiseIds = s.expertise || [];

  return (
    <div
      style={{
        background: "white", borderRadius: 24, overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
        transition: "transform 0.3s, box-shadow 0.3s",
        border: `1px solid ${C.lavender}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.13)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.07)";
      }}
    >
      {/* Photo */}
      <div style={{ height: 260, overflow: "hidden", position: "relative" }}>
        <img
          src={s.photo}
          alt={s.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          onError={e => {
            e.target.src = s.gender === "male"
              ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"
              : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80";
          }}
        />
        {/* Gender badge overlay */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: genderBg, color: genderColor,
          fontSize: 11, fontWeight: 600, padding: "4px 12px",
          borderRadius: 20, backdropFilter: "blur(6px)",
        }}>
          {genderLabel}
        </div>
        {/* Rating overlay */}
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(255,255,255,0.92)", borderRadius: 20,
          padding: "4px 12px", display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ color: "#f59e0b", fontSize: 13 }}>★</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{s.rating?.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "22px 22px 20px" }}>

        {/* Name + specialization */}
        <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 26, color: C.purple, marginBottom: 2 }}>
          {s.name}
        </h3>
        <p style={{ fontSize: 13, color: C.navy, opacity: 0.6, marginBottom: 14, fontStyle: "italic" }}>
          {s.specialization}
        </p>

        {/* Key stats row */}
        <div style={{
          display: "flex", gap: 0, marginBottom: 16,
          background: C.cream, borderRadius: 12, overflow: "hidden",
        }}>
          {[
            [`${s.experience} yrs`, "Experience"],
            [ `${s.clientsServed?.toLocaleString("en-IN")}+`, "Clients"],
            [ <Stars rating={s.rating || 4.5} />, "Rating"],
          ].map(([icon, val, label], i) => (
            <div key={label} style={{
              flex: 1, textAlign: "center", padding: "10px 6px",
              borderRight: i < 2 ? `1px solid ${C.lavender}` : "none",
            }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>{val}</div>
              <div style={{ fontSize: 10, color: C.navy, opacity: 0.5 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        {s.bio && (
          <div style={{ marginBottom: 16 }}>
            <p style={{
              fontSize: 13, color: C.navy, opacity: 0.72, lineHeight: 1.65,
              display: "-webkit-box", WebkitLineClamp: expanded ? "unset" : 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
              transition: "all 0.3s",
            }}>
              {s.bio}
            </p>
            {s.bio.length > 100 && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{ background: "none", border: "none", color: C.purple, fontSize: 12, cursor: "pointer", padding: 0, marginTop: 4, fontWeight: 500 }}
              >
                {expanded ? "Show less ▲" : "Read more ▼"}
              </button>
            )}
          </div>
        )}

        {/* Expertise services */}
        {expertiseIds.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.navy, opacity: 0.45, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              Expertise In
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {expertiseIds.map(id => <ExpertiseBadge key={id} serviceId={id} />)}
            </div>
          </div>
        )}

        {/* Working days */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.navy, opacity: 0.45, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            Available Days
          </p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {DAY_NAMES.map((d, i) => (
              <span key={d} style={{
                padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                background: s.days.includes(i) ? genderBg : `${C.lavender}40`,
                color:      s.days.includes(i) ? genderColor : "#bbb",
              }}>
                {d}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: C.navy, opacity: 0.45, marginTop: 6 }}>
             {String(s.workStart).padStart(2,"0")}:00 – {String(s.workEnd).padStart(2,"0")}:00
          </p>
        </div>

        {/* Book button */}
        <Link
          to="/book"
          style={{
            display: "block", textAlign: "center", textDecoration: "none",
            background: `linear-gradient(135deg,${C.purple},${C.navy})`,
            color: "white", padding: "12px 20px", borderRadius: 30,
            fontSize: 14, fontWeight: 600, letterSpacing: 0.3,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Book with {s.name.split(" ")[0]} 
        </Link>
      </div>
    </div>
  );
}
