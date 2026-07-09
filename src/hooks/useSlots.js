import { useState, useRef } from "react";
import {
  loadSlotsApi,
  loadWeeksApi,
  bookSlotApi,
  cancelSlotApi,
  fetchZestbotSlots
} from "../services/slots/SlotBookingService";
 
 
export function formatWeeks(apiWeeks = []) {
  console.log("Weeks API Response:", apiWeeks);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return apiWeeks
    .filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= today;
    })
    .map((item) => ({
      ...item,

      date: item.date,
      label: item.dayName,
      day: new Date(item.date).getDate().toString(),

      durationMinutes: item.slots?.[0]?.durationMinutes ?? 0,
      breakInMinutes: item.slots?.[0]?.breakInMinutes ?? 0,
}));
}
 
export function useSlots() {
  const [weeks, setWeeks] = useState([]);      
  const [slots, setSlots] = useState([]);
  const [weeksLoading, setWeeksLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [zestbotSlotsLoading, setZestbotSlotsLoading] = useState(false);
  const [error, setError] = useState(false);

  const weeksRequestId = useRef(0);
  const slotsRequestId = useRef(0);
  
  const clearWeeks = () => setWeeks([]);
  const clearSlots = () => setSlots([]);
 
  // Load week
  const loadWeeks = async (payload) => {
   const currentRequest = ++weeksRequestId.current;

    try {
        setWeeksLoading(true);
        setError(false);

        const weeksRes = await loadWeeksApi(payload);

        // Ignore stale responses
        if (currentRequest !== weeksRequestId.current) {
            return;
        }

        if (weeksRes.data?.success) {
            setWeeks(formatWeeks(weeksRes.data.data));
        } else {
            throw new Error("Failed to load weeks");
        }
    } catch (err) {
        if (currentRequest !== weeksRequestId.current) {
            return;
        }

        console.log(err?.response?.data || err.message);
        setError(true);
    } finally {
        if (currentRequest === weeksRequestId.current) {
            setWeeksLoading(false);
        }
    }
};
 
  // Load slots
  const loadSlots = async (payload) => {
    const currentRequest = ++slotsRequestId.current;
    try {
      setSlotsLoading(true);
      setError(false);
 
      const slotsRes = await loadSlotsApi(payload);
      if (currentRequest !== slotsRequestId.current) {
        return;
    }
 
      if (slotsRes.data?.success) {
        const slotDate = slotsRes.data.date; // 2026-02-01
        let filteredSlots = slotsRes.data.data;
 
        // Only filter by time if the slot date is today
        if (slotDate) {
          const today = new Date();
          const slotDateObj = new Date(slotDate);
         
          // Compare dates (ignore time component)
          const isToday =
            today.getFullYear() === slotDateObj.getFullYear() &&
            today.getMonth() === slotDateObj.getMonth() &&
            today.getDate() === slotDateObj.getDate();
 
          if (isToday) {
            // Filter out slots where endTime has already passed
            const currentTime = new Date();
            const currentHours = currentTime.getHours();
            const currentMinutes = currentTime.getMinutes();
 
            filteredSlots = filteredSlots.filter((slot) => {
              // Parse endTime (format: HH:MM or HH:mm)
              const endTime = slot.endTime;
              if (!endTime) return true; // Keep slot if no endTime
              // Handle 24:00 as midnight (next day)
              let [endHours, endMinutes] = endTime.split(":").map(Number);
              if (endHours === 24) {
                endHours = 23;
                endMinutes = 59;
              }
              // keep slot if endTime is in the future
              if (endHours > currentHours) {
                return true;
              } else if (endHours === currentHours && endMinutes > currentMinutes) {
                return true;
              }
              return false;
            });
          }
        }
        setSlots(filteredSlots);
      }
    } catch (err) {
      console.log("loadSlots error:", err?.response?.data || err.message);
      if (currentRequest === slotsRequestId.current) {
        setError(true);
    }
    } finally {
      if (currentRequest === slotsRequestId.current) {
          setSlotsLoading(false);
      }
    }
  };
 
  // Book slot
  const bookSlot = async (payload) => {
    try {
      setActionLoading(true);
      const res = await bookSlotApi(payload);
      console.log("successfully exited", res);
      return res.data?.success === true;
    } catch (err) {
      return false;
    } finally {
      setActionLoading(false);
    }
  };
 
  // Cancel slot
  const cancelSlot = async (payload) => {
    try {
      setActionLoading(true);
      const res = await cancelSlotApi(payload);
      console.log("exited cancel slot call", res);
      return res.data?.success === true;
    } catch (err) {
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const fetchZestbotSlotsDetails = async () => {
    try {
      setZestbotSlotsLoading(true);
      const res = await fetchZestbotSlots();
      return res.data;
    } catch (err) {
      return false;
    } finally {
      setZestbotSlotsLoading(false);
    }
  }

  return {
    weeks,
    slots,
    weeksLoading,
    slotsLoading,
    zestbotSlotsLoading,
    loading: weeksLoading || slotsLoading,
    actionLoading,
    error,
    loadWeeks,
    loadSlots,
    bookSlot,
    cancelSlot,
    clearWeeks,
    clearSlots,
    fetchZestbotSlotsDetails,
  };
}
 