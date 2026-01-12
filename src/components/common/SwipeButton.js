import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const BUTTON_HEIGHT = hp('7%');
const BUTTON_WIDTH = wp('90%');
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 10;
const H_SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

const SwipeButton = ({ onSwipeSuccess, title = 'Swipe to Confirm' }) => {
    const [toggled, setToggled] = useState(false);
    const pan = useRef(new Animated.ValueXY()).current;
    const [complete, setComplete] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
                });
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx > 0 && gestureState.dx < H_SWIPE_RANGE) {
                    pan.x.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < H_SWIPE_RANGE - 50) {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                } else {
                    Animated.spring(pan, {
                        toValue: { x: H_SWIPE_RANGE, y: 0 },
                        useNativeDriver: false,
                    }).start(() => {
                        setToggled(true);
                        setComplete(true);
                        onSwipeSuccess();
                    });
                }
            },
        })
    ).current;
    const animatedBgColor = pan.x.interpolate({
        inputRange: [0, H_SWIPE_RANGE],
        outputRange: ['#D8FBFF', '#5cceebff'], // light → dark blue
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.swipeable,
                    { backgroundColor: animatedBgColor },
                ]}
            >

                <Text style={styles.text}>{complete ? 'Completed' : title}</Text>
                <Animated.View
                    style={[
                        styles.circle,
                        {
                            transform: [{ translateX: pan.x }],
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <Text style={styles.arrow}>➡</Text>
                </Animated.View>
            </Animated.View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    swipeable: {
        backgroundColor: '#D8FBFF', 
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    text: {
        color: 'black',
        fontSize: wp('4%'),
        fontWeight: '600',
        zIndex: 1,
    },
    circle: {
        width: SWIPEABLE_DIMENSIONS,
        height: SWIPEABLE_DIMENSIONS,
        borderRadius: SWIPEABLE_DIMENSIONS / 2,
        backgroundColor: '#5cceebff',
        position: 'absolute',
        left: 5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        elevation: 3,
    },
    arrow: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default SwipeButton;
