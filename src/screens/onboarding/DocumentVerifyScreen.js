import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, BackHandler, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '../../components/common/Header';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../utils/colors';
import { getOnboardingStatus } from '../../services/onboardingApi';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const horizontalPadding = isTablet ? 40 : 8;
const containerMaxWidth = isTablet ? 900 : '100%';

const DOCUMENTS = [
  { title: 'Aadhar Card', id: 'aadhaar', route: 'AadharEntryScreen' },
  { title: 'PAN Card', id: 'pan', route: 'PanUploadScreen' },
  { title: 'Driving License', id: 'dl', route: 'LicenseUploadScreen' },
];

const DocumentVerificationScreen = () => {

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );

        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const navigation = useNavigation();

  const [verifiedDocuments, setVerifiedDocuments] = useState({
    aadhaar: false,
    pan: false,
    dl: false,
  });

  const [loading, setLoading] = useState(false);

  //  Always fetch latest status when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchOnboardingStatus();
    }, []),
  );

  const fetchOnboardingStatus = async () => {
    try {
      setLoading(true);
      const res = await getOnboardingStatus();

      if (res?.success) {
        setVerifiedDocuments({
          aadhaar: !!res.onboardingProgress?.aadharVerified,
          pan: !!res.onboardingProgress?.panUploaded,
          dl: !!res.onboardingProgress?.dlUploaded,
        });
      }
    } catch (error) {
      console.log('Failed to fetch onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = item => {
    if (verifiedDocuments[item.id]) return;
    navigation.navigate(item.route);
  };

  const isAllDocumentsVerified =
    Object.values(verifiedDocuments).every(Boolean);

  const handleSubmit = () => {
    navigation.replace('Splash');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.screenWrapper}>
        <View style={styles.container}>
          <Text style={styles.headerTitle}> Document Verification </Text>

          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={styles.content}>
              <Text style={styles.infoText}>
                Upload clear photos of the below documents for faster verification
              </Text>

              <View style={styles.btnsContainer}>
                {DOCUMENTS.map(item => {
                  const isVerified = verifiedDocuments[item.id];

                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleSelect(item)}
                      disabled={isVerified || loading}
                      style={[styles.btn, isVerified && styles.active]}
                    >
                      <Text style={[styles.btnText, isVerified && styles.active]}>
                        {item.title}
                      </Text>

                      <Ionicons
                        name={isVerified ? 'checkmark' : 'chevron-forward'}
                        size={20}
                        color={isVerified ? COLORS.white : COLORS.border}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={[isTablet && { width: 400, alignSelf: 'center' }]}>
              <PrimaryButton
                title="Submit"
                disabled={!isAllDocumentsVerified || loading}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DocumentVerificationScreen;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: containerMaxWidth,
    paddingHorizontal: horizontalPadding,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: isTablet ? 34 : 26,
    fontWeight: '700',
    textAlign: 'center'
  },

  content: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },

  btnsContainer: {
    marginTop: 30,
    gap: 20,
  },

  btn: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.border,
  },

  btnText: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.text,
  },

  active: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    color: COLORS.white,
  },
});
