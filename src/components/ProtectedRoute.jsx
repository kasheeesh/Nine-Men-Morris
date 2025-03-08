import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const navigate = useNavigate();
  
  const validateToken = () => {
    const token = localStorage.getItem('token');
    
    // If no token exists
    if (!token) {
      setIsTokenValid(false);
      return false;
    }
    
    try {
      // Parse the JWT token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        // Token expired
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setIsTokenValid(false);
        setShowExpiredModal(true);
        return false;
      }
      
      // Calculate time until expiration (in milliseconds)
      const timeUntilExpiry = (payload.exp - currentTime) * 1000;
      
      // Set a timer to check again just before expiration
      if (timeUntilExpiry > 0) {
        // Schedule validation 1 minute before expiry or immediately if less than 1 minute remains
        const timeoutDelay = Math.max(timeUntilExpiry - 60000, 0);
        const tokenCheckTimer = setTimeout(() => {
          validateToken();
        }, timeoutDelay);
        
        return () => clearTimeout(tokenCheckTimer);
      }
      
      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setIsTokenValid(false);
      return false;
    }
  };
  
  // Handle logout event
  const handleLogout = () => {
    setIsTokenValid(false);
  };
  
  // Check token when component mounts
  useEffect(() => {
    validateToken();
    
    // Set up interval to periodically check token validity (every 5 minutes)
    const intervalId = setInterval(validateToken, 5 * 60 * 1000);
    
    // Listen for logout events
    window.addEventListener('userLogout', handleLogout);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('userLogout', handleLogout);
    };
  }, []);
  
  // Handle closing the modal and navigating to login
  const handleLoginRedirect = () => {
    setShowExpiredModal(false);
    navigate('/login', { replace: true });
  };
  
  // If token is invalid and we're not showing the modal, redirect to login
  if (!isTokenValid && !showExpiredModal) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      {/* Session Expired Modal */}
      {showExpiredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Session Expired</h2>
            <p className="mb-6">Your session has expired. Please log in again to continue.</p>
            <button 
              onClick={handleLoginRedirect}
              className="start-btn signuppage w-full"
            >
              Log In
            </button>
          </div>
        </div>
      )}
      
      {/* Render the child routes */}
      <Outlet />
    </>
  );
};

export default ProtectedRoute;