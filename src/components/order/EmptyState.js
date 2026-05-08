import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmptyState = ({ 
    icon = 'document-text-outline', 
    title = 'No Data Available', 
    message = 'We couldn\'t find any information at the moment. Please try again later.',
    onRetry,
    buttonText = 'Retry'
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={wp('15%')} color="#94A3B8" />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            {onRetry && (
                <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default EmptyState;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp('10%'),
        paddingVertical: hp('5%'),
        backgroundColor: 'transparent',
    },
    iconContainer: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: wp('12.5%'),
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('3%'),
    },
    title: {
        fontSize: wp('5%'),
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: hp('1.5%'),
        textAlign: 'center',
    },
    message: {
        fontSize: wp('3.8%'),
        color: '#64748B',
        textAlign: 'center',
        lineHeight: hp('2.5%'),
        marginBottom: hp('4%'),
    },
    button: {
        backgroundColor: '#00C4B4',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('8%'),
        borderRadius: wp('10%'),
        shadowColor: '#00C4B4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
});
