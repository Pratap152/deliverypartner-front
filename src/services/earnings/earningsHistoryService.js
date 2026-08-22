import apiClient from "../ApiClient";

export const EarningsNewAPI = {
  getToday: async () => {
  
    const res = await apiClient.get(
      "/api/rider/earnings/new/new_daily"
    );

    return res;
  },

  getDailyByDate: async (
    date,
    page = 1,
    limit = 20
  ) => {
    const url =
      `/api/rider/earnings/new/new_daily` +
      `?date=${date}&page=${page}&limit=${limit}`;


    const res = await apiClient.get(url);

    return res;
  },

  getSummary: async () => {
    const res = await apiClient.get(
      "/api/rider/earnings/new/new_summary"
    );

    return res;
  },

  getCurrentWeek: async () => {

    const res = await apiClient.get(
      "/api/rider/earnings/new/new_weekly"
    );

    return res;
  },

  getWeekByNumber: async (
    week,
    year
  ) => {
    const url =
      `/api/rider/earnings/new/new_weekly` +
      `?week=${week}&year=${year}`;


    const res = await apiClient.get(url);

    return res;
  },

  getOrder: async (orderId) => {
    const url =
      `/api/rider/earnings/new/new_delivery/${orderId}`;


    const res = await apiClient.get(url);


    return res;
  },
};