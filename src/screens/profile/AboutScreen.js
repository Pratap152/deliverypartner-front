import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {
    responsiveWidth as rw,
    responsiveHeight as rh,
    responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Linking } from 'react-native';
import { useEffect, useState } from 'react';
import apiClient from '../../services/ApiClient';

const isTablet = DeviceInfo.isTablet();

export default function AboutScreen({ navigation }) {
    const [policies, setPolicies] = useState([]);

    const getPolicies = async () => {
        try {
            const response = await apiClient.get('/api/rider/all/policies');

            if (response?.data?.success) {
                setPolicies(response.data.data);
            }
        } catch (error) {
            console.log('Policies Error:', error);
        }
    };

    useEffect(() => {
        getPolicies();
    }, []);

    const openPolicy = type => {
        const policy = policies.find(item => item.type === type);

        if (policy?.contentUrl) {
            Linking.openURL(policy.contentUrl);
        }
    };

    const openWebsite = () => {
        Linking.openURL('https://www.zestbot.in/');
    };

    const openEmail = () => {
        Linking.openURL('mailto:rider@zestbot.in');
    };

    return (
        <SafeAreaView style={styles.root}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={rf(2.6)}
                        color="#101828"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    About
                </Text>

                <TouchableOpacity
                    style={styles.rightIconWrapper}
                    onPress={() => navigation.navigate('HelpCenterList')}
                >
                    <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={24}
                        color="#294484"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoCard}>
                        <Image
                            source={require('../../assets/zestbot.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.appName}>
                        ZestBot Rider
                    </Text>

                    <Text style={styles.appSubtitle}>
                        Your delivery partner app
                    </Text>
                </View>

                {/* App Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        App Information
                    </Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Version
                        </Text>

                        <Text style={styles.infoValue}>
                            {DeviceInfo.getVersion()}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Build Number
                        </Text>

                        <Text style={styles.infoValue}>
                            {DeviceInfo.getBuildNumber()}
                        </Text>
                    </View>
                </View>

                {/* Contact Us */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Contact Us
                    </Text>

                    <TouchableOpacity
                        style={styles.contactRow}
                        activeOpacity={0.7}
                        onPress={openEmail}
                    >
                        <View style={styles.contactIcon}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color='#1F3365'
                            />
                        </View>

                        <View style={styles.contactContent}>
                            <Text style={styles.contactLabel}>
                                Email
                            </Text>

                            <Text style={[styles.contactValue, styles.linkText]}>
                                rider@zestbot.in
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.contactRow}
                        activeOpacity={0.7}
                        onPress={openWebsite}
                    >
                        <View style={styles.contactIcon}>
                            <Ionicons
                                name="globe-outline"
                                size={20}
                                color='#1F3365'
                            />
                        </View>

                        <View style={styles.contactContent}>
                            <Text style={styles.contactLabel}>
                                Website
                            </Text>

                            <Text style={[styles.contactValue, styles.linkText]}>
                                https://www.zestbot.in/
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Description */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        About ZestBot Rider
                    </Text>

                    <Text style={styles.description}>
                        Delivery Partner is an application designed for riders to manage
                        deliveries efficiently. Riders can accept orders, navigate to pickup
                        and delivery locations, track earnings, manage wallets, book shifts,
                        and receive real-time updates.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Legal
                    </Text>

                    <TouchableOpacity
                        style={styles.legalRow}
                        onPress={() => openPolicy('OPERATIONS_POLICY')}
                    >
                        <Text style={styles.legalText}>
                            Terms of Services
                        </Text>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.legalRow}
                        onPress={() => openPolicy('PRIVACY_POLICY')}
                    >
                        <Text style={styles.legalText}>
                            Privacy Policy
                        </Text>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.legalRow}
                        onPress={() =>
                            openPolicy('DELIVERY_PARTNER_AGREEMENT')
                        }
                    >
                        <Text style={styles.legalText}>
                            License & Acknowledgment
                        </Text>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F4F6F8',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: rw(4),
        paddingVertical: rh(2.2),
        backgroundColor: '#FFFFFF',
        elevation: 3,
    },

    headerTitle: {
        fontSize: rf(2.3),
        fontWeight: '700',
        color: '#101828',
    },

    robotIcon: {
        width: rw(7.5),
        height: rw(7.5),
        resizeMode: 'contain',
    },

    container: {
        paddingHorizontal: wp('5%'),
        paddingTop: hp('3%'),
        paddingBottom: hp('4%'),
    },

    logoSection: {
        alignItems: 'center',
        marginBottom: hp('3%'),
    },

    logoCard: {
        width: wp('40%'),
        height: wp('20%'),
        backgroundColor: '#1F3365',
        borderRadius: wp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('1.8%'),
    },

    logo: {
        width: wp('40%'),
        height: wp('30%'),
    },
    appName: {
        fontSize: isTablet ? wp('3.8%') : wp('6%'),
        fontWeight: '700',
        color: '#222222',
    },

    appSubtitle: {
        marginTop: hp('0.5%'),
        fontSize: isTablet ? wp('2.2%') : wp('3.8%'),
        color: '#7B7B7B',
    },

    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('4.5%'),
        marginBottom: hp('2%'),
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    cardTitle: {
        fontSize: isTablet ? wp('2.8%') : wp('4.3%'),
        fontWeight: '700',
        color: '#222222',
        marginBottom: hp('1.2%'),
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp('1%'),
    },

    infoLabel: {
        fontSize: isTablet ? wp('2.2%') : wp('4%'),
        color: '#666666',
    },

    infoValue: {
        fontSize: isTablet ? wp('2.2%') : wp('4%'),
        color: '#222222',
        fontWeight: '600',
    },

    divider: {
        height: 1,
        backgroundColor: '#ECECEC',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
    },

    contactIcon: {
        width: wp('11%'),
        height: wp('11%'),
        borderRadius: wp('5.5%'),
        backgroundColor: '#F2F4FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('3.5%'),
    },

    contactContent: {
        flex: 1,
    },

    contactLabel: {
        fontSize: isTablet ? wp('2.2%') : wp('3.5%'),
        color: '#8B8B8B',
        marginBottom: hp('0.3%'),
    },

    contactValue: {
        fontSize: isTablet ? wp('2.3%') : wp('4%'),
        color: '#1F3365',
        fontWeight: '600',
    },
    linkText: {
        color: '#1F3365',
        textDecorationLine: 'underline',
    },
    description: {
        marginTop: hp('0.5%'),
        fontSize: isTablet ? wp('2.3%') : wp('3.9%'),
        color: '#667085',
        lineHeight: hp('3%'),
        textAlign: 'left',
    },
    legalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp('1.8%'),
    },

    legalText: {
        fontSize: isTablet ? wp('2.3%') : wp('4%'),
        color: '#222',
        fontWeight: '500',
    },
});