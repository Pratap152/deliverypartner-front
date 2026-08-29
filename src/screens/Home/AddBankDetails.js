import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Alert,
  Keyboard,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DeviceInfo from "react-native-device-info";

import { saveBankDetails } from "../../services/bankDetailsService";

const isTablet = DeviceInfo.isTablet();

export default function AddBankDetails() {
  const navigation = useNavigation();

  const scrollViewRef = useRef(null);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holder, setHolder] = useState("");
  const [branch, setBranch] = useState("");
  const [accountType, setAccountType] = useState("");

  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  /* =========================================================
     KEYBOARD STATE
     ========================================================= */

  useEffect(() => {
    const keyboardShowEvent =
      Platform.OS === "ios"
        ? "keyboardWillShow"
        : "keyboardDidShow";

    const keyboardHideEvent =
      Platform.OS === "ios"
        ? "keyboardWillHide"
        : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(
      keyboardShowEvent,
      () => {
        setKeyboardVisible(true);
      }
    );

    const hideSubscription = Keyboard.addListener(
      keyboardHideEvent,
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  /* =========================================================
     NAME VALIDATION
     ========================================================= */

  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

  const validateName = (value) => {
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

    if (value[0] === " ") {
      return `${fieldName} cannot start with spaces`;
    }

    if (value[value.length - 1] === " ") {
      return `${fieldName} cannot end with spaces`;
    }

    if (/ {2,}/.test(value)) {
      return `${fieldName} cannot contain consecutive spaces`;
    }

    if (value.trim().length < 3) {
      return `${fieldName} must contain at least 3 characters`;
    }

    if (!/^[A-Za-z ]+$/.test(value)) {
      return `${fieldName} can contain only alphabets`;
    }

    return "";
  };

  /* =========================================================
     NAME INPUT HANDLER

     Handles keyboard double-space => period.

     Example:
     "Andhra  " -> "Andhra. "

     becomes:
     "Andhra  "
     ========================================================= */

  const handleNameChange = (text, setter) => {
    let newValue = text.slice(0, 30);

    /*
     * Some keyboards automatically change:
     *
     * "ABC  "
     *
     * to:
     *
     * "ABC. "
     */
    if (newValue.endsWith(". ")) {
      newValue = newValue.slice(0, -2) + "  ";
    }

    /*
     * Remove all invalid characters.
     */
    newValue = newValue.replace(/[^A-Za-z ]/g, "");

    /*
     * Prevent leading spaces.
     */
    newValue = newValue.replace(/^ +/, "");

    /*
     * Keep consecutive spaces so validation can show:
     *
     * "Branch name cannot contain consecutive spaces"
     */
    setter(newValue);
  };

  /* =========================================================
     ACCOUNT NUMBER VALIDATION
     ========================================================= */

  const validateAccount = () => {
    return (
      /^\d{15}$/.test(accountNumber) &&
      !/^(\d)\1{14}$/.test(accountNumber)
    );
  };

  const isAllSameDigits = () => {
    return /^(\d)\1{14}$/.test(accountNumber);
  };

  /* =========================================================
     IFSC VALIDATION
     ========================================================= */

  const validateIFSC = () => {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  };

  /* =========================================================
     FIELD VALIDATION
     ========================================================= */

  const bankNameValid = validateName(bankName);
  const holderValid = validateName(holder);
  const branchValid = validateName(branch);

  const accountValid = validateAccount();
  const ifscValid = validateIFSC();

  const allValid =
    bankNameValid &&
    holderValid &&
    branchValid &&
    accountValid &&
    ifscValid;

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async () => {
    if (!allValid || loading) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        bankName: bankName.trim(),
        accountHolderName: holder.trim(),
        accountNumber,
        ifscCode: ifsc.trim().toUpperCase(),
        branch: branch.trim(),
        accountType: accountType || undefined,
      };

      await saveBankDetails(payload);

      setSuccessModal(true);
    } catch (error) {
      console.log(
        "Save bank details error:",
        error
      );

      Alert.alert(
        "Error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };



  const scrollContentStyle = [
    styles.scrollContent,
    {
      paddingBottom: keyboardVisible
        ? hp("8%")
        : hp("4%"),
    },
  ];

  /* =========================================================
     SCREEN
     ========================================================= */

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={
          Platform.OS === "ios"
            ? hp("1%")
            : 0
        }
      >
        <View style={styles.screenWrapper}>

          <View style={styles.container}>

            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={
                scrollContentStyle
              }

              /*
               * Keep keyboard open when tapping/scrolling.
               */
              keyboardShouldPersistTaps="handled"

              /*
               * Android:
               * "none" prevents scrolling from dismissing
               * the keyboard.
               */
              keyboardDismissMode={
                Platform.OS === "ios"
                  ? "interactive"
                  : "none"
              }

              showsVerticalScrollIndicator={false}

              /*
               * Prevent clipping/unmounting while scrolling.
               */
              removeClippedSubviews={false}

              /*
               * Avoid Android overscroll movement.
               */
              overScrollMode="never"

              /*
               * Make the ScrollView occupy available height.
               */
              nestedScrollEnabled={true}
            >

              {/* =================================================
                  BACK BUTTON
                  ================================================= */}

              <TouchableOpacity
                onPress={() =>
                  navigation.goBack()
                }
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="arrow-back"
                  size={
                    isTablet
                      ? 34
                      : 24
                  }
                  color="#000"
                />
              </TouchableOpacity>

              {/* =================================================
                  IMAGE
                  ================================================= */}

              <Image
                source={require(
                  "../../assets/Bank.jpg"
                )}
                style={styles.image}
                resizeMode="contain"
              />

              {/* =================================================
                  TITLE
                  ================================================= */}

              <Text style={styles.title}>
                Add Bank Account Details
              </Text>

              {/* =================================================
                  BANK NAME
                  ================================================= */}

              <Input
                label="Bank Name"
                value={bankName}
                maxLength={30}
                autoCapitalize="words"
                autoCorrect={false}
                spellCheck={false}
                autoComplete="off"
                textContentType="none"
                returnKeyType="next"
                onChangeText={(text) =>
                  handleNameChange(
                    text,
                    setBankName
                  )
                }
              />

              {bankName.length > 0 &&
                !bankNameValid && (
                  <Error
                    text={getNameError(
                      bankName,
                      "Bank name"
                    )}
                  />
                )}

              {/* =================================================
                  ACCOUNT NUMBER
                  ================================================= */}

              <Input
                label="Account Number (15 digits)"
                value={accountNumber}
                keyboardType="numeric"
                inputMode="numeric"
                maxLength={15}
                autoCorrect={false}
                autoComplete="off"
                returnKeyType="next"
                onChangeText={(text) => {
                  if (/^\d*$/.test(text)) {
                    setAccountNumber(text);
                  }
                }}
              />

              {accountNumber.length > 0 &&
                !accountValid && (
                  <Error
                    text={
                      accountNumber.length < 15
                        ? "Account number must be exactly 15 digits"
                        : isAllSameDigits()
                        ? "Account number cannot be all the same digit"
                        : "Account number must be exactly 15 digits"
                    }
                  />
                )}

              {/* =================================================
                  IFSC
                  ================================================= */}

              <Input
                label="IFSC Code"
                value={ifsc}
                maxLength={11}
                autoCapitalize="characters"
                autoCorrect={false}
                spellCheck={false}
                autoComplete="off"
                textContentType="none"
                returnKeyType="next"
                onChangeText={(text) => {
                  const formatted =
                    text
                      .toUpperCase()
                      .replace(
                        /[^A-Z0-9]/g,
                        ""
                      );

                  setIfsc(formatted);
                }}
              />

              {ifsc.length > 0 &&
                !ifscValid && (
                  <Error
                    text="IFSC must be like ABCD0XXXXXX"
                  />
                )}

              {/* =================================================
                  ACCOUNT HOLDER NAME
                  ================================================= */}

              <Input
                label="Account Holder Name"
                value={holder}
                maxLength={30}
                autoCapitalize="words"
                autoCorrect={false}
                spellCheck={false}
                autoComplete="off"
                textContentType="none"
                returnKeyType="next"
                onChangeText={(text) =>
                  handleNameChange(
                    text,
                    setHolder
                  )
                }
              />

              {holder.length > 0 &&
                !holderValid && (
                  <Error
                    text={getNameError(
                      holder,
                      "Account holder name"
                    )}
                  />
                )}

              {/* =================================================
                  BRANCH NAME
                  ================================================= */}

              <Input
                label="Branch Name"
                value={branch}
                maxLength={30}
                autoCapitalize="words"
                autoCorrect={false}
                spellCheck={false}
                autoComplete="off"
                textContentType="none"
                returnKeyType="next"
                onChangeText={(text) =>
                  handleNameChange(
                    text,
                    setBranch
                  )
                }
              />

              {branch.length > 0 &&
                !branchValid && (
                  <Error
                    text={getNameError(
                      branch,
                      "Branch name"
                    )}
                  />
                )}

              {/* =================================================
                  ACCOUNT TYPE
                  ================================================= */}

              <View
                style={
                  styles.accountTypeContainer
                }
              >
                <Text style={styles.label}>
                  Account Type
                </Text>

                <View style={styles.row}>

                  {/* SAVINGS */}

                  <TouchableOpacity
                    style={[
                      styles.typeBtn,
                      accountType ===
                        "SAVINGS" &&
                        styles.typeActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() =>
                      setAccountType(
                        "SAVINGS"
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.typeText,
                        accountType ===
                          "SAVINGS" &&
                          styles.typeTextActive,
                      ]}
                    >
                      SAVINGS
                    </Text>
                  </TouchableOpacity>

                  {/* CURRENT */}

                  <TouchableOpacity
                    style={[
                      styles.typeBtn,
                      accountType ===
                        "CURRENT" &&
                        styles.typeActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() =>
                      setAccountType(
                        "CURRENT"
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.typeText,
                        accountType ===
                          "CURRENT" &&
                          styles.typeTextActive,
                      ]}
                    >
                      CURRENT
                    </Text>
                  </TouchableOpacity>

                </View>
              </View>

              {/* =================================================
                  ADD ACCOUNT
                  ================================================= */}

              <View
                style={
                  styles.addAccountContainer
                }
              >
                <TouchableOpacity
                  style={[
                    styles.button,
                    !allValid &&
                      styles.buttonDisabled,
                  ]}
                  disabled={
                    !allValid ||
                    loading
                  }
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator
                      color="#fff"
                    />
                  ) : (
                    <Text
                      style={
                        styles.btnText
                      }
                    >
                      Add Account
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* =====================================================
          SUCCESS MODAL
          ===================================================== */}

      <Modal
        transparent
        visible={successModal}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() =>
          setSuccessModal(false)
        }
      >
        <View style={styles.modalBg}>

          <View style={styles.modalBox}>

            <Ionicons
              name="checkmark-circle"
              size={80}
              color="#28a745"
            />

            <Text
              style={
                styles.successText
              }
            >
              Bank details added
              successfully
            </Text>

            <TouchableOpacity
              style={styles.okBtn}
              activeOpacity={0.8}
              onPress={() => {
                setSuccessModal(false);
                navigation.goBack();
              }}
            >
              <Text
                style={styles.okText}
              >
                OK
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* =========================================================
   INPUT COMPONENT
   ========================================================= */

const Input = ({
  label,
  ...props
}) => {
  return (
    <View style={styles.inputWrapper}>

      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#98A2B3"
        autoCorrect={false}
        spellCheck={false}
        {...props}
      />

    </View>
  );
};

/* =========================================================
   ERROR COMPONENT
   ========================================================= */

const Error = ({ text }) => {
  return (
    <Text style={styles.error}>
      {text}
    </Text>
  );
};

/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({

  /* =======================================================
     ROOT
     ======================================================= */

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  keyboardContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  screenWrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp("7%"),
    paddingTop: hp("1%"),
  },

  /* =======================================================
     BACK
     ======================================================= */

  backButton: {
    width: wp("12%"),
    height: wp("12%"),
    justifyContent: "center",
    alignItems: "flex-start",
  },

  /* =======================================================
     IMAGE
     ======================================================= */

  image: {
    width: wp("90%"),
    height: hp("25%"),
    alignSelf: "center",
  },

  /* =======================================================
     TITLE
     ======================================================= */

  title: {
    fontSize: wp("5.5%"),
    fontWeight: "700",
    textAlign: "center",
    color: "#101828",
    marginBottom: hp("1%"),
  },

  /* =======================================================
     INPUT
     ======================================================= */

  inputWrapper: {
    marginTop: hp("2.2%"),
  },

  label: {
    fontSize: wp("3.6%"),
    marginBottom: hp("0.8%"),
    color: "#101828",
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp("3%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.8%"),
    color: "#101828",
    backgroundColor: "#fff",
    fontSize: wp("4%"),
    minHeight: hp("6%"),
  },

  /* =======================================================
     ERROR
     ======================================================= */

  error: {
    color: "red",
    fontSize: wp("3.2%"),
    marginTop: hp("0.5%"),
  },

  /* =======================================================
     ACCOUNT TYPE
     ======================================================= */

  accountTypeContainer: {
    marginTop: hp("2.2%"),
  },

  row: {
    flexDirection: "row",
    gap: wp("3%"),
  },

  typeBtn: {
    borderWidth: 1,
    borderColor: "#3D63FF",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.2%"),
    borderRadius: wp("6%"),
  },

  typeActive: {
    backgroundColor: "#3D63FF",
  },

  typeText: {
    color: "#000",
    fontSize: wp("3.5%"),
    fontWeight: "500",
  },

  typeTextActive: {
    color: "#fff",
  },

  /* =======================================================
     ADD ACCOUNT
     ======================================================= */

  addAccountContainer: {
    marginTop: hp("3%"),
    marginBottom: hp("1%"),
    width: "100%",
  },

  button: {
    width: "100%",
    height: hp("6.5%"),
    backgroundColor: "#3D63FF",
    borderRadius: wp("8%"),
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    backgroundColor: "#9BB4FF",
  },

  btnText: {
    color: "#fff",
    fontSize: wp("4.2%"),
    fontWeight: "600",
  },

  /* =======================================================
     MODAL
     ======================================================= */

  modalBg: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: wp("6%"),
    borderRadius: wp("4%"),
    alignItems: "center",
  },

  successText: {
    color: "#28a745",
    fontSize: wp("4.5%"),
    marginVertical: hp("2%"),
    textAlign: "center",
    fontWeight: "600",
  },

  okBtn: {
    backgroundColor: "#28a745",
    paddingHorizontal: wp("10%"),
    paddingVertical: hp("1.2%"),
    borderRadius: wp("6%"),
  },

  okText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "500",
  },
});