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

    // CTA defaults
    const defaultCTA = {
      bank: 'Complete Now',
      kit: 'Claim Now',
      joiningBonus: 'Start Now',
      referAndEarn: 'Refer Now',
      dailyIncentive: 'View Incentives',
      promotional: 'Know More',
    };

    // Navigation ids
    const navigationIds = {
      bank: 'bank',
      kit: 'kit',
      joiningBonus: 'joining',
      referAndEarn: 'refer',
      dailyIncentive: 'incentives',
    };

    /**
     * ALL NORMAL BANNERS
     * Whatever backend sends automatically comes here.
     */

    Object.entries(apiData).forEach(([key, value]) => {
      if (key === 'promotionalBanners') return;

      if (!value || typeof value !== 'object') return;

      if (!value.isAvailable) return;

      banners.push({
        id: navigationIds[key] || key,
        type: key,
        title: value.labelName,
        subtitle: value.message,
        imageUrl: value.imageUrl,
        cta: defaultCTA[key] || 'Know More',

        // Entire backend response if needed later
        data: value,
      });
    });

    /**
     * PROMOTIONAL BANNERS
     * Backend can send 1,5,10,100 banners.
     * All will appear automatically.
     */

    if (Array.isArray(apiData.promotionalBanners)) {
      apiData.promotionalBanners.forEach(item => {
        if (!item.isAvailable) return;

        banners.push({
          id: item.id,
          type: 'promotional',
          promoType: item.type,
          title: item.labelName,
          subtitle: item.message,
          imageUrl: item.imageUrl,
          cta: 'Know More',
          data: item,
        });
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

