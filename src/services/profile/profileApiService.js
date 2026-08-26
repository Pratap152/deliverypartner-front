import apiClient from '../ApiClient';

export const getAllPolicies = async () => {
    const response = await apiClient.get('/api/rider/all/policies');
    return response;
};

export const getBankDetails = async () => {
    const response = await apiClient.get(`/api/rider/profile/bank-details`);
    return response;
};

export const updateBankDetails = async (payload) => {
    const response = await apiClient.put(`/api/rider/profile/bank-details`, payload);
    return response;
};

export const getCashBalance = async () => {
    const response = await apiClient.get(`/api/rider/cashbalance`);
    return response;
};

export const getProfileDocuments = async () => {
    const response = await apiClient.get(
        '/api/rider/profile/documents'
    );

    return response;
};

export const updateDocuments = async (formData) => {
    const response = await apiClient.put(
        '/api/rider/profile/documents/update',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
    return response;
};

export const getRiderRatingWeekly = async () => {
    const response = await apiClient.get('/api/rider/rating/weekly');
    return response;
};

export const getRiderAssets = async () => {
    const response = await apiClient.get("/api/rider/kit/rider/assets");
    return response;
};

export const getSlotHistory = async (params = {}) => {
    const response = await apiClient.get(
        '/api/rider/profile/slots/history',
        {
            params,
        }
    );

    return response;
};

export const getWalletData = async () => {
    const response = await apiClient.get('/api/rider/get/wallet');
    return response;
};

export const getSettlementBreakdown = async () => {
    const response = await apiClient.get('/api/rider/settlement-breakdown');
    return response;
};

export const getTransactions = async () => {
    const response = await apiClient.get('/api/rider/wallet/withdrawals');
    return response;
}