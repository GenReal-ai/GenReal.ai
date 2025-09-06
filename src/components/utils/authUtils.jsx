// utils/authUtils.js - Frontend authentication utilities
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

  // --- Request Helpers ---
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

    let response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // include refresh token cookie
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
          response = await fetch(url, {
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

  // --- Auth Flow ---
  static async refreshToken() {
    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/refresh-token",
        {
          method: "POST",
          credentials: "include", // send cookie
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
      await fetch("http://localhost:3001/api/auth/logout", {
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
        "http://localhost:3001/api/auth/credits"
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
        "http://localhost:3001/api/auth/validate"
      );
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
}
