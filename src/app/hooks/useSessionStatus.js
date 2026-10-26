//app/hooks/useAuthStatus.js
import { useState, useEffect } from "react";
import { getSessionStatus } from "../services/authService";

export const useSessionStatus = () => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      try {
        const data = await getSessionStatus();
        if (isActive) setSessionData(data);
      } catch (error) {
        if (isActive) setError(error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    checkSession();

    return () => {
      isActive = false;
    };
  }, []);

  return { sessionData, loading, error };
};
