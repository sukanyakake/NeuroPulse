import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useMood } from "../context/MoodContext";
import MoodPicker from "../components/MoodPicker";
import MetricCard from "../components/MetricCard";
import { Table } from "lucide-react";

const DataSources = () => {
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    screen_time: "",
    sleep: "",
    steps: "",
    unlocks: "",
  });

  const { isSyncing } = useMood();

  // =========================
  // FETCH DATA
  // =========================
  const fetchLogs = () => {
    api
      .getTelemetry()
      .then((data) => {
        setTelemetryLogs(Array.isArray(data) ? data : []);
        setLoading(false);
        setLastSyncTime(new Date().toLocaleTimeString());
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!isSyncing) fetchLogs();
  }, [isSyncing]);

  // =========================
  // TODAY LOGIC
  // =========================
  const today = new Date().toLocaleDateString("en-CA");

  const todayData = telemetryLogs
    .filter((log) => log.date === today)
    .sort((a, b) => new Date(b.sync_at) - new Date(a.sync_at))[0];

  const latest = todayData
    ? todayData
    : {
        metrics: {
          screen_time: 0,
          steps: 0,
          sleep: 0,
          unlocks: 0,
        },
      };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-10 md:p-20">
        <div className="text-cyan-400 font-black italic animate-pulse tracking-widest">
          QUERYING MONGODB...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-2 md:px-0">

      {/* HEADER - Updated for stacking on Mobile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white">
            Device <span className="text-cyan-400">Telemetry</span>
          </h1>

          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Historical ingestion logs from MongoDB.
          </p>

          {lastSyncTime && (
            <p className="text-[10px] text-slate-500 mt-2">
              Last Synced: {lastSyncTime}
            </p>
          )}

          {!todayData && (
            <p className="text-xs text-yellow-400 mt-2">
              No data synced today. Please add data.
            </p>
          )}
        </div>

        {/* RIGHT SIDE - Sync status and Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-5 py-2 rounded-xl shadow-lg transition-all"
          >
            + Add Data
          </button>

          <div className="flex items-center gap-3 glass px-4 md:px-6 py-2 rounded-2xl text-cyan-400 text-[10px] md:text-xs font-bold uppercase border border-cyan-500/20">
            <div
              className={`w-3 h-3 rounded-full ${
                isSyncing
                  ? "bg-yellow-400 animate-spin"
                  : "bg-cyan-400 animate-pulse"
              }`}
            ></div>
            {isSyncing ? "Syncing..." : "DB: Connected"}
          </div>
        </div>
      </div>

      {/* METRICS - Grid updated: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10 md:mb-14">
        <MetricCard title="Unlock Events" value={latest.metrics.unlocks} icon="📱" />
        <MetricCard title="Active Usage" value={`${latest.metrics.screen_time}h`} icon="⌛" />
        <MetricCard title="Step Count" value={latest.metrics.steps} icon="👟" />
        <MetricCard title="Sleep Status" value={`${latest.metrics.sleep}h`} icon="🌙" />
      </div>

      {/* MOOD */}
      <div className="mb-10 md:mb-14">
        <MoodPicker />
      </div>

      {/* TABLE */}
      <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-t border-white/5 mb-10">
        <h2 className="text-sm md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-2 italic text-white uppercase tracking-widest">
          <Table className="text-cyan-400" size={18} /> Full Metadata Log
        </h2>

        {telemetryLogs.length === 0 ? (
          <div className="text-center text-slate-500 italic py-10">
            No data available. Click + Add Data
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="text-slate-500 uppercase text-[9px] md:text-[10px] font-black tracking-[0.2em] border-b border-white/5">
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Screen Time</th>
                  <th className="pb-4">Steps</th>
                  <th className="pb-4">Sleep</th>
                  <th className="pb-4 text-right">User</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {telemetryLogs.map((log, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 text-cyan-400">{log.date}</td>
                    <td className="py-4">{log.metrics?.screen_time}h</td>
                    <td className="py-4">{log.metrics?.steps}</td>
                    <td className="py-4">{log.metrics?.sleep}h</td>
                    <td className="py-4 text-right text-[10px] md:text-xs text-slate-500">
                      {log.user_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL - Updated width for mobile screens */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-[400px] shadow-2xl">

            <h2 className="text-xl font-bold text-cyan-400 mb-6 text-center">
              Enter Telemetry Data
            </h2>

            <div className="space-y-3">
                <input
                type="number"
                placeholder="Screen Time"
                className="w-full p-3 rounded bg-slate-800 text-white border border-white/5 focus:border-cyan-500 outline-none"
                onChange={(e) =>
                    setFormData({ ...formData, screen_time: e.target.value })
                }
                />

                <input
                type="number"
                placeholder="Sleep"
                className="w-full p-3 rounded bg-slate-800 text-white border border-white/5 focus:border-cyan-500 outline-none"
                onChange={(e) =>
                    setFormData({ ...formData, sleep: e.target.value })
                }
                />

                <input
                type="number"
                placeholder="Steps"
                className="w-full p-3 rounded bg-slate-800 text-white border border-white/5 focus:border-cyan-500 outline-none"
                onChange={(e) =>
                    setFormData({ ...formData, steps: e.target.value })
                }
                />

                <input
                type="number"
                placeholder="Unlocks"
                className="w-full p-3 rounded bg-slate-800 text-white border border-white/5 focus:border-cyan-500 outline-none"
                onChange={(e) =>
                    setFormData({ ...formData, unlocks: e.target.value })
                }
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-all"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await api.syncData({
                    signals: {
                      screen_time: Number(formData.screen_time),
                      sleep: Number(formData.sleep),
                      steps: Number(formData.steps),
                      unlocks: Number(formData.unlocks),
                    },
                  });

                  setShowModal(false);
                  fetchLogs();
                }}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-2 rounded font-bold transition-all"
              >
                Sync 🚀
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DataSources;