import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for responsive toggle

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to track mobile menu

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    window.location.href = "/login";
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-10 py-5 bg-[#020617]/80 backdrop-blur-md z-50 border-b border-white/5">
      {/* LOGO */}
      <div
        onClick={() => {
          navigate("/");
          closeMenu();
        }}
        className="text-2xl font-black cursor-pointer z-[60]"
      >
        Neuro<span className="text-cyan-400">Pulse</span>
      </div>

      {/* MOBILE HAMBURGER ICON - Visible only on small screens */}
      <div className="md:hidden flex items-center z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU - Desktop (flex) and Mobile (hidden/absolute) */}
      <div
        className={`${
          isOpen
            ? "flex flex-col absolute top-0 left-0 w-full h-screen bg-[#020617] justify-center items-center gap-10"
            : "hidden"
        } md:static md:h-auto md:w-auto md:bg-transparent md:flex md:flex-row md:items-center md:gap-8 text-sm text-gray-300 transition-all duration-300`}
      >
        <button
          onClick={() => {
            navigate("/");
            closeMenu();
          }}
        >
          Home
        </button>
        <button
          onClick={() => {
            navigate("/dashboard");
            closeMenu();
          }}
        >
          Dashboard
        </button>

        {/* AUTH BUTTONS */}
        <button
          onClick={() => {
            navigate("/login");
            closeMenu();
          }}
          className="hover:text-cyan-400"
        >
          Login
        </button>

        <button
          onClick={() => {
            navigate("/signup");
            closeMenu();
          }}
          className="bg-cyan-400 text-black px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Navbar;