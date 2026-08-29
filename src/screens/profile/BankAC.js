import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
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

import { getBankDetails, updateBankDetails } from '../../services/profile/profileApiService';

const isTablet = DeviceInfo.isTablet();
const containerMaxWidth = isTablet ? 900 : '100%';



const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

const validateName = value => {
  const trimmedValue = value.trim();
  return (
    trimmedValue.length >= 3 &&
    trimmedValue.length <= 30 &&
    nameRegex.test(value) 
  );
};

const getNameError = (value, fieldName) => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }

  if (value.length > 30) {
    return `${fieldName} must not exceed 30 characters`;
  }

  const startsWithSpace = value[0] === ' ';
  const endsWithSpace = value[value.length - 1] === ' ';

  if (startsWithSpace || endsWithSpace) {
    return `${fieldName} cannot start or end with spaces`;
  }

  
  if (/\s{2,}/.test(value)) {
    return `${fieldName} cannot contain consecutive spaces`;
  }

  if (value.trim().length < 3) {
    return `${fieldName} must contain at least 3 characters`;
  }

  if (!/^[A-Za-z ]+$/.test(value)) {
    return `${fieldName} can contain only alphabets`;
  }

  return '';
};

const validateAccount = value =>
  /^\d{15}$/.test(value) && !/^(\d)\1{14}$/.test(value); 

const validateIFSC = value => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value);

const FIELD_LABELS = {
  accountHolderName: 'Account holder name',
  bankName: 'Bank name',
  branch: 'Branch name',
};

