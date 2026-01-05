// src/modules/slots/slots.hooks.js
export function formatWeeks(apiWeeks = []) {
  return apiWeeks.map((item) => ({
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
  const [weeks, setWeeks] = useState([]);      // 👈 NEW
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
        setSlots(slotsRes.data.data);
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
