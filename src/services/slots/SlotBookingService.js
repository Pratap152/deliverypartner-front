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
  const { cityId, pincodeId, year } = payload;

  return apiClient.get(`/api/rider/slots/week`, {
    params: { cityId, pincodeId, weekNumber, year },
  });
};

// Load slots
export const loadSlotsApi = async (payload = {}) => {
  const { date, cityId, pincodeId, filter: status = "all" } = payload;

  return apiClient.get(`/api/rider/slots/status`, {
    params: {
      date,
      cityId,
      pincodeId,
      status,
    },
  });
};

// Book slots
export const bookSlotApi = async (payload) => {
  const { slotIds, date } = payload;
  return apiClient.post(`/api/rider/slots/book`, { date, slotIds });
};


// Cancel slots
export const cancelSlotApi = async (bookingId) => {
  return apiClient.delete(`/api/rider/slots/cancel/${bookingId}`);
};

//Zestbot slots
export const fetchZestbotSlots = async () => {
  return apiClient.get(`/api/rider/zestbot/my-shift`);
};
