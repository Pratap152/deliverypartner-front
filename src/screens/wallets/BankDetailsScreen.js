import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import axios from "axios";
import WEBSITE_URL from "../../utils/host";

export default function AddBankDetailsScreen() {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holder, setHolder] = useState("");

  const [touched, setTouched] = useState({
    bankName: false,
    accountNumber: false,
    ifsc: false,
    holder: false,
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------------- VALIDATIONS ---------------- */
  const validateBank = (t) =>
    !t.trim()
      ? "Bank name required"
      : !/^(?!.*\s{2,})[A-Za-z ]{3,50}$/.test(t)
      ? "Enter valid bank name"
      : "";

  const validateAccount = (t) =>
    !t.trim()
      ? "Account number required"
      : !/^\d{9,18}$/.test(t)
      ? "Account number must be 9–18 digits"
      : "";

const validateIFSC = (t) => {
  if (!t.trim()) return "IFSC code is required";

  if (t.length < 11)
    return "IFSC must be 11 characters";

  if (!/^[A-Z]{4}/.test(t))
    return "First 4 characters must be letters";

  if (t[4] !== "0")
    return "5th character must be 0";

  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(t))
    return "Last 6 characters must be letters or numbers";

  return "";
};

  const validateHolder = (t) =>
    !t.trim()
      ? "Account holder name required"
      : !/^(?!.*\s{2,})[A-Za-z ]{3,50}$/.test(t)
      ? "Enter valid name"
      : "";

  /* ---------------- LIVE VALIDATION ---------------- */
  useEffect(() => {
    if (touched.bankName)
      setError((e) => ({ ...e, bankName: validateBank(bankName) }));
  }, [bankName, touched.bankName]);

  useEffect(() => {
    if (touched.accountNumber)
      setError((e) => ({
        ...e,
        accountNumber: validateAccount(accountNumber),
      }));
  }, [accountNumber, touched.accountNumber]);

  useEffect(() => {
    if (touched.ifsc)
      setError((e) => ({ ...e, ifsc: validateIFSC(ifsc) }));
  }, [ifsc, touched.ifsc]);

  useEffect(() => {
    if (touched.holder)
      setError((e) => ({ ...e, holder: validateHolder(holder) }));
  }, [holder, touched.holder]);

  /* ---------------- FINAL CHECK ---------------- */
  const allValid =
    !validateBank(bankName) &&
    !validateAccount(accountNumber) &&
    !validateIFSC(ifsc) &&
    !validateHolder(holder);


  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!allValid) return;

    setLoading(true);
    try { 
      const response = await axios.post(
  `${WEBSITE_URL}/api/bank/bank-details`,
  {
    bankName,
    accountHolderName: holder,
    accountNumber,
    ifscCode: ifsc,
  },
  {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjk0NGYyZjE3OWYwYjY0Y2I5NTMzMjA0IiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2NjEyNjMyOCwiZXhwIjoxNzY2MTI3MjI4fQ.mEtF1flRl00yTPTFb9S9nKX0Ol_dUWsQJHRGeq63XEY",
    },
  }
);

           Alert.alert("Success", "Bank details added successfully"); } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../../assets/Bank.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Add Bank Account Details</Text>

        <InputField
          label="Bank Name"
          value={bankName}
          onChangeText={(t) =>
            setBankName(t.replace(/[^A-Za-z ]/g, "").replace(/\s{2,}/g, " "))
          }
          onBlur={() => setTouched((p) => ({ ...p, bankName: true }))}
          error={error.bankName}
          touched={touched.bankName}
        />

        <InputField
          label="Account Number"
          value={accountNumber}
          keyboardType="numeric"
          onChangeText={(t) => setAccountNumber(t.replace(/\D/g, ""))}
          onBlur={() => setTouched((p) => ({ ...p, accountNumber: true }))}
          error={error.accountNumber}
          touched={touched.accountNumber}
        />

        <InputField
  label="IFSC Code"
  value={ifsc}
  maxLength={11}
  autoCapitalize="characters"
  onChangeText={(t) =>
    setIfsc(t.replace(/[^A-Za-z0-9]/g, "").toUpperCase())
  }
  onBlur={() => setTouched((p) => ({ ...p, ifsc: true }))}
  error={error.ifsc}
  touched={touched.ifsc}
/>


        <InputField
          label="Account Holder Name"
          value={holder}
          onChangeText={setHolder}
          onBlur={() => setTouched((p) => ({ ...p, holder: true }))}
          error={error.holder}
          touched={touched.holder}
        />

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------- INPUT FIELD ---------------- */
const InputField = ({ label, error, touched, ...props }) => (
  <View style={{ marginTop: 18 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
    {touched && !!error && (
      <Text style={styles.error}>{error}</Text>
    )}
  </View>
);

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { padding: 30, backgroundColor: "#fff" },
  image: { width: "90%", height: 200, alignSelf: "center" },
  title: { fontSize: 22, fontWeight: "700", marginTop: 20, textAlign: "center" },
  label: { fontSize: 14, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
  },
  error: { color: "red", fontSize: 12, marginTop: 5 },
  button: {
    backgroundColor: "#3D63FF",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 100,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#9BB4FF" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
