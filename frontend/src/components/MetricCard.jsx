import React from "react";

const MetricCard = ({ icon, title, value, colorClass = "text-white" }) => {
  return (
    <div className="glass p-8 rounded-[2.5rem] text-center border-t border-white/5 hover:-translate-y-2 transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <p className="text-slate-500 uppercase text-[10px] font-black tracking-widest">
        {title}
      </p>
      <p className={`text-4xl font-black mt-1 italic ${colorClass}`}>{value}</p>
    </div>
  );
};

export default MetricCard;
