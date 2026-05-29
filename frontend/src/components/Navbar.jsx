import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C } from "../utils/constants";

const NAV_LINKS = [
  { label: "Home",     to: "/" },
  { label: "About",    to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Stylists", to: "/stylists" },
  { label: "History",  to: "/history" },
  { label: "Contact",  to: "/contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "white",
      borderBottom: `1px solid ${C.lavender}`,
      transition: "box-shadow 0.3s",
      padding: "0 24px",
      boxShadow: scrolled ? "0 2px 20px rgba(17,19,68,0.1)" : "0 1px 4px rgba(17,19,68,0.05)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: `linear-gradient(135deg,${C.purple},${C.navy})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontFamily: "'Playfair Display',serif",
            fontSize: 18, fontWeight: 700,
            boxShadow: `0 3px 12px rgba(82,21,78,0.3)`,
          }}>T</div>
          <span style={{
            fontFamily: "'Playfair Display',serif", fontSize: 22,
            fontWeight: 600, color: C.purple, letterSpacing: 0.5,
          }}>Tutoria</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 2, alignItems: "center" }} className="desktop-nav">
          {/* Nav links */}
          {NAV_LINKS.map((n) => (
            <Link key={n.to} to={n.to} style={{
              padding: "8px 13px",
              fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500,
              color: isActive(n.to) ? C.purple : C.navy,
              opacity: isActive(n.to) ? 1 : 0.65,
              borderBottom: `2px solid ${isActive(n.to) ? C.purple : "transparent"}`,
              transition: "all 0.2s", textDecoration: "none",
            }}
              onMouseEnter={e => { if (!isActive(n.to)) { e.currentTarget.style.color = C.purple; e.currentTarget.style.opacity = "1"; }}}
              onMouseLeave={e => { if (!isActive(n.to)) { e.currentTarget.style.color = C.navy; e.currentTarget.style.opacity = "0.65"; }}}
            >{n.label}</Link>
          ))}

          {/* Auth buttons */}
          {user ? (
            <div style={{ display: "flex", gap: 8, marginLeft: 12, alignItems: "center" }}>

              {/* Statistics — admin only, chart icon */}
              {user.isAdmin && (
                <Link to="/statistics" style={{
                  background: isActive("/statistics") ? C.rose : `${C.rose}15`,
                  color: isActive("/statistics") ? "white" : C.rose,
                  border: `1.5px solid ${C.rose}`,
                  padding: "7px 14px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600, textDecoration: "none",
                  letterSpacing: 0.3, transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  📊 Statistics
                </Link>
              )}

              {/* Admin — dark navy, clearly visible */}
              {user.isAdmin && (
                <Link to="/admin" style={{
                  background: C.navy,
                  color: "white",
                  padding: "8px 14px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600, textDecoration: "none",
                  letterSpacing: 0.3,
                  boxShadow: `0 2px 8px rgba(17,19,68,0.25)`,
                }}>🔐 Admin</Link>
              )}

              {/* Account — purple border + text on white */}
              <Link to="/account" style={{
                background: "white",
                border: `1.5px solid ${C.purple}`,
                padding: "7px 16px", borderRadius: 20,
                fontSize: 13, fontWeight: 500,
                color: C.purple, textDecoration: "none",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.purple; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = C.purple; }}
              >👤 {user.name.split(" ")[0]}</Link>

              {/* Logout — navy border + text on white */}
              <button onClick={handleLogout} style={{
                background: "white",
                border: `1.5px solid ${C.navy}`,
                padding: "7px 14px", borderRadius: 20,
                cursor: "pointer", fontSize: 13,
                color: C.navy, transition: "all 0.2s",
                fontFamily: "'Inter',sans-serif",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = C.navy; }}
              >Logout</button>
            </div>
          ) : (
            /* Sign In — solid purple button, always visible */
            <Link to="/login" style={{
              marginLeft: 12, padding: "9px 22px", borderRadius: 20,
              background: C.purple, color: "white",
              fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500,
              textDecoration: "none", transition: "all 0.2s",
              boxShadow: `0 3px 12px rgba(82,21,78,0.3)`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.navy; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.purple; }}
            >Sign In</Link>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger-btn"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5 }}>
          <div style={{ width: 22, height: 2, background: C.purple, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
          <div style={{ width: 22, height: 2, background: C.purple, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 22, height: 2, background: C.purple, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: "white", borderTop: `2px solid ${C.purple}`, padding: "12px 24px 24px", animation: "slideDown 0.2s ease" }}>
          {NAV_LINKS.map((n) => (
            <Link key={n.to} to={n.to} style={{
              display: "block", padding: "12px 0",
              fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 500,
              color: isActive(n.to) ? C.purple : C.navy,
              borderBottom: `1px solid ${C.lavender}`, textDecoration: "none",
            }}>{n.label}</Link>
          ))}
          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/statistics" style={{
                    flex: 1, textAlign: "center", background: `${C.rose}15`,
                    color: C.rose, border: `1.5px solid ${C.rose}`,
                    padding: "10px 16px", borderRadius: 20, textDecoration: "none",
                    fontSize: 12, fontWeight: 700,
                  }}>📊 Statistics</Link>
                )}
                {user.isAdmin && (
                  <Link to="/admin" style={{
                    flex: 1, textAlign: "center", background: C.navy, color: "white",
                    padding: "10px 16px", borderRadius: 20, textDecoration: "none",
                    fontSize: 12, fontWeight: 700,
                  }}>🔐 Admin</Link>
                )}
                <Link to="/account" style={{
                  flex: 1, textAlign: "center",
                  background: "white", border: `1.5px solid ${C.purple}`,
                  color: C.purple, padding: "10px 16px", borderRadius: 20,
                  textDecoration: "none", fontSize: 13, fontWeight: 500,
                }}>My Account</Link>
                <button onClick={handleLogout} style={{
                  flex: 1, background: "white", border: `1.5px solid ${C.navy}`,
                  color: C.navy, padding: "10px 16px", borderRadius: 20,
                  cursor: "pointer", fontSize: 13, fontFamily: "'Inter',sans-serif",
                }}>Logout</button>
              </>
            ) : (
              <Link to="/login" style={{
                width: "100%", textAlign: "center", display: "block",
                background: C.purple, color: "white",
                padding: "12px 20px", borderRadius: 20, textDecoration: "none",
                fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500,
              }}>Sign In</Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px){ .desktop-nav{display:none!important} .hamburger-btn{display:flex!important} }
        @media(min-width:769px){ .hamburger-btn{display:none!important} }
      `}</style>
    </nav>
  );
}
