import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);  // checking localStorage on mount

  // On mount: restore user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tutoria_user");
    const token  = localStorage.getItem("tutoria_token");
    if (stored && token) {
      try { setUser(JSON.parse(stored)); }
      catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const saveSession = (userData) => {
    localStorage.setItem("tutoria_user",  JSON.stringify(userData));
    localStorage.setItem("tutoria_token", userData.token);
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    saveSession(res.data.data);
    return res.data.data;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone });
    saveSession(res.data.data);
    return res.data.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("tutoria_user");
    localStorage.removeItem("tutoria_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
