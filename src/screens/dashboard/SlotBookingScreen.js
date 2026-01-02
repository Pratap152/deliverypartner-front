
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useSlots } from "../../hooks/useSlots";

import WeekSelector from "../../components/dashboard/slots/WeekSelector";
import SlotFilters from "../../components/dashboard/slots/SlotFilters";
import SlotCard from "../../components/dashboard/slots/SlotCard";
import BookSlotModal from "../../components/dashboard/slots/BookSlotModal";
import CancelSlotModal from "../../components/dashboard/slots/CancelSlotModal";
import SuccessModal from "../../components/dashboard/slots/SuccessModal";

export default function SlotBookingScreen() {
  const {
    weeks,
    slots,
    weeksLoading, // Separate loading state
    slotsLoading, // Separate loading state
    loading,      // Combined loading (if needed for global spinner)
    loadWeeks,    // 👈 Load ONLY weeks
    loadSlots,    // 👈 Load ONLY slots
    bookSlot,
    cancelSlot,
  } = useSlots();

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);

  // 1️⃣ Initial Load: Fetch Weeks ONLY
  useEffect(() => {
    loadWeeks();
  }, []);

  // 2️⃣ Auto-select first week when weeks are loaded
  useEffect(() => {
    if (weeks?.length > 0 && !selectedWeek) {
      setSelectedWeek(weeks[0].date);
    }
  }, [weeks]);

  // 3️⃣ Load Slots whenever selectedWeek or filter changes
  useEffect(() => {
    if (selectedWeek) {
      loadSlots({
        date: selectedWeek,
        filter,
      });
    }
  }, [selectedWeek, filter]);

  const toggleSlotSelection = (slot) => {
    setSelectedSlots((prev) => {
      const exists = prev.find((s) => s.slotId === slot.slotId);
      return exists
        ? prev.filter((s) => s.slotId !== slot.slotId)
        : [...prev, slot];
    });
  };

  const handleBookConfirm = async () => {
    const slotIds = selectedSlots.map((s) => s.slotId);
    const success = await bookSlot({
      slotIds,
      date: selectedWeek, // Pass selected date
    });
    console.log("booking success", success, slotIds);
    if (success) {
      setBookModalVisible(false);
      setSuccessVisible(true);
      setSelectedSlots([]);
      // Refresh slots only
      if (selectedWeek) {
        loadSlots({ date: selectedWeek, filter });
      }
    }
  };

  const handleCancelConfirm = async () => {
    const success = await cancelSlot(activeSlot.bookingId); // create success check
    if (success) {
      setCancelModalVisible(false);
      // Refresh slots only
      if (selectedWeek) {
        loadSlots({ date: selectedWeek, filter });
      }
    }
  };

  function handleChangeWeek(date) {
    setSelectedWeek(date);
    // No need to call loadSlots here, useEffect will handle it
  }

  function handleFilter(f) {
    setFilter(f);
    console.log("filter", f);
    // No need to call loadSlots here, useEffect will handle it
  }

  return (
    <View style={styles.container}>
      <WeekSelector
        weeks={weeks}
        selectedWeek={selectedWeek}
        onSelect={handleChangeWeek}
      />

      <SlotFilters value={filter} onChange={handleFilter} />

      <FlatList
        data={slots}
        keyExtractor={(item) => item.slotId}
        refreshing={slotsLoading}
        onRefresh={() => selectedWeek && loadSlots({ date: selectedWeek, filter })}
        contentContainerStyle={{ paddingBottom: 100 }} // Add padding for footer
        renderItem={({ item }) => (
          <SlotCard
            slot={item}
            selectable={item.bookingStatus === "NOT_BOOKED"}
            selected={selectedSlots.some((s) => s.slotId === item.slotId)}
            onSelect={() => toggleSlotSelection(item)}
            // onBook removed - bulk action only
            onCancel={() => {
              setActiveSlot(item);
              setCancelModalVisible(true);
            }}
          />
        )}
      />

      {/* FLOAT FOOTER FOR BOOKING action */}
      {selectedSlots.length > 0 && (
        <View style={styles.footerContainer}>
          <Text style={styles.selectedText}>
            {selectedSlots.length} Slots Selected
          </Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => setBookModalVisible(true)}
          >
            <Text style={styles.bookButtonText}>Book Selection</Text>
          </TouchableOpacity>
        </View>
      )}

      <BookSlotModal
        visible={bookModalVisible}
        slots={selectedSlots}
        onClose={() => setBookModalVisible(false)}
        onConfirm={handleBookConfirm}
      />

      <CancelSlotModal
        visible={cancelModalVisible}
        slot={activeSlot}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
      />

      <SuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", marginVertical: 40 },
  footerContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  bookButton: {
    backgroundColor: "#4C4CFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  bookButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
