import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { spacing } from '../../utils/spacing';
import { colors } from '../../utils/colors';

export const ListRow = ({ title, amount, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderColor: colors.divider,
    }}>
      <Text>{title}</Text>
      <Text style={{ color: colors.success }}>₹{amount}</Text>
    </View>
  </TouchableOpacity>
);
