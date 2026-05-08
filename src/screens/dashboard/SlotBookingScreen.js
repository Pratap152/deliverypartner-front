import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSlots } from '../../hooks/useSlots';
import { useSlotSelection } from '../../hooks/useSlotSelection';
import { TABS, FILTERS } from '../../utils/constants/slotConstants';
import { extractSlotIds } from '../../utils/slotHelpers';
import { getWeekNumber } from '../../services/slots/slots.service';
import { useSelector } from 'react-redux';

// Components
import SlotBookingHeader from '../../components/dashboard/slots/SlotBookingHeader';
import SlotsList from '../../components/dashboard/slots/SlotsList';
import LockedWeekView from '../../components/dashboard/slots/LockedWeekView';
import SlotBookingFooter from '../../components/dashboard/slots/SlotBookingFooter';
import BookSlotModal from '../../components/dashboard/slots/modals/BookSlotModal';
import CancelSlotModal from '../../components/dashboard/slots/modals/CancelSlotModal';
import SuccessModal from '../../components/dashboard/slots/modals/SuccessModal';
import SlotHistory from '../../components/common/SlotHistory';


export default function SlotBookingScreen({navigation}) {
  const {
    weeks,
    slots,
    slotsLoading,
    weeksLoading,
    loadWeeks,
    loadSlots,
    bookSlot,
    cancelSlot,
  } = useSlots();

  // Slot selection management
  const {
    selectedSlots,
    selectedCount,
    toggleSlotSelection,
    clearSelection,
    isSlotSelected,
  } = useSlotSelection();

  const today = new Date().toISOString().split('T')[0];

  // Local state
  const [activeTab, setActiveTab] = useState(TABS.CURRENT);
  const [selectedWeek, setSelectedWeek] = useState(today);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);

  const cityId = useSelector((state) => state.profile.data?.location?.city?.trim());
  const pincodeId = useSelector((state) => state.profile.data?.location?.pincode?.trim());
  
  // Load weeks and slots in parallel on mount
  useEffect(() => {
    loadWeeks({ cityId, pincodeId });
    loadSlots({ date: today, filter, cityId, pincodeId });
  }, []);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // skip on mount because we already loaded todays slots
    }
    if (selectedWeek) {
      loadSlots({ date: selectedWeek, filter, cityId, pincodeId });    
    }
  }, [selectedWeek, filter]);

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Clear selection when changing tabs
    setSelectedWeek(null);
    clearSelection();
    
    if (tab === TABS.CURRENT) {
      // Load current week
      loadWeeks({cityId, pincodeId});
    } else if (tab === TABS.NEXT) {
      // Load next week (current + 1)
      const currentWeekNum = getWeekNumber();
      const nextWeekNum = currentWeekNum + 1;
      loadWeeks({ weekNumber: nextWeekNum, cityId, pincodeId });    
    }
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
        loadSlots({ date: selectedWeek, filter, cityId, pincodeId });      
      }
    }
  };

  const handleCancelConfirm = async () => {
    const success = await cancelSlot(activeSlot.bookingId);
    if (success) {
      setCancelModalVisible(false);
      // Refresh slots
      if (selectedWeek) {
        loadSlots({ date: selectedWeek, filter, cityId, pincodeId });      
      }
    }
  };

  const handleRefresh = () => {
    if (selectedWeek) {
      loadSlots({ date: selectedWeek, filter, cityId, pincodeId });    
    }
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <SlotBookingHeader activeTab={activeTab} onTabChange={handleTabChange} navigation={navigation} />

      {/* Main Content */}
      {activeTab === TABS.UPCOMING ? (
        <LockedWeekView />
      ) : (
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
      )}

      {/* Floating Footer */}
      <SlotBookingFooter
        selectedCount={selectedCount}
        onBook={handleBookingOpen}
        visible={activeTab !== TABS.UPCOMING}
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
        date={selectedWeek}
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
    backgroundColor: '#F8F9FA'
  },
});
