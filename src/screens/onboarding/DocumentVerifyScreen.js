import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '../../components/common/Header';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../utils/colors';
import { getOnboardingStatus } from '../../services/onboardingApi';

const DOCUMENTS = [
  { title: 'Aadhar Card', id: 'aadhaar', route: 'AadharEntryScreen' },
  { title: 'PAN Card', id: 'pan', route: 'PanUploadScreen' },
  { title: 'Driving License', id: 'dl', route: 'LicenseUploadScreen' },
];

const DocumentVerificationScreen = () => {
  const navigation = useNavigation();

  const [verifiedDocuments, setVerifiedDocuments] = useState({
    aadhaar: false,
    pan: false,
    dl: false,
  });

  const [loading, setLoading] = useState(false);

  // 🔁 Always fetch latest status when screen is focused
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
    // ✅ DO NOT decide next screen here
    // Let Splash decide using onboardingStage
    navigation.replace('Splash');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header text="Document Verification" />

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

          <PrimaryButton
            title="Submit"
            disabled={!isAllDocumentsVerified || loading}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DocumentVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
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
