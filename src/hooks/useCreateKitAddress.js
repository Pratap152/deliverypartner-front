import { useState } from "react";
import axios from "axios";
import WEBSITE_URL from "../utils/host";
import { useAuth } from "./useAuth";

// move to env later

export function useCreateKitAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { authToken } = useAuth();
  const createKitAddress = async (name,address,pincode) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
        console.log(name,address,pincode,authToken)
      const response = await axios.post(
        `${WEBSITE_URL}/api/rider/kit-address`,
        {
            name: name,
            completeAddress: address,
            pincode:pincode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            "x-client": "mobile",
          },
        }
      );

      setSuccess(true);
      return response.data;
    } catch (err) {
        console.log("Error creating kit address:",err);
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
    loading,
    error,
    success,
  };
}
