import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Smartphone,
  TrendingUp,
  Bot,
  Sparkles,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  // 🔐 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/login";
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={24} />,
    },
    {
      name: "Data Sources",
      path: "/data",
      icon: <Smartphone size={24} />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <TrendingUp size={24} />,
    },
    {
      name: "AI Prediction",
      path: "/prediction",
      icon: <Bot size={24} />,
    },
    {
      name: "Action Center",
      path: "/action",
      icon: <Sparkles size={24} />,
    },
  ];

  return (
    <>
      {/* 📱 MOBILE TOGGLE BUTTON (Visible only on small screens) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-[60] p-2 bg-cyan-400/10 text-cyan-400 rounded-lg border border-white/10 backdrop-blur-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🌫️ MOBILE OVERLAY (Dims background when sidebar is open) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden"
        />
      )}

      {/* 🔷 SIDEBAR */}
      <aside
        className={`glass w-72 h-screen fixed top-0 left-0 p-8 flex flex-col justify-between z-50 border-r border-white/5 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div>
          {/* LOGO */}
          <div className="mb-14 text-3xl font-black tracking-wider text-white">
            <Link to="/" className="cursor-pointer hover:opacity-80 transition">
              Neuro<span className="text-cyan-400">Pulse</span>
            </Link>
          </div>

          {/* NAV */}
          <nav className="space-y-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)} // Auto-close on mobile after clicking
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-400 border-l-4 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                      : "text-gray-300 hover:bg-cyan-400/5 hover:text-cyan-400 hover:translate-x-2 hover:scale-[1.02]"
                  }`
                }
              >
                {/* ICON */}
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>

                {/* TEXT */}
                <span className="text-[16px] font-medium tracking-wide">
                  {item.name}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 🔻 BOTTOM SECTION */}
        <div className="mt-10 space-y-4">
          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-4 px-4 py-3 w-full rounded-xl transition-all duration-300 text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:translate-x-2"
          >
            <LogOut size={24} className="group-hover:scale-110 transition" />
            <span className="text-[16px] font-medium tracking-wide">Logout</span>
          </button>

          {/* COPYRIGHT */}
          <div className="text-xs text-gray-500 px-4">© NeuroPulse</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;