const BankAC = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAccountTypeDropdown, setShowAccountTypeDropdown] = useState(false);

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
      const res = await getBankDetails();

      if (res?.data?.success) {
        const data = res.data.data;

        setBankDetails({
          // sanitize + trim on the way in so stale/legacy backend
          // values (extra spaces, stray digits) never leave a
          // field stuck or pre-loaded with an invalid leading space
          accountHolderName: (data?.accountHolderName || '').replace(/[^A-Za-z ]/g, '').trim(),
          accountNumber: (data?.accountNumber || '').replace(/\D/g, ''),
          ifscCode: (data?.ifscCode || '').toUpperCase().replace(/[^A-Z0-9]/g, ''),
          bankName: (data?.bankName || '').replace(/[^A-Za-z ]/g, '').trim(),
          accountType: data?.accountType || '',
          branch: (data?.branch || '').replace(/[^A-Za-z ]/g, '').trim(),
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

  /* =========================================================
     LIVE VALIDATION — recomputed on every render from current
     bankDetails, same pattern as AddBankDetails.js.
     ========================================================= */

  const bankNameValid = validateName(bankDetails.bankName);
  const holderValid = validateName(bankDetails.accountHolderName);
  const branchValid = validateName(bankDetails.branch);
  const accountValid = validateAccount(bankDetails.accountNumber);
  const ifscValid = validateIFSC(bankDetails.ifscCode);

  const allValid =
    bankNameValid && holderValid && branchValid && accountValid && ifscValid;

  const liveErrors = {
    accountHolderName:
      bankDetails.accountHolderName.length > 0 && !holderValid
        ? getNameError(bankDetails.accountHolderName, FIELD_LABELS.accountHolderName)
        : '',
    bankName:
      bankDetails.bankName.length > 0 && !bankNameValid
        ? getNameError(bankDetails.bankName, FIELD_LABELS.bankName)
        : '',
    branch:
      bankDetails.branch.length > 0 && !branchValid
        ? getNameError(bankDetails.branch, FIELD_LABELS.branch)
        : '',
    accountNumber:
      bankDetails.accountNumber.length > 0 && !accountValid
        ? bankDetails.accountNumber.length < 15
          ? 'Account number must be exactly 15 digits'
          : /^(\d)\1{14}$/.test(bankDetails.accountNumber)
          ? 'Account number cannot be all the same digit'
          : 'Account number must be exactly 15 digits'
        : '',
    ifscCode:
      bankDetails.ifscCode.length > 0 && !ifscValid
        ? 'IFSC must be like ABCD0XXXXXX'
        : '',
  };

  /* UPDATE BANK DETAILS */
  const handleUpdateBankDetails = async () => {
    if (!allValid) {
      Alert.alert('Error', 'Please fix the validation errors');
      return;
    }

    try {
      const payload = {
        bankDetails: {
          bankName: bankDetails.bankName.trim(),
          accountHolderName: bankDetails.accountHolderName.trim(),
          accountType: bankDetails.accountType || undefined,
          branch: bankDetails.branch.trim(),
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode.trim().toUpperCase(),
        },
      };

      const res = await updateBankDetails(payload);

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
    setShowInfo(!showInfo);
  };

  const statusColor = status =>
    status === 'VERIFIED'
      ? '#00A63E'
      : status === 'PENDING'
      ? '#FFA500'
      : '#FF3B30';

  
  const handleInputChange = (key, text) => {
    if (key === 'accountNumber') {
      const newValue = text.replace(/\D/g, '').slice(0, 15);
      setBankDetails(prev => ({ ...prev, [key]: newValue }));
      return;
    }

    if (key === 'ifscCode') {
      const newValue = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
      setBankDetails(prev => ({ ...prev, [key]: newValue }));
      return;
    }

    if (['accountHolderName', 'bankName', 'branch'].includes(key)) {
      let newValue = text.replace(/[^A-Za-z ]/g, '').slice(0, 30);
      // Block a field that is nothing but leading spaces —
      // there's no real content yet to justify it, and it's
      // exactly the "starts with space" case you don't want.
      if (newValue.trim().length === 0) {
        newValue = '';
      }
      setBankDetails(prev => ({ ...prev, [key]: newValue }));
      return;
    }

    setBankDetails(prev => ({ ...prev, [key]: text }));
  };

  const accountTypeOptions = ['', 'SAVINGS', 'CURRENT'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? rh(6) : 0}
      >
        <View style={styles.screenWrapper}>
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
              <Ionicons name="arrow-back" size={rf(3)} onPress={() => navigation.goBack()} />
              <Text style={styles.headerTitle}>Bank Details</Text>
              {verification.bank !== 'VERIFIED' ? (
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                  <Text style={styles.editText}>{isEditing ? 'Cancel' : 'Edit'}</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: rw(10) }} />
              )}
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              {/* INFO */}
              <View style={styles.infoContainer}>
                <TouchableOpacity onPress={toggleTooltip} style={styles.infoRow}>
                  <Icon name="info-outline" size={22} color="#192A51" />
                  <Text style={styles.infoText}>Secure Information</Text>
                </TouchableOpacity>

                {showInfo && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>
                      Your bank details are securely stored and used only for payouts.
                    </Text>
                  </View>
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
                    autoCapitalize: 'words',
                  },
                  {
                    label: 'Account Number',
                    key: 'accountNumber',
                    keyboardType: 'numeric',
                  },
                  {
                    label: 'IFSC Code',
                    key: 'ifscCode',
                    autoCapitalize: 'characters',
                  },
                  {
                    label: 'Bank Name',
                    key: 'bankName',
                    autoCapitalize: 'words',
                  },
                  {
                    label: 'Branch',
                    key: 'branch',
                    autoCapitalize: 'words',
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
                        isEditing && liveErrors[item.key] && styles.inputError,
                      ]}
                      editable={isEditing}
                      value={bankDetails[item.key]}
                      keyboardType={item.keyboardType || 'default'}
                      maxLength={
                        item.key === 'accountNumber'
                          ? 15
                          : ['accountHolderName', 'bankName', 'branch'].includes(item.key)
                          ? 30
                          : item.key === 'ifscCode'
                          ? 11
                          : undefined
                      }
                      autoCapitalize={item.autoCapitalize || 'none'}
                      onChangeText={text =>
                        handleInputChange(item.key, text)
                      }
                    />

                    {/* LIVE ERROR MESSAGE */}
                    {isEditing && liveErrors[item.key] ? (
                      <Text style={styles.errorText}>
                        {liveErrors[item.key]}
                      </Text>
                    ) : null}
                  </View>
                ))}

                {/* ACCOUNT TYPE DROPDOWN */}
                <View
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
                    Account Type
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.input,
                      !isEditing && styles.disabledInput,
                      isTablet && styles.inputTablet,
                    ]}
                    onPress={() => {
                      if (isEditing) {
                        setShowAccountTypeDropdown(true);
                      }
                    }}
                    disabled={!isEditing}
                  >
                    <Text
                      style={[
                        styles.inputText,
                        !bankDetails.accountType && styles.placeholderText,
                      ]}
                    >
                      {bankDetails.accountType || 'Select Account Type'}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color="#666"
                      style={styles.dropdownIcon}
                    />
                  </TouchableOpacity>
                </View>

                {isEditing && (
                  <TouchableOpacity
                    style={[
                      styles.saveBtn,
                      !allValid && styles.saveBtnDisabled,
                    ]}
                    disabled={!allValid}
                    onPress={handleUpdateBankDetails}
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

              {/* Extra bottom space so the last field/button
                  clears the keyboard instead of hiding behind it */}
              <View style={{ height: rh(isEditing ? 4 : 2) }} />
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* ACCOUNT TYPE DROPDOWN MODAL */}
      <Modal
        transparent
        visible={showAccountTypeDropdown}
        animationType="fade"
        onRequestClose={() => setShowAccountTypeDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalBg}
          activeOpacity={1}
          onPress={() => setShowAccountTypeDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            {accountTypeOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownOption}
                onPress={() => {
                  setBankDetails(prev => ({
                    ...prev,
                    accountType: option,
                  }));
                  setShowAccountTypeDropdown(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Clear selection option */}
            <TouchableOpacity
              style={[styles.dropdownOption, styles.clearOption]}
              onPress={() => {
                setBankDetails(prev => ({
                  ...prev,
                  accountType: '',
                }));
                setShowAccountTypeDropdown(false);
              }}
            >
              <Text style={[styles.dropdownOptionText, styles.clearText]}>
                Clear Selection
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    flexGrow: 1,
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

  inputError: {
    borderColor: '#FF3B30',
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

  inputText: {
    fontSize: 14,
    color: '#000',
  },

  placeholderText: {
    color: '#999',
  },

  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
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

  saveBtnDisabled: {
    backgroundColor: '#9BB4FF',
  },

  saveText: {
    color: '#fff',
    fontWeight: '600',
  },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropdownContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },

  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  dropdownOptionText: {
    fontSize: 16,
    color: '#000',
  },
  clearOption: {
    backgroundColor: '#FFF5F5',
  },

  clearText: {
    color: '#FF3B30',
  },
});