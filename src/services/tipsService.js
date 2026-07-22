import apiClient from './ApiClient';

export const getOverview = async () => {
    const response = await apiClient.get('/api/rider/tips/overview');
    return response;
};

export const getDailySummary = async (date) => {
    const response = await apiClient.get(
        `/api/rider/tips/daily/summary?date=${date}`
    );
    return response;
};

export const getMonthlySummary = async (month, year) => {
    console.log("DFW", month, year);
    const response = await apiClient.get(
        `/api/rider/tips/monthly/summary?month=${month}&year=${year}`
    );
    return response;
};

export const getDailyTipsList = async (month, year) => {
    const response = await apiClient.get(
        `/api/rider/tips/daily-list?month=${month}&year=${year}`
    );
    return response;
};