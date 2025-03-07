import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create a custom event for logout that can be used by other components
export const createLogoutEvent = () => {
  const logoutEvent = new CustomEvent('userLogout');
  window.dispatchEvent(logoutEvent);
};

const Logout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenDebug, setTokenDebug] = useState({
    localStorageToken: null,
    tokenType: null,
    isExpired: false
  });

  // Debug effect to check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    let isExpired = false;
    
    if (token) {
      try {
        // Parse the token (assuming JWT format)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        // Check if token is expired
        isExpired = payload.exp < Date.now() / 1000;
      } catch (error) {
        console.error("Token parsing error:", error);
        isExpired = true; // Assume expired if we can't parse it
      }
    }
    
    setTokenDebug({
      localStorageToken: token,
      tokenType: typeof token,
      isExpired
    });
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Extensive logging
      console.group("Logout Debugging");
      console.log("Raw Token:", token);
      console.log("Token Type:", typeof token);
      console.log("Token Length:", token ? token.length : 'N/A');

      // Validate token before sending
      if (!token) {
        console.error("No token found in localStorage");
        throw new Error("No authentication token");
      }

      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ token }) // Optional: send token in body if needed
      });

      const responseData = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Data:", responseData);
      console.groupEnd();

      // Handle different response scenarios
      if (response.ok) {
        // Clear token from all possible storage locations
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        
        // Fire logout event for other components
        createLogoutEvent();
        
        // Navigate away
        navigate("/login", { replace: true });
      } else {
        // Fallback logout
        throw new Error(responseData.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      
      // Force logout on any error
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      
      // Fire logout event even on error
      createLogoutEvent();
      
      // More aggressive redirect
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Debug token information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mb-2">
          Token Debug: {tokenDebug.localStorageToken ? 'Present' : 'Missing'}
          {tokenDebug.isExpired && ' (Expired)'}
        </div>
      )}
      
      <button 
        className={`
          start-btn 
          signuppage 
          transition-all 
          duration-200 
          ease-in-out 
          ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        `}
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default Logout;