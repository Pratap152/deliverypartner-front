import React, { memo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/**
 * CountdownTimer Component
 * Displays a countdown timer with color-coded progress bar
 * 
 * @param {number} seconds - Remaining seconds
 * @param {number} totalSeconds - Total countdown duration
 */
const CountdownTimer = ({ seconds, totalSeconds = 60 }) => {
    const progressAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Update progress bar
        const progress = seconds / totalSeconds;
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 200,
            useNativeDriver: false,
        }).start();

        // Pulse animation when time is low
        if (seconds <= 5 && seconds > 0) {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [seconds]);

    const getColor = () => {
        if (seconds > 10) return '#00B26F'; // Green
        if (seconds > 5) return '#FFA500'; // Orange
        return '#FF4B4B'; // Red
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.timerRow}>
                <Text style={styles.label}>⏱️ Time Left</Text>
                <Animated.Text
                    style={[
                        styles.timeText,
                        {
                            color: getColor(),
                            transform: [{ scale: pulseAnim }]
                        }
                    ]}
                >
                    {seconds}s
                </Animated.Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
                <Animated.View
                    style={[
                        styles.progressFill,
                        {
                            backgroundColor: getColor(),
                            width: progressWidth,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

export default memo(CountdownTimer);

const styles = StyleSheet.create({
    container: {
        marginBottom: hp('2%'),
    },
    timerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    label: {
        fontSize: wp('3.5%'),
        fontWeight: '600',
        color: '#6B6B6B',
    },
    timeText: {
        fontSize: wp('5%'),
        fontWeight: '800',
    },
    progressBar: {
        height: hp('0.8%'),
        backgroundColor: '#E5E7EB',
        borderRadius: hp('0.4%'),
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: hp('0.4%'),
    },
});
