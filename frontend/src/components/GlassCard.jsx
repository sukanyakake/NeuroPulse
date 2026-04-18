import React from "react";

const GlassCard = ({
  children,
  title,
  icon,
  borderAccent = "border-white/5",
  className = "",
}) => {
  return (
    <div
      className={`glass p-10 rounded-[3rem] card border-t ${borderAccent} ${className}`}
    >
      {title && (
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2 italic text-slate-300">
          {icon && <span className="text-cyan-400">{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default GlassCard;
