import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";

import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import DeviceInfo from "react-native-device-info";

const isTablet = DeviceInfo.isTablet();

const OTPInputBox = ({
  otp,
  inputRefs,
  handleChange,
  handleKeyPress,
}) => {
  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref =>
            (inputRefs.current[index] = ref)
          }
          value={digit}
          onChangeText={text =>
            handleChange(text, index)
          }
          onKeyPress={e =>
            handleKeyPress(e, index)
          }
          keyboardType="number-pad"
          maxLength={index === 0 ? 6 : 1}
          style={[
            styles.otpBox,
            digit && styles.otpBoxFilled,
          ]}
          textAlign="center"
          textAlignVertical="center"
          placeholderTextColor="#999"
          selectionColor="#1F3365"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: isTablet ? 16 : 8,
    marginTop: rh(2.5),
    marginBottom: rh(3),
    width: "100%",
  },

  otpBox: {
    width: isTablet ? 95 : rw(12),
    height: isTablet ? 72 : rh(6.2),

    borderWidth: 1.3,
    borderColor: "#A5A5A5",

    borderRadius: isTablet ? 18 : rw(2),

    fontSize: isTablet ? 32 : rf(2.8),

    fontWeight: "600",

    textAlign: "center",
    textAlignVertical: "center",

    paddingVertical: 0,

    color: "#000",

    backgroundColor: "#fff",
  },

  otpBoxFilled: {
    borderColor:"#1F3365",
    backgroundColor: '#F2F4FA',
  },
});

export default OTPInputBox;