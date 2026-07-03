import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MonthPicker from 'react-native-month-year-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OrderHistory from '../profile/OrderHistory';
import apiClient from '../../services/ApiClient';


const Tips = () => {
    const navigation = useNavigation();
  const [overview, setOverview] = useState({
    tipsEarned: 0,
    tippedOrders: 0,
    highestTip: 0,
    averageTip: 0,
  });
  const today = new Date();
  const [isDailyOpen, setIsDailyOpen] = useState(true);
const [isMonthlyOpen, setIsMonthlyOpen] = useState(true);
const [dailyMessage,setDailyMessage]=useState('');
const [monthlyMessage, setMonthlyMessage] = useState('');

const [selectedDate, setSelectedDate] = useState(today);

const [showDatePicker, setShowDatePicker] = useState(false);

const [dailySummary, setDailySummary] = useState({
  totalOrdersDelivered: 0,
  ordersWithTips: 0,
  ordersWithoutTips: 0,
  highestTip: 0,
  averageTip: 0,
  totalTipsEarned: 0,
});
const currentDate = new Date();

const [selectedMonth, setSelectedMonth] = useState(currentDate);

const [showMonthPicker, setShowMonthPicker] = useState(false);

const [monthlySummary, setMonthlySummary] = useState({
  ordersDelivered: 0,
  ordersWithTips: 0,
  highestTip: 0,
  averageTip: 0,
  tipPercentage: 0,
  totalTipsEarned: 0,
});
const [dailyTipsList, setDailyTipsList] = useState([]);
const [showAllTips, setShowAllTips] = useState(false);
  useEffect(() => {
  fetchOverview();
  fetchDailySummary(today);
  fetchMonthlySummary(currentDate);
  fetchDailyTipsList(currentDate);
}, []);

  const fetchOverview = async () => {
    try {
      const response = await apiClient.get('/api/rider/tips/overview');

      if (response.data.success) {
        setOverview(response.data.data);
      }
    } catch (error) {
      console.log('Tips Overview Error:', error);
    }
  };
const formatApiDate = (date) => {
  return date.toISOString().split('T')[0];
};

const fetchDailySummary = async (date) => {
    try{

        const response = await apiClient.get(
            `/api/rider/tips/daily/summary?date=${formatApiDate(date)}`
        );

        if(response.data.success){

            setDailySummary(response.data.data);
            setDailyMessage('');

        }else{

            setDailySummary({
                totalOrdersDelivered:0,
                ordersWithTips:0,
                ordersWithoutTips:0,
                highestTip:0,
                averageTip:0,
                totalTipsEarned:0,
            });

            setDailyMessage(response.data.message);

        }

    }catch(error){
        console.log(error);
    }
}
const handleConfirm = (date) => {

  setSelectedDate(date);

  setShowDatePicker(false);

  fetchDailySummary(date);
};

const formatDisplayDate = (date) => {

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

};
const fetchMonthlySummary = async (date) => {
  try {

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const response = await apiClient.get(
      `/api/rider/tips/monthly/summary?month=${month}&year=${year}`
    );

    if (response.data.success) {

  setMonthlySummary(response.data.data);
  setMonthlyMessage('');

} else {

  setMonthlySummary({
    ordersDelivered: 0,
    ordersWithTips: 0,
    highestTip: 0,
    averageTip: 0,
    tipPercentage: 0,
    totalTipsEarned: 0,
  });

  setMonthlyMessage(response.data.message);
}

  } catch (error) {
    console.log('Monthly Summary Error', error);
  }
};
const handleMonthConfirm = (date) => {

  setSelectedMonth(date);
  setShowMonthPicker(false);

  fetchMonthlySummary(date);
  fetchDailyTipsList(date);

};

const formatMonth = (date) => {

  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

};
const fetchDailyTipsList = async (date) => {
  try {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const response = await apiClient.get(
      `/api/rider/tips/daily-list?month=${month}&year=${year}`
    );

    if (response.data.success) {
      setDailyTipsList(response.data.data);
    } else {
      setDailyTipsList([]);
    }
  } catch (error) {
    console.log("Daily Tips List Error", error);
    setDailyTipsList([]);
  }
};
const formatListDate = (date) => {

  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

};
  return (
    <SafeAreaView style={styles.container}>
              {/* Header */}
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons
      name="arrow-back"
      size={24}
      color="#101828"
    />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>
    Tips Summary
  </Text>

  <TouchableOpacity
    style={styles.rightIconWrapper}
    onPress={() => navigation.navigate('HelpCenterList')}
  >
    <Ionicons
      name="chatbubble-ellipses-outline"
      size={24}
      color="#13ACBE"
    />
  </TouchableOpacity>
</View>
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 40 }}
  >
    
