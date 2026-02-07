import {View,Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState, useEffect, useCallback} from 'react';
 
import {useSlotHistory} from '../../hooks/useSlotHistory';
import {COLORS} from '../../utils/SlotHistoryColors';
import { GRADIENTS } from '../../utils/SlotHistoryColors';
import LinearGradient from 'react-native-linear-gradient';



 
export default function SlotHistoryScreen({navigation}){
   
    const [expandedDates, setExpandedDates] = useState([]);// allows multiple open days
    const [isWeekSheetOpen, setIsWeekSheetOpen] = useState(false);

    

    // at top of SlotHistoryScreen (inside component but before useState that depends on currentWeek)
    const getCurrentWeek = () => {
    const today = new Date();
    // find Monday of week 1 via Jan 4 trick (ISO)
    const jan4 = new Date(today.getFullYear(), 0, 4);
    const week1Monday = new Date(jan4);
    week1Monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
    const todayCopy = new Date(today);
    todayCopy.setHours(0,0,0,0);
    const weekNumber = 1 + Math.floor((todayCopy - week1Monday) / (7 * 24 * 60 * 60 * 1000));
    return weekNumber;
    };

    const currentWeek = getCurrentWeek();

    // init selectedWeek with currentWeek (safe because currentWeek computed synchronously)
    const [selectedWeek, setSelectedWeek] = useState(currentWeek);

    const {
    summary,
    days,
    loading,
    refreshing,
    onRefresh,
    availableWeeks,
    preloadPastWeeks
    } = useSlotHistory(selectedWeek);


    
    useEffect(() => {
    // preload a few past weeks quietly on mount
    preloadPastWeeks(6); 
    
    }, []);

   
    //  Week helpers (date range & formatting)
    const getWeekRange = (days) => {
        if (!days || days.length === 0) return '';
        const format = (dateString) => {
            const date = new Date(dateString);
            return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}`;
        };
 
        const start = days[0].date;
        const end = days[days.length - 1].date;
        return `${format(start)} - ${format(end)}`;
        };
       
    const formatDate = (dateString) => {
        const date = new Date(dateString);
 
        const day = date.getDate();  // 29
        const month = date.toLocaleString('en-US', { month: 'short' }); // Dec
        const weekday = date.toLocaleString('en-US', { weekday: 'short' }); // Mon
 
        return `${day} ${month} - ${weekday}`;
        };
 
    const getWeekRangeByWeekNumber = (weekNumber) => {
        const year = new Date().getFullYear();
        // ISO week calculation (Monday start)
        const firstThursday = new Date(year, 0, 4);
        const weekStart = new Date(firstThursday);
        weekStart.setDate(firstThursday.getDate() + (weekNumber - 1) * 7);
        weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1);
 
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
 
        const format = (date) =>
            `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}`;
 
        return `${format(weekStart)} - ${format(weekEnd)}`;
        };



    // Header shown above the slot list (week selector + summary)
    const ListHeader = () =>{
       return(
        <View>
            <LinearGradient
              colors={['#EEF2FF', '#F5F3FF']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.weekRangeGradientCard}
            >
              <View style={styles.week_selector}>
                
                <View style={{flex:1}}>
                  <Text style={styles.week_text}>
                    {getWeekRange(days)}
                  </Text>
                </View>

                {selectedWeek === currentWeek && (
                  <View style={styles.thisWeekPremium}>
                    <Text style={styles.thisWeekPremiumText}>
                      This Week
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.changeWeekPremium}
                  onPress={() => setIsWeekSheetOpen(true)}
                >
                  <Text style={styles.changeWeekText}>
                    Change
                  </Text>

                  <Ionicons
                    name='chevron-forward-outline'
                    size={18}
                    color="#4F46E5"
                  />
                </TouchableOpacity>

              </View>
            </LinearGradient>

                
 
                {/* SUMMARY */}
                <View style={styles.summary_container}>
                    <LinearGradient
                      colors={GRADIENTS.booked}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.summaryGradient}
                    >
                      <Text style={styles.summaryGradientLabel}>Booked</Text>
                      <Text style={styles.summaryGradientValue}>
                        {summary?.booked ?? 0}
                      </Text>
                  </LinearGradient>


                    <LinearGradient
                        colors={GRADIENTS.missed}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.summaryGradient}
                      >
                        <Text style={styles.summaryGradientLabel}>Missed</Text>
                        <Text style={styles.summaryGradientValue}>
                          {summary?.missed ?? 0}
                        </Text>
                    </LinearGradient>


                </View>
                <View style={[styles.summary_container,{marginBottom:hp(2)}]}>
                    <LinearGradient
                        colors={GRADIENTS.cancelled}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.summaryGradient}
                      >
                        <Text style={styles.summaryGradientLabel}>Cancelled</Text>
                        <Text style={styles.summaryGradientValue}>
                          {summary?.cancelled ?? 0}
                        </Text>
                    </LinearGradient>


                    <LinearGradient
                      colors={GRADIENTS.completed}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.summaryGradient}
                    >
                      <Text style={styles.summaryGradientLabel}>Completed</Text>
                      <Text style={styles.summaryGradientValue}>
                        {summary?.completed ?? 0}
                      </Text>
                  </LinearGradient>


                </View>
            </View>
        );
    };
   
    

    const renderDay = useCallback(({ item: day }) => {
      const isOpen = expandedDates.includes(day.date);
      const slotCount = Array.isArray(day.slots) ? day.slots.length : 0;

      return (
        <View style={styles.dayContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            hitSlop={{top:8,bottom:8,left:8,right:8}}
            style={styles.dayHeader}
            onPress={() =>
              setExpandedDates(prev => (
                prev.includes(day.date) ? prev.filter(d => d !== day.date) : [...prev, day.date]
              ))
            }
            accessibilityRole="button"
            accessibilityLabel={`Toggle ${day.date} slots`}
          >
            <View>
              <Text style={styles.day_row_text}>{formatDate(day.date)}</Text>
              <Text style={styles.day_subtext}>{slotCount} {slotCount === 1 ? 'slot' : 'slots'}</Text>
            </View>

            <View style={styles.dayHeaderRight}>
              <Text style={styles.dayWeekBadge}>{/* optional small badge */}</Text>
              <Ionicons
                name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={20}
                color={COLORS.textSecondary}
              />
            </View>
          </TouchableOpacity>

          {isOpen && (
            <View style={styles.slotsContainer}>
              {slotCount === 0 ? (
                <Text style={styles.empty_text}>No slots for this day.</Text>
              ) : (
                day.slots.map(slot => {
                  const status = slot.status?.toLowerCase();
                  const statusStyle = getStatusStyle(status);
                  return (
                    <View key={slot._id ?? `${slot.startTime}-${slot.endTime}`} style={styles.slot_card}>
                      <View style={{flex:1}}>
                        <Text style={styles.slot_time}>{slot.startTime} — {slot.endTime}</Text>
                        <Text style={[styles.slot_status, { color: statusStyle.text }]}>
                          {String(slot.status ?? '').toUpperCase()}
                        </Text>
                      </View>

                      <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusPillText, { color: statusStyle.text }]}>
                          {String(slot.status ?? '').replace(/^\w/, c => c.toUpperCase())}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>
      );
    }, [expandedDates, setExpandedDates]);

      
 
    // STYLING
    return(
        <SafeAreaView style={{ flex:1, backgroundColor: COLORS.bg }}>
           <LinearGradient
              colors={GRADIENTS.headerc}
              start={{x:0,y:0}}
              end={{x:1,y:1}}
              style={styles.headerGradient}
            >
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name='chevron-back-outline' size={24} color="#FFF" />
              </TouchableOpacity>

              <Text style={styles.headerTitleGradient}>
                Slots History
              </Text>

              <View style={{ width: 40 }} />
            </LinearGradient>


                {/* Spacer to balance back button */}
                <View style={{ width: 40 }} />
             
               
                {/* DAYS LIST */}
                <FlatList
                    data={days}
                    keyExtractor={(item) => String(new Date(item.date).getTime())}
                    renderItem={renderDay}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    maxToRenderPerBatch={8}
                    windowSize={11}
                    removeClippedSubviews={true}
                    refreshing = {refreshing}
                    onRefresh = {onRefresh}
                    contentContainerStyle={{
                                paddingBottom: hp(4),
                                flexGrow: 1
                            }}
                    ListHeaderComponent={
                        <>
                            {loading && (
                            <View style={{ marginVertical: hp(2), alignItems: 'center' }}>
                                <ActivityIndicator size="large" color='black' />
                            </View>
                            )}
                            <ListHeader />
                        </>
                        }
                 />
 
                {isWeekSheetOpen && (
                    <View style={styles.sheet_overlay}>
                        <View style={styles.sheet_container}>
                            <Text style={styles.sheet_title}>Select Week</Text>                             
                            <ScrollView
                                style={{ maxHeight: hp(50) }}
                                showsVerticalScrollIndicator={false}
                                >
                                {(availableWeeks ?? []).map(week => (
                                    <TouchableOpacity
                                        key={`week-${week}`}
                                        style={styles.week_item}
                                        onPress={() => {
                                            setSelectedWeek(week);
                                            setIsWeekSheetOpen(false);
                                        }}
                                        >
                                        <Text
                                            style={{
                                            fontWeight: week === selectedWeek ? '700' : '400',
                                            fontSize: wp(4),
                                            }}
                                        >
                                            {getWeekRangeByWeekNumber(week)}
                                        </Text>

                                        {week === currentWeek && (
                                            <Text style={styles.this_week}>This Week</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

 
                            <TouchableOpacity
                                style={styles.sheet_cancel}
                                onPress={() => setIsWeekSheetOpen(false)}>
                                <Text style={{fontSize:wp(4),fontWeight:'500'}}>Cancel</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    )}  
        </SafeAreaView>
    );
}
 
 
 
const styles = StyleSheet.create({
    header:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    backBtn:{
    width: 40,
    alignItems:'flex-start'
    },

    headerTitle:{
        flex: 1,
        textAlign:'center',
        fontSize: wp(5.8),
        fontWeight:'600',
        color: COLORS.textPrimary,
        letterSpacing: 0.3
    },
    backBtn:{
        width: 40,
        alignItems:'flex-start'
    },
    headerGradient: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2.2),
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        },

    headerTitleGradient:{
        flex:1,
        textAlign:'center',
        fontSize: wp(6),
        fontWeight:'600',
        color:'#FFF',
        letterSpacing:0.5
    },
    weekRangeGradientCard:{
        marginTop: hp(2),
        marginBottom: hp(1),
        padding: wp(4.5),
        width: wp('95%'),
        borderRadius: 22,
        alignSelf:'center',

        borderWidth:1,
        borderColor:'#EEF2FF',

        shadowColor:'#4F46E5',
        shadowOpacity:0.08,
        shadowRadius:18,
        elevation:6
        },
    weekRangeLabel:{
        fontSize: wp(3.2),
        color:'#6B7280',
        fontWeight:'600',
        marginBottom: hp(0.3)
        },

    week_selector_container:{
        backgroundColor: COLORS.card,
        marginTop: hp(2),
        marginBottom:hp(1),
        padding: wp(4),
        width: wp('95%'),
        borderRadius: 16,
        alignSelf:'center',

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    week_selector:{
        flexDirection:'row', 
    },
    week_text:{
        fontSize: wp(5),
        fontWeight:'800',
        color:'#111827'
        },
    thisWeekPremium:{
    backgroundColor:'#dae3ff',
    paddingHorizontal: wp(3.2),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    marginRight: wp(10)
    },

    thisWeekPremiumText:{
    color:'#4F46E5',
    fontSize: wp(3.2),
    fontWeight:'800',
    letterSpacing: 0.5
    },
    changeWeekPremium:{
    flexDirection:'row',
    alignItems:'center',
    gap: wp(1)
    },

    changeWeekText:{
    color:'#4F46E5',
    fontSize: wp(4),
    fontWeight:'700'
    },


    
    this_week_placeholder:{
      width:wp(25),  
    },
    date:{
        marginLeft:wp(5),
    },
    change_week:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:wp(13),
        marginBottom:hp(1)
       
    },
    summary_container:{
        flexDirection:'row',
    },
    summary:{
        flex:1,
        paddingVertical: hp(2.2),
        paddingHorizontal: wp(4),
        borderRadius: 20,
        margin: wp(2),

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
},

    summary_text:{
        fontSize: wp(4),
        fontWeight:'600',
       
    },
    summary_count:{
        fontSize: wp(6.5),
        fontWeight:'900',
        marginTop: hp(0.5)
        },
    day_row:{
        marginLeft:wp(3),
        marginTop:hp(3),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    day_row_text:{
        fontSize:wp(4),
       
    },
    day_icon:{
        marginRight:wp(6)
    },
   slot_card: {
    backgroundColor: COLORS.card,
    padding: wp(3.5),
    marginVertical: hp(0.6),
    borderRadius: 12,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    },

    slot_time: {
    fontSize: wp(4),
    fontWeight: '700',
    color: COLORS.textPrimary
    },

    slot_status: {
    fontSize: wp(3.2),
    fontWeight: '700'
    },
 
    empty_text: {
        marginTop: hp(1),
        marginLeft: wp(3),
        color: '#777',
    },
    sheet_overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
 
    sheet_container: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: wp(6),
    },
 
    sheet_title: {
        fontSize: wp(5.2),
        fontWeight:'700',
        color: COLORS.textPrimary,
        marginBottom: hp(2),
    },
 
    week_item: {
        paddingVertical: hp(1.5),
        flexDirection:'row',
        gap:wp(2),
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(3),
        
       
    },
 
    sheet_cancel: {
        marginTop: hp(2),
        alignItems: 'center',
       
    },
    dayContainer: {
  marginHorizontal: wp(3),
},

dayHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: hp(1.2),
  paddingHorizontal: wp(3),
  backgroundColor: COLORS.card,
  borderRadius: 12,
  marginTop: hp(1.4),
  shadowColor: '#000',
  shadowOpacity: 0.03,
  shadowRadius: 8,
  elevation: 2,
},

day_row_text: {
  fontSize: wp(4.2),
  fontWeight: '700',
  color: COLORS.textPrimary,
},
day_subtext: {
  fontSize: wp(3.4),
  color: COLORS.textSecondary,
  marginTop: hp(0.3),
},

dayHeaderRight: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: wp(2),
},

slotsContainer: {
  paddingHorizontal: wp(3),
  paddingTop: hp(1),
  paddingBottom: hp(1.6),
},

statusPill: {
  paddingVertical: hp(0.5),
  paddingHorizontal: wp(3),
  borderRadius: 999,
  alignSelf: 'center',
  justifyContent: 'center',
},

statusPillText: {
  fontSize: wp(3),
  fontWeight: '700',
},
summaryGradient:{
  flex:1,
  paddingVertical: hp(2.4),
  paddingHorizontal: wp(4),
  borderRadius: 22,
  margin: wp(2),
  shadowColor:'#000',
  shadowOpacity:0.15,
  shadowRadius:18,
  elevation:8
},

summaryGradientLabel:{
  color:'#FFFFFFCC',
  fontSize: wp(3.6),
  fontWeight:'600'
},

summaryGradientValue:{
  color:'#FFF',
  fontSize: wp(7),
  fontWeight:'900',
  marginTop: hp(0.5)
}

 
 
 
});
 