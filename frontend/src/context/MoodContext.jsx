import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [mood, setMood] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncData, setLastSyncData] = useState(null);

  // =========================
  // 🔥 RESTORE MOOD (ONLY IF TOKEN EXISTS)
  // =========================
  useEffect(() => {
    const restoreMood = async () => {
      try {
        const token = localStorage.getItem("token");

        // ❌ DON'T CALL API WITHOUT TOKEN
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
  // 🔥 SYNC DATA (FIXED)
  // =========================
const triggerSync = async (selectedMood) => {
  setIsSyncing(true);

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    // ✅ SEND mood_score ALSO
    const response = await api.syncData({
      signals: {
        screen_time: 5,
        unlocks: 80,
        steps: 5000,
        sleep: 7,
      },
      mood_score: selectedMood   // ⭐ THIS WAS MISSING
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