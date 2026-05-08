import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ProgressCheckpointBar = ({ slabs, ordersCompleted }) => {
  const minOrders = slabs[slabs.length - 1]?.minOrders;
  const progressPercent = Math.min((ordersCompleted / minOrders) * 100, 100);

  return (
    <View style={styles.progressCheckpointContainer}>
      <View style={styles.progressCheckpointHeaderRow}>
        <Text style={styles.progressCheckpointTitle}>Daily Progress</Text>
        <View style={styles.progressOrdersBadge}>
          <Ionicons name="cube" size={14} color="#4F39F6" />
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
                  size={12}
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

const FixedTargetType = ({ target, ordersCompleted }) => {
  const progress = Math.min((ordersCompleted / target) * 100, 100);

  return (
    <View style={styles.progressCheckpointContainer}>
      <View style={styles.progressCheckpointHeaderRow}>
        <Text style={styles.progressCheckpointTitle}>Daily Progress</Text>
        <View style={styles.progressOrdersBadge}>
          <Ionicons name="cube" size={14} color="#4F39F6" />
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
  // Safe extraction with default values
  const params = route.params;
  console.log("data in daily guarantee: ", params);

  if (params.emptyData || params.dailyIncentivesProgress.emptyData) {
    return (
      <View>
        <Text>
          Please come again later
        </Text>
      </View>
    )
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
            <Ionicons name="arrow-back" size={24} color="#FFF" />
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
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, styles.normalIconBox]}>
              <Ionicons name="bicycle" size={20} color="#00A63E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Targets</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Rule Rows */}
          {minOrders !== 0 && (
            <View style={styles.ruleRow}>
              <Ionicons name="cube-outline" size={18} color="#555" style={styles.ruleIcon} />
              <Text style={styles.ruleText}>
                Deliver minimum of <Text style={styles.boldNormal}>{minOrders} Orders</Text> to achieve rewards
              </Text>
            </View>
          )}

          {perOrderAmount && (
            <View style={styles.ruleRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#555" style={styles.ruleIcon} />
              <Text style={styles.ruleText}>
                You will get <Text style={styles.boldNormal}>{perOrderAmount} rupees</Text> for each order
              </Text>
            </View>
          )}

          {minEarnings && (
            <View style={styles.ruleRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#555" style={styles.ruleIcon} />
              <Text style={styles.ruleText}>
                Should have minimum earnings of <Text style={styles.boldNormal}>{minEarnings}</Text> rupees
              </Text>
            </View>
          )}
        </View>

        {ruleType === "SLAB" &&
          <View style={[styles.progressWrapper]}>
            <ProgressCheckpointBar
              slabs={slabs}
              ordersCompleted={ordersCompleted}
            />
          </View>
        }

        {ruleType === "FIXED_TARGET" &&
          <View style={styles.progressWrapper}>
            <FixedTargetType
              target={target}
              ordersCompleted={ordersCompleted}
            />
          </View>
        }

        {ruleType === "HYBRID" &&
          <View style={styles.progressWrapper}>
            <FixedTargetType
              target={target}
              ordersCompleted={ordersCompleted}
            />
          </View>
        }
      </View>
    </ScrollView>
  );
};

export default DailyGuarentee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB", // Light gray-blue bg
  },
  heroHeader: {
    paddingTop: hp("3%"),
    paddingBottom: hp("4%"),
    paddingHorizontal: wp("5%"),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  heroTitle: {
    fontSize: wp("6.5%"),
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: wp("3.8%"),
    color: "rgba(255,255,255,0.9)",
    marginBottom: hp("2.5%"),
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  rewardLabel: {
    color: '#E0E0E0',
    fontSize: 13,
    marginRight: 8,
  },
  rewardValue: {
    color: '#FFD700', // Gold
    fontSize: 18,
    fontWeight: '700',
  },

  contentContainer: {
    padding: wp("5%"),
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: "#333",
    marginBottom: hp("2%"),
    marginLeft: 4,
  },

  //Progress Bar
  progressWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressCheckpointContainer: {},
  progressCheckpointHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  progressCheckpointTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  progressOrdersBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressOrdersText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F39F6",
    marginLeft: 4,
  },
  progressCheckpointTrackWrapper: {
    height: 60,
    position: "relative",
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 10,
  },
  progressCheckpointTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 22,
    height: 8,
    backgroundColor: "#EEF0F4",
    borderRadius: 4,
  },
  progressCheckpointFill: {
    position: "absolute",
    left: 0,
    top: 22,
    height: 8,
    borderRadius: 4,
  },
  progressCheckpoint: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    marginLeft: -15,
  },
  progressCheckpointIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E5E7EB",
    borderWidth: 3,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  progressCheckpointIconCompleted: {
    backgroundColor: "#00A63E",
  },
  progressCheckpointDayLabel: {
    position: "absolute",
    top: -22,
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
  },
  progressCheckpointDayLabelActive: {
    color: "#4F39F6",
    fontSize: 11,
  },
  progressCheckpointRewardLabel: {
    position: "absolute",
    top: 36,
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
  },
  progressCheckpointRewardLabelActive: {
    color: "#00A63E",
    fontSize: 10,
  },

  //Styles for FIXED_TARGET
  fixedTargetLabel: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500'
  },
  fixedTargetContainer: {
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden'
  },
  fixedTargetProgress: {
    height: '100%',
    backgroundColor: '#4CAF50'
  },
  fixedTargetPercent: {
    marginTop: 5,
    fontSize: 12,
    color: '#555'
  },

  /* Card Styles */
  ruleCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  normalCard: {
    borderLeftColor: "#00A63E", // Green Accent
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  peakIconBox: {
    backgroundColor: "#FFF0E0",
  },
  normalIconBox: {
    backgroundColor: "#E0F5E9",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFF0F6",
    marginBottom: 12,
  },

  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleIcon: {
    marginRight: 10,
    opacity: 0.7,
  },
  ruleText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
    lineHeight: 20,
  },
  boldNormal: {
    fontWeight: "700",
    color: "#15803D",
  },
});