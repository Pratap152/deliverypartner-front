import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import DeviceInfo from 'react-native-device-info';

import apiClient from '../../services/ApiClient';

const isTablet = DeviceInfo.isTablet();
const containerMaxWidth = isTablet ? 900 : '100%';

const BankAC = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountType: '',
    branch: '',
  });

  const [verification, setVerification] = useState({
    bank: '',
    ifsc: '',
  });

  /* FETCH BANK DETAILS */
  const fetchBankDetails = async () => {
    try {
      const res = await apiClient.get(`/api/profile/bank-details`);

      if (res?.data?.success) {
        const data = res.data.data;

        setBankDetails({
          accountHolderName: data?.accountHolderName || '',
          accountNumber: data?.accountNumber || '',
          ifscCode: data?.ifscCode || '',
          bankName: data?.bankName || '',
          accountType: data?.accountType || '',
          branch: data?.branch || '',
        });

        setVerification({
          bank: data?.bankVerificationStatus,
          ifsc: data?.ifscVerificationStatus,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bank details');
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  /* UPDATE BANK DETAILS */
  const updateBankDetails = async () => {
    try {
      const payload = {
        bankDetails: {
          bankName: bankDetails.bankName,
          accountHolderName: bankDetails.accountHolderName,
          accountType: bankDetails.accountType,
          branch: bankDetails.branch,
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode,
        },
      };

      const res = await apiClient.put(`/api/profile/bank-details`, payload);

      if (res?.data?.success) {
        setIsEditing(false);
        fetchBankDetails();
      } else {
        Alert.alert('Error', 'Failed to update bank details');
      }
    } catch (error) {
      console.log('Update bank error:', error?.response?.data || error);
      Alert.alert('Error', 'Something went wrong while updating bank details');
    }
  };

  const toggleTooltip = () => {
    Animated.timing(fadeAnim, {
      toValue: showInfo ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowInfo(!showInfo));
  };

  const statusColor = status =>
    status === 'VERIFIED'
      ? '#00A63E'
      : status === 'PENDING'
        ? '#FFA500'
        : '#FF3B30';

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <View style={styles.screenWrapper}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <Ionicons
              name="arrow-back"
              size={rf(3)}
              onPress={() => navigation.goBack()}
            />

            <Text style={styles.headerTitle}>Bank Details</Text>

            {verification.bank !== 'VERIFIED' ? (
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                <Text style={styles.editText}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: rw(10) }} />
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* INFO */}
            <View style={styles.infoContainer}>
              <TouchableOpacity
                onPress={toggleTooltip}
                style={styles.infoRow}
              >
                <Icon name="info-outline" size={22} color="#192A51" />

                <Text style={styles.infoText}>Secure Information</Text>
              </TouchableOpacity>

              {showInfo && (
                <Animated.View
                  style={[styles.tooltip, { opacity: fadeAnim }]}
                >
                  <Text style={styles.tooltipText}>
                    Your bank details are securely stored and used only for
                    payouts.
                  </Text>
                </Animated.View>
              )}
            </View>

            {/* BANK DETAILS */}
            <View style={styles.detailsContainer}>
              <View style={styles.accountHeader}>

                <Text style={styles.accountHeaderText}>
                  Bank Account Information
                </Text>
              </View>

              {[
                {
                  label: 'Account Holder Name',
                  key: 'accountHolderName',
                },
                {
                  label: 'Account Number',
                  key: 'accountNumber',
                },
                {
                  label: 'IFSC Code',
                  key: 'ifscCode',
                },
                {
                  label: 'Bank Name',
                  key: 'bankName',
                },
                {
                  label: 'Account Type',
                  key: 'accountType',
                },
                {
                  label: 'Branch',
                  key: 'branch',
                },
              ].map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.inputBox,
                    isTablet && styles.inputBoxTablet,
                  ]}
                >
                  <Text
                    style={[
                      styles.label,
                      isTablet && styles.labelTablet,
                    ]}
                  >
                    {item.label}
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.disabledInput,
                      isTablet && styles.inputTablet,
                    ]}
                    editable={isEditing}
                    value={bankDetails[item.key]}
                    onChangeText={text =>
                      setBankDetails({
                        ...bankDetails,
                        [item.key]: text,
                      })
                    }
                  />
                </View>
              ))}

              {isEditing && (
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={updateBankDetails}
                >
                  <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* VERIFICATION STATUS */}
            {!isEditing && (
              <View style={styles.detailsContainer1}>
                <View style={styles.verifyContainer}>
                  <Text style={styles.verifyTitle}>
                    Verification Status
                  </Text>

                  {[
                    {
                      label: 'Bank Account',
                      value: verification.bank,
                    },
                    {
                      label: 'IFSC Code',
                      value: verification.ifsc,
                    },
                  ].map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.verifyCard,
                        isTablet && styles.verifyCardTablet,
                      ]}
                    >
                      <View style={styles.leftRow}>
                        <View
                          style={[
                            styles.greenDot,
                            {
                              backgroundColor: statusColor(item.value),
                            },
                          ]}
                        />

                        <Text
                          style={[
                            styles.verifyLabel,
                            isTablet && styles.verifyLabelTablet,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.verifyText,
                          {
                            color: statusColor(item.value),
                          },
                          isTablet && styles.verifyTextTablet,
                        ]}
                      >
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BankAC;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  screenWrapper: {
    flex: 1,
    backgroundColor: '#fff',

    ...(isTablet && {
      alignItems: 'center',
    }),
  },

  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',

    ...(isTablet && {
      maxWidth: containerMaxWidth,
    }),
  },

  scrollContent: {
    paddingBottom: rh(4),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rw(4),
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: '600',

    ...(isTablet && {
      fontSize: rf(2.8),
    }),
  },

  editText: {
    color: '#192A51',
    fontWeight: '600',
  },

  infoContainer: {
    marginHorizontal: 16,
    marginTop: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    marginLeft: 6,
    color: '#192A51',
    fontWeight: '500',
  },

  tooltip: {
    marginTop: 8,
    backgroundColor: '#E8F1FF',
    padding: 12,
    borderRadius: 8,
  },

  tooltipText: {
    fontSize: 14,
    color: '#333',
  },

  detailsContainer: {
    backgroundColor: '#F9FAFB',
    margin: 12,
    borderRadius: 10,
    padding: 16,

    ...(isTablet && {
      width: '95%',
      alignSelf: 'center',
      padding: 24,
    }),
  },

  detailsContainer1: {
    backgroundColor: '#F9FAFB',
    margin: 12,
    borderRadius: 10,

    ...(isTablet && {
      width: '95%',
      alignSelf: 'center',
    }),
  },

  inputBox: {
    marginBottom: 14,
  },

  inputBoxTablet: {
    width: '100%',
    alignSelf: 'center',
  },

  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },

  labelTablet: {
    ...(isTablet && {
      fontSize: rf(1.9),
      marginBottom: 10,
    }),
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFF',
  },

  inputTablet: {
    ...(isTablet && {
      height: rh(7),
      fontSize: rf(1.9),
      paddingHorizontal: rw(2.5),
    }),
  },

  disabledInput: {
    backgroundColor: '#F1F1F1',
  },

  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  accountIcon: {
    width: 26,
    height: 26,
    marginRight: 10,

    ...(isTablet && {
      width: 34,
      height: 34,
    }),
  },

  accountHeaderText: {
    fontSize: 18,
    fontWeight: '600',

    ...(isTablet && {
      fontSize: rf(2.4),
    }),
  },

  verifyContainer: {
    margin: 16,
  },

  verifyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,

    ...(isTablet && {
      fontSize: rf(2.2),
    }),
  },

  verifyCard: {
    backgroundColor: '#EFFFF4',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  verifyCardTablet: {
    ...(isTablet && {
      paddingVertical: rh(2),
      paddingHorizontal: rw(3),
    }),
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,

    ...(isTablet && {
      width: 14,
      height: 14,
      borderRadius: 10,
    }),
  },

  verifyLabel: {
    fontSize: 15,
    fontWeight: '500',
  },

  verifyLabelTablet: {
    ...(isTablet && {
      fontSize: rf(2),
    }),
  },

  verifyText: {
    fontSize: 14,
    fontWeight: '600',
  },

  verifyTextTablet: {
    ...(isTablet && {
      fontSize: rf(1.9),
    }),
  },

  saveBtn: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',

    ...(isTablet && {
      width: '50%',
      alignSelf: 'center',
    }),
  },

  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});