import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';

import {useSlots} from '../../hooks/useSlots';
import {useSlotSelection} from '../../hooks/useSlotSelection';
import {TABS, FILTERS} from '../../utils/constants/slotConstants';
import {extractSlotIds} from '../../utils/slotHelpers';
import {getWeekNumber} from '../../services/slots/SlotBookingService';

import SlotBookingHeader from '../../components/dashboard/slots/SlotBookingHeader';
import SlotsList from '../../components/dashboard/slots/SlotsList';
import LockedWeekView from '../../components/dashboard/slots/LockedWeekView';
import SlotBookingFooter from '../../components/dashboard/slots/SlotBookingFooter';
import BookSlotModal from '../../components/dashboard/slots/modals/BookSlotModal';
import CancelSlotModal from '../../components/dashboard/slots/modals/CancelSlotModal';
import SuccessModal from '../../components/dashboard/slots/modals/SuccessModal';

export default function SlotsScreen() {
  const {
    weeks,
    slots,
    slotsLoading,
    weeksLoading,
    actionLoading,
    loadWeeks,
    loadSlots,
    bookSlot,
    cancelSlot,
  } = useSlots();

  const {
    selectedSlots,
    selectedCount,
    toggleSlotSelection,
    clearSelection,
    isSlotSelected,
  } = useSlotSelection();

  const today = new Date().toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState(TABS.CURRENT);
  const [selectedWeek, setSelectedWeek] = useState(today);
  const [filter, setFilter] = useState(FILTERS.ALL);

  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);

  // NEW
  const [tabLoading, setTabLoading] = useState(false);

  const [bookedSlots, setBookedSlots] = useState([]);

  const cityId = useSelector(
    state => state.profile.data?.location?.city?.trim(),
  );

  const pincodeId = useSelector(
    state => state.profile.data?.location?.pincode?.trim(),
  );

  useEffect(() => {
    const loadInitial = async () => {
      await loadWeeks({
        cityId,
        pincodeId,
      });

      await loadSlots({
        date: today,
        filter,
        cityId,
        pincodeId,
      });
    };

    loadInitial();
  }, []);

  const handleTabChange = async tab => {
    if (tab === activeTab) {
      return;
    }

    setTabLoading(true);

    setActiveTab(tab);
    clearSelection();

    let weekNumber;

    if (tab === TABS.NEXT) {
      weekNumber = getWeekNumber() + 1;
    } else if (tab === TABS.UPCOMING) {
      weekNumber = getWeekNumber() + 2;
    }

    await loadWeeks({
      weekNumber,
      cityId,
      pincodeId,
    });

    setTabLoading(false);
  };

  useEffect(() => {
    if (!weeks.length) {
      return;
    }

    let firstDate = weeks[0].date;

    if (activeTab === TABS.CURRENT) {
      const todaySlot = weeks.find(w => w.date === today);

      if (todaySlot) {
        firstDate = todaySlot.date;
      }
    }

    if (!selectedWeek || !weeks.some(w => w.date === selectedWeek)) {
      setSelectedWeek(firstDate);
    }
  }, [weeks]);

  useEffect(() => {
    if (!selectedWeek) {
      return;
    }

    loadSlots({
      date: selectedWeek,
      filter,
      cityId,
      pincodeId,
    });
  }, [selectedWeek, filter]);

  const handleWeekSelect = date => {
    if (date === selectedWeek) {
      return;
    }

    clearSelection();
    setSelectedWeek(date);
  };

  const handleFilterChange = newFilter => {
    if (newFilter === filter) {
      return;
    }

    clearSelection();
    setFilter(newFilter);
  };

  const handleSlotCancel = slot => {
    setActiveSlot(slot);
    setCancelModalVisible(true);
  };

 const handleBookConfirm = async () => {
  const success = await bookSlot({
    slotIds: extractSlotIds(selectedSlots),
    date: selectedWeek,
  });

  if (success) {
    // Save a copy before clearing
    setBookedSlots([...selectedSlots]);

    setBookModalVisible(false);
    setSuccessVisible(true);

    clearSelection();

    loadSlots({
      date: selectedWeek,
      filter,
      cityId,
      pincodeId,
    });
  }
};
  const handleCancelConfirm = async () => {
    const success = await cancelSlot(activeSlot.bookingId);

    if (success) {
      setCancelModalVisible(false);

      loadSlots({
        date: selectedWeek,
        filter,
        cityId,
        pincodeId,
      });
    }
  };

  const selectedWeekData =
    weeks.find(item => item.date === selectedWeek) || null;

  const showLoader = weeksLoading || tabLoading;

  return (
    <View style={styles.container}>
      <SlotBookingHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {showLoader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color="#1F3365"
          />
        </View>
      ) : activeTab === TABS.UPCOMING ? (
        <LockedWeekView />
      ) : (
        <SlotsList
          weeks={weeks}
          slots={slots}
          selectedWeek={selectedWeek}
          selectedWeekData={selectedWeekData}
          filter={filter}
          onWeekSelect={handleWeekSelect}
          onFilterChange={handleFilterChange}
          onSlotSelect={toggleSlotSelection}
          onSlotCancel={handleSlotCancel}
          isSlotSelected={isSlotSelected}
          weeksLoading={weeksLoading}
          slotsLoading={slotsLoading}
          actionLoading={actionLoading}
          onRefresh={() =>
            loadSlots({
              date: selectedWeek,
              filter,
              cityId,
              pincodeId,
            })
          }
        />
      )}

      <SlotBookingFooter
        selectedCount={selectedCount}
        onBook={() => setBookModalVisible(true)}
        visible={activeTab !== TABS.UPCOMING}
      />

      <BookSlotModal
        visible={bookModalVisible}
        slots={selectedSlots}
        date={selectedWeek}
        onClose={() => setBookModalVisible(false)}
        onConfirm={handleBookConfirm}
        loading={actionLoading}
      />

      <CancelSlotModal
        visible={cancelModalVisible}
        slot={activeSlot}
        date={selectedWeek}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
        loading={actionLoading}
      />

      <SuccessModal
        visible={successVisible}
        slots={bookedSlots}
        onClose={() => {
            setSuccessVisible(false);
            setBookedSlots([]);
        }}

    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});