import React, { useState } from "react";
import { api } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // ✅ STEP 1: SIGNUP
      const signupRes = await api.signup({ email, password });

      if (signupRes.error) {
        alert(signupRes.error);
        setLoading(false);
        return;
      }

      // ✅ STEP 2: AUTO LOGIN
      const loginRes = await api.login({ email, password });

      if (loginRes.token) {
        localStorage.setItem("token", loginRes.token);

        navigate("/dashboard");
      } else {
        alert("Signup successful. Please login manually.");
        navigate("/login");
      }
    } catch (err) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-6">
      {/* BACKGROUND */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full"></div>

      {/* CARD */}
      <div className="glass p-10 rounded-2xl w-full max-w-md relative z-10 border border-white/10 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-center">Create Account</h2>

        <p className="text-slate-400 text-sm text-center mb-8">
          Start your NeuroPulse journey today
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-cyan-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-cyan-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-cyan-400"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-cyan-400 text-black font-bold py-3 rounded-lg hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-slate-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
