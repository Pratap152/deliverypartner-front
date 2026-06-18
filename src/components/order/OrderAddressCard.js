import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * OrderAddressCard - Displays address information with a themed icon
 * @param {object} props
 * @param {string} props.title - Label like "PICKUP LOCATION"
 * @param {string} props.name - Store or Customer name
 * @param {string} props.address - Full address string
 * @param {'store' | 'home' | 'user' | 'marker'} props.iconType
 * @param {'green' | 'red' | 'blue' | 'default'} props.theme
 */
const OrderAddressCard = ({ title, name, address, iconType = 'home', theme = 'default' }) => {

    console.log("check", name,title,address);
    const getThemeStyles = () => {
        switch (theme) {
            case 'green':
                return {
                    iconBg: '#E8F7F0',
                    iconColor: '#00B26F',
                };
            case 'red':
                return {
                    iconBg: '#FDECEC',
                    iconColor: '#FF4B4B',
                };
            case 'blue':
                return {
                    iconBg: '#EFF6FF',
                    iconColor: '#3B82F6',
                };
            default:
                return {
                    iconBg: '#F1F5F9',
                    iconColor: '#475569',
                };
        }
    };

    const getIcon = () => {
        switch (iconType) {
            case 'store': return 'business-outline';
            case 'home': return 'home-outline';
            case 'user': return 'person-outline';
            case 'marker': return 'location-outline';
            default: return 'location-outline';
        }
    };

    const themeStyles = getThemeStyles();

    if (!name && !address) {
        return (
            <View style={styles.container}>
                <View style={[styles.iconWrapper, { backgroundColor: '#F8FAFC' }]}>
                    <Ionicons name="alert-circle-outline" size={wp('6%')} color="#94A3B8" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={[styles.name, { color: '#94A3B8' }]}>Address Unavailable</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.iconWrapper, { backgroundColor: themeStyles.iconBg }]}>
                <Ionicons name={getIcon()} size={wp('6%')} color={themeStyles.iconColor} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.name}>{name || 'N/A'}</Text>
                <Text style={styles.address} numberOfLines={2}>{address || 'No address provided'}</Text>
            </View>
        </View>
    );
};

export default memo(OrderAddressCard);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'),
        padding: wp('4%'),
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: hp('1.5%'),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconWrapper: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp('4%'),
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: wp('3%'),
        color: '#64748B',
        fontWeight: '700',
        marginBottom: hp('0.5%'),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    name: {
        fontSize: wp('4%'),
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: hp('0.3%'),
    },
    address: {
        fontSize: wp('3.5%'),
        color: '#64748B',
        lineHeight: hp('2.2%'),
    },
});
