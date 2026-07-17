import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const formatDate = dateString => {
  if (!dateString) return '--';

  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = dateString => {
  if (!dateString) return '--';

  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const TodayCard = ({ attendance }) => {
  const getStatus = status => {
    switch (status) {
      case 'FULL_DAY':
        return {
          label: 'Full Day',
          color: '#4CAF50',
        };

      case 'HALF_DAY':
        return {
          label: 'Half Day',
          color: '#FFC107',
        };

      case 'ONE_THIRD_DAY':
        return {
          label: 'One Third Day',
          color: '#FFB300',
        };

      case 'ABSENT':
        return {
          label: 'Absent',
          color: '#F44336',
        };

      case 'HOLIDAY':
        return {
          label: 'Holiday',
          color: '#FF9800',
        };

      case 'LEAVE':
        return {
          label: 'Leave',
          color: '#9C27B0',
        };

      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          color: '#13ACBE',
        };

      default:
        return {
          label: '--',
          color: '#999',
        };
    }
  };

  if (!attendance) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Today's Attendance</Text>

        <View style={styles.emptyContainer}>
          <Ionicons
            name="calendar-clear-outline"
            size={50}
            color="#BDBDBD"
          />

          <Text style={styles.emptyText}>
            No attendance available today
          </Text>
        </View>
      </View>
    );
  }

  const status = getStatus(attendance.status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Attendance</Text>

      <View style={styles.summaryCard}>
        {/* Check In */}
        <View style={styles.item}>
          <Ionicons
            name="log-in-outline"
            size={26}
            color="#00C853"
          />

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.value}>
              {formatTime(attendance.checkIn)}
            </Text>

            <Text style={styles.dateText}>
              {formatDate(attendance.checkIn)}
            </Text>
          </View>

          <Text style={styles.label}>Check In</Text>
        </View>

        <View style={styles.verticalDivider} />

        {/* Check Out */}
        <View style={styles.item}>
          <Ionicons
            name="log-out-outline"
            size={26}
            color="#FF6D00"
          />

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.value}>
              {formatTime(attendance.checkOut)}
            </Text>

            <Text style={styles.dateText}>
              {formatDate(attendance.checkOut)}
            </Text>
          </View>

          <Text style={styles.label}>Check Out</Text>
        </View>

        <View style={styles.verticalDivider} />

        {/* Working Hours */}
        <View style={styles.item}>
          <Ionicons
            name="time-outline"
            size={26}
            color="#5C6CFA"
          />

          <Text style={styles.value}>
            {attendance.workingHours || '--'}
          </Text>

          <Text style={styles.label}>Hours</Text>
        </View>

        <View style={styles.verticalDivider} />

        {/* Status */}
        <View style={styles.item}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: status.color,
              },
            ]}
          />

          <Text
            style={[
              styles.value,
              {
                color: status.color,
              },
            ]}>
            {status.label}
          </Text>

          <Text style={styles.label}>Status</Text>
        </View>
      </View>
    </View>
  );
};

export default TodayCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  title: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#1F3365',
    marginBottom: 12,
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: responsiveHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  verticalDivider: {
    width: 1,
    height: 74,
    backgroundColor: '#ECECEC',
  },

  value: {
    marginTop: 8,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  label: {
    marginTop: 4,
    fontSize: responsiveFontSize(1.6),
    color: '#8A8A8A',
    fontWeight: '500',
    textAlign: 'center',
  },

  dateText: {
    marginTop: 3,
    fontSize: responsiveFontSize(1.35),
    color: '#8A8A8A',
    fontWeight: '500',
    textAlign: 'center',
  },

  statusDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginBottom: 8,
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: '#ECECEC',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  emptyText: {
    marginTop: 12,
    fontSize: responsiveFontSize(1.8),
    color: '#888',
    textAlign: 'center',
  },
});