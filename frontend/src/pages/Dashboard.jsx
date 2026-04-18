import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import MetricCard from "../components/MetricCard";
import GlassCard from "../components/GlassCard";
import TrendChart from "../components/TrendChart";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getDashboard().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center p-10 md:p-20">
        <div className="text-cyan-400 font-black italic animate-pulse">
          SYNCING AI CORE...
        </div>
      </div>
    );
  }

  const signals = data.signals || {};

  // =========================
  // 🚨 NO DATA CHECK
  // =========================
  const noData = data.status === "No Data" || data.risk_score === 0;

  return (
    <div className="animate-fade-in max-w-full">
      {/* HEADER - Updated to stack on small screens */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">
            Risk <span className="text-cyan-400">Intelligence</span>
          </h1>
          <p className="text-slate-400 mt-2 text-base md:text-lg">
            Daily Behavioral Analysis & Mood Correlation.
          </p>
        </div>

        <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl text-cyan-400 font-bold text-[10px] md:text-xs uppercase">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
          AI Core Active
        </div>
      </div>

      {/* =========================
          🚨 NO DATA UI
      ========================= */}
      {noData ? (
        <div className="glass p-8 md:p-12 rounded-3xl text-center">
          <h2 className="text-2xl md:text-3xl text-yellow-400 font-bold mb-4">
            No Data Available
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            You haven’t synced your data today. Please sync to generate AI
            insights.
          </p>
        </div>
      ) : (
        <>
          {/* =========================
              METRICS - Changed to stack on mobile (1 col), tablet (3 col), desktop (5 col)
          ========================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
            <MetricCard
              title="Risk"
              value={`${data.risk_score}%`}
              icon="⚠"
              colorClass="text-rose-400"
            />

            <MetricCard
              title="Screen"
              value={`${signals.screen_time?.toFixed(1) || 0}h`}
              icon="📱"
            />

            <MetricCard
              title="Sleep"
              value={`${signals.sleep || 0}h`}
              icon="😴"
            />

            <MetricCard title="Steps" value={signals.steps || 0} icon="🚶" />

            <MetricCard
              title="Mood"
              value={`${data.mood_score || 3}/5`}
              icon="🙂"
              colorClass="text-emerald-400"
            />
          </div>

          {/* =========================
              GRAPH - Ensure overflow safety
          ========================= */}
          <GlassCard title="Risk Forecast (72h)" icon="📊" className="mb-8 md:mb-12 overflow-hidden">
            <div className="w-full overflow-x-auto">
                {data.forecast_72h?.length ? (
                <TrendChart data={data.forecast_72h} current={data.risk_score} />
                ) : (
                <p className="text-gray-400 py-10 text-center">No forecast available</p>
                )}
            </div>
          </GlassCard>

          {/* =========================
              INSIGHT + ADVICE - Changed to stack on mobile
          ========================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            {/* AI SUMMARY */}
            <GlassCard
              borderAccent="border-l-4 md:border-l-8 border-cyan-500"
              title="AI Logic Summary"
            >
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                Your current risk score is{" "}
                <span className="text-cyan-400 font-bold">
                  {data.risk_score}%
                </span>
                . {data.reason || "No insights available"}
              </p>
            </GlassCard>

            {/* ADVICE */}
            <GlassCard
              borderAccent="border-l-4 md:border-l-8 border-amber-500"
              title="Daily Advice"
            >
              {data.advice?.length ? (
                <ul className="space-y-3 md:space-y-4 text-slate-300 font-medium text-sm md:text-base">
                  {data.advice.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">No recommendations available</p>
              )}
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;