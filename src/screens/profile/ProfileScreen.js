import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import { authService } from '../../services/AuthService';
import apiClient from '../../services/ApiClient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../redux/slices/profileSlice';
import { getAllDocuments } from '../../services/getAllDocuments';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const { data: profile } = useSelector(state => state.profile);

  const [selfieUri, setSelfieUri] = useState(null);

  const partnerId = profile?.partnerId;
  const riderType = profile?.riderType;

  const formattedRiderType = riderType
    ? riderType
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    : '--';

  const ATTENDANCE_RIDER_TYPES = [
    'ZESTBOT_EMPLOYEE',
    'COMPANY_EMPLOYEE',
  ];

  const isAttendanceVisible = ATTENDANCE_RIDER_TYPES.includes(
    profile?.riderType,
  );

  const [stats, setStats] = useState({
    rating: 0,
    deliveries: 0,
    onTime: 0,
  });

  const onLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
            } catch (error) {
              console.log('Logout error:', error);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/api/rider/rating/weekly');

      if (res?.data?.success) {
        const data = res.data.data;

        setStats({
          rating: data.averageRating ?? 0,
          deliveries: data.deliveredOrders ?? 0,
          onTime: data.acceptanceRate ?? 0,
        });
      }
    } catch (err) {
      console.log('Stats API error:', err.message);
    }
  };

  const fetchSelfie = async () => {
    try {
      const res = await getAllDocuments();
      setSelfieUri(res?.data?.selfie || null);
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
      fetchStats();
      fetchSelfie();
    }, [dispatch]),
  );

  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
    >

      <View style={styles.safeArea}>
        <ScrollView
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                  {selfieUri ? (
                    <Image
                      source={{ uri: selfieUri }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={40}
                      color="#13ACBE"
                    />
                  )}
                </View>
              </View>

              <View style={{ flex: 1, marginLeft: wp('4%') }}>
                <Text style={styles.name}>
                  {profile?.personalInfo?.fullName || '—'}
                </Text>

                <Text style={styles.driverId}>
                  Rider ID: {partnerId || '—'}
                </Text>

                <View style={styles.riderTypeBadge}>
                  <Ionicons
                    name="briefcase-outline"
                    size={14}
                    color='#747474'
                    style={{ marginRight: 6 }}
                  />

                  <Text style={styles.riderTypeText}>
                    {formattedRiderType}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.deliveries}</Text>
                <Text style={styles.statLabel}>Deliveries</Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.onTime}%</Text>
                <Text style={styles.statLabel}>On-time</Text>
              </View>
            </View>
          </View>

          {/* PROFILE MANAGEMENT */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>PROFILE MANAGEMENT</Text>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('PersonalDetails')}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="person-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Personal Details
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    View detailed personal information
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* WORK & ASSETS */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { marginBottom: 4 }]}>
              WORK & ASSETS
            </Text>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('RiderAssets')}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="bicycle-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Rider Assets
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    View your assigned equipment
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Documents')}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="document-text-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Documents
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    License, permits & verification
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* EARNINGS & FINANCE */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>EARNINGS & FINANCE</Text>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Wallet')}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="wallet-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Wallet
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    View balance & transactions
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            {isAttendanceVisible && (
              <TouchableOpacity
                style={styles.listItemReduced}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('AttendanceScreen')}
              >
                <View style={styles.listLeft}>
                  <Ionicons
                    name="calendar-clear-outline"
                    size={wp('7%')}
                    color="#13ACBE"
                  />

                  <View
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      paddingRight: 10,
                    }}
                  >
                    <Text
                      style={styles.listTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Attendance
                    </Text>

                    <Text
                      style={styles.listSubtitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      View attendance & monthly summary
                    </Text>
                  </View>
                </View>

                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('CashBalance')}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="cash-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Cash Balance
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Cash collected from orders
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('BankAC')}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="card-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Bank Account Details
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Payment & withdrawal info
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* PERFORMANCE & REWARDS */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>PERFORMANCE & REWARDS</Text>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('RewardsScreen')}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="gift-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />
                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Rewards
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    View your earned rewards
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* HISTORY & ACTIVITY */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>HISTORY & ACTIVITY</Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('OrderHistory');
              }}
              style={styles.listItemReduced}
              activeOpacity={0.7}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="receipt-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Order History
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    View all completed orders
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SlotHistory')}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="calendar-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Slot History
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    View your slot bookings
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* APP SETTINGS */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>APP SETTINGS</Text>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('AboutScreen')}
            >
              <View style={styles.listLeft}>
                <Ionicons
                  name="information-circle-outline"
                  size={wp('7%')}
                  color="#13ACBE"
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={styles.listTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    About
                  </Text>

                  <Text
                    style={styles.listSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    App version, privacy policy & support
                  </Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onLogoutPress}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <View style={styles.logoutContent}>
              <Ionicons
                name="log-out-outline"
                size={wp('5.5%')}
                color="#FFFFFF"
                style={{ marginRight: wp('2%') }}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const isTablet = DeviceInfo.isTablet();

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#13ACBE',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  icon: {
    width: wp('10%'),
    height: wp('10%'),
    resizeMode: 'contain',
  },

  avatarWrapper: {
    position: 'relative',
  },

  header: {
    backgroundColor: '#13ACBE',
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('10%'),
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: wp('6.4%'),
    fontWeight: '700',
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp('4%'),
    marginTop: hp('-8%'),
    borderRadius: wp('4%'),
    padding: wp('4%'),
    elevation: 4,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  name: {
    fontSize: wp('4.8%'),
    fontWeight: '600',
    color: '#222',
  },

  riderTypeBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 6,

    backgroundColor:'#f2fcfe',
    borderRadius: 20,

    borderWidth: 1,
    borderColor:'#f2fcfe',
  },

  riderTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color:  '#747474',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: hp('2%'),
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: wp('4.9%'),
    fontWeight: '600',
    color: '#222',
  },

  statLabel: {
    fontSize: wp('3.3%'),
    color: '#777',
    marginTop: hp('0.5%'),
  },

  verticalDivider: {
    width: 1,
    height: hp('4%'),
    backgroundColor: '#EEE',
  },

  sectionContainer: {
    paddingHorizontal: wp('4%'),
    marginTop: hp('3%'),
  },

  sectionTitle: {
    fontWeight: '400',
    fontSize: wp('3.7%'),
    lineHeight: hp('2.7%'),
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#9AA0A6',
    marginBottom: hp('1%'),
  },

  listItemReduced: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('0.8%'),
  },

  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  listTitle: {
    fontSize: wp('4.3%'),
    fontWeight: '500',
    color: '#222',
  },

  listSubtitle: {
    fontSize: wp('3.5%'),
    color: '#777',
    marginTop: hp('0.3%'),
  },

  arrow: {
    fontSize: wp('5.4%'),
    color: '#9AA0A6',
  },

  logoutButton: {
    backgroundColor: '#13ACBE',
    borderRadius: wp('3%'),
    marginHorizontal: wp('4%'),
    marginTop: hp('3%'),
    paddingVertical: hp('1.8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: wp('4.3%'),
    fontWeight: '600',
  },

  logoutIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
    marginRight: wp('3%'),
  },

  driverId: {
    fontSize: isTablet ? wp('2.4%') : 13,
    color: '#666',
    marginTop: 4,
  },
});