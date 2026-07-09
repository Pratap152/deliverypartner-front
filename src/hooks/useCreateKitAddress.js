import { useState } from "react";
import apiClient from "../services/ApiClient";
import { useSelector } from 'react-redux';

export function useKitAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);

  const pincode = useSelector((state) => state.profile.data?.location?.pincode?.trim());

  // POST – create kit address 
  const createKitAddress = async (name, address, pincode, deliveryMode="HOME_DELIVERY", pickupLocationId = null) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await apiClient.post(
        "/api/kit/rider/joining-kit",
        {
          deliveryMode,
          name,
          completeAddress: address,
          pincode,
          ...(pickupLocationId && { pickupLocationId }),
        },
        { headers: { "x-client": "mobile" } }
      );
      setData(response.data);
      setSuccess(true);
      return response.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // GET – fetch zone points by pincode
  const getKitAddress = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await apiClient.get('/api/location/cities', {
      headers: { 'x-client': 'mobile' },
    });

    const cities = response?.data?.cities ?? [];
    setData(cities);
    return cities;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || 'Something went wrong';
    setError(message);
    throw err;
  } finally {
    setLoading(false);
  }
};
  const getJoiningKit = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await apiClient.get('/api/kit/joining-kit', {
      headers: { 'x-client': 'mobile' },
    });
    setData(response.data);
    return response.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || 'Something went wrong';
    setError(message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  return {
    createKitAddress,
    getKitAddress,
    getJoiningKit,
    data,
    loading,
    error,
    success,
  };
}
