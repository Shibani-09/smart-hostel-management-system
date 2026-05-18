import { useState, useCallback } from "react";
import axios from "axios";
import { getAuthHeader } from "../services/api";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios({
        ...config,
        headers: {
          ...config.headers,
          ...getAuthHeader()
        }
      });

      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return { request, loading, error, clearError };
};
