import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C } from "../utils/constants";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from || "/";
  const sessionMsg = location.state?.msg || "";

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm]         = useState({ name:"",email:"",password:"",phone:"" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (isSignup && !form.name)        { setError("Name is required."); return; }

    setLoading(true);
    try {
      let user;
      if (isSignup) {
        user = await register(form.name, form.email, form.password, form.phone);
      } else {
        user = await login(form.email, form.password);
      }
      navigate(user.isAdmin ? "/admin" : from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{ minHeight:"100vh",background:`linear-gradient(135deg,${C.lavender},${C.cream})`,display:"flex",alignItems:"center",justifyContent:"center",padding:"100px 20px 40px" }}>
      <div style={{ background:"white",borderRadius:24,padding:"40px",maxWidth:440,width:"100%",boxShadow:"0 16px 60px rgba(0,0,0,0.1)" }} className="fade-in-up">

        {/* Header */}
        <div style={{ textAlign:"center",marginBottom:32 }}>
          <div style={{ width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.navy})`,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontFamily:"Cormorant Garamond",fontSize:24,fontWeight:600 }}>T</div>
          <h2 style={{ fontFamily:"Cormorant Garamond",fontSize:32,color:C.purple }}>
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p style={{ fontSize:14,color:C.navy,opacity:0.6,marginTop:6 }}>
            {isSignup ? "Join Tutoria Salon today" : "Sign in to your account"}
          </p>
        </div>

        {/* Session expired message */}
        {sessionMsg && (
          <div style={{ background:"#fff8e1",border:"1px solid #ffc107",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#b45309",marginBottom:16 }}>
             {sessionMsg}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background:"#fdecea",border:"1px solid #f44336",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#c62828",marginBottom:16 }}>
             {error}
          </div>
        )}

        {/* Fields */}
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {isSignup && (
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name} onChange={e => setForm({...form,name:e.target.value})}  onKeyDown={handleKey} />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}  onKeyDown={handleKey} />
          </div>
          {isSignup && (
            <div className="form-group">
              <label>Phone Number</label>
              <input value={form.phone} onChange={e => setForm({...form,phone:e.target.value})}  maxLength={10} onKeyDown={handleKey} />
            </div>
          )}
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})}  onKeyDown={handleKey} />
          </div>

          <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ padding:14,width:"100%",marginTop:6,fontSize:15 }}>
            {loading ? <span className="spinner-sm" /> : isSignup ? "Create Account" : "Sign In"}
          </button>

          <button onClick={() => { setIsSignup(!isSignup); setError(""); }} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14,color:C.purple,padding:"4px 0" }}>
            {isSignup ? "Already have an account? Sign In" : "New here? Create Account"}
          </button>
        </div>

  
        {/* <div style={{ marginTop:24,paddingTop:20,borderTop:`1px solid ${C.lavender}`,textAlign:"center" }}>
          <p style={{ fontSize:12,color:C.navy,opacity:0.45,marginBottom:8 }}>Admin access</p>
          <code style={{ fontSize:12,color:C.navy,opacity:0.6,background:C.lavender,padding:"4px 10px",borderRadius:6 }}>
            admin@tutoria.in / admin123
          </code>
        </div> */}
      </div>
    </div>
  );
}
