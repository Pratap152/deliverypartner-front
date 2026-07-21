import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import Header from '../../components/attendance/Header';
import DateNavigator from '../../components/slots/DateNavigator';

import SlotSummaryCard from '../../components/slots/SlotSummaryCard';
import SlotListCard from '../../components/slots/SlotListCard';
import DailySummaryCard from '../../components/slots/DailySummaryCard';

import ShiftSummaryCard from '../../components/slots/ShiftSummaryCard';
import EmptyState from '../../components/slots/EmptyState';

import { getSlotDetails } from '../../services/slots/slotDetailsService';

const SlotHistoryScreen = () => {
  const riderType = useSelector(
    state => state.profile.data?.riderType,
  );

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD'),
  );

  const [loading, setLoading] = useState(false);
  const [slotDetails, setSlotDetails] = useState(null);
  const [message, setMessage] = useState('');

  const isIndividual =
    riderType === 'INDIVIDUAL_EMPLOYEE';

  const isEmployee =
    riderType === 'COMPANY_EMPLOYEE' ||
    riderType === 'ZESTBOT_EMPLOYEE';

  const fetchSlotDetails = async date => {
    try {
      setLoading(true);
      setMessage('');

      const response = await getSlotDetails(date);

      console.log('Redux Rider Type:', riderType);
      console.log('Slot Details Response:', response);

      if (response?.success) {
        setSlotDetails(response.data);
      } else {
        setSlotDetails(null);
        setMessage(response?.message || 'No slot details available.');
      }
    } catch (error) {
      console.log('Slot Details Error:', error);

      setSlotDetails(null);

      setMessage(
        error?.response?.data?.message ||
        'No slot details available.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotDetails(selectedDate);
  }, [selectedDate]);

  const goPreviousDay = () => {
    setSelectedDate(
      dayjs(selectedDate)
        .subtract(1, 'day')
        .format('YYYY-MM-DD'),
    );
  };

  const goNextDay = () => {
    setSelectedDate(
      dayjs(selectedDate)
        .add(1, 'day')
        .format('YYYY-MM-DD'),
    );
  };

  const hasIndividualData =
    slotDetails?.summary &&
    slotDetails?.slots &&
    slotDetails?.dailySummary;

  const hasEmployeeData =
    slotDetails?.bookings &&
    slotDetails.bookings.length > 0;
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Slot Details" />

      <DateNavigator
        selectedDate={selectedDate}
        onPrevious={goPreviousDay}
        onNext={goNextDay}
      />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#3558B5"
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>

          {/* Individual Employee */}

          {isIndividual &&
            (hasIndividualData ? (
              <>
                <SlotSummaryCard
                  summary={slotDetails.summary}
                />

                <SlotListCard
                  slots={slotDetails.slots}
                />

                <DailySummaryCard
                  summary={slotDetails.dailySummary}
                />
              </>
            ) : (
              <EmptyState
                title="No Slot Details"
                message={
                  message ||
                  `No slot details available for ${dayjs(
                    selectedDate,
                  ).format('DD MMM YYYY')}`
                }
              />
            ))}

          {/* Company Employee / Zestbot Employee */}

          {isEmployee &&
            (hasEmployeeData ? (
              <>
                <ShiftSummaryCard
                  bookings={slotDetails.bookings}
                  selectedDate={selectedDate}
                />


              </>
            ) : (
              <EmptyState
                title="No Shift Assigned"
                message={
                  message ||
                  `No shifts assigned for ${dayjs(
                    selectedDate,
                  ).format('DD MMM YYYY')}`
                }
              />
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SlotHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  content: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});