import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../utils/colors';
import { setKitCompleted } from '../../redux/slices/kitSlice';

const SuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);

  const { source, riderId } = route?.params || {};

  useEffect(() => {
    if (!riderId) return;

    dispatch(
      setKitCompleted({
        riderId,
        kitCompleted: true,
        currentStep: 'SuccessScreen',
      })
    );
  }, [dispatch, riderId]);

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconOuter}>
          <View style={styles.iconInner}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>Kit Requested Successfully</Text>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
          <Text style={styles.secondaryButtonText}>
            Go to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SuccessScreen;

const getStyles = isTablet =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    container: {
      flex: 1,
      paddingHorizontal: isTablet ? 80 : 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconOuter: {
      width: isTablet ? 160 : 120,
      height: isTablet ? 160 : 120,
      borderRadius: isTablet ? 80 : 60,
      backgroundColor: '#DCFCE7',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    iconInner: {
      width: isTablet ? 110 : 78,
      height: isTablet ? 110 : 78,
      borderRadius: isTablet ? 55 : 39,
      backgroundColor: COLORS.success || '#22C55E',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkIcon: {
      color: '#FFFFFF',
      fontSize: isTablet ? 54 : 38,
      fontWeight: '800',
    },
    title: {
      fontSize: isTablet ? 32 : 22,
      lineHeight: isTablet ? 42 : 30,
      fontWeight: '700',
      color: '#1E293B',
      textAlign: 'center',
      marginBottom: 32,
    },
    secondaryButton: {
      backgroundColor: '#FFFFFF',
      paddingVertical: isTablet ? 24 : 18,
      paddingHorizontal: isTablet ? 48 : 32,
      borderRadius: isTablet ? 22 : 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#0F172A',
    },
    secondaryButtonText: {
      color: '#0F172A',
      fontSize: isTablet ? 24 : 17,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
  });