import React from "react";
import {
    View,
    Text,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import DeviceInfo from "react-native-device-info";

const SlabRuleTypeIncentives = ({ title, status, slabs, ordersCompleted, maxReward }) => {
    const { width } = useWindowDimensions();
    const isTablet = DeviceInfo.isTablet();
    const styles = createStyles(isTablet, width);

    const minOrders = slabs[slabs.length - 1]?.minOrders;
    const progressPercent = Math.min((ordersCompleted / minOrders) * 100, 100);

    return (
        <View style={styles.progressWrapper}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.status}>{status}</Text>
            </View>

            <View>
                <Text style={styles.contentHead}>Slab Reward</Text>
                {slabs.map((slab, index) => {
                    return (
                        <View key={index} style={styles.slabCards}>
                            <Text style={styles.slabText}>{slab.minOrders} - {slab.maxOrders} Orders</Text>
                            <Text style={styles.slabAmout}>₹{slab.rewardAmount}</Text>
                        </View>
                    )
                })}

                <View style={styles.content}>
                    <Text style={styles.contentLabel}>Completed Orders</Text>
                    <Text style={styles.contentValue}>{ordersCompleted}/{slabs[slabs.length - 1].maxOrders}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.contentLabel}>Maximum Reward</Text>
                    <Text style={styles.contentValue}>₹{maxReward}</Text>
                </View>
            </View>

            {/* Checkpoint Track */}
            <View style={styles.checkpointTrackWrapper}>
                {/* Background Track */}
                <View style={styles.checkpointTrack} />

                {/* Progress Fill */}
                <LinearGradient
                    colors={["#192A51", "#475B8A"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.checkpointFill, { width: `${progressPercent}%` }]}
                />

                {/* Day Checkpoint Markers */}
                {slabs.map((slab, index) => {
                    const position = (slab.minOrders / minOrders) * 100;
                    const isCompleted = ordersCompleted >= slab.minOrders;

                    return (
                        <View
                            key={index}
                            style={[styles.checkpoint, { left: `${position}%` }]}
                        >
                            {/* Checkpoint Icon */}
                            <View
                                style={[
                                    styles.checkpointIcon,
                                    isCompleted && styles.checkpointIconCompleted,
                                ]}
                            >
                                <Ionicons
                                    name={isCompleted ? "checkmark" : "lock-closed"}
                                    size={isTablet ? 16 : 12}
                                    color={isCompleted ? "#FFF" : "#999"}
                                />
                            </View>

                            {/* Day Label Above */}
                            <Text
                                style={[
                                    styles.checkpointDayLabel,
                                    isCompleted && styles.checkpointDayLabelActive,
                                ]}
                            >
                                {slab.minOrders}
                            </Text>

                            {/* Reward Label Below */}
                            <Text
                                style={[
                                    styles.checkpointRewardLabel,
                                    isCompleted && styles.checkpointRewardLabelActive,
                                ]}
                            >
                                ₹{slab.rewardAmount}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default SlabRuleTypeIncentives;

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
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isTablet ? 32 : 22,
            gap: 10,
        },

        title: {
            flex: 1,
            fontSize: isTablet ? 24 : 17,
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
            marginBottom: 10,
        },

        slabCards: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 6,
            borderRadius: 14,
            backgroundColor: '#E9E6FF',
            paddingHorizontal: isTablet ? 24 : 16,
            paddingVertical: isTablet ? 14 : 10,
        },

        slabText: {
            color: '#0A0A0A',
            fontSize: isTablet ? 17 : 14,
            fontWeight: '500',
            flex: 1,
        },

        slabAmout: {
            color: '#0A0A0A',
            fontSize: isTablet ? 17 : 14,
            fontWeight: '600',
            marginLeft: 12,
        },

        content: {
            marginTop: 14,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: isTablet ? 6 : 2,
            gap: 10,
        },

        contentLabel: {
            fontSize: isTablet ? 18 : 15,
            fontWeight: '500',
            color: '#4B5563',
            flex: 1,
        },

        contentValue: {
            fontSize: isTablet ? 20 : 16,
            fontWeight: '700',
            color: '#111827',
        },

        checkpointTrackWrapper: {
            height: isTablet ? 100 : 70,
            position: 'relative',
            marginTop: isTablet ? 60 : 45,
            marginBottom: isTablet ? 20 : 10,
            marginHorizontal: isTablet ? 18 : 10,
        },

        checkpointTrack: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: isTablet ? 38 : 26,
            height: isTablet ? 12 : 8,
            backgroundColor: '#EEF0F4',
            borderRadius: 999,
        },

        checkpointFill: {
            position: 'absolute',
            left: 0,
            top: isTablet ? 38 : 26,
            height: isTablet ? 12 : 8,
            borderRadius: 999,
        },

        checkpoint: {
            position: 'absolute',
            top: 0,
            alignItems: 'center',
            marginLeft: isTablet ? -22 : -15,
        },

        checkpointIcon: {
            width: isTablet ? 46 : 30,
            height: isTablet ? 46 : 30,
            borderRadius: 999,
            backgroundColor: '#E5E7EB',
            borderWidth: 3,
            borderColor: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3,
        },

        checkpointIconCompleted: {
            backgroundColor: '#00A63E',
        },

        checkpointDayLabel: {
            position: 'absolute',
            top: isTablet ? -34 : -22,
            fontSize: isTablet ? 14 : 10,
            fontWeight: '700',
            color: '#999',
        },

        checkpointDayLabelActive: {
            color: '#4F39F6',
        },

        checkpointRewardLabel: {
            position: 'absolute',
            top: isTablet ? 58 : 38,
            fontSize: isTablet ? 13 : 10,
            fontWeight: '700',
            color: '#999',
        },

        checkpointRewardLabelActive: {
            color: '#00A63E',
        },
    });
};