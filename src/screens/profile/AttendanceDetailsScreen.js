import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

import Header from '../../components/attendance/Header';
import { getAttendanceDetails } from '../../services/profile/attendanceApi';

const AttendanceDetailsScreen = ({ route }) => {
  const { date } = route.params;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetchAttendanceDetails();
  }, []);

  const fetchAttendanceDetails = async () => {
    try {
      setLoading(true);

      const response = await getAttendanceDetails(date);

      if (response.data.success) {
        setDetails(response.data.data);
      }

    } catch (error) {

      console.log(error);

      if (error?.response?.status === 404) {
        setDetails(null);
      } else {
        Alert.alert(
          'Error',
          'Unable to fetch attendance details.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const getStatus = status => {
  switch (status) {
    case 'FULL_DAY':
      return {
        text: 'Full Day',
        color: '#4CAF50',
        icon: 'checkmark-circle',
      };

    case 'HALF_DAY':
      return {
        text: 'Half Day',
        color: '#FFC107',
        icon: 'time',
      };

    case 'ONE_THIRD_DAY':
      return {
        text: 'One Third Day',
        color: '#FFB300',
        icon: 'hourglass',
      };

    case 'ABSENT':
      return {
        text: 'Absent',
        color: '#F44336',
        icon: 'close-circle',
      };

    case 'HOLIDAY':
      return {
        text: 'Holiday',
        color: '#FF9800',
        icon: 'gift',
      };

    case 'LEAVE':
      return {
        text: 'Leave',
        color: '#9C27B0',
        icon: 'airplane',
      };

    case 'IN_PROGRESS':
      return {
        text: 'In Progress',
        color: '#13ACBE',
        icon: 'sync-circle',
      };

    default:
      return {
        text: status
          ? status
              .replace(/_/g, ' ')
              .toLowerCase()
              .replace(/\b\w/g, c => c.toUpperCase())
          : '--',
        color: '#999',
        icon: 'help-circle',
      };
  }
};

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#1F3365"
        />
      </SafeAreaView>
    );
  }

  if (!details) {
    return (
      <SafeAreaView style={styles.container}>

        <Header title="Attendance Details" />

        <View style={styles.emptyContainer}>

          <Ionicons
            name="calendar-outline"
            size={70}
            color="#CCCCCC"
          />

          <Text style={styles.emptyTitle}>
            No Attendance
          </Text>

          <Text style={styles.emptySubtitle}>
            You did not work on this day. No attendance record is available.
          </Text>

        </View>

      </SafeAreaView>
    );
  }

  const status = getStatus(details.attendance);

  return (

    <SafeAreaView style={styles.container}>

      <Header title="Attendance Details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* Date Card */}

        <View style={styles.card}>

          <View style={styles.dateRow}>

            <Ionicons
              name="calendar-outline"
              size={22}
              color="#1F3365"
            />

            <Text style={styles.date}>
              {details.date || date}
            </Text>

          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: `${status.color}20`,
              },
            ]}>

            <Ionicons
              name={status.icon}
              size={18}
              color={status.color}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color: status.color,
                },
              ]}>
              {status.text}
            </Text>

          </View>

        </View>
        {/* Holiday */}

        {details.attendance === 'HOLIDAY' ? (

          <View style={styles.card}>

            <View style={styles.centerContent}>

              <Ionicons
                name="gift"
                size={70}
                color="#FF9800"
              />

              <Text style={styles.holidayTitle}>
                Holiday
              </Text>

              <Text style={styles.holidayName}>
                {details.holidayName || 'Holiday'}
              </Text>

              <Text style={styles.holidaySubtitle}>
                Enjoy your day!
              </Text>

            </View>

          </View>

        ) : (

          <>
            {/* Check In */}

            {details.checkIn && (
              <InfoRow
                label="Check In"
                value={details.checkIn}
              />
            )}

            {/* Check Out */}

            {details.checkOut && (
              <InfoRow
                label="Check Out"
                value={details.checkOut}
              />
            )}

            {/* Working Hours */}

            {details.workingHours && (
              <InfoRow
                label="Working Hours"
                value={details.workingHours}
              />
            )}

            {/* Break */}

            {details.breakMinutes !== undefined && (
              <InfoRow
                label="Break Time"
                value={`${details.breakMinutes} mins`}
              />
            )}

            {/* Salary */}

            {details.salaryEligibility && (
              <InfoRow
                label="Salary Eligibility"
                value={details.salaryEligibility}
              />
            )}

            {/* Location */}

            <InfoRow
              label="Location"
              value={details.location || 'Not Available'}
            />

            {/* Notes */}

            {details.notes && (
              <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                  Notes
                </Text>

                <Text style={styles.notes}>
                  {details.notes}
                </Text>

              </View>
            )}

          </>

        )}

      </ScrollView>

    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }) => (

  <View style={styles.card}>

    <View style={styles.infoRow}>

      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>

    </View>

  </View>

);

export default AttendanceDetailsScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  date: {
    flex: 1,
    marginLeft: 10,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#1F3365',
  },

  statusBadge: {
    marginTop: 15,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 25,
  },

  statusText: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: responsiveFontSize(1.7),
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
    fontWeight: '600',
  },

  infoValue: {
    fontSize: responsiveFontSize(1.8),
    color: '#1F3365',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },

  sectionTitle: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '700',
    color: '#1F3365',
    marginBottom: 10,
  },

  notes: {
    fontSize: responsiveFontSize(1.8),
    color: '#555',
    lineHeight: 24,
  },

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(3),
  },

  holidayTitle: {
    marginTop: 18,
    fontSize: responsiveFontSize(2.3),
    fontWeight: '700',
    color: '#FF9800',
  },

  holidayName: {
    marginTop: 8,
    fontSize: responsiveFontSize(2),
    color: '#1F3365',
    fontWeight: '700',
  },

  holidaySubtitle: {
    marginTop: 8,
    fontSize: responsiveFontSize(1.8),
    color: '#777',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#1F3365',
  },

  emptySubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#777',
    fontSize: responsiveFontSize(1.8),
  },

});