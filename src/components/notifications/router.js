export const routeNotification = data => {
  switch (data.type) {
    case 'SLOT_START_REMINDER':
    case 'SLOT_STARTED':
      navigate('SlotBookingScreen', JSON.parse(data.params));
      break;

    case 'EARNINGS_CREDITED':
      navigate('EarningsScreen');
      break;

    case 'NEW_ORDER':
      navigate('OrderAccept', { orderId: data.params.orderId });
      break;
  }
};
