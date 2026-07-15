import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import SlotCard from './SlotCard';
import EmptySlotState from './EmptySlotState';
import SlotHistory from '../../common/SlotHistory';

import { isSlotSelectable } from '../../../utils/slotHelpers';

import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SlotsList({
  weeks,
  slots,
  selectedWeek,
  filter,
  onWeekSelect,
  onFilterChange,
  onSlotSelect,
  onSlotCancel,
  isSlotSelected,
  weeksLoading = false,
  slotsLoading = false,
  actionLoading = false,
  selectedWeekData,
}) {
  const hasWeeks = weeks.length > 0;
  const hasSlots = slots.length > 0;
  const showHeader = hasWeeks && (!weeksLoading || hasSlots);

  const showLoader =
  slotsLoading || actionLoading;


  const renderSlotCard = ({ item }) => {
    const selectable = isSlotSelectable(item, filter);
    const selected = isSlotSelected(item.slotId);

    return (
      <SlotCard
        slot={item}
        weekData={selectedWeekData}
        activeFilter={filter}
        selectable={selectable}
        selected={selected}
        onSelect={() =>
          onSlotSelect({
            ...item,
            durationMinutes:
              item.durationMinutes ?? selectedWeekData?.durationMinutes,
            breakInMinutes:
              item.breakInMinutes ?? selectedWeekData?.breakInMinutes,
            isPeakSlot:
              item.isPeakSlot ?? selectedWeekData?.isPeakSlot,
          })
        }
        onCancel={() => onSlotCancel(item)}
    />
    );
  };
  
  return (
    <View style={styles.container}>

      {/* Slots Loader */}
      {showLoader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color="#1F3365"
          />
        </View>
      ) : !hasWeeks ? (
        <EmptySlotState />
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item.slotId}
          renderItem={renderSlotCard}
          ListEmptyComponent={
            !slotsLoading && !weeksLoading
                ? <EmptySlotState filter={filter} />
                : null
        }
          ListFooterComponent={
            hasSlots ? <SlotHistory /> : null
          }
           contentContainerStyle={[
            styles.listContent,
            !hasSlots && {
              flexGrow: 1,
              justifyContent: 'center',
            },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: isTablet ? 28 : 16,
    marginTop: isTablet ? 20 : 10,

    ...(isTablet && {
      width: '94%',
      alignSelf: 'center',
    }),
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  listContent: {
    paddingBottom: 100,
  },
});