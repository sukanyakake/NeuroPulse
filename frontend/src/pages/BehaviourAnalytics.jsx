import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Smartphone, Moon, Smile, Link2 } from "lucide-react";

const BehaviourAnalytics = () => {
  const [activeTab, setActiveTab] = useState("screen");
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalyticsData);
  }, []);

  // =========================
  // 📊 GRAPH COMPONENT
  // =========================
  const RenderLineChart = ({ data, color = "#22d3ee", label, yLabel }) => {
    if (!data || data.length === 0)
      return <div className="text-slate-500 text-lg">No data available</div>;

    const width = 800;
    const height = 320;
    const padding = 60;

    const maxVal = Math.max(...data.map((d) => d.value), 1);

    const points = data.map((d, i) => ({
      x: padding + (i * (width - padding * 2)) / (data.length - 1),
      y: height - padding - (d.value / maxVal) * (height - padding * 2),
      value: d.value,
      day: d.day,
    }));

    const path = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    return (
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-80">
          {/* Y AXIS TITLE */}
          <text
            x={20}
            y={height / 2}
            fill="#94a3b8"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(-90, 20, ${height / 2})`}
          >
            {yLabel}
          </text>

          {/* GRID */}
          {[0, maxVal / 2, maxVal].map((v, i) => (
            <line
              key={i}
              x1={padding}
              x2={width - padding}
              y1={height - padding - (v / maxVal) * (height - padding * 2)}
              y2={height - padding - (v / maxVal) * (height - padding * 2)}
              stroke="#ffffff15"
            />
          ))}

          {/* Y AXIS VALUES */}
          {[0, maxVal / 2, maxVal].map((v, i) => (
            <text
              key={i}
              x={40}
              y={height - padding - (v / maxVal) * (height - padding * 2)}
              fill="#94a3b8"
              fontSize="14"
              fontWeight="bold"
            >
              {Math.round(v)}
            </text>
          ))}

          {/* X AXIS VALUES */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="13"
              fontWeight="bold"
            >
              {p.day}
            </text>
          ))}

          {/* LINE */}
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="4"
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />

          {/* POINTS */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="6" fill={color} />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fill="#fff"
                fontSize="13"
                fontWeight="bold"
              >
                {p.value}
              </text>
            </g>
          ))}
        </svg>

        {/* X AXIS TITLE */}
        <p className="text-center text-base mt-4 text-slate-400 font-semibold">
          {label}
        </p>
      </div>
    );
  };

  // =========================
  // 🧠 INSIGHT
  // =========================
  const getInsight = (data) => {
    if (!data || data.length < 2) return "Not enough data";

    const first = data[0].value;
    const last = data[data.length - 1].value;

    if (last > first) return "Increasing trend observed 📈";
    if (last < first) return "Decreasing trend observed 📉";
    return "Stable pattern observed ➖";
  };

  if (!analyticsData)
    return (
      <div className="flex h-full items-center justify-center p-20">
        <div className="text-cyan-400 font-black italic animate-pulse tracking-widest">
          ANALYZING BEHAVIOURAL PATTERNS...
        </div>
      </div>
    );

  const tabs = [
    { id: "screen", label: "Screen Use", icon: <Smartphone size={16} /> },
    { id: "sleep", label: "Sleep Cycle", icon: <Moon size={16} /> },
    { id: "mood", label: "Mood Trend", icon: <Smile size={16} /> },
    { id: "correlation", label: "Correlations", icon: <Link2 size={16} /> },
  ];

  return (
    <div className="text-slate-300">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tight">
          Behaviour{" "}
          <span className="text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]">
            Analytics
          </span>
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Weekly trends & insights</p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-10 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:scale-105"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        {activeTab === "screen" && (
          <>
            <RenderLineChart
              data={analyticsData.screen}
              label="Days"
              yLabel="Hours"
            />
            <p className="text-center mt-4 text-cyan-400 text-lg font-semibold">
              {getInsight(analyticsData.screen)}
            </p>
          </>
        )}

        {activeTab === "sleep" && (
          <>
            <RenderLineChart
              data={analyticsData.sleep}
              color="#10b981"
              label="Days"
              yLabel="Hours"
            />
            <p className="text-center mt-4 text-cyan-400 text-lg font-semibold">
              {getInsight(analyticsData.sleep)}
            </p>
          </>
        )}

        {activeTab === "mood" && (
          <>
            <RenderLineChart
              data={analyticsData.mood}
              color="#facc15"
              label="Days"
              yLabel="Score"
            />
            <p className="text-center mt-4 text-cyan-400 text-lg font-semibold">
              {getInsight(analyticsData.mood)}
            </p>
          </>
        )}

        {activeTab === "correlation" &&
          (() => {
            const matrix = analyticsData.correlation_matrix || [];
            const labels = ["Screen", "Sleep", "Mood"]; // can be dynamic later

            // 🔥 Find strongest correlation (excluding diagonal)
            let maxVal = 0;
            let pair = ["", ""];

            matrix.forEach((row, i) => {
              row.forEach((val, j) => {
                if (i !== j && Math.abs(val) > Math.abs(maxVal)) {
                  maxVal = val;
                  pair = [labels[i], labels[j]];
                }
              });
            });

            // 🔥 Dynamic interpretation
            const getMeaning = (v) => {
              if (v > 0.6) return "Strong Positive";
              if (v > 0.3) return "Moderate Positive";
              if (v < -0.6) return "Strong Negative";
              if (v < -0.3) return "Moderate Negative";
              return "Weak";
            };

            const getColor = (v) => {
              if (v >= 0.7) return "bg-emerald-500";
              if (v >= 0.3) return "bg-emerald-300";
              if (v <= -0.7) return "bg-rose-500";
              if (v <= -0.3) return "bg-rose-300";
              return "bg-gray-700";
            };

            return (
              <div className="flex flex-col items-center">
                {/* TITLE */}
                <h2 className="text-2xl font-bold mb-8 text-white">
                  Behavioral Correlation Heatmap
                </h2>

                {/* HEATMAP */}
                <div className="grid grid-cols-4 gap-3 text-center">
                  {/* HEADER */}
                  <div></div>
                  {labels.map((col, i) => (
                    <div
                      key={i}
                      className="text-slate-400 font-semibold text-sm"
                    >
                      {col}
                    </div>
                  ))}

                  {/* ROWS */}
                  {labels.map((row, i) => (
                    <React.Fragment key={i}>
                      <div className="text-slate-400 font-semibold text-sm flex justify-end pr-2">
                        {row}
                      </div>

                      {matrix[i]?.map((val, j) => (
                        <div
                          key={j}
                          className={`w-20 h-20 flex flex-col items-center justify-center rounded-xl font-bold text-lg transition-all duration-300 hover:scale-110 ${getColor(val)} ${
                            Math.abs(val) > 0.5 ? "text-white" : "text-gray-200"
                          }`}
                        >
                          {val}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>

                {/* LEGEND */}
                <div className="flex gap-6 mt-8 text-sm text-slate-400">
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    Positive
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500 rounded"></div>
                    Neutral
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-rose-500 rounded"></div>
                    Negative
                  </span>
                </div>

                {/* 🔥 DYNAMIC INSIGHT */}
                <div className="mt-8 text-center max-w-xl">
                  <p className="text-slate-300 text-sm italic">
                    Strongest relationship observed between{" "}
                    <span className="text-cyan-400 font-bold">
                      {pair[0]} and {pair[1]}
                    </span>{" "}
                    with a{" "}
                    <span className="font-bold">
                      {getMeaning(maxVal)} ({maxVal})
                    </span>{" "}
                    correlation.
                  </p>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export default BehaviourAnalytics;
