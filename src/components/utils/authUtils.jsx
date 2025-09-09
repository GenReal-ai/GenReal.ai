// utils/authUtils.js - Frontend authentication utilities with cold start handling
export class AuthUtils {
  // --- Token + User Management ---
  static getToken() {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  }

  static setToken(token) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("token", token); // backward compatibility
  }

  static removeToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  static getUser() {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static isAuthenticated() {
    return !!(this.getToken() && this.getUser());
  }

  // --- Request Helpers with Cold Start Handling ---
  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async authenticatedFetch(url, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    let response = await this.fetchWithRetry(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401) {
      let data;
      try {
        data = await response.clone().json();
      } catch {
        data = {};
      }

      if (data.code === "TOKEN_EXPIRED" || data.code === "INVALID_TOKEN") {
        try {
          await this.refreshToken();
          const newHeaders = {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
            ...options.headers,
          };
          response = await this.fetchWithRetry(url, {
            ...options,
            headers: newHeaders,
            credentials: "include",
          });
        } catch (err) {
          this.logout();
          window.location.href = "/login";
          throw new Error("Authentication expired");
        }
      }
    }

    return response;
  }

  // Fetch with retry logic for handling cold starts
  static async fetchWithRetry(url, options = {}, maxRetries = 2) {
    const delays = [0, 2000, 5000]; // 0ms, 2s, 5s delays
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt} for ${url} after ${delays[attempt]}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), attempt === 0 ? 10000 : 30000);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // If we get a response (even error codes), return it
        if (response.status < 500 || attempt === maxRetries) {
          return response;
        }

        // For 5xx errors, retry
        throw new Error(`Server error: ${response.status}`);

      } catch (error) {
        console.error(`Fetch attempt ${attempt + 1} failed:`, error);
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Check if it's a retryable error
        const isRetryable = error.name === 'AbortError' || 
                           error.message.includes('fetch') ||
                           error.message.includes('network') ||
                           error.message.includes('timeout') ||
                           error.message.includes('Server error') ||
                           error.message.includes('Failed to fetch');

        if (!isRetryable) {
          throw error;
        }
      }
    }
  }

  // --- Auth Flow ---
  static async refreshToken() {
    try {
      const response = await this.fetchWithRetry(
        "https://backendgenreal-authservice.onrender.com/api/auth/refresh-token",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.success && data.token) {
        this.setToken(data.token);
        if (data.user) this.setUser(data.user);
        return data.token;
      }
      throw new Error("Token refresh failed");
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }

  static async logout() {
    try {
      await this.fetchWithRetry("https://backendgenreal-authservice.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.removeToken();

      window.dispatchEvent(
        new CustomEvent("authStateChanged", {
          detail: { isLoggedIn: false },
        })
      );
    }
  }

  // --- Extras ---
  static async checkCredits(requiredCredits = 1) {
    try {
      const response = await this.authenticatedFetch(
        "https://backendgenreal-authservice.onrender.com/api/auth/credits"
      );
      const data = await response.json();

      if (data.success) {
        return data.data.credits >= requiredCredits;
      }
      return false;
    } catch (error) {
      console.error("Credits check error:", error);
      return false;
    }
  }

  static async validateToken() {
    try {
      const response = await this.authenticatedFetch(
        "https://backendgenreal-authservice.onrender.com/api/auth/validate"
      );
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();

      if (data.success) {
        this.setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }

  // Ping backend to wake it up (call this on app load)
  static async wakeUpBackend() {
    try {
      console.log('Pinging backend to wake it up...');
      await this.fetchWithRetry(
        "https://backendgenreal-authservice.onrender.com/health",
        { method: "GET" },
        1 // Only retry once for wake-up
      );
      console.log('Backend is awake');
    } catch (error) {
      console.log('Backend wake-up failed, but continuing:', error);
      // Don't throw error, just log it
    }
  }
}