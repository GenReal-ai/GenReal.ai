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

const ColorfulPillNavbar = ({ activeSection, onMobileMenuToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef(null);
  const pillRefs = useRef([]);
  const mobileMenuRef = useRef(null);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'Products', label: 'Products', href: '#Products' },
    { id: 'news', label: 'News', href: '#news' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
    { id: 'contact-us', label: 'Contact', href: '#contact-us' },
    { id: 'account', label: 'Account', href: '/dashboard' },
  ];

  const getItemColor = (id) => {
    const colors = {
      home: 'from-cyan-400 to-blue-500',
      about: 'from-purple-400 to-pink-500',
      Products: 'from-emerald-400 to-teal-500',
      news: 'from-orange-400 to-red-500',
      faq: 'from-yellow-400 to-orange-500',
      'contact-us': 'from-pink-400 to-purple-500',
      account: 'from-blue-600 to-cyan-400'
    };
    return colors[id] || 'from-gray-400 to-gray-600';
  };

  const getItemIcon = (id) => {
    const icons = {
      home: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" />
        </svg>
      ),
      about: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
        </svg>
      ),
      Products: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      news: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" />
        </svg>
      ),
      faq: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      ),
      'contact-us': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      account: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a5 5 0 100 10 5 5 0 000-10zM2 18a8 8 0 1116 0H2z" />
        </svg>
      ),
    };
    return icons[id] || null;
  };

  // Scroll-based visibility logic - ONLY for desktop
  useEffect(() => {
    // Prevent this effect from running on mobile
    if (window.innerWidth < 768) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledHandleScroll);

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [lastScrollY]);

  const handlePillHover = (index, isEntering) => {
    const pill = pillRefs.current[index];
    if (!pill) return;

    const icon = pill.querySelector('.pill-icon');

    if (isEntering) {
      gsap.to(pill, { scale: 1.05, duration: 0.2, ease: "power2.out" });
      if (icon) {
        gsap.fromTo(icon,
          { rotation: 0 },
          { rotation: 360, duration: 0.6, ease: "power2.out" }
        );
      }
    } else {
      gsap.to(pill, { scale: 1, duration: 0.2, ease: "power2.out" });
      if (icon) {
        gsap.set(icon, { rotation: 0 });
      }
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);

    if (mobileMenuRef.current) {
      if (newState) {
        gsap.set(mobileMenuRef.current, { display: 'block' });
        gsap.fromTo(mobileMenuRef.current,
          { opacity: 0, y: -20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => gsap.set(mobileMenuRef.current, { display: 'none' })
        });
      }
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        ref={navRef}
        className={`hidden md:flex fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="flex items-center rounded-full px-4 py-3 backdrop-blur-xl bg-black/20 shadow-xl shadow-black/30">
          <div className="flex items-center justify-center w-14 h-14 rounded-full">
            <img
              src="/logoGenReal.png"
              alt="GenReal AI"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="flex items-center space-x-2">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id;
              const gradientColor = getItemColor(item.id);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  ref={el => pillRefs.current[index] = el}
                  onMouseEnter={() => handlePillHover(index, true)}
                  onMouseLeave={() => handlePillHover(index, false)}
                  className={`
                    relative flex items-center space-x-2 px-4 py-3 rounded-full transition-all duration-300 group
                    ${item.id === "account"
                      ? `bg-gradient-to-r ${getItemColor(item.id)} text-black font-bold shadow-lg`
                      : isActive
                        ? `bg-gradient-to-r ${getItemColor(item.id)} text-black font-bold shadow-lg`
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <div className={`pill-icon transition-colors duration-300 ${isActive || item.id === 'account' ? 'text-black' : ''}`}>
                    {getItemIcon(item.id)}
                  </div>
                  <span className="text-base font-semibold tracking-wide">
                    {item.label}
                  </span>
                  {!isActive && item.id !== 'account' && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradientColor} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Always Visible */}
      <div className="md:hidden fixed top-6 left-6 right-6 z-50 flex justify-between items-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full">
          <img
            src="/logoGenReal.png"
            alt="GenReal AI"
            className="w-12 h-12 object-cover rounded-full"
          />
        </div>
        <button
          onClick={toggleMobileMenu}
          className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-white/10 backdrop-blur-xl bg-black/20 shadow-lg shadow-black/20"
        >
          {/* ✅ FIXED: More robust 2-bar hamburger icon */}
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`block h-0.5 w-6 bg-gradient-to-r from-cyan-400 to-blue-500 transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[2.5px]' : ''
                }`}
            />
            <span
              className={`block h-0.5 w-6 bg-gradient-to-r from-purple-400 to-pink-500 transform transition-all duration-300 ease-in-out mt-1.5 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[2.5px]' : ''
                }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed top-20 left-6 right-6 z-40 hidden"
      >
        <div className="rounded-2xl p-4 backdrop-blur-xl bg-black/20 shadow-xl shadow-black/30">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const gradientColor = getItemColor(item.id);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  // ✅ FIXED: Call toggleMobileMenu to ensure animation runs on close
                  onClick={toggleMobileMenu}
                  className={`
                    flex items-center space-x-3 p-3 rounded-xl transition-all duration-300
                    ${isActive
                      ? `bg-gradient-to-r ${gradientColor} text-black font-bold shadow-lg`
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <div className={`${isActive ? 'text-black' : 'text-white'} transition-colors duration-300`}>
                    {getItemIcon(item.id)}
                  </div>
                  <span className="font-semibold text-sm">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// The HeroSection component remains unchanged
const HeroSection = ({ Loaded, onFaceModelLoaded, activeSection: propActiveSection }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [animateScroll, setAnimateScroll] = useState(false);

  const statsRef = useRef(null);
  const heroRef = useRef(null);

  const currentActiveSection = propActiveSection || activeSection;

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

  /** Section Tracking - Only if no prop activeSection provided */
  useEffect(() => {
    if (propActiveSection) return;

    const handleScroll = () => {
      const sections = ["home", "about", "Products", "news", "faq", "contact-us"];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [propActiveSection]);

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

  return (
    <div
      className="relative h-screen bg-transparent text-white overflow-hidden"
      id="home"
      ref={heroRef}
    >
      <GeometricAnimation paused={!isHeroInView} />
      <FaceModel
        paused={!isHeroInView}
        disableTracking={isMobile}
        onModelLoaded={handleFaceModelLoaded}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-black z-20 pointer-events-none" />
      <ColorfulPillNavbar
        activeSection={currentActiveSection}
      />
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
            <a href="#Products">
              <button className="get-started-btn mt-[clamp(1.5rem,3vw,2rem)] bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-[clamp(1.5rem,2vw,2rem)] py-[clamp(0.75rem,1vw,1rem)] rounded-full text-[clamp(0.875rem,1vw,1rem)] font-semibold transition duration-300 transform hover:scale-105 shadow-lg shadow-orange-400/30">
                Get Started →
              </button>
            </a>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-30 pointer-events-none md:hidden">
        <div className="h-full flex flex-col min-h-screen">
          <div className="flex-1 flex flex-col items-center justify-center text-center px-[clamp(1rem,5vw,2rem)] mt-[clamp(4rem,12vh,6rem)]">
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
            <div className="mt-[clamp(1rem,3vh,1.5rem)] pointer-events-auto">
              <a href="#Products">
                <button className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-[clamp(1.25rem,5vw,1.75rem)] py-[clamp(0.6rem,2vh,0.9rem)] rounded-full text-[clamp(0.8rem,3vw,0.95rem)] font-semibold transition duration-300 transform hover:scale-105 shadow-lg shadow-orange-400/25">
                  Get Started →
                </button>
              </a>
            </div>
          </div>
          <div className="flex-none pb-[clamp(1rem,3vh,2rem)] w-full">
            <div className="px-[clamp(0.75rem,4vw,1.5rem)]">
              <div className="pointer-events-auto w-full max-w-[500px] mx-auto">
                <div className="backdrop-blur-lg rounded-2xl border border-cyan-400/30 p-[clamp(0.75rem,3vw,1.25rem)] shadow-xl shadow-cyan-400/10">
                  <div className="flex flex-col xs:flex-row items-center justify-between gap-[clamp(0.75rem,3vw,1rem)]">
                    <div className="text-center flex-1">
                      <h3 className="text-cyan-400 text-[clamp(1rem,5vw,1.5rem)] font-bold">
                        80%
                      </h3>
                      <p className="text-gray-400 text-[clamp(0.65rem,3vw,0.8rem)] leading-tight">
                        companies lack deepfake protocols
                      </p>
                    </div>
                    <div className="hidden xs:block w-px h-[clamp(2.5rem,8vh,3.5rem)] bg-gray-500/50"></div>
                    <div className="text-center flex-1">
                      <h3 className="text-cyan-400 text-[clamp(1rem,5vw,1.5rem)] font-bold">
                        60%
                      </h3>
                      <p className="text-gray-400 text-[clamp(0.65rem,3vw,0.8rem)] leading-tight">
                        people saw deepfakes last year
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-[clamp(0.75rem,2.5vh,1rem)] pt-[clamp(0.75rem,2.5vh,1rem)] border-t border-gray-700/50">
                    <p
                      className={`text-[clamp(0.65rem,2.5vw,0.75rem)] text-white/50 transition-all duration-1000 ease-out ${animateScroll ? "opacity-100" : "opacity-0"
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
            className={`relative transition-all text-white/60 duration-1000 ease-out ${animateScroll ? "top-0" : "top-[20px]"
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