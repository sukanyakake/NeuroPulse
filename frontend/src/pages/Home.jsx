import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import analysis from "../assets/images/analysis.png"
import prediction from "../assets/images/prediction.png"
import dashboard from "../assets/images/dashboard.png"

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#020617] text-slate-300 overflow-x-hidden">
      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-xs uppercase tracking-widest text-slate-400">
              AI Mental Health Intelligence
            </span>
          </div>

          <h1 className="text-7xl font-black text-white mb-6">
            NEURO<span className="text-cyan-400">PULSE</span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
            NeuroPulse is an AI-powered behavioral intelligence system that
            continuously analyzes your daily habits — including sleep patterns,
            screen usage, physical activity, and mood — to detect early signs of
            mental stress.
            <br />
            <br />
            Using advanced LSTM-based models, it predicts future mental risk
            trends and provides actionable insights before issues escalate.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-10 py-4 bg-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition"
          >
            Open Dashboard →
          </button>
        </div>
      </section>

      {/* =========================
          ABOUT
      ========================= */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">About NeuroPulse</h2>

        <p className="text-slate-400 leading-relaxed text-lg">
          Mental health challenges often build silently through everyday habits
          such as poor sleep, excessive screen time, and low physical activity.
          <br />
          <br />
          NeuroPulse bridges the gap between raw behavioral data and meaningful
          insights by using AI to identify patterns over time.
          <br />
          <br />
          Instead of relying on manual inputs or surveys, it automatically
          tracks behavioral signals and explains *why* your mental state is
          changing — empowering you to take action early.
        </p>
      </section>

      {/* =========================
          FEATURES
      ========================= */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <h2 className="text-4xl text-white font-bold text-center mb-16">
          Core Features
        </h2>

        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <Feature
            icon="📊"
            title="Risk Prediction"
            desc="AI computes real-time mental risk score using behavioral signals."
          />

          <Feature
            icon="📈"
            title="72h Forecast"
            desc="Predicts how your mental state evolves over the next 3 days."
          />

          <Feature
            icon="🧠"
            title="Explainable AI"
            desc="Shows clear reasons behind risk like low sleep or high usage."
          />

          <Feature
            icon="⚡"
            title="Real-time Sync"
            desc="Automatically updates data without manual tracking."
          />
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================= */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <Step
            title="Collect Data"
            desc="Sleep, steps, screen time and mood are captured daily."
          />

          <Step
            title="AI Analysis"
            desc="LSTM model detects patterns and behavioral trends."
          />

          <Step
            title="Insights"
            desc="Risk score, forecast and recommendations are generated."
          />
        </div>
      </section>

      {/* =========================
          GALLERY
      ========================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl text-white font-bold text-center mb-16">
          Product Preview
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <GalleryCard
            title="Dashboard"
            desc="View real-time metrics including risk score, sleep, and activity."
            img={dashboard}
          />

          <GalleryCard
            title="Prediction"
            desc="Explore AI-based risk forecasting with future trend analysis."
            img={prediction}
          />

          <GalleryCard
            title="Analytics"
            desc="Understand behavioral correlations and long-term patterns."
            img={analysis}
          />
        </div>
      </section>

      {/* =========================
          CONTACT
      ========================= */}
      <section className="py-24 px-6 bg-white/[0.02] text-center">
        <h2 className="text-4xl text-white font-bold mb-8">Contact Us</h2>

        <p className="text-slate-400 mb-6 text-lg">
          Interested in this project or want to collaborate?
          <br />
          Feel free to reach out.
        </p>

        <div className="text-slate-300 space-y-2">
          <p>📧 neuropulse@gmail.com</p>
          <p>📍 RGUKT, Andhra Pradesh</p>
        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}
      <section className="py-24 text-center">
        <h2 className="text-3xl text-white font-bold mb-6">
          Take control of your mental wellbeing
        </h2>

        <p className="text-slate-400 mb-8">
          Start exploring your behavioral insights in real time.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-10 py-4 bg-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition"
        >
          Go to Dashboard
        </button>
      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm">
          © 2026 NeuroPulse • AI Mental Health System
        </p>
      </footer>
    </div>
  );
};

/* =========================
   COMPONENTS
========================= */

const Feature = ({ icon, title, desc }) => (
  <div className="glass p-6 rounded-xl text-center hover:scale-105 transition">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-white font-bold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{desc}</p>
  </div>
);

const Step = ({ title, desc }) => (
  <div className="glass p-8 rounded-xl">
    <h3 className="text-white font-bold mb-2">{title}</h3>
    <p className="text-slate-400">{desc}</p>
  </div>
);

const GalleryCard = ({ title, desc,img }) => (
  <div className="glass p-8 rounded-xl text-center hover:scale-105 transition">
    <img src={img} />
    <p className="text-white font-bold mb-2">{title}</p>
    <p className="text-slate-400 text-sm">{desc}</p>
  </div>
);

export default Home;
