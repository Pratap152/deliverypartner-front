// src/modules/slots/slots.service.js
import axios from "axios";
import { tokenService } from "../../services/TokenService";
import WEBSITE_URL from "../../utils/host";



// 🔹 Common API configuration (previously apiClient)
// replace with real URL
const TIMEOUT = 15000;
export function getWeekNumber() {

  const currentDate = new Date();
  console.log("current date.... ", currentDate);

  // Convert Sunday (0) to 7
  const day = currentDate.getDay() || 7;

  // Move date to Thursday of the current week
  currentDate.setDate(currentDate.getDate() + 4 - day);

  const yearStart = new Date(currentDate.getFullYear(), 0, 4);

  const diffInMs = currentDate - yearStart;
  const diffInDays = Math.floor(diffInMs / (24 * 60 * 60 * 1000));

  return Math.floor(diffInDays / 7) + 2;
}

export const getAuthHeaders = async () => {
  const token = await tokenService.get();
  const access = token?.accessToken;
  //const access = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjk0ZmEzZGY0OGJjMjVlMTQwMzRhYWYxIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2NzM1MTMzNn0.-oxahATt8sxeT6BLjWB0z6u5_bTfcx6jIfWowMkqtqc";
  return {
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };
};
export const loadWeeksApi = async (payload = {}) => {
  /* 
   * Priority: 
   * 1. payload.weekNumber (if provided)
   * 2. getWeekNumber() (calculated current week)
   */
  const weekNumber = payload.weekNumber || getWeekNumber();


  const { city = "Hyderabad", zone = "Madhapur", year = "2026" } = payload;
  console.log("city zone weekNumber year.....", city, zone, weekNumber, year);

  const headers = await getAuthHeaders();
  console.log("entered into loadweeks api...", weekNumber);
  return axios.get(`${WEBSITE_URL}/api/slots/week?city=${city}&zone=${zone}&weekNumber=${weekNumber}&year=${year}`, {
    timeout: TIMEOUT,
    headers,
  });
};

// 1️⃣ Load slots
export const loadSlotsApi = async (payload = {}) => {
  console.log("entered...loadslotsapi", payload);
  const { date = "2026-01-05", city = "Hyderabad", zone = "Madhapur", filter: status = "all" } = payload;
  console.log("status....inner", status, date);
  const headers = await getAuthHeaders();
  console.log("entered into loadslotsstatus api...")
  return axios.get(`${WEBSITE_URL}/api/slots/status?date=${date}&city=${city}&zone=${zone}&status=${status}`, {
    timeout: TIMEOUT,
    headers,
  });
};

// 2️⃣ Book slot
export const bookSlotApi = async (payload) => {
  const { slotIds, date } = payload;
  console.log("booking payload....", payload);
  const headers = await getAuthHeaders();
  return axios.post(`${WEBSITE_URL}/api/slots/book`,
    {
      date, // Use dynamic date
      slotIds
    },
    {
      timeout: TIMEOUT,
      headers,
    });
};

// 3️⃣ Cancel slot
export const cancelSlotApi = async (bookingId) => {
  console.log("entered cancelslot booking", bookingId);
  const headers = await getAuthHeaders();
  return axios.delete(`${WEBSITE_URL}/api/slots/cancel/${bookingId}`, {
    timeout: TIMEOUT,
    headers,
  });
};
