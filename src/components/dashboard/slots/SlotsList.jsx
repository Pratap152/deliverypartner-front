import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import WeekSelector from './WeekSelector';
import SlotFilters from './SlotFilters';
import SlotCard from './SlotCard';
import EmptySlotState from './EmptySlotState';
import { isSlotSelectable } from '../../../utils/slotHelpers';
import SlotHistory from '../../common/SlotHistory';

/**
 * SlotsList Component
 * Renders week selector, filters, and scrollable list of slot cards
 * 
 * @param {Array} weeks - Available weeks data
 * @param {Array} slots - Slots to display
 * @param {string} selectedWeek - Currently selected week
 * @param {string} filter - Active filter
 * @param {function} onWeekSelect - Handler for week selection
 * @param {function} onFilterChange - Handler for filter change
 * @param {function} onSlotSelect - Handler for slot selection
 * @param {function} onSlotCancel - Handler for slot cancellation
 * @param {function} isSlotSelected - Function to check if slot is selected
 * @param {boolean} loading - Loading state
 * @param {function} onRefresh - Pull to refresh handler
 */
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
    loading = false,
    onRefresh,
}) {
    const renderSlotCard = ({ item }) => {
        const selectable = isSlotSelectable(item, filter);
        const selected = isSlotSelected(item.slotId);

        return (
            <SlotCard
                slot={item}
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
            <WeekSelector
                weeks={weeks}
                selectedWeek={selectedWeek}
                onSelect={onWeekSelect}
            />

            <SlotFilters value={filter} onChange={onFilterChange} />

            <FlatList
                data={slots}
                keyExtractor={(item) => item.slotId}
                renderItem={renderSlotCard}
                ListEmptyComponent={<EmptySlotState filter={filter} />}
                 ListFooterComponent={<SlotHistory />}
                refreshing={loading}
                onRefresh={onRefresh}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 10,
    },
    listContent: {
        paddingBottom: 100, // Space for floating footer
    },
});
