import api from "./api";

/* =========================================================
   GET DASHBOARD STATS
========================================================= */

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard/stats", {
      params: {
        _: Date.now(),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};

/* =========================================================
   GET CRM STATUS
========================================================= */

export const getCrmStatus = async () => {
  try {
    const response = await api.get("/dashboard/status", {
      params: {
        _: Date.now(),
      },
    });

    return response.data;
  } catch (error) {
    console.error("CRM Status API Error:", error);
    throw error;
  }
};