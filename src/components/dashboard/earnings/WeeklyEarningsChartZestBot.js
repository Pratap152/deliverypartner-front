import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Rect, Text as TextSvg, Line } from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { formatMoney } from '../../../utils/formatMoney';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const PADDING_LEFT = wp(10);
const PADDING_RIGHT = wp(2);
const PADDING_TOP = wp(6);
const PADDING_BOTTOM = wp(7);
const BAR_RADIUS = 4;
const VALUE_LABEL_GAP = 4;


function BarChart({
  data,
  chartWidth,
  chartHeight,
  getValue,
  yLabelFormat,
  yAxisCount = 4,
  barColor = '#10B981',
  barColorActive = '#059669',
  valueLabelFormat,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const plotWidth = chartWidth - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = chartHeight - PADDING_TOP - PADDING_BOTTOM;
  const barGroupWidth = plotWidth / data.length;
  const barWidth = barGroupWidth * 0.45;

  const rawMax = Math.max(...data.map(d => getValue(d)), 0);
  const maxValue = rawMax === 0
    ? yAxisCount - 1
    : Math.ceil(rawMax / (yAxisCount - 1)) * (yAxisCount - 1);

  const points = useMemo(() => {
    return data.map((item, index) => {
      const val = getValue(item);
      const barX = PADDING_LEFT + index * barGroupWidth + (barGroupWidth - barWidth) / 2;
      const barHeight = maxValue === 0 ? 0 : (val / maxValue) * plotHeight;
      const barY = PADDING_TOP + plotHeight - barHeight;
      const centerX = barX + barWidth / 2;
      return { ...item, val, barX, barY, barHeight, centerX };
    });
  }, [data, maxValue]);

  const panResponder = require('react-native').PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, g) => {
      const i = Math.floor((g.x0 - PADDING_LEFT) / barGroupWidth);
      if (i >= 0 && i < data.length) setActiveIndex(i);
    },
    onPanResponderMove: (_, g) => {
      const i = Math.floor((g.moveX - PADDING_LEFT) / barGroupWidth);
      if (i >= 0 && i < data.length) setActiveIndex(i);
    },
    onPanResponderRelease: () => setActiveIndex(null),
    onPanResponderTerminate: () => setActiveIndex(null),
  });

  return (
    <View style={bcStyles.container} {...panResponder.panHandlers}>
      <Svg width={chartWidth} height={chartHeight}>

        {/* Grid + Y labels */}
        {Array.from({ length: yAxisCount }).map((_, i) => {
          const y = PADDING_TOP + (i * plotHeight) / (yAxisCount - 1);
          const value = Math.round((maxValue / (yAxisCount - 1)) * (yAxisCount - 1 - i));
          return (
            <React.Fragment key={`grid-${i}`}>
              <Line
                x1={PADDING_LEFT} x2={chartWidth - PADDING_RIGHT}
                y1={y} y2={y}
                stroke="#E5E7EB" strokeWidth={1}
              />
              <TextSvg
                x={PADDING_LEFT - wp(0.5)}
                y={y + 4}
                fontSize={isTablet ? wp(2.3) : wp(2.7)}
                fill="#9CA3AF"
                textAnchor="end"
              >
                {yLabelFormat ? yLabelFormat(value) : `${value}`}
              </TextSvg>
            </React.Fragment>
          );
        })}

        {points.map((p, index) => {
          const isActive = activeIndex === index;
          const hasValue = p.val > 0;
          const displayH = Math.max(p.barHeight, hasValue ? BAR_RADIUS * 2 : 0);
          const displayY = PADDING_TOP + plotHeight - displayH;
          const valueLabelY = displayY - VALUE_LABEL_GAP;

          return (
            <React.Fragment key={`bar-${index}`}>
              {/* Coloured bar */}
              {hasValue && (
                <Rect
                  x={p.barX} y={displayY}
                  width={barWidth} height={displayH}
                  rx={BAR_RADIUS}
                  fill={isActive ? barColorActive : barColor}
                  opacity={isActive ? 1 : 0.88}
                />
              )}

              {/* Value above bar */}
              {hasValue && (
                <TextSvg
                  x={p.centerX}
                  y={valueLabelY}
                  fontSize={isTablet ? wp(2.2) : wp(2.6)}
                  fill={isActive ? barColorActive : '#374151'}
                  textAnchor="middle"
                  fontWeight={isActive ? '800' : '600'}
                >
                  {valueLabelFormat ? valueLabelFormat(p) : `${p.val}`}
                </TextSvg>
              )}

              {/* Day label */}
              <TextSvg
                x={p.centerX}
                y={chartHeight - wp(1.5)}
                fontSize={isTablet ? wp(2.6) : wp(3.2)}
                fill={isActive ? '#111827' : '#9CA3AF'}
                textAnchor="middle"
                fontWeight={isActive ? '800' : '600'}
              >
                {p.label}
              </TextSvg>
            </React.Fragment>
          );
        })}

      </Svg>
    </View>
  );
}

