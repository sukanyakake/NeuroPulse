import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [mood, setMood] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncData, setLastSyncData] = useState(null);

  // =========================
  // 🔥 RESTORE MOOD (SAFE)
  // =========================
  useEffect(() => {
    const restoreMood = async () => {
      try {
        const token = localStorage.getItem("token");

        // ❌ Don't call API without login
        if (!token) {
          setMood(3);
          return;
        }

        const data = await api.getSyncSummary();

        if (data && data.mood_score !== undefined) {
          setMood(data.mood_score);
          setLastSyncData(data);
        } else {
          setMood(3);
        }
      } catch (err) {
        console.error("Restore Mood Error:", err);
        setMood(3);
      }
    };

    restoreMood();
  }, []);

  // =========================
  // 🔥 SYNC MOOD ONLY (FIXED)
  // =========================
  const triggerSync = async (selectedMood) => {
    setIsSyncing(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      // ✅ ONLY SEND MOOD (NO TELEMETRY HERE)
      const response = await api.syncData({
        mood_score: selectedMood,
      });

      setLastSyncData(response);
      setMood(selectedMood);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <MoodContext.Provider
      value={{ mood, isSyncing, triggerSync, lastSyncData }}
    >
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => useContext(MoodContext);
