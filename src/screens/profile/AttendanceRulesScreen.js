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
import { getAttendanceRules } from '../../services/profile/attendanceApi';

const AttendanceRulesScreen = () => {

  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState([]);
  const [salaryCreditDate, setSalaryCreditDate] = useState('');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {

      setLoading(true);

      const response = await getAttendanceRules();

      if (response.data.success) {
        setRules(response.data.data.rules);
        setSalaryCreditDate(response.data.data.salaryCreditDate);
      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        'Unable to fetch attendance rules.'
      );

    } finally {

      setLoading(false);

    }
  };

  const getColor = title => {

    switch (title) {

      case 'Full Day':
        return '#4CAF50';

      case '2/3 Day':
        return '#FFC107';

      case '1/3 Day':
        return '#FF9800';

      default:
        return '#1F3365';

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

  return (

    <SafeAreaView style={styles.container}>

      <Header title="Attendance Rules" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        <Text style={styles.heading}>
          Attendance Rules
        </Text>

        {rules.map((item, index) => (

          <View
            key={index}
            style={styles.card}>

            <View style={styles.titleRow}>

              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: getColor(item.title),
                  },
                ]}
              />

              <Text style={styles.title}>
                {item.title}
              </Text>

            </View>

            {item.minimumHours !== undefined && (
              <View style={styles.row}>
                <Text style={styles.label}>
                  Minimum Hours
                </Text>

                <Text style={styles.value}>
                  {item.minimumHours} hrs
                </Text>
              </View>
            )}

            {item.maximumHours !== undefined && (
              <View style={styles.row}>
                <Text style={styles.label}>
                  Maximum Hours
                </Text>

                <Text style={styles.value}>
                  {item.maximumHours} hrs
                </Text>
              </View>
            )}

            <View style={styles.row}>
              <Text style={styles.label}>
                Salary Percentage
              </Text>

              <Text style={styles.salary}>
                {item.salaryPercentage}%
              </Text>
            </View>

          </View>

        ))}

        <View style={styles.card}>

          <View style={styles.creditHeader}>

            <Ionicons
              name="wallet-outline"
              size={24}
              color="#2E7D32"
            />

            <Text style={styles.creditTitle}>
              Salary Credit Date
            </Text>

          </View>

          <Text style={styles.creditDate}>
            {salaryCreditDate}
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>

  );
};

export default AttendanceRulesScreen;

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

  heading: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#1F3365',
    marginBottom: 16,
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

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },

  title: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#1F3365',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
  },

  value: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: '#1F3365',
  },

  salary: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '700',
    color: '#2E7D32',
  },

  creditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  creditTitle: {
    marginLeft: 10,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#1F3365',
  },

  creditDate: {
    fontSize: responsiveFontSize(2.1),
    color: '#2E7D32',
    fontWeight: '700',
  },

});