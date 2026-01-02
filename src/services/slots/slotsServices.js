import axios from "axios";
import { tokenService } from "../../services/TokenService";
import WEBSITE_URL from "../../utils/host";



// 🔹 Common API configuration (previously apiClient)
 // replace with real URL
const TIMEOUT = 15000;

export const getAuthHeaders = async () => {
  const token=await tokenService.get();
    const access=token?.accessToken;
  return {
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };
};
export const loadWeeksApi = async (payload) => {
  const {city,zone,weekNumber,year}=payload;
  
  const headers = await getAuthHeaders();
  return axios.get(`${WEBSITE_URL}/api/slots/week?city=${city}&zone=${zone}&weekNumber=${weekNumber}&year=${year}`, {
    timeout: TIMEOUT,
    headers,
  });
};

// 1️⃣ Load slots
export const loadSlotsApi = async (payload) => {
  const {date,city,zone,status}=payload;
  const headers = await getAuthHeaders();
  return axios.get(`${WEBSITE_URL}/api/slots/status?date=${date}&city=${city}&zone=${zone}&status=${status}`, {
    timeout: TIMEOUT,
    headers,
  });
};

// 2️⃣ Book slot
export const bookSlotApi = async (payload) => {
  const {date,slotIds}=payload;
  const headers = await getAuthHeaders();
  return axios.post(`${WEBSITE_URL}/api/slots/book`,
  {
  date,slotIds
  }, 
  {
      timeout: TIMEOUT,
      headers,
    });
};

// 3️⃣ Cancel slot
export const cancelSlotApi = async (bookingId) => {
  const headers = await getAuthHeaders();
  return axios.delete(`${WEBSITE_URL}/api/slots/cancel/${bookingId}`, {
    timeout: TIMEOUT,
    headers,
  });
};
