import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, PanResponder } from "react-native";

const CONTAINER_WIDTH = 280;
const THUMB_SIZE = 52;
const MAX_TRANSLATE = CONTAINER_WIDTH - THUMB_SIZE - 4;
const SWIPE_THRESHOLD = MAX_TRANSLATE * 0.7;

export default function SwipeToggle({ isOnline, onToggle }) {
  const translateX = useRef(new Animated.Value(0)).current;

  // Sync thumb when state changes
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOnline ? MAX_TRANSLATE : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOnline]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,

      onPanResponderMove: (_, gesture) => {
        let newX = isOnline
          ? MAX_TRANSLATE + gesture.dx
          : gesture.dx;

        newX = Math.max(0, Math.min(newX, MAX_TRANSLATE));
        translateX.setValue(newX);
      },

      onPanResponderRelease: (_, gesture) => {
        if (!isOnline && gesture.dx > SWIPE_THRESHOLD) {
          onToggle(true);
        } else if (isOnline && gesture.dx < -SWIPE_THRESHOLD) {
          onToggle(false);
        } else {
          Animated.spring(translateX, {
            toValue: isOnline ? MAX_TRANSLATE : 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isOnline ? "#2ECC71" : "#EAEAEA" },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: isOnline ? "#fff" : "#888" },
        ]}
      >
        {isOnline ? "Swipe to go Offline" : "Swipe to go Online"}
      </Text>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.thumb,
          { transform: [{ translateX }] },
        ]}
      >
        <Text style={styles.icon}>
          {isOnline ? "⏪" : "⏩"}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    height: 56,
    borderRadius: 30,
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
    padding: 2,
  },
  label: {
    position: "absolute",
    alignSelf: "center",
    fontWeight: "600",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  icon: {
    fontSize: 18,
  },
});
