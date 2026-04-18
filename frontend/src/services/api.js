const BASE_URL = "/api";

// =========================
// 🔐 COMMON HEADER
// =========================
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const api = {
  // =========================
  // 📊 DASHBOARD
  // =========================
  getDashboard: async () => {
    const res = await fetch(`${BASE_URL}/dashboard/summary`, {
      headers: getAuthHeaders(), // ✅ FIX
    });

    return res.json();
  },

  // =========================
  // 📈 ANALYTICS
  // =========================
  getAnalytics: async () => {
    const res = await fetch(`${BASE_URL}/behaviour/stats`, {
      headers: getAuthHeaders(),
    });

    return res.json();
  },

  // =========================
  // 🤖 PREDICTION
  // =========================
  getPrediction: async () => {
    const res = await fetch(`${BASE_URL}/prediction/forecast`, {
      headers: getAuthHeaders(),
    });

    return res.json();
  },

  // =========================
  // ✨ ACTION CENTER
  // =========================
  getActionPlan: async () => {
    const res = await fetch(`${BASE_URL}/action/plan`, {
      headers: getAuthHeaders(),
    });

    return res.json();
  },

  // =========================
  // 📊 TELEMETRY
  // =========================
  getTelemetry: async () => {
    const res = await fetch(
      `${BASE_URL}/datasources/raw_logs?ts=${Date.now()}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return res.json();
  },

  // =========================
  // 📈 SUMMARY
  // =========================
  getSyncSummary: async () => {
    const res = await fetch(`${BASE_URL}/datasources/summary`, {
      headers: getAuthHeaders(), // ✅ FIX
    });

    return res.json();
  },

  // =========================
  // 🔥 SYNC
  // =========================
  syncData: async (payload) => {
    const res = await fetch(`${BASE_URL}/datasources/sync`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ FIX
      body: JSON.stringify(payload),
    });

    return res.json();
  },

  // =========================
  // 🔐 AUTH
  // =========================
  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    // ✅ STORE TOKEN
    if (result.token) {
      localStorage.setItem("token", result.token);
    }

    return result;
  },

  signup: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },
};