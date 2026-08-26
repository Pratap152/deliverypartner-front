import {navigate} from '../../navigation/RootNavigation';

export const routeNotification = data => {
  switch (data?.type) {
    // =========================
    // ORDER
    // =========================
    case 'ORDER_ASSIGNED': {
      // Example body:
      // "Order #ORD10234 has been assigned to you."

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

      navigate('OrderAccept', {
        orderId,
      });

      break;
    }

    // =========================
    // SLOTS
    // =========================
    case 'SLOT_BOOKED':
    case 'SLOT_CANCELLED':
      navigate('SlotsNavigator', {
        screen: 'SlotBookingScreen',
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
      navigate('EarningsNavigator', {
        screen: 'EarningsScreen',
      });
      break;

    // =========================
    // BANK
    // =========================
    case 'BANK_ADDED':
    case 'BANK_VERIFIED':
      navigate('BankAC');
      break;

    case 'BANK_PENDING':
      navigate('AddBankDetails');
      break;

    // =========================
    // ANNOUNCEMENT
    // =========================
    case 'ANNOUNCEMENT':
      navigate('NotificationsScreen');
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