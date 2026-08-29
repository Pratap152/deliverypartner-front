import {navigate} from '../../navigation/RootNavigation';

export const routeNotification = data => {
  switch (data?.type) {
    // =========================
    // ORDER
    // =========================
    case 'ORDER_ASSIGNED': {
      const orderId = data?.body?.match(
        /Order\s+#([A-Za-z0-9_-]+)/i,
      )?.[1];

      if (!orderId) {
        console.log(
          'ORDER_ASSIGNED notification does not contain a valid orderId:',
          data,
        );
        return;
      }

      navigate('MainTabs', {
        screen: 'Home',
        params: {
          screen: 'OrderDetailsScreen',
          params: {
            orderId,
          },
        },
      });

      break;
    }

    // =========================
    // SLOTS
    // =========================
    case 'SLOT_BOOKED':
    case 'SLOT_CANCELLED':
      navigate('MainTabs', {
        screen: 'SlotBooking',
        params: {
          screen: 'SlotBookingScreen',
        },
      });
      break;

    // =========================
    // EARNINGS / INCENTIVES
    // =========================
    case 'BASE_PAY_UPDATED':
    case 'PER_KM_RATE_UPDATED':
    case 'SURGE_PAY_UPDATED':
    case 'PEAK_PAY_UPDATED':
    case 'PEAK_SLOT_CREATED':
    case 'DAILY_INCENTIVE_CREATED':
    case 'WEEKLY_INCENTIVE_CREATED':
      navigate('MainTabs', {
        screen: 'Earnings',
        params: {
          screen: 'EarningsScreen',
        },
      });
      break;

    // =========================
    // BANK
    // =========================
    case 'BANK_ADDED':
    case 'BANK_VERIFIED':
      navigate('MainTabs', {
        screen: 'Profile',
        params: {
          screen: 'BankAC',
        },
      });
      break;

    case 'BANK_PENDING':
      navigate('MainTabs', {
        screen: 'Profile',
        params: {
          screen: 'BankAC',
        },
      });
      break;

    // =========================
    // ANNOUNCEMENT
    // =========================
    case 'ANNOUNCEMENT':
      navigate('MainTabs', {
        screen: 'Alerts',
      });
      break;

    // =========================
    // NO NAVIGATION
    // =========================
    case 'WELCOME':
    case 'KYC_APPROVED':
    case 'KYC_REJECTED':
    case 'PAN_APPROVED':
    case 'PAN_REJECTED':
    case 'DL_APPROVED':
    case 'DL_REJECTED':
    case 'SELFIE_UPLOADED':
    case 'AADHAAR_UPLOADED':
    case 'PAN_UPLOADED':
    case 'DL_UPLOADED':
      console.log(
        `No navigation configured for notification type: ${data?.type}`,
      );
      break;

    default:
      console.log(
        'Unknown notification type:',
        data?.type,
      );
  }
};