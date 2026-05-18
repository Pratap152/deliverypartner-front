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
import { Camera } from 'react-native-vision-camera';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DeviceInfo from 'react-native-device-info';

import { authService } from '../../services/AuthService';
import apiClient from '../../services/ApiClient';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../redux/slices/profileSlice';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const { data: profile } = useSelector(state => state.profile);

  const partnerId = profile?.partnerId;
  const isPartnerActive = profile?.isPartnerActive;

  const [stats, setStats] = useState({
    rating: 0,
    deliveries: 0,
    onTime: 0,
  });

  const onLogoutPress = () => {
    authService.logout();
  };

  const openCamera = async () => {
    try {
      let permission = await Camera.getCameraPermissionStatus();

      if (permission === 'not-determined') {
        permission = await Camera.requestCameraPermission();
      }

      if (permission === 'authorized') {
        navigation.navigate('CameraScreen');
        return;
      }

      Alert.alert(
        'Camera Permission Required',
        'Please allow camera access to continue',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    } catch (error) {
      console.log('Camera permission error:', error);
    }
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

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
      fetchStats();
    }, [dispatch]),
  );

  const getSelfieUri = selfie => {
    if (!selfie) return null;

    if (typeof selfie === 'string') return selfie;

    if (typeof selfie === 'object' && selfie.url) {
      return selfie.url;
    }

    return null;
  };

  const selfieUri = getSelfieUri(profile?.selfie);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#13ACBE" barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                  <Image
                    source={
                      selfieUri
                        ? { uri: selfieUri }
                        : require('../../assets/profile/profileicon.png')
                    }
                    style={styles.avatarImage}
                  />
                </View>
              </View>

              <View style={{ flex: 1, marginLeft: wp('4%') }}>
                <Text style={styles.name}>
                  {profile?.personalInfo?.fullName || '—'}
                </Text>

                <Text style={styles.driverId}>
                  Rider ID: {partnerId || '—'}
                </Text>

                <View
                  style={[
                    styles.activeBadge,
                    {
                      backgroundColor: isPartnerActive
                        ? '#E6F6EC'
                        : '#FDECEA',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.activeText,
                      {
                        color: isPartnerActive ? '#2E7D32' : '#C62828',
                      },
                    ]}
                  >
                    {isPartnerActive ? 'Active' : 'Inactive'}
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
                <Image
                  source={require('../../assets/profile/personal.png')}
                  style={styles.icon}
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
                <Image
                  source={require('../../assets/profile/Rider.png')}
                  style={styles.icon}
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
                <Image
                  source={require('../../assets/profile/Documents.png')}
                  style={styles.icon}
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
                <Image
                  source={require('../../assets/profile/Wallet.png')}
                  style={styles.icon}
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

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('CashBalance')}
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/Cash.png')}
                  style={styles.icon}
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
                <Image
                  source={require('../../assets/profile/Bank.png')}
                  style={styles.icon}
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
                <Image
                  source={require('../../assets/profile/Rewards.png')}
                  style={styles.icon}
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
                <Image
                  source={require('../../assets/profile/Order.png')}
                  style={styles.icon}
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
                <Image
                  source={require('../../assets/profile/Slot.png')}
                  style={styles.icon}
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

          <TouchableOpacity
            onPress={onLogoutPress}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <View style={styles.logoutContent}>
              <Image
                source={require('../../assets/profile/Logout.png')}
                style={styles.logoutIcon}
              />

              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
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
    fontWeight: '600',
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

  partnerId: {
    fontSize: wp('3.5%'),
    color: '#777',
    marginTop: hp('0.3%'),
  },

  activeBadge: {
    marginTop: hp('0.8%'),
    alignSelf: 'flex-start',
    backgroundColor: '#E6F6EC',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('3%'),
  },

  activeText: {
    fontSize: wp('3.3%'),
    color: '#2E7D32',
    fontWeight: '500',
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