import { useState, useCallback } from 'react';

/**
 * Custom hook for managing slot selection state and operations
 * @returns {Object} - Selection state and handlers
 */
export const useSlotSelection = () => {
    const [selectedSlots, setSelectedSlots] = useState([]);

    /**
     * Toggle slot selection
     */
    const toggleSlotSelection = useCallback((slot) => {
        setSelectedSlots((prev) => {
            const exists = prev.find((s) => s.slotId === slot.slotId);
            return exists
                ? prev.filter((s) => s.slotId !== slot.slotId)
                : [...prev, slot];
        });
    }, []);

    /**
     * Clear all selections
     */
    const clearSelection = useCallback(() => {
        setSelectedSlots([]);
    }, []);

    /**
     * Check if a slot is selected
     */
    const isSlotSelected = useCallback(
        (slotId) => {
            return selectedSlots.some((s) => s.slotId === slotId);
        },
        [selectedSlots]
    );

    /**
     * Get selected slot count
     */
    const selectedCount = selectedSlots.length;

    return {
        selectedSlots,
        selectedCount,
        toggleSlotSelection,
        clearSelection,
        isSlotSelected,
    };
};
