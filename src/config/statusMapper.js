// statusMapper.js
import { ORDER_STATUS } from './orderStates';

export const mapBackendStatus = (apiStatus) => {
  switch (apiStatus) {
    case 'picked_up':
      return ORDER_STATUS.PICKED_UP;
    case 'arrived_at_location':
      return ORDER_STATUS.ARRIVED;
    case 'delivered':
      return ORDER_STATUS.DELIVERED;
    default:
      return ORDER_STATUS.PICKED_UP;
  }
};
