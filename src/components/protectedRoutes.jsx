// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireCredits = 0, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

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

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#010c1f] via-[#01152b] to-[#00132d] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (requireCredits > 0 && user?.credits < requireCredits) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#010c1f] via-[#01152b] to-[#00132d] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Insufficient Credits</h1>
          <p>You need {requireCredits} credits to access this feature.</p>
          <p>Available credits: {user?.credits || 0}</p>
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            Get More Credits
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;