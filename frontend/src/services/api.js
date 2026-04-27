const BASE_URL = "/api";

// =========================
// 🔐 COMMON HEADER
// =========================
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // ✅ safer
  };
};

// =========================
// 🔥 COMMON FETCH HANDLER
// =========================
const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "API Error");
  }
  return res.json();
};

export const api = {
  // =========================
  // 📊 DASHBOARD
  // =========================
  getDashboard: async () => {
    const res = await fetch(`${BASE_URL}/dashboard/summary`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // =========================
  // 📈 ANALYTICS
  // =========================
  getAnalytics: async () => {
    const res = await fetch(`${BASE_URL}/behaviour/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // =========================
  // 🤖 PREDICTION
  // =========================
  getPrediction: async () => {
    const res = await fetch(`${BASE_URL}/prediction/forecast`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // =========================
  // ✨ ACTION CENTER
  // =========================
  getActionPlan: async () => {
    const res = await fetch(`${BASE_URL}/action/plan`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // =========================
  // 📊 TELEMETRY
  // =========================
  getTelemetry: async () => {
    const res = await fetch(
      `${BASE_URL}/datasources/raw_logs?ts=${Date.now()}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(res);
  },

  // =========================
  // 📈 SUMMARY
  // =========================
  getSyncSummary: async () => {
    const res = await fetch(`${BASE_URL}/datasources/summary`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // =========================
  // 🔥 SYNC
  // =========================
  syncData: async (payload) => {
    const res = await fetch(`${BASE_URL}/datasources/sync`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
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

    const result = await handleResponse(res);

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

    return handleResponse(res);
  },

  // =========================
  // 🔓 LOGOUT (ADDED)
  // =========================
  logout: () => {
    localStorage.removeItem("token");
  },
};
