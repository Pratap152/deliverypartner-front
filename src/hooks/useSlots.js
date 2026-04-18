export function formatWeeks(apiWeeks = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return apiWeeks
    .filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= today;
    })
    .map((item) => ({
      date: item.date,                 // "2025-12-01"
      label: item.dayName,             // "Mon", "Tue"
      day: new Date(item.date).getDate().toString(), // "1", "2"
    }));
}

import { useState } from "react";
import {
  loadSlotsApi,
  loadWeeksApi,
  bookSlotApi,
  cancelSlotApi,
} from "../services/slots/slots.service";

export function useSlots() {
  const [weeks, setWeeks] = useState([]);      
  const [slots, setSlots] = useState([]);
  const [weeksLoading, setWeeksLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(false);

  // Load weeks (days)
  const loadWeeks = async (payload) => {
    console.log("loadWeeks hook entered...payload", payload);
    try {
      setWeeksLoading(true);
      setError(false);

      const weeksRes = await loadWeeksApi(payload);
      console.log("loadWeeksApi exited.....", weeksRes?.data?.data);

      if (weeksRes.data?.success) {
        setWeeks(formatWeeks(weeksRes.data.data));
      } else {
        throw new Error("Failed to load weeks");
      }
    } catch (err) {
      console.log("loadWeeks error:", err?.response?.data || err.message);
      setError(true);
    } finally {
      setWeeksLoading(false);
    }
  };

  // Load slots
  const loadSlots = async (payload) => {
    console.log("loadSlots hook entered...payload", payload);
    try {
      setSlotsLoading(true);
      setError(false);

      const slotsRes = await loadSlotsApi(payload);
      console.log("loadSlotsApi exited....", slotsRes?.data);

      if (slotsRes.data?.success) {
        const slotDate = slotsRes.data.date; // ex: "2026-02-01"
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
              // Parse endTime (format: "HH:MM" or "HH:mm")
              const endTime = slot.endTime;
              if (!endTime) return true; // Keep slot if no endTime

              // Handle "24:00" as midnight (next day)
              let [endHours, endMinutes] = endTime.split(":").map(Number);
              if (endHours === 24) {
                endHours = 23;
                endMinutes = 59;
              }

              // Compare: keep slot if endTime is in the future
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
      setError(true);
    } finally {
      setSlotsLoading(false);
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

  return {
    weeks,
    slots,
    weeksLoading,
    slotsLoading,
    loading: weeksLoading || slotsLoading,
    actionLoading,
    error,
    loadWeeks,
    loadSlots,
    bookSlot,
    cancelSlot,
  };
}
