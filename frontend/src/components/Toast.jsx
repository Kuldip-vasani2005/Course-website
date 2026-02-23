import React from 'react';
import { useAlert } from '../context/useAlert';
import './Toast.css';

const Toast = () => {
  const { alerts, removeAlert } = useAlert();

  return (
    <div className="toast-container">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`toast toast-${alert.type}`}
          role="alert"
        >
          <div className="toast-content">
            <span className="toast-icon">
              {alert.type === 'success' && '✓'}
              {alert.type === 'error' && '✕'}
              {alert.type === 'warning' && '⚠'}
              {alert.type === 'info' && 'ℹ'}
            </span>
            <span className="toast-message">{alert.message}</span>
          </div>
          <button
            className="toast-close"
            onClick={() => removeAlert(alert.id)}
            aria-label="Close alert"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
