import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const PrimaryButton = ({
  title,
  onPress,
  bgColor = '#00B5CC',
  textColor = '#fff',
  width = responsiveWidth(90),
  loading = false,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: bgColor, width: width, opacity: disabled ? 0.6 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(4),
    alignSelf: 'center',
    marginVertical: responsiveHeight(2),
  },

  text: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: '700',
  },
});
