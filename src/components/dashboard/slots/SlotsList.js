import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import WeekSelector from './DaySelector';
import SlotFilters from './SlotFilters';
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
  onRefresh,
  selectedWeekData,
}) {
  const hasWeeks = weeks.length > 0;
  const hasSlots = slots.length > 0;
  const showHeader = hasWeeks && (!weeksLoading || hasSlots);


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
        onSelect={() => onSlotSelect(item)}
        onCancel={() => onSlotCancel(item)}
    />
    );
  };

  return (
    <View style={styles.container}>

      {/* Week Loader */}
      {showHeader && (
        <>
            <WeekSelector
                weeks={weeks}
                selectedWeek={selectedWeek}
                onSelect={onWeekSelect}
                />

            <SlotFilters
                value={filter}
                onChange={onFilterChange}
                />
        </>
        )}

      {/* Slots Loader */}
      {slotsLoading || actionLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color="#4C4CFF"
          />
        </View>
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
          refreshing={false}
          onRefresh={onRefresh}
          contentContainerStyle={[
            styles.listContent,
            !hasSlots && {
              flexGrow: 1,
              justifyContent: 'center',
            },
          ]}
          showsVerticalScrollIndicator={false}
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