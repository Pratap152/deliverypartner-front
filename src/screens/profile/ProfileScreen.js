import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Linking } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function ProfileScreen({ navigation }) {
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
                    source={require('../../assets/profile/profileicon.png')}
                    style={styles.avatarImage}
                  />
                </View>

                <TouchableOpacity
                  style={styles.cameraIconWrapper}
                  activeOpacity={0.8}
                  onPress={openCamera}
                >
                  <Image
                    source={require('../../assets/profile/Camera.png')}
                    style={styles.cameraIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>Rajesh Kumar</Text>
                <Text style={styles.partnerId}>Partner ID: DP482763</Text>

                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>Active</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statValue}>847</Text>
                <Text style={styles.statLabel}>Deliveries</Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statValue}>98%</Text>
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
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Personal Details</Text>
                  <Text style={styles.listSubtitle}>
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
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Rider Assets</Text>
                  <Text style={styles.listSubtitle}>
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
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Documents</Text>
                  <Text style={styles.listSubtitle}>
                    License, permits & verification
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Insurance')}
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/Insurance.png')}
                  style={styles.icon}
                />
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Insurance</Text>
                  <Text style={styles.listSubtitle}>
                    View insurance coverage details
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
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Wallet</Text>
                  <Text style={styles.listSubtitle}>
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
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Cash Balance</Text>
                  <Text style={styles.listSubtitle}>
                    Cash collected from orders
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/Bank.png')}
                  style={styles.icon}
                />
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Bank Account Details</Text>
                  <Text style={styles.listSubtitle}>
                    Payment & withdrawal info
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/Vega.png')}
                  style={styles.icon}
                />
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Vega Card</Text>
                  <Text style={styles.listSubtitle}>Manage your Vega card</Text>
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
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/Rewards.png')}
                  style={styles.icon}
                />
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Rewards</Text>
                  <Text style={styles.listSubtitle}>
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
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Order History</Text>
                  <Text style={styles.listSubtitle}>
                    View all completed orders
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/Slot.png')}
                  style={styles.icon}
                />
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Slot History</Text>
                  <Text style={styles.listSubtitle}>
                    View your slot bookings
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/Message.png')}
                  style={styles.icon}
                />
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Message Center</Text>
                  <Text style={styles.listSubtitle}>
                    View all messages & updates
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* LEARNING & SUPPORT */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>LEARNING & SUPPORT</Text>
            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/Academy.png')}
                  style={styles.icon}
                />
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Academy</Text>
                  <Text style={styles.listSubtitle}>
                    Training & learning resources
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
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/Language.png')}
                  style={styles.icon}
                />
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>Language</Text>
                  <Text style={styles.listSubtitle}>Change app language</Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItemReduced}
              activeOpacity={0.7}
            >
              <View style={styles.listLeft}>
                <Image
                  source={require('../../assets/profile/About.png')}
                  style={styles.icon}
                />
                <View style={{ maxWidth: 220, marginLeft: 12 }}>
                  <Text style={styles.listTitle}>About</Text>
                  <Text style={styles.listSubtitle}>
                    App version & information
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
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

  cameraIconWrapper: {
    position: 'absolute',
    bottom: hp('-2%'),
    right: wp('0%'),
    borderRadius: wp('5%'),
    padding: wp('1.5%'),
  },

  cameraIcon: {
    width: wp('7%'),
    height: wp('7%'),
    resizeMode: 'contain',
  },

  header: {
    backgroundColor: '#13ACBE',
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('10%'),
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: wp('6%'),
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
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    backgroundColor: '#13ACBE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
  },

  avatarImage: {
    width: wp('9%'),
    height: wp('9%'),
    resizeMode: 'contain',
  },

  name: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#222',
  },

  partnerId: {
    fontSize: wp('3.2%'),
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
    fontSize: wp('3%'),
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
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#222',
  },

  statLabel: {
    fontSize: wp('3%'),
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
    fontSize: wp('3.4%'),
    lineHeight: hp('2.5%'),
    letterSpacing: 0.35,
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
  },

  listTitle: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: '#222',
  },

  listSubtitle: {
    fontSize: wp('3.2%'),
    color: '#777',
    marginTop: hp('0.3%'),
  },

  arrow: {
    fontSize: wp('5%'),
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
    fontSize: wp('4%'),
    fontWeight: '600',
  },

  logoutIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
    marginRight: wp('3%'),
  },
});
