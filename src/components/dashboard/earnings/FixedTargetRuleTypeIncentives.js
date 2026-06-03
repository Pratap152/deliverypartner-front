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

const FixedTargetRuleTypeIncentives = ({ title, status, target, ordersCompleted, maxReward }) => {
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    const styles = createStyles(isTablet, width);

    return (
        <View style={styles.progressWrapper}>
            <View style={styles.checkpointHeaderRow}>
                <View style={styles.headerRow}>
                    <Text style={styles.checkpointTitle}>{title}</Text>
                    <Text style={styles.status}>{status}</Text>
                </View>
            </View>
            <View>
                <Text style={styles.contentHead}>Your Target</Text>
                <View style={styles.targetCard}>
                    <Text style={styles.cardLabel}>Target Orders</Text>
                    <Text style={styles.cardValue}>{target}</Text>
                </View>
                <LinearGradient
                    colors={["#FFEFEF", "#FF9898"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.rewardCard}
                >
                    <Text style={styles.cardLabel}>Reward</Text>
                    <Text style={styles.cardValue}>₹{maxReward}</Text>
                </LinearGradient>

                <View style={styles.content}>
                    <Text style={styles.contentLabel}>Completed Orders</Text>
                    <Text style={styles.contentValue}>{ordersCompleted}/{target}</Text>
                </View>
            </View>
            <View style={styles.progressCard}>
                <View style={styles.progressBar}>
                    <ProgressBar
                        progress={(ordersCompleted / target) * 100}
                        progressColor="#192A51"
                    />
                </View>
                <Text style={styles.progressPercent}>{Math.min(Math.round((ordersCompleted / target) * 100), 100)}%</Text>
            </View>
        </View>
    );
};

export default FixedTargetRuleTypeIncentives;

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

        checkpointHeaderRow: {
            marginBottom: isTablet ? 32 : 22,
        },

        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
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

        contentHead: {
            fontSize: isTablet ? 18 : 15,
            fontWeight: '700',
            color: '#111827',
            marginBottom: 12,
        },

        targetCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#E9E6FF',
            borderRadius: 14,
            paddingVertical: isTablet ? 16 : 12,
            paddingHorizontal: isTablet ? 24 : 16,
            marginBottom: 12,
        },

        rewardCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 14,
            paddingVertical: isTablet ? 16 : 12,
            paddingHorizontal: isTablet ? 24 : 16,
            marginBottom: 12,
        },

        cardLabel: {
            fontSize: isTablet ? 18 : 15,
            fontWeight: '500',
            color: '#111827',
        },

        cardValue: {
            fontSize: isTablet ? 20 : 16,
            fontWeight: '700',
            color: '#111827',
        },

        content: {
            marginTop: 14,
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