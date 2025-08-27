import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import GeometricAnimation from "./GeometricAnimation";
import FaceModel from "./FaceModel";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const HeroSection = ({ Loaded, onFaceModelLoaded }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [animateScroll, setAnimateScroll] = useState(false);

  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const lastScrollPos = useRef(0);

  /** Detect Mobile */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** Animate Stats */
  useEffect(() => {
    if (statsRef.current && Loaded) {
      gsap.fromTo(
        statsRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0 }
      );
    }
  }, [Loaded]);

  /** Delay Scroll Animation */
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateScroll(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  /** Navbar Show/Hide on Scroll */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(
        lastScrollPos.current > currentScrollPos || currentScrollPos < 10
      );
      lastScrollPos.current = currentScrollPos;
      setIsMobileMenuOpen(false);
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledHandleScroll);
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  /** Section Tracking */
  useEffect(() => {
    const sections = ["home", "about", "news", "faq", "contact-us"];
    const observers = sections.map((id) => {
      const section = document.getElementById(id);
      if (!section) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.4 }
      );
      observer.observe(section);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  /** Hero in View Detection */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    const currentHeroRef = heroRef.current;
    if (currentHeroRef) observer.observe(currentHeroRef);
    return () => {
      if (currentHeroRef) observer.unobserve(currentHeroRef);
    };
  }, []);

  /** FaceModel Callback */
  const handleFaceModelLoaded = useCallback(() => {
    if (onFaceModelLoaded) {
      onFaceModelLoaded();
    }
  }, [onFaceModelLoaded]);

  /** Navbar Links */
  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "news", label: "News" },
    { id: "faq", label: "FAQ" },
    { id: "contact-us", label: "Contact Us" },
  ];

  const getLinkClass = (id) =>
    activeSection === id
      ? "text-white font-semibold border-b-2 border-white"
      : "text-gray-300 hover:text-white";

  return (
    <div
      className="relative h-screen bg-transparent text-white overflow-hidden"
      id="home"
      ref={heroRef}
    >
      {/* Background Animations */}
      <GeometricAnimation paused={!isHeroInView} />
      <FaceModel
        paused={!isHeroInView}
        disableTracking={isMobile}
        onModelLoaded={handleFaceModelLoaded}
      />

      {/* Overlay Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-black z-20 pointer-events-none" />

      {/* Navbar */}
      <nav
        className={`w-full fixed top-0 z-50 transition-transform duration-300 bg-gradient-to-b from-black to-transparent ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center px-[4vw] py-4 w-full">
          <img
            src="/logoGenReal.png"
            alt="GenReal AI"
            className="h-[12vw] w-[12vw] sm:h-[8vw] sm:w-[8vw] md:h-[6.5vw] md:w-[6.5vw] lg:h-[6vw] lg:w-[6vw] xl:h-[5vw] xl:w-[5vw]"
          />
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
          {/* Desktop Links */}
          <ul className="hidden md:flex text-lg gap-[4vw] font-light">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className={getLinkClass(link.id)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <ul className="md:hidden px-[4vw] pb-4 space-y-2 bg-black/30 backdrop-blur-md z-40">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className={getLinkClass(link.id)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Desktop Hero */}
      <div className="absolute inset-0 z-30 pointer-events-none hidden md:block">
        <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-[clamp(4rem,8vw,6rem)] lg:text-[clamp(4.5rem,7vw,5.5rem)] xl:text-[clamp(5rem,6vw,6rem)] leading-[0.9] font-bold whitespace-nowrap">
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-[#6EE5F5] via-[#29A3B3] to-[#1397A9] bg-clip-text text-transparent">
              GenReal
            </span>
            .AI
          </h1>
          <p className="mt-[clamp(1rem,2vw,2rem)] text-[clamp(0.875rem,1.5vw,1.125rem)] text-gray-300">
            Discover the new age of security
          </p>
          <div className="relative pointer-events-auto">
            <a href="#products">
              <button className="get-started-btn mt-[clamp(1.5rem,3vw,2rem)] bg-orange-400 hover:bg-orange-500 text-white px-[clamp(1.5rem,2vw,2rem)] py-[clamp(0.75rem,1vw,1rem)] rounded-full text-[clamp(0.875rem,1vw,1rem)] font-semibold transition duration-300 transform hover:scale-105">
                Get Started →
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Hero (fully responsive + small screen tweak at ≤678px) */}
      <div className="absolute inset-0 z-30 pointer-events-none md:hidden">
        <div className="h-full flex flex-col min-h-screen">
          
          {/* Welcome Text */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-[clamp(1rem,5vw,2rem)] mt-[clamp(2rem,6vh,4rem)]">
            <h1 className="text-[clamp(3rem,9vw,3.5rem)] leading-[1] font-bold max-w-[90vw] mx-auto">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-[#6EE5F5] via-[#29A3B3] to-[#1397A9] bg-clip-text text-transparent">
                GenReal
              </span>
              .AI
            </h1>
            <p className="mt-[clamp(0.9rem,2vh,1.25rem)] text-[clamp(0.9rem,3vw,0.95rem)] text-gray-300 max-w-[80vw] mx-auto leading-relaxed">
              Discover the new age of security
            </p>

            {/* ✅ Button moved here */}
            <div className="mt-[clamp(1rem,3vh,1.5rem)] pointer-events-auto">
              <a href="#products">
                <button className="bg-orange-400 hover:bg-orange-500 text-white px-[clamp(1.25rem,5vw,1.75rem)] py-[clamp(0.6rem,2vh,0.9rem)] rounded-full text-[clamp(0.8rem,3vw,0.95rem)] font-semibold transition duration-300 transform hover:scale-105 shadow-lg shadow-orange-400/25">
                  Get Started →
                </button>
              </a>
            </div>
          </div>

          {/* ✅ Stats Below Button (responsive) */}
          <div className="flex-none pb-[clamp(1rem,3vh,2rem)] w-full">
            <div className="px-[clamp(0.75rem,4vw,1.5rem)]">
              <div className="pointer-events-auto w-full max-w-[500px] mx-auto">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-cyan-400/30 p-[clamp(0.75rem,3vw,1.25rem)]">
                  <div className="flex flex-col xs:flex-row items-center justify-between gap-[clamp(0.75rem,3vw,1rem)]">
                    
                    {/* Stat 1 */}
                    <div className="text-center flex-1">
                      <h3 className="text-cyan-400 text-[clamp(1rem,5vw,1.5rem)] font-bold">
                        80%
                      </h3>
                      <p className="text-gray-400 text-[clamp(0.65rem,3vw,0.8rem)] leading-tight">
                        companies lack deepfake protocols
                      </p>
                    </div>

                    {/* Divider (hidden on extra small) */}
                    <div className="hidden xs:block w-px h-[clamp(2.5rem,8vh,3.5rem)] bg-gray-500/50"></div>

                    {/* Stat 2 */}
                    <div className="text-center flex-1">
                      <h3 className="text-cyan-400 text-[clamp(1rem,5vw,1.5rem)] font-bold">
                        60%
                      </h3>
                      <p className="text-gray-400 text-[clamp(0.65rem,3vw,0.8rem)] leading-tight">
                        people saw deepfakes last year
                      </p>
                    </div>
                  </div>

                  {/* Scroll Indicator */}
                  <div className="flex items-center justify-center mt-[clamp(0.75rem,2.5vh,1rem)] pt-[clamp(0.75rem,2.5vh,1rem)] border-t border-gray-700/50">
                    <p
                      className={`text-[clamp(0.65rem,2.5vw,0.75rem)] text-white/50 transition-all duration-1000 ease-out ${
                        animateScroll ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      ↓ Scroll to explore
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Desktop Stats */}
      <div
        ref={statsRef}
        className="absolute opacity-0 w-full bottom-0 z-40 hidden md:flex justify-around items-center px-8 py-4 pointer-events-auto"
      >
        <div className="text-center">
          <h2 className="text-cyan-400 text-4xl font-bold">80%</h2>
          <p className="text-gray-400 mt-2 text-sm max-w-xs">
            of companies lack protocols to handle deepfake attacks
          </p>
        </div>
        <div className="translate-y-6 h-[4vw] flex justify-center items-center flex-col">
          <p
            className={`relative transition-all text-white/60 duration-1000 ease-out ${
              animateScroll ? "top-0" : "top-[20px]"
            }`}
          >
            Scroll Down
          </p>
          <div className="w-full -mt-1 z-[99] h-[2vw] bg-black"></div>
        </div>
        <div className="text-center">
          <h2 className="text-cyan-400 text-4xl font-bold">60%</h2>
          <p className="text-gray-400 mt-2 text-sm max-w-xs">
            of people encountered a deepfake video in the past year
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
