import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, PanResponder, ActivityIndicator } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SWIPE_WIDTH = wp("87%");
const TRACK_HEIGHT = hp("7.5%");
const THUMB_SIZE = hp("6.5%");
const MAX_SWIPE = SWIPE_WIDTH - THUMB_SIZE;

const SwipeOnlineToggle = ({
  onSwipeOnline,
  onSwipeOffline,
  isOnline,
  isLoading = false,
}) => {
  const translateX = useRef(
    new Animated.Value(isOnline ? MAX_SWIPE : 0)
  ).current;

  const startX = useRef(0);

  // Use refs to track current values (fixes stale closure issue)
  const isOnlineRef = useRef(isOnline);
  const isLoadingRef = useRef(isLoading);
  const onSwipeOnlineRef = useRef(onSwipeOnline);
  const onSwipeOfflineRef = useRef(onSwipeOffline);

  // Keep refs in sync with props
  useEffect(() => {
    isOnlineRef.current = isOnline;
    console.log("🔄 SwipeOnlineToggle: isOnline updated to", isOnline);
  }, [isOnline]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    onSwipeOnlineRef.current = onSwipeOnline;
  }, [onSwipeOnline]);

  useEffect(() => {
    onSwipeOfflineRef.current = onSwipeOffline;
  }, [onSwipeOffline]);

  // Sync animation with isOnline state
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOnline ? MAX_SWIPE : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOnline]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        // Disable gestures while loading
        if (isLoadingRef.current) return false;
        return Math.abs(g.dx) > 5;
      },

      onPanResponderGrant: () => {
        if (isLoadingRef.current) return;
        startX.current = translateX.__getValue();
      },

      onPanResponderMove: (_, g) => {
        if (isLoadingRef.current) return;
        let newX = startX.current + g.dx;
        newX = Math.max(0, Math.min(MAX_SWIPE, newX));
        translateX.setValue(newX);
      },

      onPanResponderRelease: () => {
        if (isLoadingRef.current) return;

        const finalX = translateX.__getValue();
        const currentIsOnline = isOnlineRef.current;

        console.log("👆 SwipeOnlineToggle: Release - finalX:", finalX, "currentIsOnline:", currentIsOnline);

        if (finalX > MAX_SWIPE / 2) {
          Animated.timing(translateX, {
            toValue: MAX_SWIPE,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            console.log("👆 SwipeOnlineToggle: Swipe completed to RIGHT");
            if (!currentIsOnline) {
              console.log("👆 SwipeOnlineToggle: Calling onSwipeOnline()");
              onSwipeOnlineRef.current?.();
            }
          });
        } else {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            console.log("👆 SwipeOnlineToggle: Swipe completed to LEFT");
            if (currentIsOnline) {
              console.log("👆 SwipeOnlineToggle: Calling onSwipeOffline()");
              onSwipeOfflineRef.current?.();
            }
          });
        }
      },
    })
  ).current;

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.label,
          { color: isOnline ? "#16A34A" : "#9CA3AF" },
        ]}
      >
        {isLoading
          ? (isOnline ? "Going Offline..." : "Going Online...")
          : (isOnline ? "Swipe For Offline" : "Swipe For Online")}
      </Text>

      <View style={styles.track}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#16A34A" />
          </View>
        ) : (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.thumb,
              {
                backgroundColor: isOnline ? "#B7F7C2" : "#E5E7EB",
                transform: [{ translateX }],
              },
            ]}
          >
            <Text style={styles.arrow}>
              {isOnline ? "<<" : ">>"}
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default SwipeOnlineToggle;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: hp("4%"),
    alignItems: "center",
  },
  label: {
    position: "absolute",
    zIndex: 1,
    fontSize: hp("2.2%"),
    marginTop: hp("2%"),
    fontWeight: "600",
  },
  track: {
    width: SWIPE_WIDTH,
    height: TRACK_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: hp("1.2%"),
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: hp("1.2%"),
    justifyContent: "center",
    alignItems: "center",
    margin: wp("0.8%"),
  },
  arrow: {
    fontSize: hp("3%"),
    fontWeight: "900",
    color: "#16A34A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

