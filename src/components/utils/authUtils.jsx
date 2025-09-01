// utils/authUtils.js - Frontend authentication utilities
export class AuthUtils {
  static getToken() {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  }

  static setToken(token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token); // Keep both for compatibility
  }

  static removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static getUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Create authenticated API request headers
  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Make authenticated API request
  static async authenticatedFetch(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for refresh token
    });

    // Handle token expiration
    if (response.status === 401) {
      const data = await response.json();
      if (data.code === 'TOKEN_EXPIRED' || data.code === 'INVALID_TOKEN') {
        // Try to refresh token
        try {
          await this.refreshToken();
          // Retry the original request with new token
          const newHeaders = {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
            ...options.headers,
          };
          return fetch(url, { ...options, headers: newHeaders, credentials: 'include' });
        } catch (refreshError) {
          // Refresh failed, redirect to login
          this.logout();
          window.location.href = '/login';
          throw new Error('Authentication expired');
        }
      }
    }

    return response;
  }

  // Refresh access token using refresh token (stored in httpOnly cookie)
  static async refreshToken() {
    try {
      const response = await fetch('http://localhost:3001/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include', // Send cookies
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        this.setToken(data.token);
        return data.token;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout() {
    try {
      // Call logout endpoint to invalidate refresh token
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.removeToken();
      
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { isLoggedIn: false } 
      }));
    }
  }

  // Check if user has enough credits
  static async checkCredits(requiredCredits = 1) {
    try {
      const response = await this.authenticatedFetch('http://localhost:3001/api/auth/credits');
      const data = await response.json();
      
      if (data.success) {
        return data.data.credits >= requiredCredits;
      }
      return false;
    } catch (error) {
      console.error('Credits check error:', error);
      return false;
    }
  }

  // Validate current token
  static async validateToken() {
    try {
      const response = await this.authenticatedFetch('http://localhost:3001/api/auth/validate');
      const data = await response.json();
      
      if (data.success) {
        // Update user data in localStorage
        this.setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}