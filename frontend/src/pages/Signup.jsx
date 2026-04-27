import React, { useState } from "react";
import { api } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    let err = {};

    if (!form.email) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email";

    if (!form.password) err.password = "Password required";
    else if (form.password.length < 6) err.password = "Min 6 characters";

    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSignup = async () => {
    setServerError("");

    if (!validate()) return;

    try {
      const res = await api.signup({
        email: form.email,
        password: form.password,
      });

      if (res.error) {
        setServerError(res.error);
        return;
      }

      navigate("/login");
    } catch {
      setServerError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-6 relative overflow-hidden">
      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full"></div>

      {/* 🔷 CARD */}
      <div className="glass p-10 rounded-3xl w-full max-w-md relative z-10 border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-2 tracking-wide">
          Create Account ✨
        </h2>

        <p className="text-slate-400 text-sm text-center mb-8">
          Start your NeuroPulse journey today
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-800 outline-none border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-1 animate-pulse">
              {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-800 outline-none border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-1 animate-pulse">
              {errors.password}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded-lg bg-gray-800 outline-none border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 ml-1 animate-pulse">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* SERVER ERROR */}
        {serverError && (
          <p className="text-red-200 text-sm text-center mb-3 bg-red-500/10 py-2 rounded-lg">
            {serverError}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          className="w-full bg-cyan-400 text-black font-bold py-3 rounded-lg 
                     hover:scale-105 hover:bg-cyan-300 transition-all duration-300 shadow-lg"
        >
          Sign Up 🚀
        </button>

        {/* FOOTER */}
        <p className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:underline hover:text-cyan-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
