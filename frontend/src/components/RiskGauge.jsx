import { ShieldCheck } from "lucide-react";

const RiskGauge = ({ risk }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - risk / 100);

  return (
    <div className="glass p-10 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden group">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-3xl opacity-30 group-hover:opacity-60 transition duration-500"></div>

      {/* 🔥 SVG GAUGE */}
      <div className="relative flex items-center justify-center">
        <svg className="w-52 h-52 -rotate-90">

          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#1e293b"
            strokeWidth="8"
            fill="transparent"
          />

          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-[2000ms] ease-out"
            style={{
              filter: "drop-shadow(0 0 12px rgba(34,211,238,0.6))",
            }}
          />

          {/* 🔥 Gradient */}
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>

        {/* 🔥 CENTER TEXT */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-black italic text-white tracking-tight drop-shadow-lg">
            {risk}%
          </span>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">
            Neural Load
          </p>
        </div>
      </div>

      {/* 🔥 CONFIDENCE */}
      <div className="mt-6 flex items-center gap-2 text-cyan-400 text-[11px] font-bold uppercase tracking-widest">
        <ShieldCheck size={16} className="animate-pulse" />
        94% Confidence
      </div>

    </div>
  );
};

export default RiskGauge;