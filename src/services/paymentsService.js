import apiClient from './ApiClient';

export const patchPayment = async (requestIdsForComplete) => {
    const response = await apiClient.patch(
        `/api/kit/payments/complete?requestIds=${requestIdsForComplete}`
    );
    return response;
};

export const saveResponse = async (requestIds, paymentSelectionPayload) => {
    const response = await apiClient.post(
        `/api/kit/payment?requestIds=${requestIds}`,
        paymentSelectionPayload
    );
    return response;
};

export const getEmiPlans = async () => {
    const response = await apiClient.get('/api/rider/kit/emi/plans', {
        headers: { 'x-client': 'mobile' },
    });
    return response;
}