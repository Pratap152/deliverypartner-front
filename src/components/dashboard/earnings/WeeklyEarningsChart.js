import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as TextSvg, Line } from 'react-native-svg';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { formatMoney } from '../../../utils/formatMoney';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const PADDING_LEFT  = isTablet ? wp(12) : wp(10);
const PADDING_RIGHT = wp(2);
const PADDING_TOP   = wp(6);   // extra headroom so value labels above bars don't clip
const PADDING_BOTTOM = wp(7);  // day labels

const BAR_RADIUS      = 4;
const Y_AXIS_LABELS   = 4;
const BAR_COLOR       = '#10B981';
const BAR_COLOR_ACTIVE = '#059669';
const VALUE_LABEL_GAP  = 4;    // px gap between top of bar and value text

export default function WeeklyEarningsChart({ data, width: chartWidth, height: chartHeight }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const rawMaxValue = Math.max(...data.map(d => d.value), 0);
  const maxValue = rawMaxValue === 0 ? 100 : Math.ceil(rawMaxValue / 100) * 100;

  const plotWidth  = chartWidth - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = chartHeight - PADDING_TOP - PADDING_BOTTOM;

  const barGroupWidth = plotWidth / data.length;
  const barWidth      = barGroupWidth * 0.45;

  const points = useMemo(() => {
    return data.map((item, index) => {
      const barX      = PADDING_LEFT + index * barGroupWidth + (barGroupWidth - barWidth) / 2;
      const barHeight = maxValue === 0 ? 0 : (item.value / maxValue) * plotHeight;
      const barY      = PADDING_TOP + plotHeight - barHeight;
      const centerX   = barX + barWidth / 2;
      return { ...item, barX, barY, barHeight, centerX };
    });
  }, [data, maxValue, plotWidth, plotHeight]);

  const panResponder = require('react-native').PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: (_, g) => {
      const i = Math.floor((g.x0 - PADDING_LEFT) / barGroupWidth);
      if (i >= 0 && i < data.length) setActiveIndex(i);
    },
    onPanResponderMove: (_, g) => {
      const i = Math.floor((g.moveX - PADDING_LEFT) / barGroupWidth);
      if (i >= 0 && i < data.length) setActiveIndex(i);
    },
    onPanResponderRelease:   () => setActiveIndex(null),
    onPanResponderTerminate: () => setActiveIndex(null),
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

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width={chartWidth} height={chartHeight}>

        {/* Grid lines + Y-axis labels */}
        {Array.from({ length: Y_AXIS_LABELS }).map((_, i) => {
          const y     = PADDING_TOP + (i * plotHeight) / (Y_AXIS_LABELS - 1);
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
          const isActive     = activeIndex === index;
          const hasValue     = p.value > 0;
          const displayH     = Math.max(p.barHeight, hasValue ? BAR_RADIUS * 2 : 0);
          const displayY     = PADDING_TOP + plotHeight - displayH;
          const valueLabelY  = displayY - VALUE_LABEL_GAP; 
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
});