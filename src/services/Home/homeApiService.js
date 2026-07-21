import apiClient from '../ApiClient';

export const getBanners = async () => {
    const response = await apiClient.get('/api/rider/banner/home-banners');
    return response;
};

export const getCurrentSlot = async () => {
    const response = await apiClient.get('/api/rider/slots/current');
    return response;
}