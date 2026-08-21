import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Svg, { Rect, Text as TextSvg, Line } from 'react-native-svg';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { formatMoney } from '../../../utils/formatMoney';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const PADDING_LEFT = isTablet ? wp(12) : wp(10);
const PADDING_RIGHT = wp(2);
const PADDING_TOP = wp(6);   // extra headroom so value labels above bars don't clip
const PADDING_BOTTOM = wp(7);  // day labels

const BAR_RADIUS = 4;
const Y_AXIS_LABELS = 4;
const BAR_COLOR = '#10B981';
const BAR_COLOR_ACTIVE = '#059669';
const VALUE_LABEL_GAP = 4;    // px gap between top of bar and value text

export default function WeeklyEarningsChart({ data, width: chartWidth, height: chartHeight, earningsDataLoading }) {

  const [currentWeekIndex, setCurrentWeekIndex] = useState(() => {
    if (!data?.length) return 0;

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const groupedWeeks = [];
    let currentWeek = [];

    data.forEach(item => {
      const date = new Date(year, month, item.day);
      const dayOfWeek = date.getDay();
      const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      currentWeek.push(item);

      if (mondayIndex === 6 || item.day === data[data.length - 1].day) {
        groupedWeeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return groupedWeeks.findIndex(week =>
      week.some(item => item.day === today.getDate()),
    );
  });

  const weeks = useMemo(() => {
    if (!data?.length) return [];

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const groupedWeeks = [];
    let currentWeek = [];

    data.forEach(item => {
      const date = new Date(year, month, item.day);
      const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

      // Convert so Monday = 0 ... Sunday = 6
      const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      currentWeek.push({
        ...item,
        label: String(item.day),
        value: item.amount ?? 0,
      });

      // End of week (Sunday) or last day of month
      if (mondayIndex === 6 || item.day === data[data.length - 1].day) {
        groupedWeeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return groupedWeeks;
  }, [data]);

  const weekData = weeks[currentWeekIndex] || [];

  const [activeIndex, setActiveIndex] = useState(null);

  const rawMaxValue = Math.max(
    ...weekData.map(item => item.value ?? 0),
    0,
  );

  const maxValue =
    rawMaxValue === 0
      ? 100
      : Math.ceil(rawMaxValue / (Y_AXIS_LABELS - 1)) *
      (Y_AXIS_LABELS - 1);

  const plotWidth = chartWidth - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = chartHeight - PADDING_TOP - PADDING_BOTTOM;

  const barGroupWidth = plotWidth / Math.max(weekData.length, 1);
  const barWidth = barGroupWidth * 0.45;

  const points = useMemo(() => {
    return weekData.map((item, index) => {
      const value = item.value ?? 0;

      const barX =
        PADDING_LEFT +
        index * barGroupWidth +
        (barGroupWidth - barWidth) / 2;

      const barHeight = (value / maxValue) * plotHeight;

      const centerX = barX + barWidth / 2;

      return {
        ...item,
        value,
        barX,
        barHeight,
        centerX,
      };
    });
  }, [
    weekData,
    maxValue,
    plotHeight,
    barGroupWidth,
    barWidth,
  ]);

  const panResponder = require('react-native').PanResponder.create({
  onStartShouldSetPanResponder: () => false,

  onMoveShouldSetPanResponder: (_, gestureState) => {
    // Only capture horizontal swipes
    return (
      Math.abs(gestureState.dx) >
      Math.abs(gestureState.dy) * 1.5
    );
  },

  onPanResponderGrant: (_, g) => {
    const i = Math.floor(
      (g.x0 - PADDING_LEFT) / barGroupWidth
    );

    if (i >= 0 && i < weekData.length) {
      setActiveIndex(i);
    }
  },

  onPanResponderMove: (_, g) => {
    const i = Math.floor(
      (g.moveX - PADDING_LEFT) / barGroupWidth
    );

    if (i >= 0 && i < weekData.length) {
      setActiveIndex(i);
    }
  },

  onPanResponderRelease: () => {
    setActiveIndex(null);
  },

  onPanResponderTerminate: () => {
    setActiveIndex(null);
  },
});
  const yLabel = (value) => {
    if (value === 0) return '0';
    if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
    return `${value}`;
  };

  // Format value above bar
  const valueLabel = (value) => {
    if (value === 0) return '';
    if (value >= 1000) return `₹${formatMoney(value)}`;
    return `₹${formatMoney(value)}`;
  };

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
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.weekHeader}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            currentWeekIndex === 0 && styles.iconButtonDisabled,
          ]}
          disabled={currentWeekIndex === 0}
          onPress={() => setCurrentWeekIndex(prev => prev - 1)}
        >
          {/* <MaterialIcons
            name="chevron-left"
            size={isTablet ? 30 : 26}
            color={currentWeekIndex === 0 ? '#C7CDD4' : '#16A34A'}
          /> */}
          <Text
            style={[
              styles.arrow,
              currentWeekIndex === 0 && styles.disabled,
            ]}
          >
            ◀
          </Text>
        </TouchableOpacity>

        <Text style={styles.weekText}>
          Week {currentWeekIndex + 1} of {weeks.length}
        </Text>

        <TouchableOpacity
          style={[
            styles.iconButton,
            currentWeekIndex === weeks.length - 1 &&
            styles.iconButtonDisabled,
          ]}
          disabled={currentWeekIndex === weeks.length - 1}
          onPress={() => setCurrentWeekIndex(prev => prev + 1)}
        >
          {/* <MaterialIcons
            name="chevron-right"
            size={isTablet ? 30 : 26}
            color={
              currentWeekIndex === weeks.length - 1
                ? '#C7CDD4'
                : '#16A34A'
            }
          /> */}
          <Text
            style={[
              styles.arrow,
              currentWeekIndex === weeks.length - 1 && styles.disabled,
            ]}
          >
            ▶
          </Text>
        </TouchableOpacity>
      </View>

      <Svg width={chartWidth} height={chartHeight}>

        {/* Grid lines + Y-axis labels */}
        {Array.from({ length: Y_AXIS_LABELS }).map((_, i) => {
          const y = PADDING_TOP + (i * plotHeight) / (Y_AXIS_LABELS - 1);
          const value = Math.round((maxValue / (Y_AXIS_LABELS - 1)) * (Y_AXIS_LABELS - 1 - i));
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
                fontSize={isTablet ? wp(2.4) : wp(2.8)}
                fill="#9CA3AF"
                textAnchor="end"
              >
                {`₹${yLabel(value)}`}
              </TextSvg>
            </React.Fragment>
          );
        })}

        {points.map((p, index) => {
          const isActive = activeIndex === index;
          const hasValue = p.value > 0;
          const displayH = Math.max(p.barHeight, hasValue ? BAR_RADIUS * 2 : 0);
          const displayY = PADDING_TOP + plotHeight - displayH;
          const valueLabelY = displayY - VALUE_LABEL_GAP;
          return (
            <React.Fragment key={`bar-${index}`}>
              {hasValue && (
                <Rect
                  x={p.barX} y={displayY}
                  width={barWidth} height={displayH}
                  rx={BAR_RADIUS}
                  fill={isActive ? BAR_COLOR_ACTIVE : BAR_COLOR}
                  opacity={isActive ? 1 : 0.88}
                />
              )}

              {hasValue && (
                <TextSvg
                  x={p.centerX}
                  y={valueLabelY}
                  fontSize={isTablet ? wp(2.2) : wp(2.6)}
                  fill={isActive ? '#059669' : '#374151'}
                  textAnchor="middle"
                  fontWeight={isActive ? '700' : '500'}
                >
                  {valueLabel(p.value)}
                </TextSvg>
              )}

              {/* Day label */}
              <TextSvg
                x={p.centerX}
                y={chartHeight - wp(1.5)}
                fontSize={isTablet ? wp(2.6) : wp(3.2)}
                fill={isActive ? '#111827' : '#9CA3AF'}
                textAnchor="middle"
                fontWeight={isActive ? '600' : '400'}
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

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconButton: {
    width: isTablet ? 42 : 36,
    height: isTablet ? 42 : 36,
    borderRadius: isTablet ? 21 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  weekText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#111827',
  },
  arrow: {
    fontSize: isTablet ? 28 : 24,
    color: '#10B981',
    fontWeight: '700',
  },
  disabled: {
    color: '#D1D5DB',
  },
});