import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import WeekSelector from './WeekSelector';
import SlotFilters from './SlotFilters';
import SlotCard from './SlotCard';
import EmptySlotState from './EmptySlotState';
import { isSlotSelectable } from '../../../utils/slotHelpers';
import SlotHistory from '../../common/SlotHistory';


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
