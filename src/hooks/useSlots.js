import { useState } from "react";
import {
  loadSlotsApi,
  loadWeeksApi,
  bookSlotApi,
  cancelSlotApi,
} from "../services/slots/slotsServices";

export function useSlots() {
  const [weeks, setWeeks] = useState([]);      // 👈 NEW
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(false);

  /**
   * Load weeks first → then load slots
   * payload = { city, zone, weekNumber, year }
   */
  const loadWeeksAndSlots = async (payload) => {
    try {
      setLoading(true);
      setError(false);

      // 1️⃣ Load weeks (days)
      const weeksRes = await loadWeeksApi(payload);

      if (weeksRes.data?.success) {
        setWeeks(weeksRes.data.data);
      } else {
        throw new Error("Failed to load weeks");
      }

      // 2️⃣ Load slots AFTER weeks success
      const slotsRes = await loadSlotsApi(payload);

      if (slotsRes.data?.success) {
        setSlots(slotsRes.data.data);
      }
    } catch (err) {
      console.log("Slots hook error:", err?.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Book slot
  const bookSlot = async (payload) => {
    try {
      setActionLoading(true);
      const res = await bookSlotApi(payload);
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
      return res.data?.success === true;
    } catch (err) {
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    weeks,               // 👈 expose weeks (days)
    slots,
    loading,
    actionLoading,
    error,
    loadWeeksAndSlots,   // 👈 NEW main loader
    bookSlot,
    cancelSlot,
  };
}
