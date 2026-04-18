import apiClient from "../../services/ApiClient";


export function getWeekNumber() {
  const currentDate = new Date();
  const day = currentDate.getDay() || 7;
  currentDate.setDate(currentDate.getDate() + 4 - day);
  const yearStart = new Date(currentDate.getFullYear(), 0, 4);
  const diffInDays = Math.floor((currentDate - yearStart) / (24 * 60 * 60 * 1000));
  return Math.floor(diffInDays / 7) + 2;
}

// Load weeks
export const loadWeeksApi = async (payload = {}) => {
  const weekNumber = payload.weekNumber || getWeekNumber();
  const { city, zone, year } = payload; // no hardcoded defaults

  return apiClient.get(`/api/slots/week`, {
    params: { city, zone, weekNumber, year },
  });
};

// Load slots
export const loadSlotsApi = async (payload = {}) => {
  const { date, city, zone, filter: status = "all" } = payload; // only "all" is a safe default

  return apiClient.get(`/api/slots/status`, {
    params: { date, city, zone, status },
  });
};

// Book slots
export const bookSlotApi = async (payload) => {
  const { slotIds, date } = payload;
  return apiClient.post(`/api/slots/book`, { date, slotIds });
};


// Cancel slots
export const cancelSlotApi = async (bookingId) => {
  return apiClient.delete(`/api/slots/cancel/${bookingId}`);
};
