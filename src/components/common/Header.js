import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../utils/colors';
import { useNavigation } from '@react-navigation/native';

// eslint-disable-next-line react/prop-types
const Header = ({ text }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
      onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" color={COLORS.textPrimary} size={25} />
      </TouchableOpacity>
      {text && (
        <>
          <Text style={styles.headerTitle}>{text}</Text>
          <View style={{ width: 25 }} />
        </>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
