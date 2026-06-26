import React, { useState } from "react";
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
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import apiClient from "../../services/ApiClient";
import DeviceInfo from "react-native-device-info";


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

  /* -------- VALIDATIONS -------- */
  const validateAccount = () =>
    /^\d{15}$/.test(accountNumber);

  const validateIFSC = () =>
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

  const allValid =
    bankName.trim() &&
    holder.trim() &&
    branch.trim() &&
    accountType &&
    validateAccount() &&
    validateIFSC();

  /* -------- SUBMIT -------- */
  const handleSubmit = async () => {
    if (!allValid) return;

    setLoading(true);
    try {
      await apiClient.post("/api/bank/bank-details", {
        bankName: bankName.trim(),
        accountHolderName: holder.trim(),
        accountNumber,
        ifscCode: ifsc,
        branch: branch.trim(),
        accountType,
      });

      setSuccessModal(true);
    } catch (e) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}
                            style={{marginTop:15}}>
            <Ionicons
              name="arrow-back"
              size={isTablet ? 34 : 24}
              color="#000"
            />
          </TouchableOpacity>
          <Image
            source={require("../../assets/Bank.jpg")}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>Add Bank Account Details</Text>

          <Input label="Bank Name" value={bankName} onChangeText={setBankName} />
          <Input
            label="Account Number (15 digits)"
            value={accountNumber}
            keyboardType="numeric"
            onChangeText={(t) => /^\d*$/.test(t) && setAccountNumber(t)}
          />
          {!validateAccount() && accountNumber.length > 0 && (
            <Error text="Account number must be exactly 15 digits" />
          )}

          <Input
            label="IFSC Code"
            value={ifsc}
            maxLength={11}
            autoCapitalize="characters"
            onChangeText={(t) => setIfsc(t.toUpperCase())}
          />
          {!validateIFSC() && ifsc.length > 0 && (
            <Error text="IFSC must be like ABCD0XXXXXX" />
          )}

          <Input
            label="Account Holder Name"
            value={holder}
            onChangeText={setHolder}
          />
          <Input
            label="Branch Name"
            value={branch}
            onChangeText={setBranch}
          />

          <Text style={styles.label}>Account Type</Text>
          <View style={styles.row}>
            {["SAVINGS", "CURRENT"].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeBtn,
                  accountType === t && styles.typeActive,
                ]}
                onPress={() => setAccountType(t)}
              >
                <Text
                  style={[
                    styles.typeText,
                    accountType === t && { color: "#fff" },
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: hp("12%") }} />
        </ScrollView>

        {/* FIXED BUTTON */}
        <View style={styles.fixedButton}>
          <TouchableOpacity
            style={[styles.button, !allValid && styles.buttonDisabled]}
            disabled={!allValid || loading}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Add Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* SUCCESS MODAL */}
      <Modal transparent visible={successModal} animationType="fade">
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
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/* -------- SMALL COMPONENTS -------- */
const Input = ({ label, ...props }) => (
  <View style={{ marginTop: 18 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

const Error = ({ text }) => (
  <Text style={{ color: "red", fontSize: wp("3.2%") }}>{text}</Text>
);

/* -------- STYLES -------- */
const styles = StyleSheet.create({
  container: { padding: wp("7%"), backgroundColor: "#fff" },
  image: { width: wp("90%"), height: hp("25%"), alignSelf: "center" },
  title: { fontSize: wp("5.5%"), fontWeight: "700", textAlign: "center" },
  label: { fontSize: wp("3.6%"), marginBottom: hp("0.8%") },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp("3%"),
    padding: wp("4%"),
  },
  row: { flexDirection: "row", gap: wp("3%") },
  typeBtn: {
    borderWidth: 1,
    borderColor: "#3D63FF",
    padding: wp("3%"),
    borderRadius: wp("6%"),
  },
  typeActive: { backgroundColor: "#3D63FF" },
  typeText: { color: "#000" },
  button: {
    backgroundColor: "#3D63FF",
    padding: hp("2%"),
    borderRadius: wp("8%"),
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#9BB4FF" },
  btnText: { color: "#fff", fontSize: wp("4.2%"), fontWeight: "600" },
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
  okText: { color: "#fff", fontSize: wp("4%") },
});
