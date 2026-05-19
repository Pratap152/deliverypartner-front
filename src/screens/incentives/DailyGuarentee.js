import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import DeviceInfo from 'react-native-device-info';

const ProgressCheckpointBar = ({ slabs, ordersCompleted, isTablet, styles }) => {
  const minOrders = slabs[slabs.length - 1]?.minOrders;
  const progressPercent = Math.min((ordersCompleted / minOrders) * 100, 100);

  return (
    <View style={styles.progressCheckpointContainer}>
      <View style={styles.progressCheckpointHeaderRow}>
        <Text style={styles.progressCheckpointTitle}>Daily Progress</Text>
        <View style={styles.progressOrdersBadge}>
          <Ionicons
            name="cube"
            size={isTablet ? 18 : 14}
            color="#4F39F6"
          />
          <Text style={styles.progressOrdersText}>{ordersCompleted} orders</Text>
        </View>
      </View>

      {/* Checkpoint Track */}
      <View style={styles.progressCheckpointTrackWrapper}>
        {/* Background Track */}
        <View style={styles.progressCheckpointTrack} />

        {/* Progress Fill */}
        <LinearGradient
          colors={["#4F39F6", "#3B28C7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressCheckpointFill, { width: `${progressPercent}%` }]}
        />

        {/* Day Checkpoint Markers */}
        {slabs.map((slab, index) => {
          const position = (slab.minOrders / minOrders) * 100;
          const isCompleted = ordersCompleted >= slab.minOrders;

          return (
            <View
              key={index}
              style={[styles.progressCheckpoint, { left: `${position}%` }]}
            >
              {/* Checkpoint Icon */}
              <View
                style={[
                  styles.progressCheckpointIcon,
                  isCompleted && styles.progressCheckpointIconCompleted,
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
                  styles.progressCheckpointDayLabel,
                  isCompleted && styles.progressCheckpointDayLabelActive,
                ]}
              >
                {slab.minOrders}
              </Text>

              {/* Reward Label Below */}
              <Text
                style={[
                  styles.progressCheckpointRewardLabel,
                  isCompleted && styles.progressCheckpointRewardLabelActive,
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

const FixedTargetType = ({ target, ordersCompleted, isTablet, styles }) => {
  const progress = Math.min((ordersCompleted / target) * 100, 100);

  return (
    <View style={styles.progressCheckpointContainer}>
      <View style={styles.progressCheckpointHeaderRow}>
        <Text style={styles.progressCheckpointTitle}>Daily Progress</Text>
        <View style={styles.progressOrdersBadge}>
          <Ionicons
            name="cube"
            size={isTablet ? 18 : 14}
            color="#4F39F6" />
          <Text style={styles.progressOrdersText}>{ordersCompleted} orders</Text>
        </View>
      </View>
      <View>
        <Text style={styles.fixedTargetLabel}>
          Complete minimum of {target} Orders in a day
        </Text>
        <View style={styles.fixedTargetContainer}>
          <View style={[styles.fixedTargetProgress, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.fixedTargetPercent}>
          {progress.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};

const DailyGuarentee = ({ route, navigation }) => {

  const { width } = useWindowDimensions;
  const isTablet = DeviceInfo.isTablet();
  console.log("FWS: ", isTablet);
  const styles = createStyles(isTablet, width);

  // Safe extraction with default values
  const params = route.params;
  console.log("data in daily guarantee: ", params);

  if (params.emptyData || params.dailyIncentivesProgress.emptyData) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="calendar-outline"
          size={isTablet ? 70 : 50}
          color="#9CA3AF"
        />
        <Text style={styles.emptyText}>
          Please come again later
        </Text>
      </View>
    );
  }

  const title = params.daily_data.data[0].name;

  const ruleType = params.daily_data.data[0].ruleType;
  const slabs = params.daily_data.data[0]?.slabs;
  const ordersCompleted = params.dailyIncentivesProgress.ordersCompleted;
  const rewardAmount = params.daily_data.data[0].maxPayoutPerDay;
  const minOrders = params.minOrders;

  const target = params.minOrders;

  const minEarnings = params.daily_data.data[0]?.conditions?.minEarnings;

  const perOrderAmount = params.daily_data.data[0]?.reward?.perOrderAmount

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* --- HERO HEADER --- */}
      <LinearGradient
        colors={["#4F39F6", "#3B28C7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroHeader}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={isTablet ? 30 : 24}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroTitle}>{title}</Text>

        <View style={styles.rewardPill}>
          <Text style={styles.rewardLabel}>Potential Earnings</Text>
          <Text style={styles.rewardValue}>₹ {rewardAmount}</Text>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Your Daily Mission</Text>

        {/* --- ZONE 2: NORMAL PERFORMANCE (Cool Schema) --- */}
        <View style={[styles.ruleCard, styles.normalCard]}>
          {!perOrderAmount &&
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, styles.normalIconBox]}>
                <Ionicons
                  name="bicycle"
                  size={isTablet ? 26 : 20}
                  color="#00A63E"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Targets</Text>
              </View>
            </View>
          }

          {perOrderAmount &&
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, styles.normalIconBox]}>
                <Ionicons
                  name="bicycle"
                  size={isTablet ? 26 : 20}
                  color="#00A63E"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Orders Delivered</Text>
              </View>
              <View style={styles.progressOrdersBadge}>
                <Ionicons
                  name="cube"
                  size={isTablet ? 18 : 14}
                  color="#4F39F6"
                />
                <Text style={styles.progressOrdersText}>{ordersCompleted} orders</Text>
              </View>
            </View>
          }

          {!perOrderAmount &&
            <View style={styles.divider} />
          }

          {/* Rule Rows */}
          {minOrders !== 0 && (
            <View style={styles.ruleRow}>
              <Ionicons
                name="cube-outline"
                size={isTablet ? 24 : 18}
                color="#555"
                style={styles.ruleIcon}
              />
              <Text style={styles.ruleText}>
                Deliver minimum of{' '}<Text style={styles.boldNormal}>{minOrders} Orders</Text>{' '}to achieve rewards
              </Text>
            </View>
          )}

          {minEarnings && (
            <View style={styles.ruleRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={isTablet ? 24 : 18}
                color="#555"
                style={styles.ruleIcon}
              />
              <Text style={styles.ruleText}>
                Should have minimum earnings of{' '}<Text style={styles.boldNormal}>{minEarnings}</Text>{' '}rupees
              </Text>
            </View>
          )}
        </View>

        {ruleType === "SLAB" &&
          <View style={[styles.progressWrapper]}>
            <ProgressCheckpointBar
              slabs={slabs}
              ordersCompleted={ordersCompleted}
              styles={styles}
              isTablet={isTablet}
            />
          </View>
        }

        {(ruleType === "FIXED_TARGET" || ruleType === "HYBRID") &&
          <View style={styles.progressWrapper}>
            <FixedTargetType
              target={target}
              ordersCompleted={ordersCompleted}
              styles={styles}
              isTablet={isTablet}
            />
          </View>
        }

        {perOrderAmount && (
          <View style={[styles.ruleCard, styles.normalCard]}>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                name="checkmark-circle-outline"
                size={isTablet ? 24 : 18}
                color="#555"
                style={styles.ruleIcon}
              />
              <Text style={styles.ruleText}>
                You will get{' '}<Text style={styles.boldNormal}>{perOrderAmount} rupees</Text>{' '}for each order you deliver
              </Text>
            </View>
          </View>
        )}

      </View>
    </ScrollView>
  );
};

export default DailyGuarentee;

const createStyles = (
  isTablet,
  width,
) => {
  const contentWidth = isTablet
    ? width > 1000
      ? '70%'
      : '82%'
    : '100%';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F7FB',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F4F7FB',
    },
    emptyText: {
      marginTop: 14,
      fontSize: isTablet ? 22 : 16,
      color: '#6B7280',
      fontWeight: '600',
    },
    heroHeader: {
      paddingTop: isTablet ? 55 : 35,
      paddingBottom: isTablet ? 45 : 30,
      paddingHorizontal: isTablet ? 34 : 20,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      alignItems: 'flex-start',
    },
    headerTop: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isTablet ? 28 : 18,
    },
    heroTitle: {
      fontSize: isTablet ? 38 : 26,
      fontWeight: '800',
      color: '#FFF',
      marginBottom: 10,
      textAlign: isTablet
        ? 'center'
        : 'left',
    },
    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        'rgba(255,255,255,0.15)',
      paddingHorizontal: isTablet
        ? 22
        : 16,
      paddingVertical: isTablet
        ? 12
        : 8,
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,0.2)',
    },
    rewardLabel: {
      color: '#E0E0E0',
      fontSize: isTablet ? 16 : 13,
      marginRight: 8,
    },
    rewardValue: {
      color: '#FFD700',
      fontSize: isTablet ? 24 : 18,
      fontWeight: '700',
    },
    contentContainer: {
      width: contentWidth,
      alignSelf: 'center',
      paddingVertical: isTablet
        ? 28
        : 20,
      paddingHorizontal: isTablet
        ? 0
        : 20,
    },
    sectionTitle: {
      fontSize: isTablet ? 28 : 20,
      fontWeight: '700',
      color: '#333',
      marginBottom: isTablet ? 22 : 16,
    },
    progressWrapper: {
      backgroundColor: '#FFF',
      borderRadius: isTablet ? 24 : 16,
      padding: isTablet ? 28 : 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    progressCheckpointContainer: {
      backgroundColor: '#FFFFFF'
    },
    progressCheckpointHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isTablet ? 34 : 24,
    },
    progressCheckpointTitle: {
      fontSize: isTablet ? 22 : 16,
      fontWeight: '700',
      color: '#333',
    },
    progressOrdersBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E0E7FF',
      paddingHorizontal: isTablet
        ? 14
        : 10,
      paddingVertical: isTablet
        ? 8
        : 4,
      borderRadius: 14,
    },
    progressOrdersText: {
      fontSize: isTablet ? 15 : 12,
      fontWeight: '700',
      color: '#4F39F6',
      marginLeft: 4,
    },
    progressCheckpointTrackWrapper: {
      height: isTablet ? 90 : 60,
      position: 'relative',
      marginTop: 20,
      marginBottom: isTablet ? 50 : 30,
      marginHorizontal: 10,
    },
    progressCheckpointTrack: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: isTablet ? 34 : 22,
      height: isTablet ? 12 : 8,
      backgroundColor: '#EEF0F4',
      borderRadius: 6,
    },
    progressCheckpointFill: {
      position: 'absolute',
      left: 0,
      top: isTablet ? 34 : 22,
      height: isTablet ? 12 : 8,
      borderRadius: 6,
    },
    progressCheckpoint: {
      position: 'absolute',
      top: 0,
      alignItems: 'center',
      marginLeft: isTablet ? -22 : -15,
    },
    progressCheckpointIcon: {
      width: isTablet ? 44 : 30,
      height: isTablet ? 44 : 30,
      borderRadius: 999,
      backgroundColor: '#E5E7EB',
      borderWidth: 3,
      borderColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
    },
    progressCheckpointIconCompleted: {
      backgroundColor: '#00A63E',
    },
    progressCheckpointDayLabel: {
      position: 'absolute',
      top: isTablet ? -34 : -22,
      fontSize: isTablet ? 14 : 10,
      fontWeight: '700',
      color: '#999',
    },
    progressCheckpointDayLabelActive: {
      color: '#4F39F6',
    },
    progressCheckpointRewardLabel: {
      position: 'absolute',
      top: isTablet ? 54 : 36,
      fontSize: isTablet ? 13 : 10,
      fontWeight: '700',
      color: '#999',
    },
    progressCheckpointRewardLabelActive:
    {
      color: '#00A63E',
    },
    fixedTargetLabel: {
      marginBottom: 8,
      fontSize: isTablet ? 18 : 14,
      fontWeight: '500',
      color: '#374151',
    },
    fixedTargetContainer: {
      height: isTablet ? 18 : 12,
      backgroundColor: '#eee',
      borderRadius: 999,
      overflow: 'hidden',
    },
    fixedTargetProgress: {
      height: '100%',
      backgroundColor: '#4CAF50',
    },
    fixedTargetPercent: {
      marginTop: 8,
      fontSize: isTablet ? 16 : 12,
      color: '#555',
      fontWeight: '600',
    },
    ruleCard: {
      backgroundColor: '#FFF',
      borderRadius: isTablet ? 24 : 16,
      padding: isTablet ? 24 : 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      borderLeftWidth: 5,
    },
    normalCard: {
      borderLeftColor: '#00A63E',
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    iconBox: {
      width: isTablet ? 54 : 40,
      height: isTablet ? 54 : 40,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    normalIconBox: {
      backgroundColor: '#E0F5E9',
    },
    cardTitle: {
      fontSize: isTablet ? 22 : 16,
      fontWeight: '700',
      color: '#1F2937',
    },
    divider: {
      height: 1,
      backgroundColor: '#EFF0F6',
      marginBottom: 14,
    },
    ruleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    ruleIcon: {
      marginRight: 10,
      opacity: 0.7,
    },
    ruleText: {
      fontSize: isTablet ? 20 : 14,
      color: '#4B5563',
      flex: 1,
      lineHeight: isTablet ? 30 : 20,
    },
    boldNormal: {
      fontWeight: '700',
      color: '#15803D',
    },
  });
};