import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../utils/api";
import { C } from "../utils/constants";
import { formatCurrency } from "../utils/helpers";

/* Tiny bar chart (pure CSS/SVG)  */
function MiniBarChart({ data, labelKey, valueKey, color }) {
  if (!data || data.length === 0) return <p style={{ color: C.navy, opacity: 0.4, fontSize: 13 }}>No data yet</p>;
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: C.navy, opacity: 0.7, width: 130, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d[labelKey]}</span>
          <div style={{ flex: 1, background: `${color}20`, borderRadius: 6, height: 20, overflow: "hidden" }}>
            <div style={{
              width: `${Math.max(4, (d[valueKey] / max) * 100)}%`,
              height: "100%",
              background: color,
              borderRadius: 6,
              transition: "width 0.8s ease",
            }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color, width: 40, textAlign: "right", flexShrink: 0 }}>{d[valueKey]}</span>
        </div>
      ))}
    </div>
  );
}

/*  Stat card  */
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: "24px 20px",
      boxShadow: "0 4px 20px rgba(55,37,73,0.08)",
      borderLeft: `4px solid ${color}`,
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: "'Cormorant Garamond',serif" }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: C.navy, opacity: 0.5 }}>{sub}</div>}
    </div>
  );
}

/*  Section wrapper  */
function Section({ title, children }) {
  return (
    <div style={{
      background: "white", borderRadius: 20, padding: 28,
      boxShadow: "0 4px 20px rgba(55,37,73,0.07)",
      marginBottom: 24,
    }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.purple, marginBottom: 20 }}>{title}</h3>
      {children}
    </div>
  );
}

/*  PowerBI Embed Panel  */
function PowerBIPanel({ embedUrl, onUrlChange }) {
  const [inputVal, setInputVal] = useState(embedUrl || "");
  const [editing, setEditing]   = useState(!embedUrl);

  const handleSave = () => {
    onUrlChange(inputVal.trim());
    if (inputVal.trim()) setEditing(false);
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: C.purple, marginBottom: 4 }}>
            Power BI Dashboard
          </h2>
          <p style={{ fontSize: 13, color: C.navy, opacity: 0.55 }}>
            Paste your Power BI Embed URL below to display your published report
          </p>
        </div>
        {!editing && embedUrl && (
          <button onClick={() => setEditing(true)} style={{
            background: `${C.mauve}15`, border: `1.5px solid ${C.mauve}`,
            color: C.mauve, padding: "8px 16px", borderRadius: 20,
            cursor: "pointer", fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: 500,
          }}>Change URL</button>
        )}
      </div>

      {/* URL input */}
      {editing && (
        <div style={{
          background: `${C.lavender}40`, borderRadius: 16, padding: 20,
          marginBottom: 16, border: `1px dashed ${C.mauve}`,
        }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
            Power BI Embed URL
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
              style={{
                flex: 1, minWidth: 260, padding: "10px 14px", borderRadius: 10,
                border: `1.5px solid ${C.lavender}`, fontSize: 13, fontFamily: "'Inter',sans-serif",
                outline: "none",
              }}
            />
            <button onClick={handleSave} style={{
              background: C.purple, color: "white",
              padding: "10px 22px", borderRadius: 10,
              border: "none", cursor: "pointer", fontSize: 13,
              fontFamily: "'Inter',sans-serif", fontWeight: 600,
            }}>Embed</button>
          </div>
          <p style={{ fontSize: 12, color: C.navy, opacity: 0.5, marginTop: 8 }}>
            In Power BI Service → File → Embed Report → Website or portal → copy the iframe src URL
          </p>
        </div>
      )}

      {/* Iframe */}
      {embedUrl ? (
        <div style={{
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 4px 24px rgba(55,37,73,0.12)",
          border: `1px solid ${C.lavender}`,
          background: "#f8f6f9",
        }}>
          <iframe
            title="Power BI Report"
            src={embedUrl}
            width="100%"
            height="600"
            style={{ border: "none", display: "block" }}
            allowFullScreen
          />
        </div>
      ) : (
        !editing && (
          <div style={{
            borderRadius: 16, border: `2px dashed ${C.lavender}`,
            height: 300, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
            background: `${C.cream}30`,
          }}>
            <div style={{ fontSize: 48 }}></div>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.purple }}>No report embedded yet</p>
            <p style={{ fontSize: 13, color: C.navy, opacity: 0.5 }}>Click the button above to add your Power BI URL</p>
            <button onClick={() => setEditing(true)} style={{
              marginTop: 8, background: C.purple, color: "white",
              padding: "10px 22px", borderRadius: 20, border: "none",
              cursor: "pointer", fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: 500,
            }}>+ Add Power BI Report</button>
          </div>
        )
      )}
    </div>
  );
}

