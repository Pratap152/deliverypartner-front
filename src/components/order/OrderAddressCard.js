import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

/**
 * @param {object} props
 * @param {'store' | 'home' | 'user'} props.iconType
 * @param {'green' | 'red' | 'default'} props.theme
 */
const OrderAddressCard = ({ title, name, address, iconType = 'home', theme = 'default' }) => {

    const getThemeStyles = () => {
        switch (theme) {
            case 'green':
                return {
                    iconBg: '#E8F7F0',
                    iconColor: '#00B26F', // Green
                };
            case 'red':
                return {
                    iconBg: '#FDECEC',
                    iconColor: '#FF4B4B', // Red
                };
            default:
                return {
                    iconBg: '#E8F7F0',
                    iconColor: '#1C1C1C',
                };
        }
    };

    const getIcon = () => {
        switch (iconType) {
            case 'store': return '🏪';
            case 'home': return '🏠';
            case 'user': return '👤';
            default: return '📍';
        }
    };

    const themeStyles = getThemeStyles();

    return (
        <View style={styles.container}>
            <View style={[styles.iconWrapper, { backgroundColor: themeStyles.iconBg }]}>
                <Text style={[styles.icon, { color: themeStyles.iconColor }]}>{getIcon()}</Text>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.address}>{address}</Text>
            </View>
        </View>
    );
};

export default memo(OrderAddressCard);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('3%'),
        padding: wp('3.5%'),
        borderWidth: 1,
        borderColor: '#E6E6E6',
        marginBottom: hp('1.5%'),
        alignItems: 'center',
    },
    iconWrapper: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('4.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp('3%'),
    },
    icon: {
        fontSize: wp('5.5%'),
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: wp('3.2%'),
        color: '#6F6F6F',
        fontWeight: '600',
        marginBottom: hp('0.5%'),
        textTransform: 'uppercase',
    },
    name: {
        fontSize: wp('4%'),
        fontWeight: '700',
        color: '#1C1C1C',
        marginBottom: hp('0.3%'),
    },
    address: {
        fontSize: wp('3.2%'),
        color: '#6F6F6F',
        lineHeight: hp('2.2%'),
    },
});
