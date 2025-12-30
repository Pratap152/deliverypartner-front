import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import WeekSwitcher from './components/WeekSwitcher';
import DaySelector from './components/DaySelector';
import FilterTabs from './components/FilterTabs';
import SlotCard from './components/SlotCard';
import BookedSummary from './components/BookedSummary';
import NextWeekLocked from './components/NextWeekLocked';

import BookingModal from './modals/BookingModal';
import BookingSuccessModal from './modals/BookingSuccessModal';
import CancelModal from './modals/CancelModal';

import useSlots from '../../../hooks/useSlots';

const FILTERS = ['All', 'Available', 'Booked', 'Cancelled'];

export default function MySlotsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { weeklySlots, loading } = useSelector(state => state.slots);

  const [weekType, setWeekType] = useState('CURRENT');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState('All');

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingVisible, setBookingVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);

  useEffect(() => {
    dispatch(useSlots({ weeksRes }));
  }, [weekType]);

  /** Extract selected day slots */
  const daySlots = useMemo(() => {
    if (!selectedDate || !weeklySlots?.length) return [];
    const dayObj = weeklySlots.find(d => d.date === selectedDate);
    return dayObj?.slots || [];
  }, [weeklySlots, selectedDate]);

  /** Apply filter */
  const filteredSlots = useMemo(() => {
    if (filter === 'All') return daySlots;

    if (filter === 'Available') {
      return daySlots.filter(
        s => s.isAvailable && !s.isLocked && s.bookedRiders < s.maxRiders
      );
    }

    if (filter === 'Booked') {
      return daySlots.filter(s => s.bookedRiders > 0);
    }

    if (filter === 'Cancelled') {
      return daySlots.filter(s => s.status !== 'ACTIVE');
    }

    return daySlots;
  }, [filter, daySlots]);

  const isNextWeekLocked = useMemo(() => {
    if (weekType !== 'NEXT') return false;
    const now = new Date();
    return !(now.getDay() === 6 && now.getHours() >= 14);
  }, [weekType]);

  return (
    <View style={styles.container}>
      <WeekSwitcher week={weekType} onChange={setWeekType} />
      <DaySelector
        data={weeklySlots}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      {isNextWeekLocked ? (
        <NextWeekLocked />
      ) : (
        <>
          <FilterTabs filters={FILTERS} active={filter} onChange={setFilter} />

          <FlatList
            data={filteredSlots}
            keyExtractor={item => item.slotId}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <SlotCard
                slot={item}
                selected={selectedSlots.includes(item.slotId)}
                onSelect={id =>
                  setSelectedSlots(prev =>
                    prev.includes(id)
                      ? prev.filter(x => x !== id)
                      : [...prev, id]
                  )
                }
                onBook={() => {
                  setSelectedSlots([item.slotId]);
                  setBookingVisible(true);
                }}
                onCancel={() => {
                  setSelectedSlots([item.slotId]);
                  setCancelVisible(true);
                }}
              />
            )}
          />

          <BookedSummary
            weeklySlots={weeklySlots}
            onHistory={() => navigation.navigate('SlotHistory')}
          />
        </>
      )}

      <BookingModal
        visible={bookingVisible}
        slots={selectedSlots}
        onClose={() => setBookingVisible(false)}
        onConfirm={() => {
          setBookingVisible(false);
          setSuccessVisible(true);
        }}
      />

      <BookingSuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
      />

      <CancelModal
        visible={cancelVisible}
        slots={selectedSlots}
        onClose={() => setCancelVisible(false)}
        onConfirm={() => setCancelVisible(false)}
      />
    </View>
  );
}
