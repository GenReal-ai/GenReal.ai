// hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { AuthUtils } from "../utils/authUtils";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthUtils.isAuthenticated()
  );
  const [user, setUser] = useState(AuthUtils.getUser());
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthUtils.isAuthenticated()) {
          let isValid = await AuthUtils.validateToken();

          if (!isValid) {
            // Try refresh if token expired
            const refreshed = await AuthUtils.refreshToken();
            if (refreshed) {
              setIsAuthenticated(true);
              setUser(AuthUtils.getUser());
              setLoading(false);
              return;
            }
          }

          if (isValid) {
            setIsAuthenticated(true);
            setUser(AuthUtils.getUser());
          } else {
            setIsAuthenticated(false);
            setUser(null);
            AuthUtils.removeToken();
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
        AuthUtils.removeToken();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Listen for auth state changes (cross-tab + internal updates)
  useEffect(() => {
    const handleAuthChange = (event) => {
      setIsAuthenticated(event.detail.isLoggedIn);
      if (event.detail.isLoggedIn) {
        setUser(AuthUtils.getUser());
      } else {
        setUser(null);
      }
    };

    window.addEventListener("authStateChanged", handleAuthChange);
    return () =>
      window.removeEventListener("authStateChanged", handleAuthChange);
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important: send cookies for refresh token
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        AuthUtils.setToken(data.token);
        AuthUtils.setUser(data.user);
        setIsAuthenticated(true);
        setUser(data.user);

        // Dispatch global event
        window.dispatchEvent(
          new CustomEvent("authStateChanged", {
            detail: { isLoggedIn: true },
          })
        );

        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error" };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await AuthUtils.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setIsAuthenticated(false);
    setUser(null);

    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { isLoggedIn: false },
      })
    );
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkCredits: AuthUtils.checkCredits,
    authenticatedFetch: AuthUtils.authenticatedFetch,
  };
};