/*  Main Statistics Page  */
export default function StatisticsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [powerBiUrl, setPowerBiUrl] = useState(() => localStorage.getItem("tutoria_powerbi_url") || "");

  // Admin-only guard
  useEffect(() => {
    if (user && !user.isAdmin) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    setLoading(true);
    adminAPI.getAnalytics()
      .then(res => setAnalytics(res.data.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePowerBiUrl = (url) => {
    setPowerBiUrl(url);
    if (url) localStorage.setItem("tutoria_powerbi_url", url);
    else localStorage.removeItem("tutoria_powerbi_url");
  };

  if (!user || !user.isAdmin) return null;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.lavender}40,${C.cream}60)`, paddingTop: 88 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Page Title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", color: C.purple, marginBottom: 6 }}>
            Statistics & Analytics
          </h1>
          <p style={{ fontSize: 14, color: C.navy, opacity: 0.55 }}>
            Salon performance overview · Power BI integration
          </p>
        </div>

        {/* ── Power BI Section ── */}
        <div style={{
          background: "white", borderRadius: 20, padding: 28,
          boxShadow: "0 4px 20px rgba(55,37,73,0.07)", marginBottom: 28,
        }}>
          <PowerBIPanel embedUrl={powerBiUrl} onUrlChange={handlePowerBiUrl} />
        </div>

        {/* ── Native Stats ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <div className="spinner" />
            <p style={{ marginTop: 12, color: C.navy, opacity: 0.5 }}>Loading analytics…</p>
          </div>
        ) : error ? (
          <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 12, padding: 20, color: "#c00", fontSize: 14 }}>
             {error}
          </div>
        ) : analytics ? (
          <>
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
              <StatCard  label="Total Bookings" value={analytics.summary.totalBookings} sub="All time (non-cancelled)" color={C.purple} />
              <StatCard  label="Total Revenue"  value={formatCurrency(analytics.summary.totalRevenue)}  sub="Excluding cancellations" color={C.rose} />
              <StatCard  label="Unique Customers" value={analytics.summary.totalCustomers} sub="Distinct users booked" color={C.mauve} />
              <StatCard  label="Booked Today" value={analytics.summary.todayCount} sub="Appointments today" color="#4CAF50" />
            </div>

            {/* Two-column row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24, marginBottom: 24 }}>

              {/* Top Services by Bookings */}
              <Section title="Most Booked Services">
                <MiniBarChart
                  data={analytics.topServices}
                  labelKey="_id"
                  valueKey="count"
                  color={C.purple}
                />
              </Section>

              {/* Top Services by Revenue */}
              <Section title="Top Services by Revenue">
                <MiniBarChart
                  data={analytics.topServices.slice().sort((a,b) => b.revenue - a.revenue)}
                  labelKey="_id"
                  valueKey="revenue"
                  color={C.rose}
                />
                <p style={{ fontSize: 11, color: C.navy, opacity: 0.4, marginTop: 12 }}>Values in ₹</p>
              </Section>

            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24, marginBottom: 24 }}>

              {/* Top Stylists */}
              <Section title="Top Stylists">
                <MiniBarChart
                  data={analytics.topStylists.map(s => ({ _id: s.name, count: s.count }))}
                  labelKey="_id"
                  valueKey="count"
                  color={C.mauve}
                />
              </Section>

              {/* Bookings by Status */}
              <Section title="Bookings by Status">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {analytics.bookingsByStatus.map(s => {
                    const colors = { upcoming: "#4CAF50", completed: C.purple, cancelled: C.rose };
                    return (
                      <div key={s._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: `${colors[s._id] || C.navy}10` }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: C.navy, textTransform: "capitalize" }}>{s._id}</span>
                        <span style={{ fontSize: 18, fontWeight: 700, color: colors[s._id] || C.navy }}>{s.count}</span>
                      </div>
                    );
                  })}
                </div>
              </Section>

            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24, marginBottom: 24 }}>

              {/* Bookings by Gender */}
              <Section title="👤 Bookings by Gender">
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {analytics.bookingsByGender.map(g => {
                    const clrs = { female: C.rose, male: C.purple, other: C.mauve };
                    return (
                      <div key={g._id} style={{
                        flex: 1, minWidth: 100, textAlign: "center", padding: "18px 12px",
                        background: `${clrs[g._id] || C.navy}10`, borderRadius: 12,
                        border: `1.5px solid ${clrs[g._id] || C.navy}30`,
                      }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: clrs[g._id] || C.navy }}>{g.count}</div>
                        <div style={{ fontSize: 12, color: C.navy, textTransform: "capitalize", marginTop: 4 }}>{g._id}</div>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* Payment Methods */}
              <Section title="Payment Methods">
                <MiniBarChart
                  data={analytics.bookingsByPayment}
                  labelKey="_id"
                  valueKey="count"
                  color="#4CAF50"
                />
              </Section>

            </div>

            {/* Monthly Revenue */}
            <Section title=" Monthly Revenue (Last 6 Months)">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                {analytics.monthlyRevenue.length === 0 ? (
                  <p style={{ color: C.navy, opacity: 0.4, fontSize: 13 }}>No data yet</p>
                ) : (
                  (() => {
                    const maxRev = Math.max(...analytics.monthlyRevenue.map(m => m.revenue));
                    return analytics.monthlyRevenue.map((m, i) => (
                      <div key={i} style={{ flex: 1, minWidth: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: C.navy, opacity: 0.6, fontWeight: 600 }}>{formatCurrency(m.revenue)}</span>
                        <div style={{
                          width: "100%", background: `${C.purple}15`, borderRadius: "6px 6px 0 0",
                          display: "flex", alignItems: "flex-end",
                          height: 120,
                        }}>
                          <div style={{
                            width: "100%", background: `linear-gradient(to top,${C.purple},${C.mauve})`,
                            height: `${Math.max(8, (m.revenue / maxRev) * 100)}%`,
                            borderRadius: "6px 6px 0 0", transition: "height 0.8s ease",
                          }} />
                        </div>
                        <span style={{ fontSize: 11, color: C.navy, opacity: 0.6 }}>{m._id}</span>
                        <span style={{ fontSize: 10, color: C.navy, opacity: 0.4 }}>{m.count} bookings</span>
                      </div>
                    ));
                  })()
                )}
              </div>
            </Section>

          </>
        ) : null}
      </div>
    </div>
  );
}
