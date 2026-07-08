import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import WeekSelector from './WeekSelector';
import SlotFilters from './SlotFilters';
import SlotCard from './SlotCard';
import EmptySlotState from './EmptySlotState';
import { isSlotSelectable } from '../../../utils/slotHelpers';
import SlotHistory from '../../common/SlotHistory';
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
    loading = false,
    onRefresh,
}) {
    if(loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4C4CFF" />
            </View>
        )
    }

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
    paddingHorizontal: isTablet ? 28 : 16,
    marginTop: isTablet ? 20 : 10,
    ...(isTablet && {
        alignSelf: 'center',
        width: '94%',
    }),
},
    listContent: {
        paddingBottom: 100, // Space for floating footer
    },
});
