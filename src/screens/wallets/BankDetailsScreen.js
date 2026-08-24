import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DeviceInfo from "react-native-device-info";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { saveBankDetails } from "../../services/bankDetailsService";

const isTablet = DeviceInfo.isTablet();

export default function AddBankDetails() {
  const navigation = useNavigation();

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holder, setHolder] = useState("");
  const [branch, setBranch] = useState("");
  const [accountType, setAccountType] = useState("");

  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  /* =========================================================
     NAME VALIDATION
     ========================================================= */

  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

  const validateName = (value) => {
    const trimmedValue = value.trim();

    return (
      trimmedValue.length >= 3 &&
      trimmedValue.length <= 30 &&
      nameRegex.test(trimmedValue)
    );
  };

  const getNameError = (value, fieldName) => {
    if (!value.trim()) {
      return `${fieldName} is required`;
    }

    if (value.length > 30) {
      return `${fieldName} must not exceed 30 characters`;
    }

    if (value.trim().length < 3) {
      return `${fieldName} must contain at least 3 characters`;
    }

    if (value !== value.trim()) {
      return `${fieldName} cannot start or end with spaces`;
    }

    if (/\s{2,}/.test(value)) {
      return `${fieldName} cannot contain consecutive spaces`;
    }

    if (!/^[A-Za-z ]+$/.test(value)) {
      return `${fieldName} can contain only alphabets`;
    }

    return "";
  };

  const handleNameChange = (text, setter) => {
    setter(text.slice(0, 30));
  };

  /* =========================================================
     ACCOUNT NUMBER VALIDATION
     ========================================================= */

  const validateAccount = () =>
    /^\d{15}$/.test(accountNumber);

  /* =========================================================
     IFSC VALIDATION
     ========================================================= */

  const validateIFSC = () =>
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

  /* =========================================================
     FIELD VALIDATIONS
     ========================================================= */

  const bankNameValid = validateName(bankName);
  const holderValid = validateName(holder);
  const branchValid = validateName(branch);

  const allValid =
    bankNameValid &&
    holderValid &&
    branchValid &&
    validateAccount() &&
    validateIFSC();

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async () => {
    if (!allValid) return;

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
    } catch (e) {
      console.log("Save bank details error:", e);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>

      {/* =================================================
          FORM
          ================================================= */}

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === "android" ? hp("4%") : hp("2%")}
        extraHeight={Platform.OS === "android" ? hp("8%") : hp("4%")}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={
          Platform.OS === "ios"
            ? "interactive"
            : "on-drag"
        }
        showsVerticalScrollIndicator={false}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >

        {/* =================================================
            BACK
            ================================================= */}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={isTablet ? 34 : 24}
            color="#000"
          />
        </TouchableOpacity>

        {/* =================================================
            IMAGE
            ================================================= */}

        <Image
          source={require("../../assets/Bank.jpg")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Add Bank 
        </Text>

        {/* =================================================
            BANK NAME
            ================================================= */}

        <Input
          label="Bank Name"
          value={bankName}
          maxLength={30}
          autoCapitalize="words"
          onChangeText={(text) =>
            handleNameChange(text, setBankName)
          }
        />

        {bankName.length > 0 && !bankNameValid && (
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
          maxLength={15}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) {
              setAccountNumber(text);
            }
          }}
        />

        {!validateAccount() &&
          accountNumber.length > 0 && (
            <Error
              text="Account number must be exactly 15 digits"
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
          onChangeText={(text) =>
            setIfsc(text.toUpperCase())
          }
        />

        {!validateIFSC() &&
          ifsc.length > 0 && (
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
          onChangeText={(text) =>
            handleNameChange(text, setHolder)
          }
        />

        {holder.length > 0 && !holderValid && (
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
          onChangeText={(text) =>
            handleNameChange(text, setBranch)
          }
        />

        {branch.length > 0 && !branchValid && (
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

        <Text style={styles.label}>
          Account Type
        </Text>

        <View style={styles.row}>
          {["SAVINGS", "CURRENT"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeBtn,
                accountType === type &&
                  styles.typeActive,
              ]}
              onPress={() =>
                setAccountType(type)
              }
            >
              <Text
                style={[
                  styles.typeText,
                  accountType === type && {
                    color: "#fff",
                  },
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Extra space so the last field can move
            completely above the keyboard and button */}
        <View style={styles.bottomSpace} />

      </KeyboardAwareScrollView>

      {/* =================================================
          FIXED BUTTON
          ================================================= */}

      <View style={styles.fixedButton}>
        <TouchableOpacity
          style={[
            styles.button,
            !allValid &&
              styles.buttonDisabled,
          ]}
          disabled={!allValid || loading}
          onPress={handleSubmit}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              Add Account
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ===================================================
          SUCCESS MODAL
          =================================================== */}

      <Modal
        transparent
        visible={successModal}
        animationType="fade"
      >
        <View style={styles.modalBg}>

          <View style={styles.modalBox}>

            <Ionicons
              name="checkmark-circle"
              size={80}
              color="#28a745"
            />

            <Text style={styles.successText}>
              Bank details added successfully
            </Text>

            <TouchableOpacity
              style={styles.okBtn}
              onPress={() => {
                setSuccessModal(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.okText}>
                OK
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>

    </View>
  );
}

/* =========================================================
   INPUT COMPONENT
   ========================================================= */

const Input = ({
  label,
  ...props
}) => (
  <View style={styles.inputContainer}>

    <Text style={styles.label}>
      {label}
    </Text>

    <TextInput
      style={styles.input}
      placeholder={`Enter ${label}`}
      placeholderTextColor="#98A2B3"
      {...props}
    />

  </View>
);

/* =========================================================
   ERROR COMPONENT
   ========================================================= */

const Error = ({ text }) => (
  <Text style={styles.error}>
    {text}
  </Text>
);

/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scroll: {
    flex: 1,
  },

  container: {
    padding: wp("7%"),
    paddingBottom: hp("25%"),
    backgroundColor: "#fff",
  },

  backButton: {
    marginTop: 15,
  },

  image: {
    width: wp("90%"),
    height: hp("25%"),
    alignSelf: "center",
  },

  title: {
    fontSize: wp("5.5%"),
    fontWeight: "700",
    textAlign: "center",
  },

  inputContainer: {
    marginTop: 18,
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
    padding: wp("4%"),
    color: "#101828",
  },

  error: {
    color: "red",
    fontSize: wp("3.2%"),
    marginTop: hp("0.5%"),
  },

  row: {
    flexDirection: "row",
    gap: wp("3%"),
  },

  typeBtn: {
    borderWidth: 1,
    borderColor: "#3D63FF",
    padding: wp("3%"),
    borderRadius: wp("6%"),
  },

  typeActive: {
    backgroundColor: "#3D63FF",
  },

  typeText: {
    color: "#000",
  },

  bottomSpace: {
    height: hp("25%"),
  },

  button: {
    backgroundColor: "#3D63FF",
    padding: hp("2%"),
    borderRadius: wp("8%"),
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#9BB4FF",
  },

  btnText: {
    color: "#fff",
    fontSize: wp("4.2%"),
    fontWeight: "600",
  },

  fixedButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp("5%"),
    backgroundColor: "#fff",
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
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
  },

});