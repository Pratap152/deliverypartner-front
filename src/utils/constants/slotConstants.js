// Slot Booking Constants

export const TABS = {
    CURRENT: 'current',
    NEXT: 'next',
};

export const FILTERS = {
    ALL: 'all',
    AVAILABLE: 'available',
    BOOKED: 'booked',
    CANCELLED: 'cancelled',
};

export const FILTER_LIST = [
    FILTERS.ALL,
    FILTERS.AVAILABLE,
    FILTERS.BOOKED,
    FILTERS.CANCELLED,
];

export const BOOKING_STATUS = {
    NOT_BOOKED: 'NOT_BOOKED',
    BOOKED: 'BOOKED',
    CANCELLED_BY_RIDER: 'CANCELLED_BY_RIDER',
    CANCELLED_BY_ADMIN: 'CANCELLED_BY_ADMIN',
};

export const DISPLAY_STATUS = {
    AVAILABLE: 'AVAILABLE',
    BOOKED: 'BOOKED',
    CANCELLED: 'CANCELLED',
};

// Status badge configuration
export const STATUS_CONFIG = {
    [DISPLAY_STATUS.AVAILABLE]: {
        label: 'Available',
        icon: 'radio-button-on',
        color: '#4C4CFF',
        backgroundColor: '#4C4CFF',
        textColor: '#FFF',
    },
    [DISPLAY_STATUS.BOOKED]: {
        label: 'Booked',
        icon: 'checkmark-circle',
        color: '#34C759',
        backgroundColor: '#34C759',
        textColor: '#FFF',
    },
    [DISPLAY_STATUS.CANCELLED]: {
        label: 'Cancelled',
        icon: 'close-circle',
        color: '#FF6A00',
        backgroundColor: '#FF6A00',
        textColor: '#FFF',
    },
};
