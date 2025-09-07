// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children, requireCredits = 0, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#010c1f] via-[#01152b] to-[#00132d] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-white mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    const redirectUrl = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  // Check admin permissions
  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#010c1f] via-[#01152b] to-[#00132d] flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">You don't have permission to access this page. Admin privileges required.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check credit requirements
  if (requireCredits > 0 && (!user?.credits || user.credits < requireCredits)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#010c1f] via-[#01152b] to-[#00132d] flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="text-yellow-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Insufficient Credits</h1>
          <p className="text-gray-300 mb-2">You need <span className="font-semibold text-cyan-400">{requireCredits}</span> credits to access this feature.</p>
          <p className="text-gray-400 mb-6">Available credits: <span className="font-semibold">{user?.credits || 0}</span></p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-semibold"
            >
              Get More Credits
            </button>
            <button 
              onClick={() => window.history.back()}
              className="w-full px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;