import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useAuth } from "../../hooks/useAuth";

export default function PersonalInfoScreen({ navigation }) {
  const { authToken } = useAuth();

  // FORM DATA
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
    gender: "",
  });

  // UI states for mobile fields
  const [mobileDigits, setMobileDigits] = useState("");
  const [altDigits, setAltDigits] = useState("");

  // DOB
  const [isModalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const formatDate = (d) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleConfirm = (selectedDate) => {
    setModalVisible(false);
    setDate(selectedDate);
    handleChange("dob", formatDate(selectedDate));
  };
  const handleCancel = () => setModalVisible(false);

  const handleChange = (field, value) =>
    setFormData((f) => ({ ...f, [field]: value }));

  // helper
  const extractDigits = (s = "") => String(s).replace(/\D/g, "");

  const setMobileValue = (digits) => {
    setMobileDigits(digits);
    handleChange("primaryPhone", digits);
  };
  const setAltValue = (digits) => {
    setAltDigits(digits);
    handleChange("secondaryPhone", digits);
  };

  // VALIDATIONS
  const validateName = (fullName) => {
    if (!fullName) return "Name is required";
    return (/^[A-Za-z\s]*$/).test(fullName) ? "" : "only alphabets are allowed";
  };
  const validateDOB = (dob) => {
    if (!dob) return "Date of birth is required";
    return "";
  };
  const validateGender = (gender) => {
    if (!gender) return "Gender is required";
    return "";
  };
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? "" : "Enter a valid email address";
  };
  const validateMobile = (primaryPhone) => {
    if (!primaryPhone) return "Mobile number is required";
    return primaryPhone.length === 10
      ? ""
      : "Enter a valid 10-digit mobile number";
  };
  const validateAlternativeMobile = (secondaryPhone) => {
    if (!secondaryPhone) return "Alternative Mobile number is required";
    return secondaryPhone.length === 10
      ? ""
      : "Enter a valid 10-digit alternative mobile number";
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.fullName = validateName(formData.fullName);
    newErrors.dob = validateDOB(formData.dob);
    newErrors.email = validateEmail(formData.email);
    newErrors.primaryPhone = validateMobile(formData.primaryPhone);
    newErrors.secondaryPhone = validateAlternativeMobile(formData.secondaryPhone);
    newErrors.gender = validateGender(formData.gender);

    // Prevent same number
    if (
      formData.primaryPhone.length === 10 &&
      formData.secondaryPhone.length === 10 &&
      formData.primaryPhone === formData.secondaryPhone
    ) {
      newErrors.secondaryPhone =
        "Alternative number cannot be same as mobile number";
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  // helper
  const formatDobForApi = (ddmmyyyy = "") => {
    if (!ddmmyyyy) return "";
    const parts = ddmmyyyy.split("-");
    if (parts.length !== 3) return ddmmyyyy;
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm}-${dd}`;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const payload = {
      fullName: formData.fullName,
      dob: formatDobForApi(formData.dob),
      gender: formData.gender,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      email: formData.email,
    };
    console.log("submit", payload);

    setLoading(true);
    try {
      const res = await fetch(
        "https://delivarypartner.onrender.com/api/rider/personal-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => ({}));
      console.log("STATUS:", res.status);
      console.log("BODY:", json);
      if (res.ok) {
        console.log("Details uploaded successfully");
        navigation.navigate("FaceInstructionScreen");
      } else {
        console.log("Error");
      }
    } catch (err) {
      console.log("error in fetch ", err);
    } finally {
      setLoading(false);
    }
  };


  const isFormValid =
    formData.fullName.trim().length > 0 &&
    formData.dob.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.primaryPhone.trim().length > 0 &&
    formData.secondaryPhone.trim().length > 0 &&
    formData.gender.trim().length > 0;


  // RADIO BUTTON
  const GenderRadio = ({ value, label }) => {
    const selected = formData.gender === value;
    return (
      <TouchableOpacity
        onPress={() => handleChange("gender", value)}
        style={{ flexDirection: "row", alignItems: "center", gap: hp('0.7%'), }}
      >
        <Ionicons
          name={selected ? "radio-button-on" : "radio-button-off"}
          color={selected ? "black" : 'grey'}
          size={22}
        />
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  };

  const isAndroid = Platform.OS === "android";


  // STYLING
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: hp("6%"),
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          <View>
            {/* HEADER */}
            <View
              style={{
                flexDirection: "row",
                alignItems: 'center',
                gap: wp('17%'),
                marginTop: hp("5%"),
                marginLeft: wp("4%"),
                position: 'relative'
              }}
            >
              {/* BACK BUTTON */}
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back-outline"
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
              {/* HEADING */}
              <Text style={{ fontSize: wp('5%'), fontWeight: "700" }}>
                Personal Information
              </Text>
            </View>

            <Text style={{
              fontSize: wp('4%'), fontWeight: '400', marginTop: hp("3.5%"),
              marginLeft: wp("8%"), marginRight: wp('10%')
            }}>
              Enter the details below so we can get to know and serve you better.
            </Text>


            <View
              style={{
                flex: 1,
                marginTop: hp("3%"),
                marginLeft: wp("6%"),
              }}
            >
              {/* USER NAME */}
              <Text style={{ marginBottom: hp('0.6%'), fontWeight: "500" }}>
                User Name
              </Text>
              <TextInput
                placeholder="enter your name"
                placeholderTextColor={"#888"}
                value={formData.fullName}
                onChangeText={(text) => handleChange("fullName", text)}
                style={{
                  borderWidth: 1,
                  borderRadius: wp('2.5%'),
                  borderColor: 'grey',
                  marginBottom: hp('2.2%'),
                  width: wp("90%"),
                  paddingVertical: hp('1.2%'),
                  paddingHorizontal: wp('2.5%'),
                }}
              />
              {errors.fullName ? (
                <Text style={{ color: "red", marginBottom: hp('1.2%') }}>
                  {errors.fullName}
                </Text>
              ) : null}

              {/* DOB */}
              <Text style={{ marginBottom: hp('0.6%'), fontWeight: "500" }}>
                Date of Birth
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  borderWidth: 1,
                  borderColor: 'grey',
                  paddingVertical: hp('1.2%'),
                  paddingHorizontal: wp('3%'),
                  borderRadius: wp('2.5%'),
                  width: wp("90%"),
                  marginBottom: hp('2.2%'),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: formData.dob ? "#000" : "#888",
                    flex: 1,
                    marginRight: wp('2%'),
                  }}
                >
                  {formData.dob ? formData.dob : "DD-MM-YYYY"}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color="#444"
                  style={{ marginLeft: wp('1%') }}
                />
              </TouchableOpacity>
              {errors.dob ? (
                <Text style={{ color: "red", marginBottom: hp('1.2%') }}>
                  {errors.dob}
                </Text>
              ) : null}

              <DateTimePickerModal
                isVisible={isModalVisible}
                mode="date"
                maximumDate={new Date()}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />

              {/* MOBILE NO. */}
              <Text style={{ marginBottom: hp('0.6%'), fontWeight: "500" }}>
                Mobile Number
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: wp('2.5%'),
                  borderColor: 'grey',
                  width: wp("90%"),
                  marginBottom: hp('2.2%'),
                  overflow: "hidden",
                }}
              >
                <Text
                  style={{
                    paddingVertical: hp('1.2%'),
                    paddingHorizontal: wp('3%'),
                    backgroundColor: "#f3f3f3",
                    borderRightWidth: 1,
                    borderRightColor: "#eee",
                  }}
                >
                  +91
                </Text>

                <TextInput
                  placeholder="enter mobile number"
                  placeholderTextColor="#888"
                  value={mobileDigits}
                  onChangeText={(text) => {
                    let digits = extractDigits(text);
                    if (digits.length > 10) digits = digits.slice(-10);
                    if (digits.length > 10) return;
                    setMobileValue(digits);
                  }}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={{
                    flex: 1,
                    paddingVertical: hp('1.2%'),
                    paddingHorizontal: wp('3%'),
                    color: "black",

                  }}
                />
              </View>
              {errors.primaryPhone ? (
                <Text style={{ color: "red", marginBottom: hp('1.2%') }}>
                  {errors.primaryPhone}
                </Text>
              ) : null}

              {/* ALTERNATIVE MOBILE NO. */}
              <Text style={{ marginBottom: hp('0.6%'), fontWeight: "500" }}>
                Alternative Mobile Number
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: wp('2.5%'),
                  borderColor: 'grey',
                  width: wp("90%"),
                  marginBottom: hp('2.2%'),
                  overflow: "hidden",
                }}
              >
                <Text
                  style={{
                    paddingVertical: hp('1.2%'),
                    paddingHorizontal: wp('3%'),
                    backgroundColor: "#f3f3f3",
                    borderRightWidth: 1,
                    borderRightColor: "#eee",
                  }}
                >
                  +91
                </Text>

                <TextInput
                  placeholder="enter alternative mobile number"
                  placeholderTextColor="#888"
                  value={altDigits}
                  onChangeText={(text) => {
                    let digits = extractDigits(text);
                    if (digits.length > 10) digits = digits.slice(-10);
                    if (digits.length > 10) return;
                    setAltValue(digits);
                  }}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={{
                    flex: 1,
                    paddingVertical: hp('1.2%'),
                    paddingHorizontal: wp('3%'),
                    color: "black",
                  }}
                />
              </View>
              {errors.secondaryPhone ? (
                <Text style={{ color: "red", marginBottom: hp('1.2%') }}>
                  {errors.secondaryPhone}
                </Text>
              ) : null}

              {/* MAIL ID */}
              <Text style={{ marginBottom: hp('0.6%'), fontWeight: "500" }}>
                Email Id
              </Text>
              <TextInput
                placeholder="e.g., xyz@gmail.com"
                placeholderTextColor={"#888"}
                value={formData.email}
                onChangeText={(text) =>
                  handleChange("email", text.toLowerCase())
                }
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: 'grey',
                  marginBottom: 18,
                  width: wp("90%"),
                  paddingVertical: hp('1.2%'),
                  paddingHorizontal: wp('2.5%'),

                }}
              />
              {errors.email ? (
                <Text style={{ color: "red", marginBottom: hp('1.2%') }}>
                  {errors.email}
                </Text>
              ) : null}

              {/* GENDER */}
              <Text style={{ marginBottom: hp('1.2%'), fontWeight: "500" }}>
                Gender
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: wp("13.3%"),
                  marginBottom: hp('1.2%'),
                }}
              >
                <GenderRadio value="male" label="Male" />
                <GenderRadio value="female" label="Female" />
              </View>
              {errors.gender ? (
                <Text style={{ color: "red", marginBottom: hp('1.2%') }}>
                  {errors.gender}
                </Text>
              ) : null}
            </View>
          </View>

          {/* SUBMIT BUTTON */}
          <View
            style={{
              alignItems: "center",
              marginTop: hp('10%')
            }}>
            <TouchableOpacity
              style={{
                alignSelf: "center",
                backgroundColor: isFormValid ? '#0CBACE' : '#aee2e8ff',
                paddingVertical: hp("1.5%"),
                borderRadius: wp('6%'),
                width: wp("60%"),

              }}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: wp('5%'),
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
}