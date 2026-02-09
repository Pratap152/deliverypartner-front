
import { useState } from "react";
import apiClient from "../services/ApiClient";

export function useKitAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);

  // 🔹 POST – create / update address
  const createKitAddress = async (name, address, pincode) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiClient.post(
        "/api/rider/kit-address",
        {
          name,
          completeAddress: address,
          pincode,
        },
        {
          headers: {
            "x-client": "mobile",
          },
        }
      );

      setData(response.data);
      setSuccess(true);
      return response.data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GET – fetch existing address
  const getKitAddress = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/api/rider/kit-address", {
        headers: {
          "x-client": "mobile",
        },
      });

      // 👇 because backend returns { data: {...} }
      setData(response.data?.data);
      return response.data?.data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createKitAddress,
    getKitAddress,
    data,
    loading,
    error,
    success,
  };
}
