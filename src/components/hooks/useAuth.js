// hooks/useAuth.js - FIXED VERSION
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

      // If no token or user, set unauthenticated immediately
      if (!token || !storedUser) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Set authenticated state immediately with stored data
      setIsAuthenticated(true);
      setUser(storedUser);
      setLoading(false);

      // Validate token in background (don't wait for this)
      AuthUtils.validateToken().then(isValid => {
        if (!isValid) {
          // Token invalid, clear auth state
          AuthUtils.removeToken();
          setIsAuthenticated(false);
          setUser(null);
          
          // Dispatch global auth state change
          window.dispatchEvent(
            new CustomEvent('authStateChanged', {
              detail: { isLoggedIn: false, user: null }
            })
          );
        } else {
          // Update user data if validation returned new data
          const updatedUser = AuthUtils.getUser();
          if (updatedUser) {
            setUser(updatedUser);
          }
        }
      }).catch(error => {
        // On validation error, clear auth state
        AuthUtils.removeToken();
        setIsAuthenticated(false);
        setUser(null);
        
        window.dispatchEvent(
          new CustomEvent('authStateChanged', {
            detail: { isLoggedIn: false, user: null }
          })
        );
      });

    } catch (error) {
      
      // On error, clear auth state
      AuthUtils.removeToken();
      setIsAuthenticated(false);
      setUser(null);
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
      
      // Still clear local state even if API call fails
      AuthUtils.removeToken();
      setIsAuthenticated(false);
      setUser(null);
      
      // Dispatch global auth state change
      window.dispatchEvent(
        new CustomEvent('authStateChanged', {
          detail: { isLoggedIn: false, user: null }
        })
      );
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

  // Initial auth check on mount - only run once
  useEffect(() => {
    let mounted = true;
    
    const performCheck = async () => {
      if (mounted) {
        // Wake up backend service first
        AuthUtils.wakeUpBackend().catch(() => {
          // Ignore wake-up errors
        });
        
        await checkAuth();
      }
    };
    
    performCheck();
    
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once

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