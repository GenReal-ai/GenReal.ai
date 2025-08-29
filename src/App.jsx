import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useHashScroll from './components/useHashScroll';
import { LoginRegister, AuthCallback } from "./components/LoginRegister";

// Import all the necessary components
import Loader from './components/loader';
import Hero from './components/hero';
import About from './components/about';
import News from './components/news';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import Upload from './components/Upload';
import Plagiarism from "./components/Plagiarism-upload";
import DeepfakeDetectionPlatform from "./components/aboutCards";
import Team from "./components/team";
import LoginWidget from "./components/LoginWidget";
import Dashboard from "./components/Dashboard";

/**
 * Enhanced active section detection using scroll position method
 * This is more reliable than intersection observer for navbar highlighting
 */
const useActiveSection = (isLoaded) => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const sections = ['home', 'about', 'Products', 'news', 'faq', 'contact-us'];
      const scrollPosition = window.scrollY + 200; // Offset for navbar height
      
      // Log for debugging
      console.log('Current scroll position:', scrollPosition);

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const elementTop = element.offsetTop;
          const elementHeight = element.offsetHeight;
          
          console.log(`Section ${sections[i]}:`, {
            top: elementTop,
            height: elementHeight,
            bottom: elementTop + elementHeight,
            isActive: elementTop <= scrollPosition
          });
          
          if (elementTop <= scrollPosition) {
            if (activeSection !== sections[i]) {
              console.log(`Setting active section to: ${sections[i]}`);
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

const AppContent = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [faceModelLoaded, setFaceModelLoaded] = useState(false);
  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");
  
  useHashScroll(isLoaded);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      
      if (token && user) {
        setIsLoggedIn(true);
        console.log("User is already logged in");
      } else {
        setIsLoggedIn(false);
        console.log("User is not logged in");
      }
    };

    checkAuthState();
  }, []);

  // Listen for auth state changes (from login/register components)
  useEffect(() => {
    const handleAuthStateChange = (event) => {
      console.log("Auth state changed:", event.detail);
      setIsLoggedIn(event.detail.isLoggedIn);
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  // Handle route changes for login/register
  useEffect(() => {
    if (location.pathname === "/register") setIsLogin(false);
    else setIsLogin(true);
  }, [location.pathname]);

  // Handle OAuth callback token from URL (legacy support)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      setIsLoggedIn(true);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handleFaceModelLoaded = () => {
    setFaceModelLoaded(true);
  };

  const handleLoaderFinish = () => {
    setIsLoaded(true);
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out user");
    setIsLoggedIn(false);
    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (isLoaded && !location.hash) {
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
          {/* Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            }
          />

          <Route
            path="/deepfake-detection"
            element={
              <PageWrapper>
                <Upload />
              </PageWrapper>
            }
          />
          <Route
            path="/plagiarism-detection"
            element={
              <PageWrapper>
                <Plagiarism />
              </PageWrapper>
            }
          />

          <Route
            path="/login"
            element={
              <PageWrapper>
                <LoginRegister isLogin={true} />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <LoginRegister isLogin={false} />
              </PageWrapper>
            }
          />

          {/* OAuth callback route */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            path="*"
            element={
              <PageWrapper>
                <Home
                  isLoaded={isLoaded}
                  onFaceModelLoaded={handleFaceModelLoaded}
                />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>

      {/* Login Widget - only show on home page when loaded */}
      {isLoaded && location.pathname === "/" && (
        <LoginWidget 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout}
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