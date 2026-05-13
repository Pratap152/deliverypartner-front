import apiClient from '../services/ApiClient';

export const getJoiningBonusProgress = async () => {
  const res = await apiClient.get(
    '/api/refer/referral/referee-progress'
  );

  return res.data;
};

export const getTaskDescription = (task) => {
  if (!task?.slabs?.length) {
    return 'Complete daily target';
  }

  return task.slabs
    .map((slab) => {
      if (slab.maxOrders) {
        return `${slab.minOrders}-${slab.maxOrders} orders → ₹${slab.rewardAmount}`;
      }

      return `${slab.minOrders}+ orders → ₹${slab.rewardAmount}`;
    })
    .join('\n');
};