const bcStyles = StyleSheet.create({
  container: { alignSelf: 'center' },
});

const WeekNavigator = ({
  currentWeekIndex,
  totalWeeks,
  onPrevious,
  onNext,
}) => (
  <View style={styles.weekNavigation}>
    <TouchableOpacity
      disabled={currentWeekIndex === 0}
      style={styles.iconButton}
      onPress={onPrevious}
    >
      <Text
        style={[
          styles.arrow,
          currentWeekIndex === 0 && styles.disabled,
        ]}
      >
        ◀
      </Text>
    </TouchableOpacity>

    <Text style={styles.weekTitle}>
      Week {currentWeekIndex + 1} of {totalWeeks}
    </Text>

    <TouchableOpacity
      disabled={currentWeekIndex === totalWeeks - 1}
      style={styles.iconButton}
      onPress={onNext}
    >
      <Text
        style={[
          styles.arrow,
          currentWeekIndex === totalWeeks - 1 && styles.disabled,
        ]}
      >
        ▶
      </Text>
    </TouchableOpacity>
  </View>
);

export default function WeeklyEarningsChartZestBot({
  data,
  width: chartWidth,
  height: chartHeight,
  monthlyTarget,
  completedOrders,
  weeklyTotal,
  eligible,
  earningsDataLoading,
}) {
  const target = monthlyTarget ?? 0;
  const completed = completedOrders ?? 0;
  const isComplete = eligible === true;
  const remaining = Math.max(target - completed, 0);
  const progressPct = target > 0 ? Math.min((completed / target) * 100, 100) : 0;

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  React.useEffect(() => {
    if (!weeks.length) return;

    const today = new Date();
    const currentDay = today.getDate();

    const index = weeks.findIndex(week =>
      week.some(item => item.day === currentDay),
    );

    if (index !== -1) {
      setCurrentWeekIndex(index);
    }
  }, [weeks]);

  const weeks = useMemo(() => {
    if (!data?.length) return [];

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const weeks = [];
    let currentWeek = [];

    data.forEach(item => {
      const date = new Date(year, month, item.day);
      const dayOfWeek = date.getDay(); // Sun=0, Mon=1, ..., Sat=6

      // Start a new week every Monday (except for the very first item)
      if (dayOfWeek === 1 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push({
        ...item,
        label: String(item.day),
        value: item.amount ?? 0,
      });
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [data]);

  const weekData = weeks[currentWeekIndex] || [];

  if (earningsDataLoading) {
    return (
      <View
        style={{
          height: chartHeight,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View>
      {/* Before target */}
      {!isComplete && (
        <>
          {/* Section header */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Weekly Orders</Text>
            <View style={[styles.pill, styles.pillAmber]}>
              <Text style={[styles.pillText, styles.pillTextAmber]}>
                {`${completed} / ${target} orders`}
              </Text>
            </View>
          </View>

          {/* Description panel */}
          <View style={styles.descPanel}>
            <Text style={styles.descCount}>{completed} / {target} Orders</Text>
            <View style={styles.track}>
              <View style={[styles.fill, styles.fillAmber, { width: `${progressPct}%` }]} />
            </View>
            <Text style={styles.descLocked}>
              {remaining} more {remaining === 1 ? 'order' : 'orders'} to unlock earnings
            </Text>
          </View>

          {/* Orders chart — amber bars */}
          <Text style={styles.chartLabel}>Daily Orders</Text>

          <WeekNavigator
            currentWeekIndex={currentWeekIndex}
            totalWeeks={weeks.length}
            onPrevious={() => setCurrentWeekIndex(i => i - 1)}
            onNext={() => setCurrentWeekIndex(i => i + 1)}
          />

          <BarChart
            data={weekData}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            getValue={(item) => item.orders ?? 0}
            yLabelFormat={(v) => `${v}`}
            yAxisCount={5}
            barColor="#F59E0B"
            barColorActive="#D97706"
            valueLabelFormat={(p) =>
              `${p.orders ?? 0} ${(p.orders ?? 0) === 1 ? 'order' : 'orders'}`
            }
          />
        </>
      )}

      {/* After target */}
      {isComplete && (
        <>
          {/* Section header */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Weekly Incentives</Text>
            <View style={[styles.pill, styles.pillGreen]}>
              <Text style={[styles.pillText, styles.pillTextGreen]}>
                ✓ Target Achieved
              </Text>
            </View>
          </View>

          {/* Description panel */}
          <View style={styles.descPanel}>
            <Text style={styles.descCount}>{completed} / {target} Orders</Text>
            <View style={styles.track}>
              <View style={[styles.fill, styles.fillGreen, { width: '100%' }]} />
            </View>
            <Text style={styles.descUnlock}>Incentive earnings unlocked</Text>
            <Text style={styles.earningsTotal}>₹{formatMoney(weeklyTotal ?? 0)}</Text>
          </View>

          <WeekNavigator
            currentWeekIndex={currentWeekIndex}
            totalWeeks={weeks.length}
            onPrevious={() => setCurrentWeekIndex(i => i - 1)}
            onNext={() => setCurrentWeekIndex(i => i + 1)}
          />

          {/* Earnings chart — green bars */}
          <BarChart
            data={weekData}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            getValue={(item) => item.value ?? 0}
            yLabelFormat={(v) =>
              v === 0 ? '0' : v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
            }
            yAxisCount={4}
            barColor="#10B981"
            barColorActive="#059669"
            valueLabelFormat={(p) =>
              p.value > 0 ? `₹${formatMoney(p.value)}` : ''
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  sectionTitle: {
    fontSize: isTablet ? wp(3) : wp(4),
    fontWeight: '600',
    color: '#111827',
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: hp(1.5),
  },
  navButton: {
    fontSize: isTablet ? wp(3.2) : wp(5),
    fontWeight: '700',
    color: '#2E9B51',
    paddingHorizontal: wp(2),
  },
  disabledButton: {
    color: '#D1D5DB',
  },
  weekTitle: {
    fontSize: isTablet ? wp(2.8) : wp(3.8),
    fontWeight: '600',
    color: '#111827',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  arrow: {
    fontSize: isTablet ? 28 : 24,
    color: '#10B981',
    fontWeight: '700',
  },
  disabled: {
    color: '#D1D5DB',
  },
  pill: {
    paddingHorizontal: wp(2.5),
    paddingVertical: 3,
    borderRadius: 20,
  },
  pillAmber: { backgroundColor: '#FEF3C7' },
  pillGreen: { backgroundColor: '#D1FAE5' },
  pillText: {
    fontSize: isTablet ? wp(2.2) : wp(3),
    fontWeight: '600',
  },
  pillTextAmber: { color: '#92400E' },
  pillTextGreen: { color: '#065F46' },
  descPanel: {
    backgroundColor: '#F9FAFB',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    marginBottom: hp(1.5),
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  descCount: {
    fontSize: isTablet ? wp(2.8) : wp(3.8),
    fontWeight: '500',
    color: '#374151',
    marginBottom: hp(0.8),
  },
  track: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: hp(0.8),
  },
  fill: { height: '100%', borderRadius: 99 },
  fillAmber: { backgroundColor: '#F59E0B' },
  fillGreen: { backgroundColor: '#10B981' },
  descUnlock: {
    fontSize: isTablet ? wp(2.4) : wp(3.2),
    color: '#059669',
    fontWeight: '500',
  },
  descLocked: {
    fontSize: isTablet ? wp(2.4) : wp(3.2),
    color: '#9CA3AF',
  },
  earningsTotal: {
    fontSize: isTablet ? wp(4) : wp(5.5),
    fontWeight: '700',
    color: '#111827',
    marginTop: hp(0.8),
  },
  chartLabel: {
    fontSize: isTablet ? wp(2.4) : wp(3.2),
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: hp(0.5),
  },
});