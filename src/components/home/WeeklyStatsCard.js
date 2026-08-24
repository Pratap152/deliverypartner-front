import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useNavigation,useFocusEffect } from "@react-navigation/native";

import useEarningsDashboard from "../../hooks/useEarningsDashboard";
import { formatMoney } from "../../utils/formatMoney";

const StatRow = ({
  label,
  value,
  large = false,
}) => {
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.label,
          large && styles.largeLabel,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.value,
          large && styles.largeValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const WeeklyStatsCard = ({ hours }) => {
  const navigation = useNavigation();

  const {
  data,
  loading,
  onRefresh,
} = useEarningsDashboard();
  const {
    riderType = "",
    earningsSummary = {},
  } = data || {};

  /*
   * IMPORTANT:
   *
   * Weekly card ONLY reads from:
   *
   * earningsSummary.week
   *
   * Never from month.
   */

  const weekly =
    earningsSummary?.week || {};

  const orders =
    Number(weekly?.orders ?? 0);

  const salary =
    Number(
      weekly?.attendanceAmount ?? 0
    );

  const tips =
    Number(weekly?.tips ?? 0);

  const incentives =
    Number(
      weekly?.incentives ?? 0
    );

  const total =
    Number(weekly?.total ?? 0);

  const isZestbotEmployee =
    riderType === "ZESTBOT_EMPLOYEE";

  const openWeeklyEarnings = () => {
    navigation.navigate(
      "EarningsHistoryScreen",
      {
        mode: "WEEK",
      }
    );
  };

  if (loading) {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={openWeeklyEarnings}
    >
      <View style={styles.container}>

        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Weekly Progress
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openWeeklyEarnings}
          >
            <Text style={styles.link}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* ORDERS */}

        <StatRow
          label="Orders Delivered"
          value={orders}
          large
        />

        {/* TOTAL */}

        <StatRow
          label="Total Earnings"
          value={`₹${formatMoney(total)}`}
          large
        />
        
        {/* ZESTBOT BREAKDOWN */}

        {isZestbotEmployee && (
          <>
            <StatRow
              label="Salary"
              value={`₹${formatMoney(
                salary
              )}`}
            />

            <StatRow
              label="Tips"
              value={`₹${formatMoney(
                tips
              )}`}
            />

            <StatRow
              label="Incentives"
              value={`₹${formatMoney(
                incentives
              )}`}
            />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(
  WeeklyStatsCard
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9FDE6",
    borderRadius: wp("4%"),
    padding: wp("4%"),
    marginTop: wp("4%"),

    borderWidth: 1.5,
    borderColor: "#22C55E",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: wp("3%"),
  },

  title: {
    fontSize: wp("4.2%"),
    fontWeight: "700",
    color: "#16A34A",
  },

  link: {
    fontSize: wp("3.2%"),
    color: "#FFFFFF",
    fontWeight: "600",

    backgroundColor: "#16A34A",

    paddingVertical: wp("1%"),
    paddingHorizontal: wp("3%"),

    borderRadius: wp("2%"),
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: wp("2.8%"),
  },

  label: {
    flex: 1,

    fontSize: wp("3.4%"),
    color: "#065F46",
    fontWeight: "500",
  },

  value: {
    fontSize: wp("3.6%"),
    fontWeight: "700",
    color: "#022C22",

    marginLeft: wp("3%"),
  },

  largeLabel: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
  },

  largeValue: {
    fontSize: wp("4.2%"),
    fontWeight: "800",
  },
});