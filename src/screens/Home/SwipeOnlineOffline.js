import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
} from "react-native";

const CONTAINER_WIDTH = 260;
const CONTAINER_HEIGHT = 56;
const THUMB_SIZE = 52;
const PADDING = 2;

const MAX_TRANSLATE =
  CONTAINER_WIDTH - THUMB_SIZE - PADDING * 2;
const THRESHOLD = MAX_TRANSLATE / 2;

const SwipeOnlineOffline = ({ isOnline, setIsOnline }) => {
  const translateX = useRef(
    new Animated.Value(isOnline ? MAX_TRANSLATE : 0)
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        // OFFLINE → ONLINE (Swipe Right)
        if (!isOnline && gesture.dx > 0) {
          translateX.setValue(
            Math.min(gesture.dx, MAX_TRANSLATE)
          );
        }

        // ONLINE → OFFLINE (Swipe Left)
        if (isOnline && gesture.dx < 0) {
          translateX.setValue(
            Math.max(MAX_TRANSLATE + gesture.dx, 0)
          );
        }
      },

      onPanResponderRelease: (_, gesture) => {
        // Go ONLINE
        if (!isOnline && gesture.dx > THRESHOLD) {
          Animated.timing(translateX, {
            toValue: MAX_TRANSLATE,
            duration: 200,
            useNativeDriver: false,
          }).start(() => setIsOnline(true));

        // Go OFFLINE
        } else if (
          isOnline &&
          Math.abs(gesture.dx) > THRESHOLD
        ) {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start(() => setIsOnline(false));

        // RESET (Not enough swipe)
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
        styles.swipeContainer,
        { backgroundColor: isOnline ? "#2ECC71" : "#EAEAEA" },
      ]}
    >
      <Text
        style={[
          styles.swipeLabel,
          { color: isOnline ? "#FFFFFF" : "#999999" },
        ]}
      >
        {isOnline ? "Swipe For Offline" : "Swipe For Online"}
      </Text>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.swipeThumb,
          { transform: [{ translateX }] },
        ]}
      >
        <Text style={styles.thumbIcon}>
          {isOnline ? "⏪" : "⏩"}
        </Text>
      </Animated.View>
    </View>
  );
};

export default SwipeOnlineOffline;
const styles = StyleSheet.create({
  swipeContainer: {
    width: CONTAINER_WIDTH, // 🔴 MUST
    height: CONTAINER_HEIGHT,
    borderRadius: CONTAINER_HEIGHT / 2,
    justifyContent: "center",
    padding: PADDING,
    marginBottom: 16,
    overflow: "hidden",
  },

  swipeLabel: {
    position: "absolute",
    alignSelf: "center",
    fontWeight: "600",
    fontSize: 14,
  },

  swipeThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  thumbIcon: {
    fontSize: 18,
  },
});
