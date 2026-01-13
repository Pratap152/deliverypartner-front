import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SwipeAction = ({ label, onSwipeSuccess, backgroundColor }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx > 0 && gesture.dx < wp('65%')) {
          translateX.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > wp('55%')  ) { 
          onSwipeSuccess();
        }
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.thumb, { transform: [{ translateX }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp('7%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    paddingHorizontal: wp('3%'),
  },
  label: {
    textAlign: 'center',
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  thumb: {
    position: 'absolute',
    left: wp('2%'),
    height: hp('5.5%'),
    width: hp('5.5%'),
    borderRadius: hp('3%'),
    backgroundColor: '#fff',
  },
});

export default React.memo(SwipeAction);
