import apiClient from "../services/ApiClient";

export const EarningsNewAPI = {
  getToday: async () => {
    console.log("🟡 HIT: GET /api/rider/earnings/new/daily");
    const res = await apiClient.get("/api/rider/earnings/new/daily");
    console.log("🟢 RESPONSE (Today):", JSON.stringify(res.data, null, 2));
    return res;
  },

  getDailyByDate: async (date, page = 1, limit = 20) => {
    const url = `/api/rider/earnings/new/daily?date=${date}&page=${page}&limit=${limit}`;
    console.log("🟡 HIT:", url);
    const res = await apiClient.get(url);
    console.log("🟢 RESPONSE (Daily):", JSON.stringify(res.data, null, 2));
    return res;
  },

  getCurrentWeek: async () => {
    console.log("🟡 HIT: GET /api/rider/earnings/new/weekly");
    const res = await apiClient.get("/api/rider/earnings/new/weekly");
    console.log("🟢 RESPONSE (Current Week):", JSON.stringify(res.data, null, 2));
    return res;
  },

  getWeekByNumber: async (week, year) => {
    const url = `/api/rider/earnings/new/weekly?week=${week}&year=${year}`;
    console.log("🟡 HIT:", url);
    const res = await apiClient.get(url);
    console.log("🟢 RESPONSE (Week):", JSON.stringify(res.data, null, 2));
    return res;
  },

  getOrder: async (orderId) => {
    const url = `/api/rider/earnings/new/delivery/${orderId}`;
    console.log("🟡 HIT:", url);
    const res = await apiClient.get(url);
    console.log("🟢 RESPONSE (Order):", JSON.stringify(res.data, null, 2));
    return res;
  },
};
