import apiClient from "../../../services/ApiClient";

export const bannerMeta = {
  bank: {
    id: 'bank',
    cta: 'Complete Now',
    backgroundColor: '#FFE8CC',
  },

  kit: {
    id: 'kit',
    cta: 'Claim Now',
    backgroundColor: '#E8EDFF',
  },

  referAndEarn: {
    id: 'refer',
    cta: 'Refer Now',
    backgroundColor: '#D1FAE5',
  },

  dailyIncentive: {
    id: 'incentives',
    cta: 'View Incentives',
    backgroundColor: '#FEF3C7',
  },

  joiningBonus: {
    id: 'joining',
    cta: 'Start Now',
    backgroundColor: '#E0E7FF',
  },
};

export const getHomeBanners = async () => {
  try {
    const response = await apiClient.get('/api/banner/home-banners');

    const apiData = response?.data?.data || {};

    const banners = [];

    // BANK
    if (
      apiData?.bank?.isAvailable &&
      !apiData?.bank?.isCompleted
    ) {
      banners.push({
        ...bannerMeta.bank,
        title: apiData.bank.labelName,
        subtitle: apiData.bank.message,
      });
    }

    // KIT
    if (
      apiData?.kit?.isAvailable &&
      !apiData?.kit?.isCompleted
    ) {
      banners.push({
        ...bannerMeta.kit,
        title: apiData.kit.labelName,
        subtitle: apiData.kit.message,
      });
    }

    // REFER & EARN -> ALWAYS SHOW
    banners.push({
      ...bannerMeta.referAndEarn,
      title: apiData?.referAndEarn?.labelName || 'Refer & Earn',
      subtitle:
        apiData?.referAndEarn?.message ||
        'Invite friends and earn rewards',
    });

    // DAILY INCENTIVE -> ALWAYS SHOW
    banners.push({
      ...bannerMeta.dailyIncentive,
      title:
        apiData?.dailyIncentive?.labelName ||
        'Daily Incentives',
      subtitle:
        apiData?.dailyIncentive?.message ||
        'Complete orders & earn extra',
    });

    // JOINING BONUS
    if (
      apiData?.joiningBonus?.isAvailable &&
      !apiData?.joiningBonus?.isCompleted
    ) {
      banners.push({
        ...bannerMeta.joiningBonus,
        title: apiData.joiningBonus.labelName,
        subtitle: apiData.joiningBonus.message,
      });
    }

    return banners;
  } catch (error) {
    console.log('HOME BANNERS API ERROR:', error);
    return [];
  }
};

export const todayStats = [
  { id: 'earnings', label: 'Earnings' },
  { id: 'hours', label: 'Online' },
  { id: 'orders', label: 'Orders' },
];

