import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Svg, {
  Rect,
  Text as TextSvg,
  Line,
} from 'react-native-svg';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { formatMoney } from '../../../utils/formatMoney';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

/* =========================================================
   CHART CONSTANTS
========================================================= */

const PADDING_LEFT = wp(10);
const PADDING_RIGHT = wp(2);
const PADDING_TOP = wp(6);

/*
 * Increased bottom padding so day labels
 * have enough space and don't get clipped.
 */
const PADDING_BOTTOM = wp(10);

const BAR_RADIUS = 4;
const VALUE_LABEL_GAP = 5;

/* =========================================================
   BAR CHART
========================================================= */

function BarChart({
  data = [],
  chartWidth,
  chartHeight,
  getValue,
  yLabelFormat,
  yAxisCount = 4,
  barColor = '#10B981',
  barColorActive = '#059669',
  valueLabelFormat,
  onBarPress,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  /*
   * Make sure we always have valid dimensions.
   */
  const safeWidth = Math.max(chartWidth || 0, 1);
  const safeHeight = Math.max(chartHeight || 0, 1);

  const plotWidth =
    safeWidth - PADDING_LEFT - PADDING_RIGHT;

  const plotHeight =
    safeHeight - PADDING_TOP - PADDING_BOTTOM;

  const barGroupWidth =
    data.length > 0
      ? plotWidth / data.length
      : plotWidth;

  const barWidth =
    Math.max(barGroupWidth * 0.45, 4);

  /*
   * Calculate maximum value.
   */
  const rawMax =
    data.length > 0
      ? Math.max(
          ...data.map(item => {
            const value = Number(getValue(item)) || 0;
            return value;
          }),
          0,
        )
      : 0;

  const safeYAxisCount = Math.max(yAxisCount, 2);

  const maxValue =
    rawMax === 0
      ? safeYAxisCount - 1
      : Math.ceil(
          rawMax / (safeYAxisCount - 1),
        ) *
        (safeYAxisCount - 1);

  /*
   * Calculate bars.
   */
  const points = useMemo(() => {
    return data.map((item, index) => {
      const val = Number(getValue(item)) || 0;

      const barX =
        PADDING_LEFT +
        index * barGroupWidth +
        (barGroupWidth - barWidth) / 2;

      const barHeight =
        maxValue > 0
          ? (val / maxValue) * plotHeight
          : 0;

      const barY =
        PADDING_TOP +
        plotHeight -
        barHeight;

      const centerX =
        barX + barWidth / 2;

      return {
        ...item,
        val,
        barX,
        barY,
        barHeight,
        centerX,
      };
    });
  }, [
    data,
    barGroupWidth,
    barWidth,
    maxValue,
    plotHeight,
    getValue,
  ]);

  /*
   * Important:
   *
   * DO NOT use PanResponder here.
   *
   * PanResponder was capturing the touch gesture
   * and preventing the parent ScrollView from scrolling.
   *
   * Instead, individual bars use onPress.
   */
  const handleBarPress = index => {
    setActiveIndex(index);

    if (onBarPress) {
      onBarPress(index);
    }
  };

  return (
    <View style={bcStyles.container}>
      <Svg
        width={safeWidth}
        height={safeHeight}
      >
        {/* =================================================
            Y AXIS GRID + LABELS
        ================================================= */}

        {Array.from({
          length: safeYAxisCount,
        }).map((_, i) => {
          const y =
            PADDING_TOP +
            (i * plotHeight) /
              (safeYAxisCount - 1);

          const value = Math.round(
            (maxValue /
              (safeYAxisCount - 1)) *
              (safeYAxisCount - 1 - i),
          );

          return (
            <React.Fragment
              key={`grid-${i}`}
            >
              {/* Horizontal grid line */}
              <Line
                x1={PADDING_LEFT}
                x2={
                  safeWidth -
                  PADDING_RIGHT
                }
                y1={y}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth={1}
              />

              {/* Y axis value */}
              <TextSvg
                x={
                  PADDING_LEFT -
                  wp(1)
                }
                y={y + 4}
                fontSize={
                  isTablet
                    ? wp(2.3)
                    : wp(2.7)
                }
                fill="#9CA3AF"
                textAnchor="end"
              >
                {yLabelFormat
                  ? yLabelFormat(value)
                  : `${value}`}
              </TextSvg>
            </React.Fragment>
          );
        })}

        {/* =================================================
            X AXIS BASE LINE
        ================================================= */}

        <Line
          x1={PADDING_LEFT}
          x2={
            safeWidth -
            PADDING_RIGHT
          }
          y1={
            PADDING_TOP +
            plotHeight
          }
          y2={
            PADDING_TOP +
            plotHeight
          }
          stroke="#D1D5DB"
          strokeWidth={1}
        />

        {/* =================================================
            BARS + X LABELS
        ================================================= */}

        {points.map((p, index) => {
          const isActive =
            activeIndex === index;

          const hasValue = p.val > 0;

          /*
           * Keep a tiny bar for positive values.
           */
          const displayH = Math.max(
            p.barHeight,
            hasValue
              ? BAR_RADIUS * 2
              : 0,
          );

          const displayY =
            PADDING_TOP +
            plotHeight -
            displayH;

          const valueLabelY =
            Math.max(
              displayY -
                VALUE_LABEL_GAP,
              PADDING_TOP -
                2,
            );

          return (
            <React.Fragment
              key={`bar-${index}`}
            >
              {/* =================================================
                  BAR
              ================================================= */}

              {hasValue && (
                <Rect
                  x={p.barX}
                  y={displayY}
                  width={barWidth}
                  height={displayH}
                  rx={BAR_RADIUS}
                  fill={
                    isActive
                      ? barColorActive
                      : barColor
                  }
                  opacity={
                    isActive
                      ? 1
                      : 0.88
                  }

                  /*
                   * onPress only handles a tap.
                   * It does NOT capture vertical scrolling
                   * like PanResponder did.
                   */
                  onPress={() =>
                    handleBarPress(index)
                  }
                />
              )}

              {/* =================================================
                  VALUE ABOVE BAR
              ================================================= */}

              {hasValue && (
                <TextSvg
                  x={p.centerX}
                  y={valueLabelY}
                  fontSize={
                    isTablet
                      ? wp(2.2)
                      : wp(2.6)
                  }
                  fill={
                    isActive
                      ? barColorActive
                      : '#374151'
                  }
                  textAnchor="middle"
                  fontWeight={
                    isActive
                      ? '800'
                      : '600'
                  }
                  onPress={() =>
                    handleBarPress(index)
                  }
                >
                  {valueLabelFormat
                    ? valueLabelFormat(p)
                    : `${p.val}`}
                </TextSvg>
              )}

              {/* =================================================
                  X AXIS DAY LABEL
              ================================================= */}

              <TextSvg
                x={p.centerX}
                y={
                  safeHeight -
                  wp(3)
                }
                fontSize={
                  isTablet
                    ? wp(2.6)
                    : wp(3.2)
                }
                fill={
                  isActive
                    ? '#111827'
                    : '#6B7280'
                }
                textAnchor="middle"
                fontWeight={
                  isActive
                    ? '800'
                    : '600'
                }
                onPress={() =>
                  handleBarPress(index)
                }
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

/* =========================================================
   WEEK NAVIGATOR
========================================================= */

const WeekNavigator = ({
  currentWeekIndex,
  totalWeeks,
  onPrevious,
  onNext,
}) => {
  const isFirst =
    currentWeekIndex === 0;

  const isLast =
    currentWeekIndex ===
    totalWeeks - 1;

  return (
    <View style={styles.weekNavigation}>
      <TouchableOpacity
        disabled={isFirst}
        style={styles.iconButton}
        onPress={onPrevious}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.arrow,
            isFirst &&
              styles.disabled,
          ]}
        >
          ◀
        </Text>
      </TouchableOpacity>

      <Text style={styles.weekTitle}>
        Week {currentWeekIndex + 1} of{' '}
        {totalWeeks}
      </Text>

      <TouchableOpacity
        disabled={isLast}
        style={styles.iconButton}
        onPress={onNext}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.arrow,
            isLast &&
              styles.disabled,
          ]}
        >
          ▶
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WeeklyEarningsChartZestBot({
  data = [],
  width: chartWidth,
  height: chartHeight,
  monthlyTarget,
  completedOrders,
  weeklyTotal,
  eligible,
  earningsDataLoading,
}) {
  const target =
    Number(monthlyTarget) || 0;

  const completed =
    Number(completedOrders) || 0;

  const isComplete =
    eligible === true;

  const remaining =
    Math.max(
      target - completed,
      0,
    );

  const progressPct =
    target > 0
      ? Math.min(
          (completed / target) * 100,
          100,
        )
      : 0;

  const [currentWeekIndex, setCurrentWeekIndex] =
    useState(0);

  /* =========================================================
     PREPARE WEEKS
  ========================================================= */

  const weeks = useMemo(() => {
    if (!Array.isArray(data) || !data.length) {
      return [];
    }

    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      today.getMonth();

    const result = [];

    let currentWeek = [];

    data.forEach(item => {
      const day =
        Number(item.day) || 0;

      const date = new Date(
        year,
        month,
        day,
      );

      const dayOfWeek =
        date.getDay();

      /*
       * Monday starts a new week.
       */
      if (
        dayOfWeek === 1 &&
        currentWeek.length > 0
      ) {
        result.push(
          currentWeek,
        );

        currentWeek = [];
      }

      currentWeek.push({
        ...item,

        /*
         * X axis:
         * 1, 2, 3, 4...
         */
        label: String(day),

        value:
          Number(item.amount) || 0,

        orders:
          Number(item.orders) || 0,
      });
    });

    if (currentWeek.length > 0) {
      result.push(
        currentWeek,
      );
    }

    return result;
  }, [data]);

  /* =========================================================
     SELECT CURRENT WEEK
  ========================================================= */

  useEffect(() => {
    if (!weeks.length) {
      setCurrentWeekIndex(0);
      return;
    }

    const today =
      new Date();

    const currentDay =
      today.getDate();

    const index =
      weeks.findIndex(
        week =>
          week.some(
            item =>
              Number(item.day) ===
              currentDay,
          ),
      );

    if (index !== -1) {
      setCurrentWeekIndex(index);
    }
  }, [weeks]);

  const weekData =
    weeks[currentWeekIndex] || [];

  /* =========================================================
     LOADING
  ========================================================= */

  if (earningsDataLoading) {
    return (
      <View
        style={{
          height: chartHeight,
          justifyContent:
            'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#10B981"
        />
      </View>
    );
  }

  /* =========================================================
     EMPTY DATA
  ========================================================= */

  if (!weeks.length) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            height: chartHeight,
          },
        ]}
      >
        <Text style={styles.emptyText}>
          No weekly data available
        </Text>
      </View>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <View>
      {/* =====================================================
          BEFORE TARGET
      ===================================================== */}

      {!isComplete && (
        <>
          {/* Section header */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              Weekly Orders
            </Text>

            <View
              style={[
                styles.pill,
                styles.pillAmber,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  styles.pillTextAmber,
                ]}
              >
                {completed} / {target}{' '}
                orders
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descPanel}>
            <Text style={styles.descCount}>
              {completed} / {target}{' '}
              Orders
            </Text>

            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  styles.fillAmber,
                  {
                    width: `${progressPct}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.descLocked}>
              {remaining} more{' '}
              {remaining === 1
                ? 'order'
                : 'orders'}{' '}
              to unlock earnings
            </Text>
          </View>

          <Text style={styles.chartLabel}>
            Daily Orders
          </Text>

          <WeekNavigator
            currentWeekIndex={
              currentWeekIndex
            }
            totalWeeks={
              weeks.length
            }
            onPrevious={() =>
              setCurrentWeekIndex(
                index =>
                  Math.max(
                    index - 1,
                    0,
                  ),
              )
            }
            onNext={() =>
              setCurrentWeekIndex(
                index =>
                  Math.min(
                    index + 1,
                    weeks.length -
                      1,
                  ),
              )
            }
          />

          <BarChart
            data={weekData}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            getValue={item =>
              item.orders ?? 0
            }
            yLabelFormat={value =>
              `${value}`
            }
            yAxisCount={5}
            barColor="#F59E0B"
            barColorActive="#D97706"
            valueLabelFormat={item =>
              `${item.orders ?? 0} ${
                (item.orders ?? 0) === 1
                  ? 'order'
                  : 'orders'
              }`
            }
          />
        </>
      )}

      {/* =====================================================
          AFTER TARGET
      ===================================================== */}

      {isComplete && (
        <>
          {/* Section header */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              Weekly Incentives
            </Text>

            <View
              style={[
                styles.pill,
                styles.pillGreen,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  styles.pillTextGreen,
                ]}
              >
                ✓ Target Achieved
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descPanel}>
            <Text style={styles.descCount}>
              {completed} / {target}{' '}
              Orders
            </Text>

            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  styles.fillGreen,
                  {
                    width: '100%',
                  },
                ]}
              />
            </View>

            <Text style={styles.descUnlock}>
              Incentive earnings unlocked
            </Text>

            <Text style={styles.earningsTotal}>
              ₹
              {formatMoney(
                weeklyTotal ?? 0,
              )}
            </Text>
          </View>

          <WeekNavigator
            currentWeekIndex={
              currentWeekIndex
            }
            totalWeeks={
              weeks.length
            }
            onPrevious={() =>
              setCurrentWeekIndex(
                index =>
                  Math.max(
                    index - 1,
                    0,
                  ),
              )
            }
            onNext={() =>
              setCurrentWeekIndex(
                index =>
                  Math.min(
                    index + 1,
                    weeks.length -
                      1,
                  ),
              )
            }
          />

          <BarChart
            data={weekData}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            getValue={item =>
              item.value ?? 0
            }
            yLabelFormat={value => {
              if (value === 0) {
                return '0';
              }

              if (value >= 1000) {
                return `₹${(
                  value / 1000
                ).toFixed(0)}k`;
              }

              return `₹${value}`;
            }}
            yAxisCount={4}
            barColor="#10B981"
            barColorActive="#059669"
            valueLabelFormat={item =>
              item.value > 0
                ? `₹${formatMoney(
                    item.value,
                  )}`
                : ''
            }
          />
        </>
      )}
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },

  sectionTitle: {
    fontSize:
      isTablet
        ? wp(3)
        : wp(4),
    fontWeight: '600',
    color: '#111827',
  },

  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: hp(1.5),
  },

  weekTitle: {
    fontSize:
      isTablet
        ? wp(2.8)
        : wp(3.8),
    fontWeight: '600',
    color: '#111827',
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent:
      'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  arrow: {
    fontSize:
      isTablet
        ? 28
        : 24,
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

  pillAmber: {
    backgroundColor: '#FEF3C7',
  },

  pillGreen: {
    backgroundColor: '#D1FAE5',
  },

  pillText: {
    fontSize:
      isTablet
        ? wp(2.2)
        : wp(3),
    fontWeight: '600',
  },

  pillTextAmber: {
    color: '#92400E',
  },

  pillTextGreen: {
    color: '#065F46',
  },

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
    fontSize:
      isTablet
        ? wp(2.8)
        : wp(3.8),
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

  fill: {
    height: '100%',
    borderRadius: 99,
  },

  fillAmber: {
    backgroundColor: '#F59E0B',
  },

  fillGreen: {
    backgroundColor: '#10B981',
  },

  descUnlock: {
    fontSize:
      isTablet
        ? wp(2.4)
        : wp(3.2),
    color: '#059669',
    fontWeight: '500',
  },

  descLocked: {
    fontSize:
      isTablet
        ? wp(2.4)
        : wp(3.2),
    color: '#9CA3AF',
  },

  earningsTotal: {
    fontSize:
      isTablet
        ? wp(4)
        : wp(5.5),
    fontWeight: '700',
    color: '#111827',
    marginTop: hp(0.8),
  },

  chartLabel: {
    fontSize:
      isTablet
        ? wp(2.4)
        : wp(3.2),
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: hp(0.5),
  },

  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: wp(3.5),
  },
});

const bcStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});