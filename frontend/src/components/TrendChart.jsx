import React from "react";

const TrendChart = ({
  points = "0,150 100,130 200,140 300,100 400,80 500,60 600,45",
}) => {
  return (
    <div className="relative h-64 w-full flex">
      {/* Y-Axis Labels */}
      <div className="flex flex-col justify-between text-[10px] text-slate-500 font-bold pr-4 border-r border-white/5">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>

      <div className="flex-1 relative">
        <svg viewBox="0 0 600 200" className="w-full h-full px-4">
          {/* Grid Lines */}
          {[0, 50, 100, 150].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
            />
          ))}

          {/* Animated Trend Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeLinecap="round"
            className="risk-line transition-all duration-1000"
          />

          {/* Today's Indicator */}
          <circle
            cx="600"
            cy="45"
            r="8"
            fill="#fb7185"
            className="animate-pulse"
          />
        </svg>

        {/* X-Axis Labels */}
        <div className="flex justify-between mt-4 text-[10px] text-slate-500 uppercase font-black px-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span key={day}>{day}</span>
          ))}
          <span className="text-white underline">Today</span>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
