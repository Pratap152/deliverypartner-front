import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import colors from '../../../../utils/colors';

export default function DaySelector({ data, selectedDate, onSelect }) {
  if (!data?.length) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
        {data.map(day => {
          const active = selectedDate === day.date;

          return (
            <TouchableOpacity
              key={day.date}
              onPress={() => onSelect(day.date)}
              style={{
                backgroundColor: active ? colors.primary : colors.white,
                borderRadius: 12,
                padding: 12,
                marginRight: 10,
                alignItems: 'center',
                minWidth: 60,
              }}
            >
              <Text style={{ color: active ? colors.white : colors.black }}>
                {day.dayName}
              </Text>
              <Text
                style={{
                  color: active ? colors.white : colors.gray,
                  fontSize: 12,
                }}
              >
                {day.date.split('-')[2]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
