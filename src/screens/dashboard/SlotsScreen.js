import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSlots } from '../../hooks/useSlots';
import { useSlotSelection } from '../../hooks/useSlotSelection';
import { TABS, FILTERS } from '../../utils/constants/slotConstants';
import { extractSlotIds } from '../../utils/slotHelpers';
import { getWeekNumber } from '../../services/slots/SlotBookingService';
import { useSelector } from 'react-redux';

// Components
import SlotBookingHeader from '../../components/dashboard/slots/SlotBookingHeader';
import SlotsList from '../../components/dashboard/slots/SlotsList';
import LockedWeekView from '../../components/dashboard/slots/LockedWeekView';
import SlotBookingFooter from '../../components/dashboard/slots/SlotBookingFooter';
import BookSlotModal from '../../components/dashboard/slots/modals/BookSlotModal';
import CancelSlotModal from '../../components/dashboard/slots/modals/CancelSlotModal';
import SuccessModal from '../../components/dashboard/slots/modals/SuccessModal';


export default function SlotsScreen({ navigation }) {
    const {
        weeks,
        slots,
        slotsLoading,
        weeksLoading,
        actionLoading,
        loadWeeks,
        loadSlots,
        bookSlot,
        cancelSlot,
        clearSlots,
        clearWeeks
    } = useSlots();

    // Slot selection management
    const {
        selectedSlots,
        selectedCount,
        toggleSlotSelection,
        clearSelection,
        isSlotSelected,
    } = useSlotSelection();

    const today = new Date().toISOString().split('T')[0];

    // Local state
    const [activeTab, setActiveTab] = useState(TABS.CURRENT);
    const [selectedWeek, setSelectedWeek] = useState(today);
    const firstLoad = useRef(true);
    const [filter, setFilter] = useState(FILTERS.ALL);
    const [bookModalVisible, setBookModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [activeSlot, setActiveSlot] = useState(null);


    const cityId = useSelector((state) => state.profile.data?.location?.city?.trim());
    const pincodeId = useSelector((state) => state.profile.data?.location?.pincode?.trim());


    useEffect(() => {
        const loadInitial = async () => {
            await loadWeeks({
                cityId,
                pincodeId,
            });

            await loadSlots({
                date: today,
                filter,
                cityId,
                pincodeId,
            });
        };

        loadInitial();
    }, []);



    const handleTabChange = async (tab) => {
        if (tab === activeTab) return;

        setActiveTab(tab);

        clearSelection();
        clearSlots();
        clearWeeks();

        setSelectedWeek(null);

        let weekNumber;

        if (tab === TABS.NEXT) {
            weekNumber = getWeekNumber() + 1;
        } else if (tab === TABS.UPCOMING) {
            weekNumber = getWeekNumber() + 2;
        }

        await loadWeeks({
            weekNumber,
            cityId,
            pincodeId,
        });
    };

    useEffect(() => {
        if (!weeks.length) return;

        let firstDate = weeks[0].date;

        if (activeTab === TABS.CURRENT) {
            const todaySlot = weeks.find(w => w.date === today);
            if (todaySlot) {
                firstDate = todaySlot.date;
            }
        }

        if (!selectedWeek || !weeks.some(w => w.date === selectedWeek)) {
            setSelectedWeek(firstDate);
        }
    }, [weeks]);

    useEffect(() => {
        if (!selectedWeek) return;

        loadSlots({
            date: selectedWeek,
            filter,
            cityId,
            pincodeId,
        });
    }, [selectedWeek, filter]);

    const handleWeekSelect = (date) => {
        if (date === selectedWeek) {
            return;
        }

        clearSelection();
        setSelectedWeek(date);
    };

    const handleFilterChange = (newFilter) => {
        if (newFilter === filter) {
            return;
        }

        clearSelection();
        setFilter(newFilter);
    };

    const handleSlotCancel = (slot) => {
        setActiveSlot(slot);
        setCancelModalVisible(true);
    };

    const handleBookingOpen = () => {
        setBookModalVisible(true);
    };

    const refreshSlots = () => {
        if (!selectedWeek) return;

        loadSlots({
            date: selectedWeek,
            filter,
            cityId,
            pincodeId,
        });
    };

    const handleBookConfirm = async () => {
        const slotIds = extractSlotIds(selectedSlots);
        const success = await bookSlot({
            slotIds,
            date: selectedWeek,
        });

        if (success) {
            setBookModalVisible(false);
            setSuccessVisible(true);
            clearSelection();
            // Refresh slots
            refreshSlots();
        }
    };

    const handleCancelConfirm = async () => {
        const success = await cancelSlot(activeSlot.bookingId);
        if (success) {
            setCancelModalVisible(false);
            refreshSlots();
        }
    };
    const handleRefresh = () => {
        if (!selectedWeek) return;

        loadSlots({
            date: selectedWeek,
            filter,
            cityId,
            pincodeId,
        });
    };

    const selectedWeekData =
    weeks.find(item => item.date === selectedWeek) || null;

    return (
        <View style={styles.container}>
            {/* Header */}
            <SlotBookingHeader
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
            {/* Main Content */}
            {activeTab === TABS.UPCOMING ? (
                <LockedWeekView
                />
            ) : (
                <SlotsList
                    weeks={weeks}
                    slots={slots}
                    selectedWeek={selectedWeek}
                    selectedWeekData={selectedWeekData}
                    filter={filter}
                    onWeekSelect={handleWeekSelect}
                    onFilterChange={handleFilterChange}
                    onSlotSelect={toggleSlotSelection}
                    onSlotCancel={handleSlotCancel}
                    isSlotSelected={isSlotSelected}
                    weeksLoading={weeksLoading}
                    slotsLoading={slotsLoading}
                    actionLoading={actionLoading}
                    onRefresh={handleRefresh}
                />
            )}

            {/* Floating Footer */}
            <SlotBookingFooter
                selectedCount={selectedCount}
                onBook={handleBookingOpen}
                visible={activeTab !== TABS.UPCOMING}
            />

            {/* Modals */}
            <BookSlotModal
                visible={bookModalVisible}
                slots={selectedSlots}
                date={selectedWeek}
                onClose={() => setBookModalVisible(false)}
                onConfirm={handleBookConfirm}
                loading={actionLoading}
            />

            <CancelSlotModal
                visible={cancelModalVisible}
                slot={activeSlot}
                date={selectedWeek}
                onClose={() => setCancelModalVisible(false)}
                onConfirm={handleCancelConfirm}
                loading={actionLoading}
            />

            <SuccessModal
                visible={successVisible}
                onClose={() => setSuccessVisible(false)}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA'
    },
});
