import apiClient from '../services/ApiClient';


export const getJoiningBonusProgram = async (params = {}) => {
  const res = await apiClient.get('/api/rider/joining/bonus/programs', {
    params,
  });
  const programs = res.data?.data || [];

  if (!programs.length) {
    throw new Error('No active joining bonus program');
  }

  return programs[0];
};

export const joinJoiningBonus = async (programId) => {
  const res = await apiClient.post(`/api/rider/joining/bonus/programs/${programId}/join`);
  return res.data;
};

export const getJoiningBonusProgress = async () => {
  const res = await apiClient.get(`/api/rider/joining/bonus/programs/myProgress`);
  return res.data?.data;
};



export const getTaskDescription = (task) => {
  const minOrders = task.minOrders ?? task.conditions?.minOrders;
  const minAcceptanceRate = task.minAcceptanceRate ?? task.conditions?.minAcceptanceRate;
  const minPeakSlots = task.minPeakSlots ?? task.conditions?.minPeakSlots;
  const minEarnings = task.minEarnings ?? task.conditions?.minEarnings;

  switch (task.taskType) {
    case 'ORDERS':
      return `Complete ${minOrders} deliveries`;
    case 'ACCEPTANCE_RATE':
      return `Maintain ${minAcceptanceRate}% acceptance rate`;
    case 'PEAK_SLOTS':
      return `Work ${minPeakSlots} peak slot${minPeakSlots > 1 ? 's' : ''}`;
    case 'EARNINGS':
      return `Earn ₹${minEarnings}`;
    default:
      return 'Complete the daily task';
  }
};