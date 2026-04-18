import React, { useState, useEffect } from "react";
import { useMood } from "../context/MoodContext";
import { RefreshCcw, CloudSun } from "lucide-react";

const MoodPicker = () => {
  const { mood, triggerSync, isSyncing } = useMood();
  const [tempMood, setTempMood] = useState(mood);

  useEffect(() => {
    setTempMood(mood);
  }, [mood]);

  return (
    <div className="glass p-8 rounded-[3rem] mb-12 border-t border-white/5 relative overflow-hidden">
      {/* 💡 Loading Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 bg-cyan-950/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <RefreshCcw className="animate-spin text-cyan-400" size={32} />
            <span className="text-cyan-400 font-black italic uppercase text-[10px] tracking-widest">
              Syncing Neural Data...
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Emoji Selection */}
        <div className="w-full flex justify-between items-center bg-white/5 p-3 rounded-[2rem] border border-white/5">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => setTempMood(v)}
              className={`flex-1 py-4 rounded-2xl transition-all ${tempMood === v ? "bg-cyan-400 text-slate-900 scale-105" : "opacity-40"}`}
            >
              <span className="text-3xl">
                {["☹️", "😟", "😐", "🙂", "🤩"][v - 1]}
              </span>
            </button>
          ))}
        </div>

        {/* ⚡ THE BUTTON */}
        <button
          onClick={() => triggerSync(tempMood)}
          disabled={isSyncing}
          className="w-full lg:w-48 bg-white/10 hover:border-cyan-400 border border-transparent p-6 rounded-[2.5rem] flex flex-col items-center gap-2"
        >
          <RefreshCcw className={isSyncing ? "animate-spin" : ""} />
          <span className="font-black uppercase text-[10px]">Sync Now</span>
        </button>
      </div>
    </div>
  );
};

export default MoodPicker;
