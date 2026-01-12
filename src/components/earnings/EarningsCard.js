import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../utils/colors';
import { radius } from '../../utils/radius';
import { spacing } from '../../utils/spacing';
import { typography } from '../../utils/typography';

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
