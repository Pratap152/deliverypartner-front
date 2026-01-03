// Slot Helper Functions

/**
 * Determines if a slot is selectable based on current filter and slot properties
 * @param {Object} slot - The slot object
 * @param {string} filter - Current active filter
 * @returns {boolean} - Whether the slot can be selected
 */
export const isSlotSelectable = (slot, filter) => {
    // Cannot select from cancelled filter view
    if (filter === 'cancelled') {
        return false;
    }

    // Check if slot is available
    return !!slot.isAvailable && !slot.isBooked;
};

/**
 * Checks if a slot is selected
 * @param {Array} selectedSlots - Array of selected slots
 * @param {string} slotId - Slot ID to check
 * @returns {boolean} - Whether the slot is selected
 */
export const isSlotInSelection = (selectedSlots, slotId) => {
    return selectedSlots.some((s) => s.slotId === slotId);
};

/**
 * Extracts slot IDs from selected slots array
 * @param {Array} selectedSlots - Array of selected slot objects
 * @returns {Array<string>} - Array of slot IDs
 */
export const extractSlotIds = (selectedSlots) => {
    return selectedSlots.map((s) => s.slotId);
};
