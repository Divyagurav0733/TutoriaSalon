import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage        from "./pages/HomePage";
import AboutPage       from "./pages/AboutPage";
import ServicesPage    from "./pages/ServicesPage";
import StylistsPage    from "./pages/StylistsPage";
import HistoryPage     from "./pages/HistoryPage";
import ContactPage     from "./pages/ContactPage";
import BookPage        from "./pages/BookPage";
import LoginPage       from "./pages/LoginPage";
import AccountPage     from "./pages/AccountPage";
import AdminDashboard  from "./pages/AdminDashboard";
import StatisticsPage  from "./pages/StatisticsPage";

const Spinner = () => (
  <div style={{ paddingTop:120, textAlign:"center" }}>
    <div className="spinner" />
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)       return <Spinner />;
  if (!user)         return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/"      replace />;
  return children;
};

const NO_NAVBAR_PATHS  = ["/admin"];
const NO_FOOTER_PATHS  = ["/book", "/login", "/admin"];

function Layout() {
  const location = useLocation();
  const path     = location.pathname;
  const showNav    = !NO_NAVBAR_PATHS.some(p  => path.startsWith(p));
  const showFooter = !NO_FOOTER_PATHS.some(p  => path.startsWith(p));

  return (
    <>
      {showNav    && <Navbar />}
      <main>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/about"       element={<AboutPage />} />
          <Route path="/services"    element={<ServicesPage />} />
          <Route path="/stylists"    element={<StylistsPage />} />
          <Route path="/history"     element={<HistoryPage />} />
          <Route path="/contact"     element={<ContactPage />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/book"        element={<PrivateRoute><BookPage /></PrivateRoute>} />
          <Route path="/account"     element={<PrivateRoute><AccountPage /></PrivateRoute>} />
          <Route path="/admin"       element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/statistics"  element={<AdminRoute><StatisticsPage /></AdminRoute>} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
