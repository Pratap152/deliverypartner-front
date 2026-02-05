import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ErrorCard = ({ message, onRetry }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}>⚠️</Text>
            </View>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>{message || "We couldn't fetch the order details. Please check your connection and try again."}</Text>

            <TouchableOpacity
                style={styles.retryButton}
                onPress={onRetry}
                activeOpacity={0.8}
            >
                <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp('6%'),
        backgroundColor: '#F8F8F8',
    },
    iconCircle: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: wp('10%'),
        backgroundColor: '#FFE5E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('2%'),
        borderWidth: 1,
        borderColor: '#FFCDCD',
    },
    icon: {
        fontSize: wp('10%'),
    },
    title: {
        fontSize: wp('5%'),
        fontWeight: '700',
        color: '#1C1C1C',
        marginBottom: hp('1%'),
        textAlign: 'center',
    },
    message: {
        fontSize: wp('3.8%'),
        color: '#6B6B6B',
        textAlign: 'center',
        marginBottom: hp('4%'),
        lineHeight: hp('3%'),
    },
    retryButton: {
        backgroundColor: '#1C1C1C',
        paddingVertical: hp('1.8%'),
        paddingHorizontal: wp('10%'),
        borderRadius: wp('8%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
});

export default ErrorCard;
