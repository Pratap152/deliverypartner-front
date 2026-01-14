import React from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';


export const weeklyData = [
  { value: 990, label: 'Mon' },
  { value: 760, label: 'Tue' },
  { value: 640, label: 'Wed' },
  { value: 790, label: 'Thu' },
  { value: 810, label: 'Fri' },
  { value: 360, label: 'Sat', frontColor: '#EF4444'},
  { value: 500, label:'Sun'}
];

export const WeeklyEarningsBarChart = ({
  width,
  height,
  data,
}) => {
  return (
    <BarChart
      width={width}
      height={height}
      data={data}

      barWidth={wp(5)}          // responsive bars
      spacing={wp(5)}             // responsive spacing

      frontColor="#22C55E"
      roundedTop
      hideYAxisText = {false}
      noOfSections={5}
      hideRules = {true}
      
      initialSpacing={wp(2)}

      focusBarOnPress
      showTextOnPress
      textColor="white"
      textFontSize={wp(4)}

      animationDuration={500}
    />
  );
};
