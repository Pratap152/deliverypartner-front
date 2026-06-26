import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProgressBar from './ProgressBar';

export default function IncentiveCard({ item, weeklyCompletedOrders, dailyCompletedOrders, peakCompletedOrders, weeklyProgressPercentage }) {
  // console.log("ITEMMMM: ", item);
  const isPeak = item?.type === 'peak';
  const isWeekly = item?.type === 'weekly';
  const isDaily = item?.type === 'daily';

  const GREEN_THEME = {
    primary: '#10B981',     // main fill
    deep: '#065F46',        // text accent
    soft: '#D1FAE5',        // light bg
    border: '#A7F3D0',      // soft border
  };

  const metaIcons = {
    peak: { label: 'Peak', icon: require('../../../assets/peak.png') },
    weekly: { label: 'Weekly', icon: require('../../../assets/weekly.png') },
    daily: { label: 'Daily', icon: require('../../../assets/daily.png') },
    surge: { label: 'Surge', icon: require('../../../assets/surge.png') },
  };

  const meta = metaIcons[item?.type] ?? metaIcons.daily;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            item?.type === 'peak'
              ? '#FFF7ED'
              : item?.type === 'weekly'
                ? '#FAF5FF'
                : '#EFF6FF',
          borderColor:
            item?.type === 'peak'
              ? '#FFD6A7'
              : item?.type === 'weekly'
                ? '#E9D4FF'
                : '#BEDBFF',
          borderWidth: 1,
        },
      ]}>

      <View style={styles.topRow}>
        <View style={styles.left}>
          <View
            style={[
              styles.labelChip,
              {
                backgroundColor: '#FFFFFF',
              },
            ]}
          >
            <Text style={[styles.chipText, {
              color: item?.type === 'peak'
                ? '#F54900'
                : item?.type === 'weekly'
                  ? '#9810FA'
                  : '#155DFC'
            }]}>{meta.label}</Text>
          </View>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.subtitle}>{item?.subtitle}</Text>
        </View>
        <View style={styles.right}>
          {
            isWeekly && (
              <Image source={require('../../../assets/weekly.png')} style={styles.icon} />
            )
          }
          {
            isDaily && (
              <Image source={require('../../../assets/daily.png')} style={styles.icon} />
            )
          }
          {
            isPeak && (
              <Image source={require('../../../assets/peak.png')} style={styles.icon} />
            )
          }
        </View>
      </View>

      {/* Peak: multi-level UI */}
      {(isPeak && !item?.emptyData) && (
        <>
          {item?.minOrders !== 0 &&
            <View style={{ marginTop: hp(1) }}>
              {/* Normal Slot Progress */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={styles.progressText}>
                  Orders
                </Text>
                <Text style={styles.progressText}>
                  {peakCompletedOrders}/{item?.minOrders}
                </Text>
              </View>

              <ProgressBar
                progress={(peakCompletedOrders / item?.minOrders) * 100}
                progressColor="#FFD6A7"
              />
            </View>
          }
        </>
      )}

      {(isDaily && !item?.emptyData &&
        (item?.daily_data?.data[0].ruleType !== "TASK" && item?.daily_data?.data[0].ruleType !== "PER_ORDER")
      ) &&
        (
          <View style={{ marginTop: hp(1) }}>
            {/* Normal Slot Progress */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={styles.progressText}>
                Orders
              </Text>
              <Text style={styles.progressText}>
                {dailyCompletedOrders}/{item?.minOrders}
              </Text>
            </View>

            <ProgressBar
              progress={(dailyCompletedOrders / item?.minOrders) * 100}
              progressColor="#BEDBFF"
            />
          </View>
        )}

      {/* Weekly or fallback single progress bar */}
      {isWeekly && !item?.emptyData && (
        <>
          {(item?.minOrders > 0) && (
            <>
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>
                  {weeklyCompletedOrders}/{item?.minOrders}
                </Text>
              </View>

              <ProgressBar
                progress={Math.round((weeklyCompletedOrders / item?.minOrders) * 100)}
                progressColor="#E9D4FF"
              />
            </>
          )}

          {item?.weekly_data?.data[0]?.ruleType === "TASK" &&
            <View>
              <Text style={[styles.progressText, { marginBottom: 5 }]}>Progress: {Math.round(weeklyProgressPercentage)}%</Text>
              <ProgressBar
                progress={weeklyProgressPercentage}
                progressColor="#E9D4FF"
              />
            </View>
          }
        </>
      )}
      {
        item?.emptyData && (
          <Text>
            Incentives not found, please come back later
          </Text>
        )
      }

      {/* reward / CTA */}
      <View style={styles.bottomRow}>
        {item?.type !== 'peak' && (
          <Text style={styles.rewardValue}>{item?.value}</Text>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    width: wp(92),
    alignSelf: 'center',
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: wp(3),
    // card shadow
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 6 },
    }),
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  left: { flex: 1, paddingRight: wp(2) },
  right: { backgroundColor: '#FFF', padding: 10, borderRadius: 15 },
  labelChip: { backgroundColor: '#ffffff', paddingHorizontal: wp(2), paddingVertical: hp(0.3), borderRadius: wp(1.5), alignSelf: 'flex-start', marginBottom: hp(0.4) },
  chipText: { fontSize: 14, fontWeight: '700' },
  title: { fontSize: wp(4.2), fontWeight: '600', color: '#111' },
  subtitle: { fontSize: wp(3.3), color: '#6B7280', marginTop: hp(0.3) },
  icon: { width: wp(8), height: wp(8), resizeMode: 'contain' },

  slabsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(1) },
  slab: { flex: 1, backgroundColor: 'rgba(0,0,0,0.03)', padding: wp(2), marginHorizontal: wp(0.5), borderRadius: wp(2), alignItems: 'center' },
  slabOrders: { fontSize: wp(3.2), color: '#374151' },
  slabReward: { fontSize: wp(3.4), fontWeight: '700', marginTop: hp(0.3) },

  progressRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: hp(1) },
  progressText: { fontSize: wp(3.5), fontWeight: '500' },
  progressMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: hp(1) },

  smallMuted: { color: '#6B7280', fontSize: wp(3) },
  bottomRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: hp(1) },
  rewardLabel: { fontSize: wp(3.2), color: '#6B7280' },
  rewardValue: {
    fontSize: wp(4.2),
    fontWeight: '700',
    color: '#065F46',
  }

});