import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Brain, Sparkles } from "lucide-react";
import ObservationCard from "../components/ObservationCard";
const ActionCenter = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getActionPlan().then(setData);
  }, []);

  if (!data)
    return (
      <div className="flex h-full items-center justify-center p-20">
        <div className="text-cyan-400 font-black italic animate-pulse tracking-widest">
          GENERATING RECOVERY PLAN...
        </div>
      </div>
    );

  const observations = data?.observations || [];
  const steps = data?.steps || [];

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-black italic uppercase text-white">
          How to <span className="text-cyan-400">Feel Better</span>
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Based on your real behavioral data today.
        </p>
      </div>

      {/* OBSERVATIONS */}
      <div className="mb-14">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-300 uppercase text-sm">
          <Brain className="text-cyan-400" size={18} /> What your AI noticed
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {observations.length > 0 ? (
            observations.map((item) => (
              <ObservationCard key={item.id} {...item} />
            ))
          ) : (
            <p className="text-slate-400">No issues detected today ✅</p>
          )}
        </div>
      </div>

      {/* ACTION PLAN */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-300 uppercase text-sm">
          <Sparkles className="text-cyan-400" size={18} /> Easy Wins for Today
        </h2>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* STEPS */}
          <div className="glass p-10 rounded-[3rem] border-l-8 border-cyan-500">
            <h3 className="text-2xl font-black mb-8 text-white">Your Plan</h3>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <Step key={step.id} number={i + 1} {...step} />
              ))}
            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="flex flex-col gap-8">
            {/* WHY (DYNAMIC NOW) */}
            <div className="glass p-10 rounded-[3rem] bg-gradient-to-br from-cyan-500/10 to-transparent">
              <h3 className="text-xl font-bold mb-4 text-white">
                Why do this?
              </h3>
              <p className="text-slate-300 italic">
                {data.reason || "Based on your behavioral patterns today."}
              </p>
            </div>

            {/* PREDICTION */}
            <div className="glass p-8 rounded-[2.5rem] flex items-center gap-6 border border-emerald-500/20 bg-emerald-500/5">
              <div className="text-4xl">📉</div>
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-400">
                  Predicted Result
                </p>
                <p className="text-lg font-bold text-white">
                  {data.prediction_improvement || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const Step = ({ number, title, desc }) => (
  <div className="flex gap-4">
    <div className="w-8 h-8 bg-cyan-400 text-black rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div>
      <p className="font-bold text-white">{title}</p>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  </div>
);

export default ActionCenter;
