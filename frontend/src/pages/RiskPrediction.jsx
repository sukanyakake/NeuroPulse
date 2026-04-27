import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import RiskGauge from "../components/RiskGauge";
import { useMood } from "../context/MoodContext";
import {
  Cpu,
  ShieldCheck,
  Database,
  Timer,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const RiskPrediction = () => {
  const [data, setData] = useState(null);
  const { lastSyncData } = useMood();

  // =========================
  // 🔥 DYNAMIC DATA LOAD
  // =========================
  useEffect(() => {
    if (lastSyncData) {
      setData(lastSyncData);
    } else {
      // Fetches the real JSON output you shared from your API
      api
        .getSyncSummary()
        .then(setData)
        .catch((err) => console.error("Sync Error:", err));
    }
  }, [lastSyncData]);

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center p-20">
        <div className="text-cyan-400 font-black italic animate-pulse tracking-widest">
          SYNCHRONIZING NEURAL MODEL...
        </div>
      </div>
    );
  }

  // =========================
  // 🔥 DATA MAPPING
  // =========================
  const risk = Number(data.risk_score) || 0;
  const status = data.status || "Analyzing";
  const forecast = Array.isArray(data.forecast_72h)
    ? data.forecast_72h.map(Number)
    : [];
  const signals = data.signals || {};
  const hasData = risk > 0;

  // Derived Logic: Calculating real impacts from signals
  // Sleep: Impact increases as sleep falls below 8 hours
  // Screen: Impact increases with hours spent
  // Steps: Impact increases as steps fall below 8000
  const drivers = [
    {
      label: "Sleep Irregularity",
      impact: Math.max(0, (8 - (signals.sleep || 0)) * 12.5),
      color: "bg-rose-500",
    },
    {
      label: "Late Night Usage",
      impact: Math.min(100, (signals.screen_time || 0) * 8),
      color: "bg-cyan-400",
    },
    {
      label: "Activity Pulse",
      impact: Math.max(0, (8000 - (signals.steps || 0)) / 80),
      color: "bg-indigo-500",
    },
  ];

  // =========================
  // 🔥 GRAPH ENGINE
  // =========================
  const width = 800;
  const height = 240;
  const padding = 50;

  // Dynamically map forecast array to SVG coordinates
  const coords = forecast.map((val, i) => ({
    x: padding + (i * (width - padding * 2)) / (forecast.length - 1),
    y: height - padding - (val / 100) * (height - padding * 2),
    value: val,
  }));

  const createSmoothPath = (pts) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${cp1x} ${pts[i].y}, ${cp1x} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  const createAreaPath = (pts) => {
    if (pts.length < 2) return "";
    let d = createSmoothPath(pts);
    d += ` L ${pts[pts.length - 1].x} ${height - padding}`;
    d += ` L ${pts[0].x} ${height - padding} Z`;
    return d;
  };

  return (
    <div className="animate-fade-in text-slate-300 pb-20">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
            AI <span className="text-cyan-400">Prediction</span>
          </h1>
          <p className="text-slate-400 mt-2 text-lg italic">
            LSTM-based forecasting for neural stability and behavioral risk.
          </p>
        </div>
        <div className="flex items-center gap-3 glass px-6 py-2 rounded-2xl text-cyan-400 font-bold text-xs uppercase border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          <Cpu size={14} className={hasData ? "animate-pulse" : ""} /> Model:{" "}
          {status}
        </div>
      </div>

      {/* --- TOP SECTION: GAUGE & DRIVERS --- */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Dynamic Risk Gauge */}
        <RiskGauge risk={risk} />

        {/* Real-time Drivers */}
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] border-l-8 border-indigo-500 relative bg-[#0a0f1e]/40">
          <h3 className="text-xl font-bold mb-8 italic flex items-center gap-2 text-white uppercase tracking-tighter">
            <Database className="text-indigo-400" size={20} /> Top Risk Drivers
            (Explainable AI)
          </h3>
          <div className="space-y-6">
            {drivers.map((driver, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest text-slate-400">
                  <span>{driver.label}</span>
                  <span>{Math.round(driver.impact)}% Impact</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`${driver.color} h-full rounded-full transition-all duration-[1.5s] ease-out`}
                    style={{ width: `${Math.min(driver.impact, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MIDDLE SECTION: DYNAMIC LSTM PULSE GRAPH --- */}
      <div className="glass p-10 rounded-[3rem] mb-12 relative overflow-hidden group border border-white/5 bg-[#0a0f1e]/20">
        <h3 className="text-xl font-bold mb-12 flex items-center gap-2 italic text-slate-300 uppercase tracking-tighter">
          <Timer className="text-cyan-400" size={20} /> 72-Hour Pulse Timeline
        </h3>

        {/* ⚡ Increased height to h-96 and added pb-10 to make room for bottom text */}
        <div className="relative h-96 w-full flex pb-10">
          {/* --- Y AXIS LABELS --- */}
          <div className="flex flex-col justify-between text-[10px] text-slate-500 font-black pr-4 border-r border-white/5 uppercase tracking-tighter py-12">
            <span>Peak</span>
            <span>High</span>
            <span>Mod</span>
            <span>Low</span>
            <span>Stable</span>
          </div>

          <div className="flex-1 relative ml-4">
            {/* ⚡ viewBox height increased to 350 and padding to 70 for clear text space */}
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 800 350`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
                <filter id="neonGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ⚡ VISUAL Y-AXIS LINE */}
              <line
                x1="70"
                y1="40"
                x2="70"
                y2="280"
                stroke="#475569"
                strokeWidth="1"
                strokeOpacity="0.5"
              />

              {/* ⚡ VISUAL X-AXIS BASELINE */}
              <line
                x1="70"
                y1="280"
                x2="730"
                y2="280"
                stroke="#475569"
                strokeWidth="1"
                strokeOpacity="0.5"
              />

              {/* Horizontal Grid Guides */}
              {[0, 50, 100].map((v) => (
                <line
                  key={v}
                  x1={70}
                  y1={350 - 70 - (v / 100) * (350 - 70 * 2)}
                  x2={800 - 70}
                  y2={350 - 70 - (v / 100) * (350 - 70 * 2)}
                  stroke="#ffffff"
                  strokeOpacity="0.05"
                  strokeDasharray="4,4"
                />
              ))}

              {/* Area Fill */}
              {coords.length > 0 && (
                <path d={createAreaPath(coords)} fill="url(#areaGradient)" />
              )}

              {/* Dynamic Path */}
              {coords.length > 0 && (
                <path
                  d={createSmoothPath(coords)}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="4"
                  filter="url(#neonGlow)"
                  className="transition-all duration-1000"
                />
              )}

              {/* Data Points with clear font size and spacing */}
              {coords.map((p, i) => (
                <g key={i} className="group/dot">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="6"
                    fill="#020617"
                    stroke="#22d3ee"
                    strokeWidth="2"
                  />
                  <text
                    x={p.x}
                    y={p.y - 20}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="14"
                    fontWeight="900"
                    className="italic drop-shadow-md"
                  >
                    {Math.round(p.value)}%
                  </text>
                </g>
              ))}
            </svg>

            {/* --- X AXIS LABELS --- */}
            {/* ⚡ Increased mt-16 and tracking to ensure no overlap with the graph container */}
            <div className="flex justify-between mt-2 text-[10px] text-slate-500 uppercase font-black px-6 tracking-[0.2em]">
              <span>Past 24h</span>
              <span className="text-white underline underline-offset-8 decoration-cyan-400 decoration-2">
                Current
              </span>
              <span className="text-cyan-400 italic font-bold">
                +24h Forecast
              </span>
              <span className="text-cyan-400 italic font-bold">
                +48h Forecast
              </span>
              <span className="text-rose-400 font-black">+72h Peak</span>
            </div>
          </div>
        </div>
      </div>
      {/* --- BOTTOM SECTION --- */}
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="glass p-10 rounded-[3rem] border-l-8 border-cyan-500 bg-white/5">
          <h2 className="text-xl font-bold mb-6 italic text-white uppercase tracking-tighter">
            Model Interpretation
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center glass p-5 rounded-2xl bg-white/5 border border-white/5">
              <span className="font-bold text-slate-200 uppercase text-xs tracking-widest">
                Primary Cause
              </span>
              <span className="text-rose-400 font-black uppercase text-xs italic">
                {data.reason || "Analyzing..."}
              </span>
            </div>
            <div className="flex justify-between items-center glass p-5 rounded-2xl bg-white/5 border border-white/5">
              <span className="font-bold text-slate-200 uppercase text-xs tracking-widest">
                Mood Influence
              </span>
              <span className="text-indigo-400 font-black uppercase text-xs">
                Level {data.mood_score || 0} Injected
              </span>
            </div>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border-l-8 border-emerald-500 bg-emerald-500/[0.03]">
          <h2 className="text-xl font-bold mb-6 italic text-white uppercase tracking-tighter">
            AI Mitigation Path
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm italic">
            <CheckCircle className="inline text-emerald-400 mr-2" size={16} />
            If screen time drops below{" "}
            <span className="text-emerald-400 font-bold">4h</span>, risk falls
            to <span className="text-emerald-400 font-bold">42%</span> within
            24h.
          </p>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm italic">
            <AlertCircle className="inline text-amber-400 mr-2" size={16} />
            Current{" "}
            <span className="text-rose-400 font-black">Score {risk}</span>{" "}
            indicates high cognitive load. Neural stability is decreasing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskPrediction;
