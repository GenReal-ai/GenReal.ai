// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { AuthUtils } from '../utils/authUtils';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const token = AuthUtils.getToken();
      const storedUser = AuthUtils.getUser();

      if (!token || !storedUser) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Validate token with backend
      const isValid = await AuthUtils.validateToken();
      
      if (isValid) {
        setIsAuthenticated(true);
        setUser(AuthUtils.getUser());
      } else {
        // Token invalid, clear auth state
        AuthUtils.removeToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, clear auth state
      AuthUtils.removeToken();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback((token, userData) => {
    AuthUtils.setToken(token);
    AuthUtils.setUser(userData);
    setIsAuthenticated(true);
    setUser(userData);
    
    // Dispatch global auth state change
    window.dispatchEvent(
      new CustomEvent('authStateChanged', {
        detail: { isLoggedIn: true, user: userData }
      })
    );
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await AuthUtils.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      AuthUtils.removeToken();
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Update user data
  const updateUser = useCallback((userData) => {
    AuthUtils.setUser(userData);
    setUser(userData);
  }, []);

  // Check credits
  const hasCredits = useCallback((required = 1) => {
    return user && user.credits >= required;
  }, [user]);

  // Listen for auth state changes from other components
  useEffect(() => {
    const handleAuthStateChange = (event) => {
      const { isLoggedIn, user: eventUser } = event.detail;
      setIsAuthenticated(isLoggedIn);
      setUser(eventUser || null);
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUser,
    hasCredits,
    checkAuth
  };
};