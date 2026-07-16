import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/attendance/Header';
import MonthCard from '../../components/attendance/MonthCard';
import OverviewCard from '../../components/attendance/OverviewCard';
import CalendarCard from '../../components/attendance/CalendarCard';
import TodayCard from '../../components/attendance/TodayCard';
import RulesCard from '../../components/attendance/RulesCard';
import SummaryCard from '../../components/attendance/SummaryCard';

import { getAttendanceDashboard } from '../../services/profile/attendanceApi';

const AttendanceScreen = ({ navigation }) => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [attendance, setAttendance] = useState(null);

  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const isFirstRender = useRef(true);

  const fetchAttendance = async (isMonthChange = false) => {
    try {
      if (isMonthChange) {
        setCalendarLoading(true);
      } else {
        setLoading(true);
      }

      const response = await getAttendanceDashboard(month, year);

      if (response.data.success) {
        setAttendance(response.data.data);
      }
    } catch (error) {
  console.log('Attendance API Error:', error);
  console.log('Response:', error?.response);
  console.log('Status:', error?.response?.status);
  console.log('Data:', error?.response?.data);

  Alert.alert(
    'Error',
    error?.response?.data?.message || 'Unable to load attendance.'
  );
}finally {
      if (isMonthChange) {
        setCalendarLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Initial Load
  useEffect(() => {
    fetchAttendance(false);
  }, []);

  // Reload only when month/year changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    fetchAttendance(true);
  }, [month, year]);

  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1F3365" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Attendance" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        <MonthCard
          month={month}
          year={year}
        />

        <OverviewCard
          estimatedSalary={attendance?.estimatedSalary}
          presentDays={attendance?.presentDays}
          workingHours={attendance?.workingHours}
        />

        <CalendarCard
          month={month}
          year={year}
          calendar={attendance?.calendar || []}
          loading={calendarLoading}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          navigation={navigation}
        />

        <TodayCard
          attendance={attendance?.todayAttendance}
        />

        <RulesCard
          onPress={() => navigation.navigate('AttendanceRulesScreen')}
        />

        <SummaryCard
          onPress={() =>
            navigation.navigate('MonthlySummaryScreen', {
              month,
              year,
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },
});