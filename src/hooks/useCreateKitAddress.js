
// move to env later
import { useState } from "react";
import axios from "axios";
import WEBSITE_URL from "../utils/host";
import { useAuth } from "./useAuth";

export function useKitAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);

  const { authToken } = useAuth();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
    "x-client": "mobile",
  };

  // 🔹 POST – create / update address
  const createKitAddress = async (name, address, pincode) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${WEBSITE_URL}/api/rider/kit-address`,
        {
          name,
          completeAddress: address,
          pincode,
        },
        { headers }
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
      const response = await axios.get(
        `${WEBSITE_URL}/api/rider/kit-address`,
        { headers }
      );

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
