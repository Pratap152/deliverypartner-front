import React, { useRef } from 'react';
import { Pressable, Animated } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';

export default function PremiumPressable({ children, onPress }) {

  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();

    HapticFeedback.trigger('impactLight');
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
