import React from "react";
import { MoodProvider } from "./context/MoodContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DataSources from "./pages/DataSources";
import BehaviourAnalytics from "./pages/BehaviourAnalytics";
import RiskPrediction from "./pages/RiskPrediction";
import ActionCenter from "./pages/ActionCenter";

// Styles
import "./styles/tailwind.css";

// =========================
// 🔥 LAYOUT COMPONENT
// =========================
const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === "/";
  const isAuth = path === "/login" || path === "/signup";

  const token = localStorage.getItem("token");

  // 🔐 Prevent logged-in users from accessing login/signup
  if (isAuth && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
      {/* 🌐 NAVBAR (Home + Auth pages only) */}
      {(isHome || isAuth) && <Navbar />}

      {/* 📱 SIDEBAR (Only after login - now responsive) */}
      {!isHome && !isAuth && <Sidebar />}

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 min-h-screen relative overflow-x-hidden transition-all duration-300 ${
          !isHome && !isAuth 
            ? "lg:ml-72 p-6 md:p-10 lg:p-14 mt-16 lg:mt-0" 
            : ""
        }`}
      >
        {/* 🌌 Background Glow */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-500/5 blur-[80px] md:blur-[120px] rounded-full -z-10"></div>

        <Routes>
          {/* 🌐 Public */}
          <Route path="/" element={<Home />} />

          {/* 🔐 Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 📊 Protected App Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/data"
            element={
              <ProtectedRoute>
                <DataSources />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <BehaviourAnalytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/prediction"
            element={
              <ProtectedRoute>
                <RiskPrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/action"
            element={
              <ProtectedRoute>
                <ActionCenter />
              </ProtectedRoute>
            }
          />

          {/* 🔁 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// =========================
// 🚀 MAIN APP
// =========================
function App() {
  return (
    <MoodProvider>
      <Router>
        <Layout />
      </Router>
    </MoodProvider>
  );
}

export default App;