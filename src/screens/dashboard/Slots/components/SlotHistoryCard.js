import React from 'react';
import { View, Text } from 'react-native';

export default function SlotHistoryCard({ slot }) {
  return (
    <View>
      <Text>
        {slot.date} • {slot.startTime} - {slot.endTime}
      </Text>
    </View>
  );
}
