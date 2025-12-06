import React, { useState } from 'react';
import BGImage from '../../assets/Ellipse.png';
import vega_partner from '../../assets/vega_partner.png';
import WEBSITE_URL from "../../utils/host";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CURVE_TOP = '#FFFFFFF5';
const CURVE_BOTTOM = '#CDF5E7';
const BUTTON_BLUE = '#16C2D5';

// const BASE_URL = "https://delivarypartner.onrender.com";  // <-- change to your backend URL

export const sendOTPApi = async (phone) => {
    console.log("📤 Sending OTP to:", phone);
  try {
    const response = await fetch(`${WEBSITE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({
        phone: phone
      }),
    });

    const data = await response.json();
    console.log(data)
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, data: { message: "Something went wrong" }};
  }
};


const LoginEntryScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState('');
  // ---------------------------
  // MOBILE NUMBER VALIDATION
  // ---------------------------
  const validateMobileNumber = (num) => {
    if (num.length === 0) return "";

    if (!/^[0-9]+$/.test(num))
      return "Only numbers are allowed";

    if (num.length !== 10)
      return "Mobile number must be 10 digits";

    if (!/^[6-9]/.test(num))
      return "Mobile number must start with 6, 7, 8 or 9";

    if (/^(\d)\1{9}$/.test(num))
      return "Please enter a valid mobile number";

    if (num === "1234567890" || num === "9876543210")
      return "This number looks invalid";

    return "";
  };

  const handleMobileNumberChange = (text) => {
    const filteredText = text.replace(/[^0-9]/g, '');
    setMobileNumber(filteredText);

    const validationMessage = validateMobileNumber(filteredText);
    setError(validationMessage);
  };
  const handleSendOTP = async () => {
  if (error || mobileNumber.length !== 10 || isSending) return;
  setIsSending(true);
  setError(""); // reset any previous errors

  const result = await sendOTPApi(mobileNumber);
   setIsSending(false);
  if (result.status === 200) {
    navigation.navigate("LoginVerifyScreen", {
      phone: mobileNumber,
    });
  } 
  else if (result.status === 400) {
    setError("Invalid phone number");   // From API
  } 
  else {
    setError("Failed to send OTP. Try again later.");
  }
};


const isButtonDisabled = Boolean(error) || mobileNumber.length !== 10 || !isChecked || isSending;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={false}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <ImageBackground source={BGImage} style={styles.bgImage}>
            <View style={styles.imgWrap}>
              {/* MAIN IMAGE */}
              <Image
                source={vega_partner}
                style={styles.mainImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.tagline}>Be a Zest bot Partner</Text>
            <Text style={styles.title}>Earn a stable daily income</Text>
          </ImageBackground>
          <View style={styles.container}>
            <View style={styles.contentArea}>
              <Text style={styles.inputLabel}>Enter Mobile Number</Text>

              <TextInput
                style={[styles.input, error ? { borderColor: "red" } : {}]}
                value={mobileNumber}
                onChangeText={handleMobileNumberChange}
                placeholder="e.g. 98765 43210"
                placeholderTextColor="#999"        // ⭐ FIX ADDED
                keyboardType="numeric"
                maxLength={10}
              />

              {/* ERROR MESSAGE */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* TERMS CHECKBOX */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  onPress={() => setIsChecked(!isChecked)}
                  style={styles.customCheckbox}
                >
                  {isChecked && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>

                <Text style={styles.termsText}>
                  By signing up I agree to the{' '}
                  <Text style={styles.linkText}>Terms of use</Text> and{' '}
                  <Text style={styles.linkText}>Privacy Policy.</Text>
                </Text>
              </View>

              {/* SEND OTP BUTTON */}
              <TouchableOpacity
                style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={isButtonDisabled}
              >
                <Text style={styles.buttonText}>{isSending ? "Sending..." : "Send OTP"}</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --------------------------- STYLES ---------------------------

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CURVE_BOTTOM },
  container: { flex: 1, backgroundColor: CURVE_BOTTOM },


  bgImage: {
    width: wp("100%"),
    height: hp("62%"),
    alignItems: "center",
  },

  imgWrap: {
    width: wp("100%"),
    alignItems: "center",
  },

  mainImage: {
    width: wp("86%"),
    height: hp("30%"),
    marginTop: hp("15%"),
  },
  contentArea: { paddingHorizontal: 30, marginTop: 10 },

  tagline: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 5,
    marginRight: 140,
  },

  title: {
    fontWeight: '700',
    fontSize: 25,
    marginBottom: 25,
    marginRight: 30,
    marginLeft: 30,
    marginTop: 9,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 25,
  },

  input: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1.3,
    borderColor: '#A5A5A5',
    paddingHorizontal: 15,
    fontSize: 18,
    color: 'black',   // ⭐ visible in dark mode
    marginBottom: 6,
    marginTop: 18,
  },

  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 12,
  },

  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  customCheckbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: BUTTON_BLUE,
    borderRadius: 5,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkMark: { color: BUTTON_BLUE, fontSize: 16, fontWeight: 'bold' },

  termsText: { flex: 1, fontSize: 14, lineHeight: 18 },

  linkText: { color: BUTTON_BLUE, fontWeight: '600' },

  button: {
    backgroundColor: BUTTON_BLUE,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 20,
    elevation: 3,
  },

  buttonDisabled: {
    backgroundColor: '#A2A2A2',
    elevation: 0,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default LoginEntryScreen;