{/* Overview Cards */}
      <View style={styles.cardsContainer}>

        <View style={[styles.card, { backgroundColor: '#EEFDF5' }]}>
          <Text style={styles.title}>Tips Earned</Text>
          <Text style={styles.value}>₹{overview.tipsEarned}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFF8EF' }]}>
          <Text style={styles.title}>Tipped Orders</Text>
          <Text style={styles.value}>
            {overview.tippedOrders} Orders
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FDEFF4' }]}>
          <Text style={styles.title}>Highest Tip</Text>
          <Text style={styles.value}>₹{overview.highestTip}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#EEF2FF' }]}>
          <Text style={styles.title}>Average Tip</Text>
          <Text style={styles.value}>₹{overview.averageTip}</Text>
        </View>

      </View>
      <View style={styles.summaryCard}>
    {/* Header */}
    <TouchableOpacity
    style={styles.summaryHeader}
    activeOpacity={0.8}
    onPress={() => setIsDailyOpen(!isDailyOpen)}
>
        <View style={styles.leftHeader}>
            <View style={styles.iconCircle}>
                <MaterialIcons
                    name="event-note"
                    color="#12C04A"
                    size={22}
                />
            </View>
            <Text style={styles.summaryTitle}>
                Daily Summary
            </Text>
        </View>
        <Ionicons
    name={isDailyOpen ? "chevron-down" : "chevron-forward"}
    size={24}
    color="#111"
/>
    </TouchableOpacity>
    <View style={styles.line} />

{isDailyOpen && (
<>
    {/* Date */}
    <View style={styles.dateRow}>
        <TouchableOpacity
            style={styles.dateChip}
            onPress={() => setShowDatePicker(true)}
        >
            <Text style={styles.dateText}>
                {formatDisplayDate(selectedDate)}
            </Text>
            <Ionicons
                name="chevron-forward"
                size={18}
                color="#5965FF"
            />
        </TouchableOpacity>
        <Text style={styles.summaryText}>
            Summary
        </Text>
    </View>
    {dailyMessage ? (

  <Text style={styles.noDataText}>
    {dailyMessage}
  </Text>

) : (

  <>
    <View style={styles.row}>
      <Text>Total Orders Delivered</Text>
      <Text>{dailySummary.totalOrdersDelivered}</Text>
    </View>

    <View style={styles.row}>
      <Text>Orders With Tips</Text>
      <Text>{dailySummary.ordersWithTips}</Text>
    </View>

    <View style={styles.row}>
      <Text>Orders Without Tips</Text>
      <Text>{dailySummary.ordersWithoutTips}</Text>
    </View>

    <View style={styles.row}>
      <Text>Highest Tip</Text>
      <Text>₹{dailySummary.highestTip}</Text>
    </View>

    <View style={styles.row}>
      <Text>Average Tip</Text>
      <Text>₹{dailySummary.averageTip}</Text>
    </View>

    <View style={styles.totalContainer}>
      <Text style={styles.totalLabel}>
        Total Tips Earned
      </Text>

      <Text style={styles.totalValue}>
        ₹{dailySummary.totalTipsEarned}
      </Text>
    </View>
  </>

)}
</>
)}
</View>


<DateTimePickerModal
    isVisible={showDatePicker}
    mode="date"
    date={selectedDate}
    onConfirm={handleConfirm}
    onCancel={() => setShowDatePicker(false)}
