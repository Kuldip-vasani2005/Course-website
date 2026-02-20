import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const sessionId = searchParams.get('session_id');

      if (!sessionId) {
        setStatus('error');
        setMessage('Invalid payment session. Please try again.');
        return;
      }

      // Verify session with backend
      const response = await axios.post('/enrollments/verify-session', { sessionId });

      setStatus('success');
      setMessage(response.data.message || 'Enrollment successful!');

      // Redirect to My Courses after 3 seconds
      setTimeout(() => {
        navigate('/my-courses');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Payment verification failed. Please contact support.');
      console.error('Payment verification error:', error);
    }
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        {status === 'verifying' && (
          <>
            <div className="spinner"></div>
            <h2>Verifying Payment</h2>
            <p>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>{message}</p>
            <p className="redirect-info">Redirecting to My Courses...</p>
            <button onClick={() => navigate('/my-courses')} className="btn-primary">
              Go to My Courses Now
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">✕</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
