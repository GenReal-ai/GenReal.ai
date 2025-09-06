import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useHashScroll from './components/useHashScroll';
import { LoginRegister, AuthCallback } from "./components/LoginRegister";
import { useAuth } from './components/hooks/useAuth';
import ProtectedRoute from './components/protectedRoutes';

// Import all the necessary components
import Loader from './components/loader';
import Hero from './components/hero';
import About from './components/about';
import News from './components/news';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import DeepFakeUpload from './pages/DeepfakeUploadHandler';
import Plagiarism from "./components/Plagiarism-upload";
import DeepfakeDetectionPlatform from "./components/aboutCards";
import Team from "./components/team";
import LoginWidget from "./components/LoginWidget";
import Dashboard from "./components/Dashboard";

const useActiveSection = (isLoaded) => {
 const [activeSection, setActiveSection] = useState('home');

 useEffect(() => {
  if (!isLoaded) return;

  const handleScroll = () => {
   const sections = ['home', 'about', 'Products', 'news', 'faq', 'contact-us'];
   const scrollPosition = window.scrollY + 200; // Offset for navbar height
   
   for (let i = sections.length - 1; i >= 0; i--) {
    const element = document.getElementById(sections[i]);
    if (element) {
     const elementTop = element.offsetTop;
     
     if (elementTop <= scrollPosition) {
      if (activeSection !== sections[i]) {
       setActiveSection(sections[i]);
      }
      break;
     }
    }
   }
  };

  // Throttle scroll handler for performance
  const throttledHandleScroll = (() => {
   let timeoutId;
   return () => {
    if (timeoutId) return;
    timeoutId = setTimeout(() => {
     handleScroll();
     timeoutId = null;
    }, 50);
   };
  })();

  window.addEventListener('scroll', throttledHandleScroll);
  handleScroll(); // Initial check

  return () => window.removeEventListener('scroll', throttledHandleScroll);
 }, [isLoaded, activeSection]);

 useEffect(() => {
  if (isLoaded && activeSection && window.location.pathname === '/') {
   window.history.replaceState(null, '', `/#${activeSection}`);
  }
 }, [activeSection, isLoaded]);

 return activeSection;
};

const Home = ({ isLoaded, onFaceModelLoaded }) => {
 const activeSection = useActiveSection(isLoaded);

 return (
  <div className='z-10' style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
   <div id="home">
    <Hero Loaded={isLoaded} onFaceModelLoaded={onFaceModelLoaded} activeSection={activeSection} />
   </div>
   
   <div id="about">
    <About />
   </div>
   <div id="Products">
    <DeepfakeDetectionPlatform />
   </div>
   <div id="news">
    <News />
   </div>
   <div id="faq">
    <FAQ />
   </div>
   <div id="contact-us">
    <ContactUs />
   </div>
   <div id="team">
    <Team />
   </div>
   <Footer />
  </div>
 );
};

// PageWrapper for transitions
const PageWrapper = ({ children }) => (
 <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -30 }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
 >
  {children}
 </motion.div>
);

// AuthRedirect component to handle authenticated user redirects
const AuthRedirect = ({ isLogin = true }) => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading while checking authentication
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
  
  // If authenticated, redirect to the intended destination or home
  if (isAuthenticated) {
    const redirectUrl = searchParams.get('redirect') || '/';
    return <Navigate to={decodeURIComponent(redirectUrl)} replace />;
  }
  
  // If not authenticated, show login/register form
  return (
    <PageWrapper>
      <LoginRegister isLogin={isLogin} />
    </PageWrapper>
  );
};

const AppContent = () => {
 const location = useLocation();
 const [isLoaded, setIsLoaded] = useState(false);
 const [faceModelLoaded, setFaceModelLoaded] = useState(false);
 const { isAuthenticated, logout } = useAuth();
 
 useHashScroll(isLoaded);

 const handleFaceModelLoaded = () => {
  setFaceModelLoaded(true);
 };

 const handleLoaderFinish = () => {
  setIsLoaded(true);
 };

 // Handle scroll to top on route change
 useEffect(() => {
  if (isLoaded && !location.hash && location.pathname !== '/') {
   window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 }, [isLoaded, location]);

 return (
  <div className="relative bg-black overflow-hidden">
   {/* Loader only on home */}
   {location.pathname === "/" && !isLoaded && (
    <Loader
     onFinish={handleLoaderFinish}
     faceModelLoaded={faceModelLoaded}
    />
   )}

   <AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname}>
     {/* Protected Routes */}
     <Route
      path="/dashboard"
      element={
       <ProtectedRoute>
        <PageWrapper>
         <Dashboard />
        </PageWrapper>
       </ProtectedRoute>
      }
     />

     <Route
      path="/deepfake-detection"
      element={
       <ProtectedRoute requireCredits={1}>
        <PageWrapper>
         <DeepFakeUpload />
        </PageWrapper>
       </ProtectedRoute>
      }
     />
     
     <Route
      path="/plagiarism-detection"
      element={
       <ProtectedRoute requireCredits={1}>
        <PageWrapper>
         <Plagiarism />
        </PageWrapper>
       </ProtectedRoute>
      }
     />

     {/* Public Routes with proper redirect handling */}
     <Route
      path="/login"
      element={<AuthRedirect isLogin={true} />}
     />
     
     <Route
      path="/register"
      element={<AuthRedirect isLogin={false} />}
     />

     {/* OAuth callback route */}
     <Route path="/auth/callback" element={<AuthCallback />} />

     {/* Home and 404 fallback */}
     <Route
      path="/"
      element={
       <PageWrapper>
        <Home
         isLoaded={isLoaded}
         onFaceModelLoaded={handleFaceModelLoaded}
        />
       </PageWrapper>
      }
     />

     {/* 404 - redirect to home */}
     <Route
      path="*"
      element={<Navigate to="/" replace />}
     />
    </Routes>
   </AnimatePresence>

   {/* Login Widget - only show on home page when loaded */}
   {isLoaded && location.pathname === "/" && (
    <LoginWidget 
     isLoggedIn={isAuthenticated} 
     onLogout={logout}
    />
   )}
  </div>  
 );
};

const App = () => {
 return (
  <Router>
   <AppContent />
  </Router>
 );
};

export default App;