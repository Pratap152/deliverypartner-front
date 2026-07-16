import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CalendarCard = ({
  month,
  year,
  calendar = [],
  loading,
  onPreviousMonth,
  onNextMonth,
  navigation,
}) => {

  // Convert API calendar array to a lookup object
  const statusMap = {};

  calendar.forEach(item => {
    statusMap[item.date] = item.status;
  });

  // Number of days in month
  const totalDays = new Date(year, month, 0).getDate();

  // Monday = first day
  let firstDay = new Date(year, month - 1, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  // Calendar cells
  const calendarDays = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Actual days
  for (let day = 1; day <= totalDays; day++) {
    calendarDays.push(day);
  }

  const getStatusColor = status => {
    switch (status) {
      case 'FULL_DAY':
        return '#4CAF50';

      case 'HALF_DAY':
        return '#FFC107';

      case 'ABSENT':
        return '#F44336';

      case 'HOLIDAY':
        return '#FF9800';

      default:
        return '#E0E0E0';
    }
  };

  const handleDatePress = day => {
    if (!day) return;

    const formattedDate =
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    navigation.navigate('AttendanceDetailsScreen', {
      date: formattedDate,
    });
  };

  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={onPreviousMonth}
          style={styles.arrowButton}>

          <Ionicons
            name="chevron-back"
            size={22}
            color="#1F3365"
          />

        </TouchableOpacity>

        <Text style={styles.monthText}>
          {MONTHS[month - 1]} {year}
        </Text>

        <TouchableOpacity
          onPress={onNextMonth}
          style={styles.arrowButton}>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#1F3365"
          />

        </TouchableOpacity>

      </View>

      {loading ? (

        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="small"
            color="#1F3365"
          />
        </View>

      ) : (

        <>
          {/* Week Days */}

          <View style={styles.weekRow}>
            {WEEK_DAYS.map(day => (
              <Text
                key={day}
                style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}

          <View style={styles.grid}>

            {calendarDays.map((day, index) => {

              if (!day) {
                return (
                  <View
                    key={index}
                    style={styles.dayCell}
                  />
                );
              }

              const dateString =
                `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              const status = statusMap[dateString];

              const today = new Date();

              const isToday =
                today.getFullYear() === year &&
                today.getMonth() + 1 === month &&
                today.getDate() === day;

              return (

                <TouchableOpacity
                  key={index}
                  style={styles.dayCell}
                  activeOpacity={0.8}
                  onPress={() => handleDatePress(day)}
                >

                  <View
                    style={[
                      styles.circle,
                      {
                        backgroundColor:
                          getStatusColor(status),
                      },
                      isToday && styles.todayCircle,
                    ]}
                  >

                    <Text
                      style={styles.dayNumber}>
                      {day}
                    </Text>

                  </View>

                </TouchableOpacity>

              );

            })}

          </View>

                    {/* Legend */}

          <View style={styles.legendContainer}>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: '#4CAF50' },
                ]}
              />
              <Text style={styles.legendText}>Full Day</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: '#FFC107' },
                ]}
              />
              <Text style={styles.legendText}>Half Day</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: '#F44336' },
                ]}
              />
              <Text style={styles.legendText}>Absent</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: '#FF9800' },
                ]}
              />
              <Text style={styles.legendText}>Holiday</Text>
            </View>

          </View>

        </>

      )}

    </View>
  );
};

export default CalendarCard;

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  monthText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#1F3365',
  },

  loaderContainer: {
    height: responsiveHeight(28),
    justifyContent: 'center',
    alignItems: 'center',
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  weekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.7),
    fontWeight: '700',
    color: '#666',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    marginBottom: 12,
  },

  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  todayCircle: {
    borderWidth: 2,
    borderColor: '#1F3365',
  },

  dayNumber: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.8),
  },

  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '48%',
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  legendText: {
    fontSize: responsiveFontSize(1.6),
    color: '#555',
    fontWeight: '500',
  },

});