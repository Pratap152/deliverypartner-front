import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import colors from '../../../../utils/colors';

export default function WeekSwitcher({ week, onChange }) {
  return (
    <View style={{ flexDirection: 'row', padding: 16 }}>
      {['CURRENT', 'NEXT'].map(w => (
        <TouchableOpacity
          key={w}
          onPress={() => onChange(w)}
          style={{
            flex: 1,
            backgroundColor: week === w ? colors.primary : colors.lightGray,
            padding: 12,
            borderRadius: 20,
            marginHorizontal: 6,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: week === w ? colors.white : colors.black }}>
            {w === 'CURRENT' ? 'Current Week' : 'Next Week'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
