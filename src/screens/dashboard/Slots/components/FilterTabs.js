import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../styles';

export default function FilterTabs({ filters, active, onChange }) {
  return (
    <View style={styles.tabsRow}>
      {filters.map(f => (
        <TouchableOpacity
          key={f}
          style={[styles.tab, active === f && styles.tabActive]}
          onPress={() => onChange(f)}
        >
          <Text
            style={[
              styles.tabText,
              active === f && styles.tabTextActive,
            ]}
          >
            {f}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
