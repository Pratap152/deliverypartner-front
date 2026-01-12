import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing, radius, typography } from '../../../theme';

export const EarningsCard = ({ title, amount }) => (
  <View style={{
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  }}>
    <Text style={{ color: '#fff' }}>{title}</Text>
    <Text style={[typography.amount, { color: '#fff' }]}>
      ₹{amount}
    </Text>
  </View>
);
