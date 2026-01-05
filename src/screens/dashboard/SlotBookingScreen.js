import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSlots } from '../../hooks/useSlots';
import { useSlotSelection } from '../../hooks/useSlotSelection';
import { TABS, FILTERS } from '../../utils/constants/slotConstants';
import { extractSlotIds } from '../../utils/slotHelpers';

// Components
import SlotBookingHeader from '../../components/dashboard/slots/SlotBookingHeader';
import SlotsList from '../../components/dashboard/slots/SlotsList';
import LockedWeekView from '../../components/dashboard/slots/LockedWeekView';
import SlotBookingFooter from '../../components/dashboard/slots/SlotBookingFooter';
import BookSlotModal from '../../components/dashboard/slots/modals/BookSlotModal';
import CancelSlotModal from '../../components/dashboard/slots/modals/CancelSlotModal';
import SuccessModal from '../../components/dashboard/slots/modals/SuccessModal';
import SlotHistory from '../../components/common/SlotHistory';
/**
 * SlotBookingScreen - Main screen for slot booking functionality
 * Orchestrates child components and manages business logic
 */
export default function SlotBookingScreen() {
  // Hook: Slot data and operations
  const {
    weeks,
    slots,
    slotsLoading,
    loadWeeks,
    loadSlots,
    bookSlot,
    cancelSlot,
  } = useSlots();

  // Hook: Slot selection management
  const {
    selectedSlots,
    selectedCount,
    toggleSlotSelection,
    clearSelection,
    isSlotSelected,
  } = useSlotSelection();

  // Local state
  const [activeTab, setActiveTab] = useState(TABS.CURRENT);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);

  // Effect: Load weeks on mount
  useEffect(() => {
    loadWeeks();
  }, []);

  // Effect: Auto-select first week
  useEffect(() => {
    if (weeks?.length > 0 && !selectedWeek) {
      setSelectedWeek(weeks[0].date);
    }
  }, [weeks, selectedWeek]);

  // Effect: Load slots when week or filter changes
  useEffect(() => {
    if (selectedWeek) {
      loadSlots({ date: selectedWeek, filter });
    }
  }, [selectedWeek, filter]);

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleWeekSelect = (date) => {
    setSelectedWeek(date);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSlotCancel = (slot) => {
    setActiveSlot(slot);
    setCancelModalVisible(true);
  };

  const handleBookingOpen = () => {
    setBookModalVisible(true);
  };

  const handleBookConfirm = async () => {
    const slotIds = extractSlotIds(selectedSlots);
    console.log(slotIds);
    const success = await bookSlot({
      slotIds,
      date: selectedWeek,
    });

    if (success) {
      setBookModalVisible(false);
      setSuccessVisible(true);
      clearSelection();
      // Refresh slots
      if (selectedWeek) {
        loadSlots({ date: selectedWeek, filter });
      }
    }
  };

  const handleCancelConfirm = async () => {
    const success = await cancelSlot(activeSlot.bookingId);
    if (success) {
      setCancelModalVisible(false);
      // Refresh slots
      if (selectedWeek) {
        loadSlots({ date: selectedWeek, filter });
      }
    }
  };

  const handleRefresh = () => {
    if (selectedWeek) {
      loadSlots({ date: selectedWeek, filter });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SlotBookingHeader activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      {activeTab === TABS.CURRENT ? (
        <SlotsList
          weeks={weeks}
          slots={slots}
          selectedWeek={selectedWeek}
          filter={filter}
          onWeekSelect={handleWeekSelect}
          onFilterChange={handleFilterChange}
          onSlotSelect={toggleSlotSelection}
          onSlotCancel={handleSlotCancel}
          isSlotSelected={isSlotSelected}
          loading={slotsLoading}
          onRefresh={handleRefresh}
        />
      ) : (
        <LockedWeekView />
      )}

      {/* Floating Footer */}
      <SlotBookingFooter
        selectedCount={selectedCount}
        onBook={handleBookingOpen}
        visible={activeTab === TABS.CURRENT}
      />
    
      {/* Modals */}
      <BookSlotModal
        visible={bookModalVisible}
        slots={selectedSlots}
        date={selectedWeek}
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
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
