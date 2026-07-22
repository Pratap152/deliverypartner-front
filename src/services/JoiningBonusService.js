
import apiClient from '../services/ApiClient';

/* GET PROGRAMS */
export const getReferralPrograms = async () => {
  const res = await apiClient.get(
    '/api/rider/referral/programs'
  );

  return res.data;
};

/* GET PROGRAM PROGRESS */
export const getReferralProgramsProgress = async () => {
  const res = await apiClient.get(
    '/api/rider/referral/programs/progress'
  );

  return res.data;
};

/* TASK DESCRIPTION */
export const getTaskDescription = (task) => {

  switch (task.taskRuleType) {

    case 'SLAB':
      return (
        task.slabs
          ?.map((slab) => {
            if (slab.maxOrders) {
              return `${slab.minOrders}-${slab.maxOrders} orders → ₹${slab.rewardAmount}`;
            }

            return `${slab.minOrders}+ orders → ₹${slab.rewardAmount}`;
          })
          .join('\n') || 'Complete slab targets'
      );

    case 'FIXED_TARGET':
      return `Complete ${task.target?.orders || 0} orders and earn ₹${task.reward?.amount || 0}`;

    case 'PER_ORDER':
      return `Earn ₹${task.rewardPerOrder || 0} per order upto ₹${task.maxEarning || 0}`;

    case 'HYBRID':
      return `
Min Orders: ${task.conditions?.minOrders || 0}
Acceptance Rate: ${task.conditions?.minAcceptanceRate || 0}%
Completion Rate: ${task.conditions?.minCompletionRate || 0}%
Min Earnings: ₹${task.conditions?.minEarnings || 0}
      `;

    default:
      return 'Complete daily target';
  }
};