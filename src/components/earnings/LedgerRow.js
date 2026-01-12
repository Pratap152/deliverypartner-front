import React from 'react';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { View, Text } from 'react-native';
import { spacing, colors } from '../../../theme';

export const LedgerRow = ({ title, subtitle, amount }) => (
  <Animated.View entering={FadeInRight}>
    <View style={{
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderColor: colors.divider,
    }}>
      <Text>{title}</Text>
      <Text style={{ color: colors.muted }}>{subtitle}</Text>
      <Text style={{ color: colors.success }}>₹{amount}</Text>
    </View>
  </Animated.View>
);
