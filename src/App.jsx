import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useHashScroll from './components/useHashScroll';
import LoginRegister from "./components/LoginRegister";

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


/**
 * This hook is responsible for detecting which section is currently active.
 * It has been updated to use a more stable detection method.
 */
const useActiveSection = (isLoaded) => {
  const [activeSection, setActiveSection] = useState('home');

  // This effect sets up the IntersectionObserver to watch the sections.
  useEffect(() => {
    if (!isLoaded) return;

    const sections = ['home', 'about', 'products', 'news', 'faq', 'contact-us', 'team'];
    
    // The observer now fires when a section crosses the vertical center of the viewport.
    // This is much more reliable for sections of varying heights.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // This rootMargin defines a 1px horizontal line at the exact vertical center of the screen.
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0 // Fire as soon as any part of the element crosses the line
      }
    );

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoaded]);

  // This new useEffect cleanly separates the URL update from the detection logic.
  // It runs only when the activeSection state changes.
  useEffect(() => {
    if (isLoaded && activeSection && window.location.pathname === '/') {
      window.history.replaceState(null, '', `/#${activeSection}`);
    }

  }, [activeSection, isLoaded]);


  return activeSection;
};

// The Home component now correctly passes the activeSection to the Hero.
const Home = ({ isLoaded, onFaceModelLoaded }) => {
  const activeSection = useActiveSection(isLoaded);

  return (
    <div className='z-10' style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
      {/* The Hero component now receives the activeSection to highlight its nav links */}
      <div id="home">
        <Hero Loaded={isLoaded} onFaceModelLoaded={onFaceModelLoaded} activeSection={activeSection} />
      </div>
      
      {/* Ensure each component correctly applies the `id` to its root element */}
      <About id="about" />
      <div id="products">
        <DeepfakeDetectionPlatform />
      </div>
      <News id="news" />
      <FAQ id="faq" />
      <ContactUs id="contact-us" />
      <Team id="team" />
      <Footer />
    </div>
  );
};

// PageWrapper remains the same for transitions.
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

  useEffect(() => {
    const token = localStorage.getItem("token"); // or wherever you store it
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (location.pathname === "/register") setIsLogin(false);
    else setIsLogin(true);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      window.history.replaceState({}, "", "/"); // clean URL
    }
  }, []);

  const handleFaceModelLoaded = () => {
    setFaceModelLoaded(true);
  };

  const handleLoaderFinish = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    if (isLoaded && !location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isLoaded, location]);

  return (
    <div className='relative bg-black overflow-hidden'>
      {!isLoaded && (
        <Loader
          onFinish={handleLoaderFinish}
          faceModelLoaded={faceModelLoaded}
        />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
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
                <LoginRegister isLogin={true}/>
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <LoginRegister isLogin={false}/>
              </PageWrapper>
            }
          />

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

      
      {isLoaded && ["/"].includes(location.pathname) && (
        <LoginWidget isLoggedIn={isLoggedIn} />
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
