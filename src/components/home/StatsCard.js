import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import EarningsScreen from "../../screens/dashboard/EarningsScreen";
import EarningsHistoryScreen from "../../screens/earnings/EarningsHistoryScreen";
import OrderHistory from "../../screens/profile/OrderHistory";
import Tips from "../../screens/Home/Tips";

import useEarningsDashboard from "../../hooks/useEarningsDashboard";
import useTodayOrdersCount from "../../hooks/useTodayOrdersCount";

import { formatMoney } from "../../utils/formatMoney";

const StatItem = ({
  icon,
  value,
  label,
  bgColor,
  screen,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (!screen) return;

    if (typeof screen === "object") {
      navigation.navigate(screen.parent, {
        screen: screen.child,
      });
    } else {
      navigation.navigate(screen);
    }
  };

  const renderLabel = () => {
    const parts = {
      "Monthly Earnings": ["Monthly", "Earnings"],
      "Monthly Orders": ["Monthly", "Orders"],
      "Monthly Tips": ["Monthly", "Tips"],
      "Today's Earnings": ["Today's", "Earnings"],
      "Today's Orders": ["Today's", "Orders"],
      "Today's Tips": ["Today's", "Tips"],
    };

    if (parts[label]) {
      return (
        <>
          <Text style={styles.label}>{parts[label][0]}</Text>
          <Text style={styles.label}>{parts[label][1]}</Text>
        </>
      );
    }

    return (
      <Text style={styles.label}>
        {label}
      </Text>
    );
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.statContent}
        onPress={handlePress}
        disabled={!screen}
      >
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: bgColor },
          ]}
        >
          <Ionicons
            name={icon}
            size={wp("5%")}
            color="#fff"
          />
        </View>

        <Text
          style={styles.value}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>

        <View style={styles.labelContainer}>
          {renderLabel()}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const StatsCard = ({
  isActive,
  totalOnlineMinutes,
}) => {
  const { data } = useEarningsDashboard();

  const {
    todayEarnings = {},
    earningsSummary = {},
    riderType = "",
  } = data || {};

  const [minutes, setMinutes] = useState(
    totalOnlineMinutes || 0
  );

  const todayOrdersCount =
    useTodayOrdersCount();

  const isZestbotEmployee =
    riderType === "ZESTBOT_EMPLOYEE";

  /*
   * NEW SUMMARY API VALUES
   */
  const monthlyEarnings =
    Number(
      earningsSummary?.month?.total || 0
    );

  const monthlyTips =
    Number(
      earningsSummary?.month?.tips || 0
    );

  const monthlyOrders =
    Number(
      earningsSummary?.month?.orders || 0
    );

  useEffect(() => {
    setMinutes(totalOnlineMinutes || 0);

    if (!isActive) return;

    const interval = setInterval(() => {
      setMinutes((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, [isActive, totalOnlineMinutes]);

  const formatTime = (totalMinutes) => {
    const hrs = Math.floor(
      totalMinutes / 60
    );

    const mins = totalMinutes % 60;

    return `${hrs}h ${
      mins < 10 ? "0" : ""
    }${mins}m`;
  };

  const earningsValue = isZestbotEmployee
    ? `₹${formatMoney(monthlyEarnings)}`
    : `₹${formatMoney(
        todayEarnings?.total || 0
      )}`;

  const tipsValue = isZestbotEmployee
    ? `₹${formatMoney(monthlyTips)}`
    : `₹${formatMoney(
        todayEarnings?.tips || 0
      )}`;

  const ordersValue = isZestbotEmployee
    ? monthlyOrders
    : todayOrdersCount;

  const earningsLabel = "Earnings";

  const tipsLabel = "Tips";

  const ordersLabel = "Orders";

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatItem
          icon="trending-up"
          value={earningsValue}
          label={earningsLabel}
          bgColor="#2ECC71"
          screen={
            isZestbotEmployee
              ? EarningsScreen
              : EarningsHistoryScreen
          }
        />

        <StatItem
          icon="cash-outline"
          value={tipsValue}
          label={tipsLabel}
          bgColor="#8E7CF3"
          screen={Tips}
        />

        <StatItem
          icon="cart-outline"
          value={ordersValue}
          label={ordersLabel}
          bgColor="#FF6FAE"
          screen={OrderHistory}
        />
      </View>
    </View>
  );
};

export default React.memo(StatsCard);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp("2%"),
    marginTop: wp("4%"),
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  card: {
    width: wp("27%"),
    backgroundColor: "#FFFFFF",
    borderRadius: wp("4%"),
    paddingVertical: wp("4%"),
    margin: wp("1%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  statContent: {
    alignItems: "center",
    width: "100%",
  },

  iconWrapper: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: wp("3%"),
  },

  value: {
    fontSize: wp("4.3%"),
    fontWeight: "700",
    color: "#111",
  },

  labelContainer: {
    alignItems: "center",
    marginTop: wp("1%"),
    minHeight: wp("8%"),
  },

  label: {
    fontSize: wp("3.5%"),
    color: "#6c6c6e",
    textAlign: "center",
    lineHeight: wp("4%"),
  },
});