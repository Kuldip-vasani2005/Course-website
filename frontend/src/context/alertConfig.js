/**
 * CUSTOM ALERT SYSTEM - Usage Guide
 * 
 * The alert system is a toast notification system that works globally across all pages.
 * 
 * SETUP (Already done in App.jsx):
 * 1. AlertProvider wraps the entire app
 * 2. Toast component displays notifications
 * 3. useAlert hook provides alert functions
 * 
 * USAGE EXAMPLES:
 * 
 * In any component:
 * 
 * import { useAlert } from '../context/useAlert';
 * 
 * function MyComponent() {
 *   const { showSuccess, showError, showWarning, showInfo } = useAlert();
 * 
 *   const handleSubmit = async () => {
 *     try {
 *       // Do something...
 *       showSuccess('Form submitted successfully!');
 *     } catch (error) {
 *       showError('Failed to submit form');
 *     }
 *   };
 * 
 *   return (
 *     <button onClick={handleSubmit}>Submit</button>
 *   );
 * }
 * 
 * AVAILABLE METHODS:
 * 
 * - showSuccess(message, duration)   // Green notification
 * - showError(message, duration)     // Red notification
 * - showWarning(message, duration)   // Orange notification
 * - showInfo(message, duration)      // Blue notification
 * - addAlert(message, type, duration) // Custom with type: 'success', 'error', 'warning', 'info'
 * - removeAlert(id)                   // Manually remove a specific alert
 * 
 * PARAMETERS:
 * - message (string): The text to display
 * - duration (number): Time in milliseconds before auto-closing (default: 4000)
 *   Set duration to 0 for alerts that don't auto-close
 * - type (string): 'success', 'error', 'warning', or 'info'
 * 
 * EXAMPLES:
 * 
 * showSuccess('Profile updated!');
 * showError('Failed to delete course');
 * showWarning('This action cannot be undone', 5000);
 * showInfo('Loading your courses...');
 * 
 * // Alert that doesn't auto-close
 * const alertId = showWarning('Important message', 0);
 * // Later remove it manually
 * removeAlert(alertId);
 */

export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const DEFAULT_DURATION = 4000;
