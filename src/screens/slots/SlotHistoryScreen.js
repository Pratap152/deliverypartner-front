import {View,Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { tokenService } from '../../services/TokenService';


export default function SlotHistoryScreen({navigation}){
    const [selectedWeek, setSelectedWeek] = useState(6);
    const [summary, setSummary]  =useState(null);
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedDates, setExpandedDates] = useState([]);
    const [isWeekSheetOpen, setIsWeekSheetOpen] = useState(false);



    // FETCHING API DATA
    const fetchSlotHistory = async (weekNumber) =>{
        // FETCHING TOKEN
        //const access = await tokenService.getAccessToken();
        const access = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjk0ZmEzZGY0OGJjMjVlMTQwMzRhYWYxIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2NzM1MTMzNn0.-oxahATt8sxeT6BLjWB0z6u5_bTfcx6jIfWowMkqtqc";
        try{
            setLoading(true);
            // API CALL 
            const response = await axios.get(
                'https://delivarypartner.onrender.com/api/slots/history',
                {
                    params:{
                        weekNumber:weekNumber,
                    },
                    headers:{
                        Authorization:`Bearer ${access}`,
                    },
                }
            );
            const data = response.data;

            setSummary(data.summary);
            setDays(data.days);
        }
        catch (error){
            if (error.response){
                console.log('API Error:',error.response.data.message);
                console.log('data', error.response.data);
            }
            else{
                console.log('Network Error:',error.message)
            }
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchSlotHistory(selectedWeek);
    },[selectedWeek]);

    // PREVIOUS WEEKS
    const totalWeeks = 6;
    const weeks = Array.from({ length: totalWeeks }, (_, i) => totalWeeks - i);


    // WEEK RANGE
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

    // FORMATTING DATE
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const day = date.getDate();  // 29
        const month = date.toLocaleString('en-US', { month: 'short' }); // Dec
        const weekday = date.toLocaleString('en-US', { weekday: 'short' }); // Mon

        return `${day} ${month} - ${weekday}`;
        };



    // LIST HEADER
    const ListHeader = () =>{
       return(
        <View>
            <View style={styles.week_selector_container}>
                    <View style={styles.week_selector}>
                        <Text style={styles.week_text}>
                            Week {selectedWeek}
                        </Text>
                        <Text style={styles.this_week}>This Week</Text>
                        <TouchableOpacity style={styles.change_week}
                                          onPress={() => setIsWeekSheetOpen(true)}>
                            <Text style={{fontSize:wp(4),fontWeight:'500',}}>Change</Text>
                            <Ionicons name='chevron-forward-outline' 
                                    size={18}/>
                        </TouchableOpacity>  
                    </View>
                    <Text style={{marginLeft:wp(2),fontSize:wp(3.5),}}>
                       {getWeekRange(days)}
                    </Text>
                </View>

                {/* SUMMARY */}
                <View style={styles.summary_container}>
                    <View style={styles.summary}>
                        <Text style={styles.summary_text}>Completed</Text>
                        <Text style={styles.summary_count}>{summary ? summary.completed:0}</Text>
                    </View>
                    <View style={styles.summary}>
                        <Text style={styles.summary_text}>Missed</Text>
                        <Text style={styles.summary_count}>{summary ? summary.noShow:0}</Text>
                    </View>
                </View>
                <View style={[styles.summary_container,{marginBottom:hp(2)}]}>
                    <View style={styles.summary}>
                        <Text style={styles.summary_text}>Cancelled</Text>
                        <Text style={styles.summary_count}>{summary ? summary.cancelled:0}</Text>
                    </View>
                    <View style={styles.summary} >
                        <Text style={styles.summary_text}>Failed</Text>
                        <Text style={styles.summary_count}>{summary ? summary.failed:0}</Text>
                    </View>
                </View>
            </View>
        );
    };
    
    

    // DAY ROWS
    const renderDay = ({ item: day }) => {
        return (
            <View>

            {/* DAY ROW */}
            <View style={styles.day_row}>
                <Text style={styles.day_row_text}>
                    {formatDate(day.date)}
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        setExpandedDates(prev => {
                        if (prev.includes(day.date)) {
                            return prev.filter(d => d !== day.date); // close this day
                        }
                        return [...prev, day.date]; // open this day
                        })}>
                <Ionicons
                    name={
                    expandedDates.includes(day.date)
                        ? 'chevron-up-outline'
                        : 'chevron-down-outline'
                    }
                    size={20}
                    style={styles.day_icon}
                />
                </TouchableOpacity>
            </View>

            {/* EXPANDED CONTENT */}
            {expandedDates.includes(day.date)&& (
                <View style={{ marginLeft: wp(3), marginTop: hp(1) }}>
                    {/* EMPTY STATE */}
                    {day.slots.length === 0 && (
                        <Text style={{ marginTop: hp(1), color: '#777' }}>
                            No Slot details found
                        </Text>
                        )}

                    {/* SLOT CARDS */}
                    {day.slots.map(slot => (
                    <View key={slot._id} style={styles.slot_card}>
                        <Text style={styles.slot_time}>
                            {slot.startTime} - {slot.endTime}
                        </Text>

                        <Text style={styles.slot_status}>
                            {slot.status}
                        </Text>
                    </View>
                    ))}
                </View>
            )}

            </View>
        );
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


    

    


    
    return(
        <SafeAreaView style={{flex:1}}>

            <View style={styles.header}>
                <TouchableOpacity 
                                onPress={()=>navigation.goBack()}>
                    <Ionicons name='chevron-back-outline' 
                            size={24}
                            color='#677294'/>
                </TouchableOpacity>
                <Text style={{fontSize:wp(6),}}>Slots History</Text>
            </View>
                



                {/* DAYS LIST */}
                <FlatList
                    data={days}
                    keyExtractor={(item) => item.date}
                    renderItem={renderDay}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp(4)}}
                    
                    ListHeaderComponent={
                        <>
                            {loading && (
                            <View style={{ marginVertical: hp(2), alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#4F39F6" />
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
                                {weeks.map(week => (
                                    <TouchableOpacity
                                        key={week}
                                        style={styles.week_item}
                                        onPress={() => {
                                            setSelectedWeek(week);
                                            setIsWeekSheetOpen(false);
                                        }}>
                                        
                                            <Text
                                                style={{ fontWeight: week === selectedWeek ? '700' : '400' }}>
                                                {getWeekRangeByWeekNumber(week)}  (Week {week})
                                             </Text>
                                                {week === selectedWeek &&
                                                <Text style={styles.this_week}>
                                                    This Week
                                                </Text>
                                                }
                                           
                                            
                                        
                                        
                                            
                                        

                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <TouchableOpacity
                                style={styles.sheet_cancel}
                                onPress={() => setIsWeekSheetOpen(false)}>
                                <Text>Cancel</Text>
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
        gap:wp(25),
        marginLeft:wp(4)
    },
    week_selector_container:{
        backgroundColor:'#FFFFFF',
        marginTop:hp(3),
        paddingVertical:hp(2),
        width:wp('95%'),
        borderRadius:wp(3),
        alignSelf:'center',
    },
    week_selector:{
        flexDirection:'row',
        fontSize:wp(4),
        gap:wp(2),    
        
    },
    week_text:{
        fontSize:wp(4),
        marginBottom:hp(2),
        marginLeft:wp(2),
        fontWeight:'800'
    },
    this_week:{
        borderRadius:wp(2),
        backgroundColor:'#cbced7ff',
        width:wp(20),
        textAlign:'center',
        marginBottom:hp(2),
        fontWeight:'500'
        
    },
    date:{
        marginLeft:wp(5),
    },
    change_week:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:wp(32),
        marginTop:hp(1) 
    },
    summary_container:{
        flexDirection:'row',
    },
    summary:{
        backgroundColor:'#FFFFFF',
        marginLeft:wp(3),
        marginTop:hp(2),
        paddingVertical:hp(3),
        width:wp('45%'),
        borderRadius:wp(4),  
    },
    summary_text:{
        fontSize:wp(4),
        marginLeft:wp(2),
        
    },
    summary_count:{
        fontSize:wp(5),
        marginLeft:wp(2),
        fontWeight:'600'
        
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
        backgroundColor: '#FFFFFF',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        marginTop: hp(1),
        marginRight: wp(3),
        borderRadius: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    slot_time: {
        fontSize: wp(3.8),
        fontWeight: '500',
    },

    slot_status: {
        fontSize: wp(3.2),
        fontWeight: '600',
        color: '#677294',
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
        backgroundColor: '#fff',
        borderTopLeftRadius: wp(6),
        borderTopRightRadius: wp(6),
        padding: wp(5),
    },

    sheet_title: {
        fontSize: wp(4.5),
        fontWeight: '700',
        marginBottom: hp(2),
    },

    week_item: {
        paddingVertical: hp(1.5),
        flexDirection:'row',
        gap:wp(2),
        
    },

    sheet_cancel: {
        marginTop: hp(2),
        alignItems: 'center',
    },



});