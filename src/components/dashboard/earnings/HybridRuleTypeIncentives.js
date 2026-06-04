import React from "react";
import {
    View,
    Text,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import ProgressBar from "./ProgressBar";
import LinearGradient from "react-native-linear-gradient";
import DeviceInfo from "react-native-device-info";

const HybridRuleTypeIncentives = ({ title, status, ordersCompleted, minOrders, rewardEarned, minEarnings, maxReward }) => {
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    const styles = createStyles(isTablet, width);

    return (
        <View style={styles.progressWrapper}>
            <View style={styles.headerRow}>
                <Text style={styles.checkpointTitle}>{title}</Text>
                <Text style={styles.status}>{status}</Text>
            </View>
            <View style={styles.hybridConditionsWrapper}>
                <View style={styles.content}>
                    <Text style={styles.cardLabel}>Orders</Text>
                    <Text style={styles.cardValue}>{ordersCompleted}/{minOrders}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.cardLabel}>Earnings</Text>
                    <Text style={styles.cardValue}>₹{rewardEarned}/₹{minEarnings}</Text>
                </View>

                <LinearGradient
                    colors={["#FFEFEF", "#FF9898"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hybridRewards}
                >
                    <Text style={styles.cardLabel}>Reward</Text>
                    <Text style={styles.cardValue}>₹{maxReward}</Text>
                </LinearGradient>
            </View>

            <View style={styles.progressCard}>
                <View style={styles.progressBar}>
                    <ProgressBar
                        progress={(ordersCompleted / minOrders) * 100}
                        progressColor="#192A51"
                    />
                </View>
                <Text style={styles.progressPercent}>{Math.min(Math.round((ordersCompleted / minOrders) * 100), 100)}%</Text>
            </View>
        </View>
    );
};

export default HybridRuleTypeIncentives;

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
            marginBottom: isTablet ? 28 : 20,
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

        hybridConditionsWrapper: {
            borderWidth: 1,
            borderColor: '#DEDEE1',
            borderRadius: 16,
            overflow: 'hidden',
            marginTop: 4,
        },

        content: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: isTablet ? 18 : 14,
            paddingHorizontal: isTablet ? 22 : 16,
            borderBottomWidth: 1,
            borderBottomColor: '#F1F1F1',
            gap: 10,
        },

        hybridRewards: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: isTablet ? 18 : 14,
            paddingHorizontal: isTablet ? 22 : 16,
            gap: 10,
        },

        cardLabel: {
            flex: 1,
            fontSize: isTablet ? 18 : 15,
            fontWeight: '500',
            color: '#374151',
        },

        cardValue: {
            fontSize: isTablet ? 20 : 16,
            fontWeight: '700',
            color: '#111827',
        },

        progressCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: isTablet ? 24 : 18,
            gap: 12,
        },

        progressBar: {
            flex: 1,
        },

        progressPercent: {
            minWidth: isTablet ? 60 : 45,
            textAlign: 'right',
            fontSize: isTablet ? 20 : 16,
            fontWeight: '700',
            color: '#192A51',
        },
    });
};