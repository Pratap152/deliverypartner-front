import React, { useMemo, useState } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Text as TextSvg, Line } from 'react-native-svg';
import * as d3 from 'd3-shape';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const PADDING = wp(4);

const Y_AXIS_LABELS = 5;

export default function WeeklyEarningsChartEmployee({ data, width, height }) {
  const CHART_HEIGHT = height;
  const CHART_WIDTH = width;
  const [activeIndex, setActiveIndex] = useState(null);

  const rawMaxValue = Math.max(...data.map(d => d.orders), 0);

const maxValue =
  rawMaxValue <= 20
    ? 20
    : Math.ceil(rawMaxValue / 5) * 5;

  const points = useMemo(() => {
    return data.map((item, index) => {
      const x =
        PADDING +
        wp(6) + // pushes graph slightly right
        (index * (CHART_WIDTH - PADDING * 2 - wp(10))) /
        (data.length - 1);


      const y =
        CHART_HEIGHT -
        PADDING -
        (item.orders / maxValue) * (CHART_HEIGHT - PADDING * 2);

      return { ...item, x, y };
    });
  }, [data]);

  const linePath = d3
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveMonotoneX)(points);

  const areaPath = d3
    .area()
    .x(d => d.x)
    .y0(CHART_HEIGHT - PADDING)
    .y1(d => d.y)
    .curve(d3.curveMonotoneX)(points);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const chartLeftOffset = (wp(100) - CHART_WIDTH) / 2;
      const x = gesture.moveX - chartLeftOffset;
      const index = Math.round(
        ((x - PADDING) / (CHART_WIDTH - PADDING * 2)) *
        (data.length - 1)
      );
      if (index >= 0 && index < data.length) {
        setActiveIndex(index);
      }
    },
    onPanResponderRelease: () => {
      setActiveIndex(null);
    },
  });

  const formatOrderLabel = count => {
  return `${count} ${count === 1 ? 'order' : 'orders'}`;
};

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#10B981" stopOpacity={0.5} />
            <Stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Horizontal grid lines */}
        {Array.from({ length: Y_AXIS_LABELS }).map((_, i) => {
          const y =
            PADDING +
            (i * (CHART_HEIGHT - PADDING * 2)) /
            (Y_AXIS_LABELS - 1);

          return (
            <Path
              key={`grid-line-${i}`}
              d={`M ${PADDING} ${y} L ${CHART_WIDTH - PADDING} ${y}`}
              stroke="#E5E7EB"
              strokeWidth={1}
              opacity={0.6}
            />
          );
        })}


        {/* Area */}
        <Path d={areaPath} fill="url(#areaGradient)" />

        {/* Line */}
        <Path d={linePath} stroke="#22C55E" strokeWidth={3} fill="none" />

        {activeIndex !== null && (
          <Path
            d={`M ${PADDING} ${CHART_HEIGHT - PADDING}
            L ${CHART_WIDTH - PADDING} ${CHART_HEIGHT - PADDING}`}
            stroke="#D1D5DB"
            strokeWidth={1.5}
            opacity={0.3}
          />
        )}

        {/* Vertical active day line */}
        {activeIndex !== null && (
          <Line
            x1={points[activeIndex].x}
            x2={points[activeIndex].x}
            y1={PADDING}
            y2={CHART_HEIGHT - PADDING}
            stroke="#22C55E"
            strokeWidth={1.5}
            opacity={0.35}
            strokeDasharray="4 4" // makes it subtle & premium
          />
        )}


        {/* Active dot */}
        {activeIndex !== null && (
          <>
            {/* Outer glow */}
            <Circle
              cx={points[activeIndex].x}
              cy={points[activeIndex].y}
              r={10}
              fill="#22C55E"
              opacity={0.2}
            />
            {/* Inner dot */}
            <Circle
              cx={points[activeIndex].x}
              cy={points[activeIndex].y}
              r={5}
              fill="#22C55E"
            />
          </>
        )}


        {/* Y Axis labels */}
        {Array.from({ length: Y_AXIS_LABELS }).map((_, i) => {
          const value = Math.round((maxValue / (Y_AXIS_LABELS - 1)) * i);
          const y =
            CHART_HEIGHT -
            PADDING -
            (value / maxValue) * (CHART_HEIGHT - PADDING * 2);

          return (
            <TextSvg
              key={`y-label-${i}`}
              x={PADDING - 15}
              y={y + 4}
              fontSize={isTablet ? wp(2.8) : wp(3.5)}
            >
              {value}
            </TextSvg>
          );
        })}


        {/* X Axis labels */}
        {points.map((p, index) => (
          <TextSvg
            key={`x-label-${p.label}-${index}`}
            x={p.x}
            y={CHART_HEIGHT - 2}
            fontSize={isTablet ? wp(3) : wp(3.5)}
            textAnchor="middle"
          >
            {p.label}
          </TextSvg>
        ))}


      </Svg>

      {/* Tooltip */}
      {activeIndex !== null && (
        <View
          style={[
            styles.tooltip,
            {
             left:
              points[activeIndex].x > CHART_WIDTH - 80
                ? points[activeIndex].x - 70
                : points[activeIndex].x - 25,
              top: Math.max(points[activeIndex].y - 50, 10),
            },
          ]}
        >
          <Text style={styles.tooltipText}>
              {formatOrderLabel(points[activeIndex].orders ?? 0)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#111',
    paddingVertical: isTablet ? 10 : 6,
    paddingHorizontal: isTablet ? 18 : 10,
    borderRadius: 8,
    elevation: 4,
  },
  tooltipText: {
    color: '#fff',
    fontSize: isTablet ? 20 : 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tooltipSub: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'center',
  },
});
