// src/app/context/SessionContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSessionStatus } from "../hooks/useSessionStatus";
import { loginUser, logoutUser } from "../services/authService";

export const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const {
    sessionData,
    loading: sessionLoading,
    error: sessionError,
  } = useSessionStatus();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = !!user;

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginUser(credentials.email, credentials.password);
      setUser(response.user);
      setError(null);
      return response.user;
    } catch (err) {
      const message = err.message || "Login failed. Please try again.";
      setError(message);
      throw new Error(message); // Rethrow the error
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      setError(null);
    } catch (err) {
      const message = err.message || "Logout failed. Please try again.";
      setError(message);
      throw new Error(message); // Rethrow the error
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    user,
    setUser,
    loading,
    error: sessionError?.message || error,
    login,
    logout,
    isLoggedIn,
  };

  // update user for when both session exists and doesn't exist
  useEffect(() => {
    if (sessionLoading) {
      setLoading(true);
    } else {
      setUser(sessionData?.user || null);
      setLoading(false);
    }
  }, [sessionLoading, sessionData]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
