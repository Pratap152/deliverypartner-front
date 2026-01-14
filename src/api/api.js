import apiClient from "../services/ApiClient"; // 👈 change path to yours

function logResponse(tag, res) {
  console.log(`API HIT: ${tag}`);
  console.log("STATUS:", res.status);
  console.log("RESPONSE:", JSON.stringify(res.data, null, 2));
}

export const EarningsAPI = {
  async getSummary() {
    const res = await apiClient.get("/api/earnings/summary");
    logResponse("GET /api/earnings/summary", res);
    return res.data;
  },

  async getMonthly(monthKey) {
    const res = await apiClient.get(`/api/earnings/${monthKey}`);
    logResponse(`GET /api/earnings/${monthKey}`, res);
    return res.data;
  },

  async getWeekly(from, to) {
    const res = await apiClient.get(
      `/api/earnings/week?start=${from}&end=${to}`
    );
    logResponse("GET /api/earnings/week", res);
    return res.data;
  },

  async getDaily(date) {
    const res = await apiClient.get(`/api/earnings/${date}`);
    logResponse(`GET /api/earnings/${date}`, res);
    return res.data;
  },

  async getOrderBreakdown(orderId) {
    const res = await apiClient.get(`/api/earnings/orders/${orderId}`);
    logResponse(`GET /api/earnings/orders/${orderId}`, res);
    return res.data;
  },
};