/>
<View style={styles.summaryCard}>

  <TouchableOpacity
    style={styles.summaryHeader}
    onPress={() => setIsMonthlyOpen(!isMonthlyOpen)}
>

    <View style={styles.leftHeader}>

      <View
        style={[
          styles.iconCircle,
          { backgroundColor: '#FFF4EA' },
        ]}
      >
        <MaterialIcons
          name="calendar-month"
          size={22}
          color="#FF9F43"
        />
      </View>

      <Text style={styles.summaryTitle}>
        Monthly Summary
      </Text>

    </View>

    <Ionicons
    name={isMonthlyOpen ? "chevron-down" : "chevron-forward"}
    size={24}
    color="#111"
/>

  </TouchableOpacity>

  <View style={styles.line} />

{isMonthlyOpen && (
<>

  <View style={styles.dateRow}>

    <TouchableOpacity
      style={styles.dateChip}
      onPress={() => setShowMonthPicker(true)}
    >

      <Text style={styles.dateText}>
        {formatMonth(selectedMonth)}
      </Text>

    </TouchableOpacity>

    <Text style={styles.summaryText}>
      Summary
    </Text>

  </View>

  {monthlyMessage ? (

  <Text style={styles.noDataText}>
    {monthlyMessage}
  </Text>

) : (

  <>
    <View style={styles.row}>
      <Text>Orders Delivered</Text>
      <Text>{monthlySummary.ordersDelivered}</Text>
    </View>

    <View style={styles.row}>
      <Text>Orders With Tips</Text>
      <Text>{monthlySummary.ordersWithTips}</Text>
    </View>

    <View style={styles.row}>
      <Text>Highest Tip</Text>
      <Text>₹{monthlySummary.highestTip}</Text>
    </View>

    <View style={styles.row}>
      <Text>Average Tip</Text>
      <Text>₹{monthlySummary.averageTip}</Text>
    </View>

    <View style={styles.totalContainer}>
      <Text style={styles.totalLabel}>Tip Percentage</Text>
      <Text style={styles.totalValue}>
        {monthlySummary.tipPercentage}%
      </Text>
    </View>
  </>

)}
</>
)}
</View>

{showMonthPicker && (
  <MonthPicker
    value={selectedMonth}
    locale="en"
    onChange={(event, newDate) => {
      setShowMonthPicker(false);

      if (newDate) {
        setSelectedMonth(newDate);
        fetchMonthlySummary(newDate);
        fetchDailyTipsList(newDate);
      }
    }}
  />
)}
<View style={styles.listContainer}>

  <View style={styles.listHeader}>

  <Text style={styles.listTitle}>
    Daily Tips List
  </Text>

  <TouchableOpacity
    style={styles.monthChip}
    onPress={() => setShowMonthPicker(true)}
  >

    <Text style={styles.monthChipText}>
      {formatMonth(selectedMonth)}
    </Text>

    <Ionicons
      name="chevron-down"
      size={18}
      color="#5B65F2"
    />

  </TouchableOpacity>

</View>

  <View style={styles.table}>

    <View style={styles.tableHeader}>

      <Text style={styles.headerCell}>Date</Text>

      <Text style={styles.headerCell}>Orders</Text>

      <Text style={styles.headerCell}>Tips Earned</Text>

    </View>

    {(showAllTips
      ? dailyTipsList
      : dailyTipsList.slice(0, 3)
    ).map((item, index) => (

      <View
        key={index}
        style={styles.tableRow}
      >

        <Text style={styles.cell}>
          {formatListDate(item.date)}
        </Text>

        <Text style={styles.cell}>
          {item.orders}
        </Text>

        <Text style={styles.cell}>
          ₹{item.tipsEarned}
        </Text>

      </View>

    ))}

  </View>

  {dailyTipsList.length > 3 && (

    <TouchableOpacity
      style={styles.viewMoreButton}
      onPress={() => setShowAllTips(!showAllTips)}
    >

      <Text style={styles.viewMoreText}>

        {showAllTips
          ? "View Less"
          : "View More"}

      </Text>

    </TouchableOpacity>

  )}
