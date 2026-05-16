import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import DeviceInfo from "react-native-device-info";

const isTablet = DeviceInfo.isTablet();

const OTPInputBox = ({ otp, inputRefs, handleChange, handleKeyPress, length = 6 }) => {
  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={index === 0 ? 6 : 1}
          style={[styles.otpBox, digit && styles.otpBoxFilled]}
          
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: rh(2.5),
    marginBottom: rh(3),
  },

  otpBox: {
    width: isTablet ? 60 : rw(12),
    height: isTablet ? 60 : rh(6),
    borderWidth: 1.2,
    borderColor: "#A5A5A5",
    borderRadius: isTablet ? 12 : rw(2),
    fontSize: isTablet ? 24 : rf(2.8),
    textAlign: "center",
    backgroundColor: "#fff",
  },

  otpBoxFilled: {
    borderColor: "#16C2D5",
    backgroundColor: "#E8FCFF",
  },
});

export default OTPInputBox;
