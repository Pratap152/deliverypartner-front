import React from "react";
import {
    View,
    Text,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import DeviceInfo from "react-native-device-info";

const PerOrderRuleTypeIncentives = ({ title, status, perOrderAmount, maxOrders, maxReward }) => {
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    const styles = createStyles(isTablet, width);

    return (
        <View style={styles.progressWrapper}>
            <View style={styles.headerRow}>
                <Text style={styles.checkpointTitle}>{title}</Text>
                <Text style={styles.status}>{status}</Text>
            </View>

            <LinearGradient
                colors={["#FFEFEF", "#FF9898"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.perOrderRewards}
            >
                <Text style={styles.cardLabel}>Reward Per Order</Text>
                <Text style={styles.cardValue}>₹{perOrderAmount}</Text>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.contentLabel}>Maximum Orders</Text>
                <Text style={styles.contentValue}>{maxOrders}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.contentLabel}>Maximum Reward</Text>
                <Text style={styles.contentValue}>₹{maxReward}</Text>
            </View>
        </View>
    )
};

export default PerOrderRuleTypeIncentives;

const createStyles = (isTablet, width) => {
    return StyleSheet.create({
        progressWrapper: {
            backgroundColor: '#FFFFFF',
            borderColor: '#DEDEE1',
            borderWidth: 1,
            borderRadius: isTablet ? 24 : 14,
            padding: isTablet ? 28 : 18,
            marginBottom: 20,
        },

        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: isTablet ? 26 : 18,
            gap: 10,
        },

        checkpointTitle: {
            flex: 1,
            fontSize: isTablet ? 24 : 18,
            fontWeight: '700',
            color: '#333',
        },

        status: {
            color: '#FFFFFF',
            backgroundColor: '#00C786',
            paddingVertical: isTablet ? 8 : 5,
            paddingHorizontal: isTablet ? 14 : 10,
            borderRadius: 8,
            fontSize: isTablet ? 14 : 12,
            overflow: 'hidden',
        },

        perOrderRewards: {
            borderRadius: 16,
            paddingVertical: isTablet ? 22 : 18,
            paddingHorizontal: isTablet ? 22 : 16,
            marginBottom: isTablet ? 20 : 16,
            alignItems: 'center',
            justifyContent: 'center',
        },

        cardLabel: {
            fontSize: isTablet ? 18 : 15,
            fontWeight: '500',
            color: '#374151',
            marginBottom: 6,
        },

        cardValue: {
            fontSize: isTablet ? 30 : 24,
            fontWeight: '800',
            color: '#111827',
        },

        content: {
            marginTop: isTablet ? 18 : 14,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
        },

        contentLabel: {
            flex: 1,
            fontSize: isTablet ? 18 : 15,
            fontWeight: '500',
            color: '#4B5563',
        },

        contentValue: {
            fontSize: isTablet ? 20 : 16,
            fontWeight: '700',
            color: '#111827',
        },
    });
};