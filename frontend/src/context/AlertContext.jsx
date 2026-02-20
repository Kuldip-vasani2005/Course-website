import React, { createContext, useCallback, useState } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const newAlert = { id, message, type };

    setAlerts((prev) => [...prev, newAlert]);

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return addAlert(message, 'success', duration);
  }, [addAlert]);

  const showError = useCallback((message, duration) => {
    return addAlert(message, 'error', duration);
  }, [addAlert]);

  const showWarning = useCallback((message, duration) => {
    return addAlert(message, 'warning', duration);
  }, [addAlert]);

  const showInfo = useCallback((message, duration) => {
    return addAlert(message, 'info', duration);
  }, [addAlert]);

  const value = {
    alerts,
    addAlert,
    removeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};
