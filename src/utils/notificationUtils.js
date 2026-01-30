import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const groupNotificationsByDate = list => {
  const today = [];
  const yesterday = [];
  const earlier = [];

  list.forEach(n => {
    const date = dayjs(n.createdAt);

    if (date.isSame(dayjs(), 'day')) {
      today.push(n);
    } else if (date.isSame(dayjs().subtract(1, 'day'), 'day')) {
      yesterday.push(n);
    } else {
      earlier.push(n);
    }
  });

  return {
    ...(today.length && { Today: today }),
    ...(yesterday.length && { Yesterday: yesterday }),
    ...(earlier.length && { Earlier: earlier }),
  };
};

export const getIconByType = type => {
  switch (type) {
    case 'ORDER_DELIVERED':
      return { name: 'check-circle', color: '#2ecc71' };

    case 'PEAK_BONUS':
      return { name: 'flash', color: '#ff9f43' };

    case 'SHIFT_REMINDER':
      return { name: 'clock-outline', color: '#54a0ff' };

    case 'PAYOUT_PROCESSED':
      return { name: 'bank', color: '#5f27cd' };

    case 'DOCUMENT_EXPIRE':
      return { name: 'file-alert', color: '#feca57' };

    default:
      return { name: 'bell-outline', color: '#8395a7' };
  }
};
