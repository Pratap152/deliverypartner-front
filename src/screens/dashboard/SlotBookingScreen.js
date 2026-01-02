import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSlots } from "../../hooks/useSlots";

import WeekSelector from "../../components/dashboard/slots/WeekSelector";
import SlotFilters from "../../components/dashboard/slots/SlotFilters";
import SlotCard from "../../components/dashboard/slots/SlotCard";
import BookSlotModal from "../../components/dashboard/slots/BookSlotModal";
import CancelSlotModal from "../../components/dashboard/slots/CancelSlotModal";
import SuccessModal from "../../components/dashboard/slots/SuccessModal";

const { width } = Dimensions.get("window");

export default function SlotBookingScreen() {
  const {
    weeks,
    slots,
    weeksLoading,
    slotsLoading,
    loading,
    loadWeeks,
    loadSlots,
    bookSlot,
    cancelSlot,
  } = useSlots();

  const [activeTab, setActiveTab] = useState("current"); // "current" | "next"
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
  }

  function handleFilter(f) {
    setFilter(f);
    console.log("filter", f);
  }

  // --- RENDER HELPERS ---
  const renderCurrentWeek = () => (
    <View style={styles.contentContainer}>
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
    </View>
  );

  const renderNextWeek = () => (
    <View style={styles.lockedContainer}>
      <View style={styles.lockIconWrapper}>
        <Ionicons name="lock-closed" size={60} color="#6B7280" />
      </View>
      <Text style={styles.lockedText}>Slots will be unlocked next 2 hours</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* --- HEADER SECTION --- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Slots</Text>
          <TouchableOpacity>
            <Ionicons name="headset" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "current" && styles.activeTab]}
            onPress={() => setActiveTab("current")}
          >
            <Text style={[styles.tabText, activeTab === "current" && styles.activeTabText]}>
              Current Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "next" && styles.activeTab]}
            onPress={() => setActiveTab("next")}
          >
            <Text style={[styles.tabText, activeTab === "next" && styles.activeTabText]}>
              Next Week
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- MAIN CONTENT --- */}
      {activeTab === "current" ? renderCurrentWeek() : renderNextWeek()}

      {/* --- MODALS --- */}
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
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  contentContainer: { flex: 1, paddingHorizontal: 16, marginTop: 10 },

  // Header Styles
  header: {
    backgroundColor: "#4C4CFF", // Purple/Blue
    paddingTop: 20, // Status bar safe area approx
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#FFF",
  },
  tabText: {
    color: "#E0E0E0",
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#4C4CFF",
    fontWeight: "700",
  },

  // Locked View Styles
  lockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  lockIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  lockedText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },

  // Footer Styles
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
