import { navigate } from '../../navigation/RootNavigation';
export const routeNotification = data => {
  switch (data.type) {

    case 'ORDER_POPUP':
      navigate('OrderAccept', {
        orderId: data.orderId,
      });
      break;

    case 'SLOT_BOOKED':
    case 'SLOT_CANCELLED':
      navigate('SlotsNavigator', {
        screen: 'SlotBookingScreen',
      });
      break;

    case 'WITHDRAWAL_APPROVED':
    case 'BASE_PAY_UPDATED':
    case 'PER_KM_RATE_UPDATED':
    case 'SURGE_PAY_UPDATED':
    case 'PEAK_PAY_UPDATED':
      navigate('EarningsNavigator', {
        screen: 'EarningsScreen',
      });
      break;

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
      navigate('ProfileNavigator', {
        screen: 'ProfileScreen',
      });
      break;

    case 'ANNOUNCEMENT':
      navigate('NotificationsScreen');
      break;
    case 'BANK_PENDING':
      navigate('AddBankDetails');
      break;
    default:
      console.log('Unknown notification type:', data.type);
  }
};