// Slot Helper Functions

/**
 * Converts 24-hour time string to 12-hour format with AM/PM
 * @param {string} timeStr - Time string in "HH:MM" format
 * @returns {string} - Formatted time (e.g., "02:00 PM")
 */
export const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    let hours = parseInt(h, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 0 -> 12
    return `${hours.toString().padStart(2, '0')}:${m} ${suffix}`;
};


export const formatDuration = (minutes) => {
  if (minutes == null) return "";

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs === 0) return `${mins} mins`;
  if (mins === 0) return `${hrs} ${hrs === 1 ? "hr" : "hrs"}`;

  return `${hrs} ${hrs === 1 ? "hr" : "hrs"} ${mins} mins`;
};

/**
 * Formats date string with custom options
 * @param {string} dateStr - Date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date
 */
export const formatDate = (dateStr, options = { weekday: 'long', day: 'numeric', month: 'short' }) => {
    if (!dateStr) return "Selected Day";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Selected Day";
    return date.toLocaleDateString('en-US', options);
};

/**
 * Determines display status based on filter and slot state
 * @param {Object} slot - Slot object with status flags
 * @param {string} filter - Current active filter
 * @returns {string} - Display status ('AVAILABLE', 'BOOKED', 'CANCELLED')
 */
export const getDisplayStatus = (slot, filter) => {
    const rawIsBooked = slot.isBooked;
    const rawIsCancelled = slot.isCancelled;
    const rawIsAvailable = slot.isAvailable || (!rawIsBooked && !rawIsCancelled);

    // Force display based on filter
    if (filter === 'booked') return 'BOOKED';
    if (filter === 'cancelled') return 'CANCELLED';
    if (filter === 'available') return 'AVAILABLE';

    // Filter is 'all' -> prioritized logic
    if (rawIsBooked) return 'BOOKED';
    if (rawIsAvailable) return 'AVAILABLE';
    if (rawIsCancelled) return 'CANCELLED';

    return 'AVAILABLE'; // Default
};

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
