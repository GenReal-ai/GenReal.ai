// components/protectedRoutes.jsx - FIXED VERSION
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children, requireCredits = 0 }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#010c1f] via-[#01152b] to-[#00132d] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with current path as redirect
  if (!isAuthenticated) {
    const redirectPath = encodeURIComponent(`${location.pathname}${location.search}${location.hash}`);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  // Check credits if required
  if (requireCredits > 0 && (!user || user.credits < requireCredits)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#010c1f] via-[#01152b] to-[#00132d] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-bold mb-4">Insufficient Credits</h2>
          <p className="text-gray-300 mb-6">
            You need {requireCredits} credit{requireCredits > 1 ? 's' : ''} to access this feature.
            {user && ` You currently have ${user.credits} credits.`}
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has sufficient credits
  return children;
};

export default ProtectedRoute;