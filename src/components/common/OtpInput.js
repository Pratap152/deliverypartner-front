/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { COLORS } from '../../utils/colors';

const OtpInput = ({
  otp,
  error,
  inputRefs,
  onChange,
  onKeyPress,
  handlePress,
}) => {
  return (
    <View style={styles.inputsContainer}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          ref={input => {
            inputRefs.current[index] = input;
          }}
          value={otp[index]}
          onChangeText={value => onChange(value, index)}
          onKeyPress={e => onKeyPress(e, index)}
          onPress={() => handlePress(index)}
          style={[
            styles.input,
            otp[index] && styles.activeBorder,
            inputRefs.current[index]?.isFocused() || index === 0
              ? styles.activeBorder
              : '',
            error && styles.errroBorder,
          ]}
        />
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  inputsContainer: {
    width: 348,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 40,
  },

  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.border,
    textAlign: 'center',
    fontFamily: 'Radio Canada',
    fontSize: 18,
    fontWeight: '400',
  },
  activeBorder: {
    borderColor: COLORS.primary,
  },
  errroBorder: {
    borderColor: COLORS.error,
  },
});
