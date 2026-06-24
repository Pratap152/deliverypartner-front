import apiClient from "../../../services/ApiClient";

export const bannerMeta = {
  bank: {
    id: 'bank',
    cta: 'Complete Now',
  },

  kit: {
    id: 'kit',
    cta: 'Claim Now',
  },

  referAndEarn: {
    id: 'refer',
    cta: 'Refer Now',
  },

  dailyIncentive: {
    id: 'incentives',
    cta: 'View Incentives',
  },

  joiningBonus: {
    id: 'joining',
    cta: 'Start Now',
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
        imageUrl: apiData.bank.imageUrl,
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
        imageUrl: apiData.kit.imageUrl,
      });
    }

    // REFER & EARN -> ALWAYS SHOW
    banners.push({
      ...bannerMeta.referAndEarn,
      title: apiData?.referAndEarn?.labelName || 'Refer & Earn',
      subtitle:
        apiData?.referAndEarn?.message ||
        'Invite friends and earn rewards',
       imageUrl: apiData?.referAndEarn?.imageUrl,
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
      imageUrl: apiData?.dailyIncentive?.imageUrl,
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
        imageUrl: apiData.joiningBonus.imageUrl,
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