</View>
<TouchableOpacity
  style={styles.tipDetailsButton}
  onPress={() => navigation.navigate(OrderHistory)}
>
  <Text style={styles.tipDetailsButtonText}>
    Tip Details
  </Text>
</TouchableOpacity>
  </ScrollView>
</SafeAreaView>
  );
};

export default Tips;

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#F4F6F8',
},

header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: wp('4%'),
  paddingVertical: wp('3.4%'),
  backgroundColor: '#FFFFFF',
  elevation: 2,

  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 4,
  shadowOffset: {
    width: 0,
    height: 2,
  },
},

headerTitle: {
  fontSize: wp('4.8%'),
  fontWeight: '700',
  color: '#101828',
},

rightIconWrapper: {
  width: 44,
  height: 44,
  borderRadius: 12,
  backgroundColor: '#E8F9FC',
  justifyContent: 'center',
  alignItems: 'center',
},
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin:5
  },

  card: {
    width: '48%',
    borderRadius: 14,
    paddingVertical: wp('4%'),
    paddingHorizontal: wp('4%'),
    marginBottom: wp('3%'),
  },

  title: {
    fontSize: wp('4%'),
    color: '#555',
    marginBottom: wp('2%'),
  },
noDataText: {
  textAlign: 'center',
  paddingVertical: 30,
  fontSize: 16,
  color: '#777',
},
  value: {
    fontSize: wp('4.8%'),
    fontWeight: '700',
    color: '#111',
  },
  summaryCard: {
  backgroundColor: '#fff',
  borderRadius: 18,
  marginTop: 7,
  borderWidth: 1,
  borderColor: '#ECECEC',
  overflow: 'hidden',
},

summaryHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 14,
},

leftHeader: {
  flexDirection: 'row',
  alignItems: 'center',
},

iconCircle: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: '#EDF9F0',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

summaryTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: '#111',
},

line: {
  height: 1,
  backgroundColor: '#EFEFEF',
},

dateRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 18,
  paddingVertical: 12,
},

dateChip: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EEF0FF',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 14,
},

dateText: {
  color: '#5B65F2',
  fontWeight: '600',
  fontSize: 16,
  marginRight: 8,
},

summaryText: {
  color: '#8E8E8E',
  fontSize: 16,
},

row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 18,
  paddingVertical: 14,
  borderTopWidth: 1,
  borderTopColor: '#F2F2F2',
},

totalContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#EEF9F2',
  padding: 18,
},

totalLabel: {
  color: '#2F8D46',
  fontSize: 15,
  fontWeight: '700',
},

totalValue: {
  color: '#2F8D46',
  fontSize: 18,
  fontWeight: '700',
},
listContainer: {
  marginTop: 10,
},

listHeader: {
  marginBottom: 8,
},

listTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: '#111',
  marginLeft:20,
},

table: {
  borderWidth: 1,
  borderColor: '#ECECEC',
  borderRadius: 18,
  overflow: 'hidden',
},

tableHeader: {
  flexDirection: 'row',
  backgroundColor: '#EEF0FF',
  paddingVertical: 14,
},

headerCell: {
  flex: 1,
  textAlign: 'center',
  color: '#5B65F2',
  fontWeight: '700',
  fontSize: 16,
},

tableRow: {
  flexDirection: 'row',
  borderTopWidth: 1,
  borderTopColor: '#F1F1F1',
  paddingVertical: 16,
},

cell: {
  flex: 1,
  textAlign: 'center',
  color: '#222',
  fontSize: 15,
},

viewMoreButton: {
  alignSelf: 'center',
  marginTop: 15,
},

viewMoreText: {
  color: '#5B65F2',
  fontWeight: '700',
  fontSize: 16,
},
monthChip: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EEF0FF',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  marginRight:20,
},

monthChipText: {
  color: '#5B65F2',
  fontWeight: '600',
  marginRight: 6,
},

listHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},
tipDetailsButton: {
  marginTop: 20,
  marginBottom: 10,
  margin:20,
  backgroundColor: '#3558AA',
  borderRadius: 14,
  height: 54,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},

tipDetailsButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '700',
  marginRight: 8,
},
});