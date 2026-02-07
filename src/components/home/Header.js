import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {
  check,
  request,
  RESULTS,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';

import apiClient from '../../services/ApiClient';

const LOG = '[HEADER-LOCATION]';

const Header = () => {
  const apiKey = 'AIzaSyAt59NjjnVtI5PfvhkQKFDLeBFfCTW-mxg';
  const navigation = useNavigation();

  const [isLocationModal, setIsLocationModal] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  /* 🔥 PROFILE STATE */
  const [profile, setProfile] = useState(null);
  const getSelfieUri = (selfie) => {
  if (!selfie) return null;
 
  // backend string URL
  if (typeof selfie === 'string') return selfie;
 
  // backend object { url }
  if (typeof selfie === 'object' && selfie.url) return selfie.url;
 
  return null;
};
  const selfieUri = getSelfieUri(profile?.selfie);

  /* ---------------- FETCH PROFILE (SAME AS PROFILE SCREEN) ---------------- */
  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/api/profile/rider/profile');
      setProfile(res.data?.data);
    } catch (e) {
      console.log('Header profile fetch error', e);
    }
  };

  /* 🔥 AUTO REFRESH WHEN SCREEN FOCUSES */
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  /* ---------------- PERMISSION ---------------- */
  const checkLocationPermission = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result = await check(permission);

    if (result === RESULTS.GRANTED) return true;

    if (result === RESULTS.DENIED) {
      const req = await request(permission);
      return req === RESULTS.GRANTED;
    }

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Required',
        'Please enable location permission from settings',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings },
        ],
      );
    }

    return false;
  };

  /* ---------------- LOCATION ---------------- */
  const getCurrentLocation = () => {
    setIsLocationModal(true);
    setLoading(true);
    setAddress('');

    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;

        try {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
          const res = await axios.get(url);

          if (res.data.status === 'OK') {
            setAddress(res.data.results[0]?.formatted_address);
          } else {
            setAddress('Unable to fetch address');
          }
        } catch {
          setAddress('Address lookup failed');
        } finally {
          setLoading(false);
        }
      },
      error => {
        let msg = 'Unable to get location';
        if (error.code === 1) msg = 'Location permission denied';
        if (error.code === 2) msg = 'Location services are disabled';
        if (error.code === 3) msg = 'Location request timed out';

        setAddress(msg);
        setLoading(false);
        Alert.alert('Location Error', msg);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 10000,
      },
    );
  };

  const onLocationPress = async () => {
    const allowed = await checkLocationPermission();
    if (allowed) getCurrentLocation();
  };

  return (
    <>
      {/* HEADER */}
      <View style={styles.container}>
        <View style={styles.left}>
          <TouchableOpacity
            style={styles.profileWrapper}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
  source={
    selfieUri
      ? { uri: selfieUri }
      : require('../../assets/profile/profileicon.png')
  }
  
              style={styles.profileIcon}
            />
          </TouchableOpacity>

          <Text style={styles.name}>
            {profile?.personalInfo?.fullName || '—'}
          </Text>
        </View>

        <View style={styles.right}>
          <TouchableOpacity
            style={styles.rightIconWrapper}
            onPress={onLocationPress}
          >
            <Image
              source={require('../../assets/Location.png')}
              style={styles.rightIcons}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rightIconWrapper}
            onPress={() => navigation.navigate('HelpCenterList')}
          >
            <Image
              source={require('../../assets/help.png')}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* LOCATION MODAL */}
      <Modal visible={isLocationModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Current Location</Text>

            {loading ? (
              <Text style={styles.modalText}>Fetching location…</Text>
            ) : (
              <Text style={styles.modalText}>{address}</Text>
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsLocationModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

/* ---------------- STYLES (UNCHANGED) ---------------- */
const styles = StyleSheet.create({
  container: {
    height: wp('14%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6FBFF',
    paddingHorizontal: wp('5%'),
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  name: {
    fontSize: wp('4.4%'),
    fontWeight: '600',
    color: '#111827',
  },
  profileWrapper: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    overflow: 'hidden',
    backgroundColor: '#E5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  right: { flexDirection: 'row' },
  rightIconWrapper: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5%'),
    backgroundColor: '#E5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  rightIcon: { width: wp('6%'), height: wp('6%') },
  rightIcons: { width: wp('12%'), height: wp('12%') },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: wp('4.6%'),
    fontWeight: '600',
    marginBottom: 10,
  },
  modalText: {
    fontSize: wp('3.8%'),
    color: '#374151',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  closeText: {
    color: '#2563EB',
    fontWeight: '600',
  },
});

export default Header;
