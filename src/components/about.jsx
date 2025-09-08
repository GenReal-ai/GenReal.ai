import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const AboutUsSection = () => {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const deepfakeRef = useRef(null);
  const plagiarismRef = useRef(null);
  const floatingElementsRef = useRef([]);
  const particlesRef = useRef([]);
  const leftMotionRef = useRef(null);
  const rightMotionRef = useRef(null);
  const rotatingCircleRef = useRef(null);
  const codeBlockRef = useRef(null);
  
  const [currentImage, setCurrentImage] = useState('real');

  // Navigate to products page
  const handleStartDetection = () => {
    // In a real app, you would use React Router or Next.js router
    // For demo purposes, we'll just scroll or show an alert
    alert("Navigating to Products page...");
    // Example: navigate('/products') or window.location.href = '/products'
  };

  useEffect(() => {
    const createFloatingElements = () => {
      if (!sectionRef.current) return;
      for (let i = 0; i < 15; i++) { // Reduced from 20 to 15
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: #00D1FF;
          border-radius: 50%;
          opacity: ${Math.random() * 0.4 + 0.1};
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          z-index: 0;
        `;
        sectionRef.current.appendChild(element);
        floatingElementsRef.current.push(element);
      }
    };

    const createParticles = () => {
      if (!sectionRef.current) return;
      for (let i = 0; i < 30; i++) { // Reduced from 50 to 30
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
          position: absolute;
          width: 1px;
          height: 1px;
          background: #00D1FF;
          opacity: ${Math.random() * 0.3 + 0.1};
          left: ${Math.random() * 100}%;
          top: 100%;
          pointer-events: none;
          z-index: 0;
        `;
        sectionRef.current.appendChild(particle);
        particlesRef.current.push(particle);
      }
    };

    createFloatingElements();
    createParticles();

    const ctx = gsap.context(() => {
      // Background particle animations
      particlesRef.current.forEach((particle) => {
        gsap.to(particle, {
          y: -window.innerHeight - 100,
          duration: Math.random() * 10 + 8,
          repeat: -1,
          delay: Math.random() * 5,
          ease: "none"
        });
        gsap.to(particle, {
          x: `+=${Math.random() * 200 - 100}`,
          duration: Math.random() * 8 + 6,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      });

      floatingElementsRef.current.forEach((element) => {
        gsap.to(element, {
          y: Math.random() * 100 - 50,
          x: Math.random() * 100 - 50,
          duration: Math.random() * 6 + 4,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: Math.random() * 2
        });
      });

      // Hero section animation
      if (heroRef.current) {
        gsap.fromTo(heroRef.current, 
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 50%",  
              end: "top 20%",
              scrub: 1.5,
              invalidateOnRefresh: true
            }
          }
        );
      }

      // Deepfake section
      const deepfakeTl = gsap.timeline({
        scrollTrigger: {
          trigger: deepfakeRef.current,
          start: "top 90%",
          end: "top 20%",
          scrub: 1.3,
        }
      });
      deepfakeTl.fromTo(deepfakeRef.current.querySelector('.content-wrapper'),
        { x: -200, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1 });

      // **UPDATED: 180-degree rotation with 3-second pause**
      if (rotatingCircleRef.current) {
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(rotatingCircleRef.current, {
          rotationY: 180,
          duration: 1.5,
          ease: "power2.inOut"
        })
        .to(rotatingCircleRef.current, {
          rotationY: 180,
          duration: 3, // 3-second pause
          ease: "none"
        })
        .to(rotatingCircleRef.current, {
          rotationY: 360,
          duration: 1.5,
          ease: "power2.inOut"
        })
        .to(rotatingCircleRef.current, {
          rotationY: 360,
          duration: 3, // 3-second pause
          ease: "none"
        })
        .set(rotatingCircleRef.current, { rotationY: 0 }); // Reset for loop
      }

      // Plagiarism section
      const plagiarismTl = gsap.timeline({
        scrollTrigger: {
          trigger: plagiarismRef.current,
          start: "top 90%",
          end: "top 35%",
          scrub: 1.5,
        }
      });
      plagiarismTl.fromTo(plagiarismRef.current.querySelector('.content-wrapper'),
        { x: -200, opacity: 0, scale: 0.8 }, // Changed from x: 200 to x: -200
        { x: 0, opacity: 1, scale: 1 });

      // Code block animation
      if (codeBlockRef.current) {
        const lines = codeBlockRef.current.querySelectorAll('.code-line');
        gsap.set(lines, { opacity: 0, x: -50 });
        
        gsap.to(lines, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.2,
          repeat: -1,
          repeatDelay: 2,
          yoyo: false,
          scrollTrigger: {
            trigger: plagiarismRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        });
      }

      // Motion path animations
      if (leftMotionRef.current) {
        gsap.to(leftMotionRef.current, {
          motionPath: {
            path: [{x:0, y:0}, {x:-100, y:-200}, {x:50, y:-400}, {x:-50, y:-600}, {x:0, y:-800}],
            curviness: 2,
            autoRotate: true,
          },
          duration: 15, repeat: -1, ease: "none"
        });
      }
      if (rightMotionRef.current) {
        gsap.to(rightMotionRef.current, {
          motionPath: {
            path: [{x:0, y:0}, {x:100, y:-150}, {x:-30, y:-350}, {x:80, y:-550}, {x:0, y:-750}],
            curviness: 2,
            autoRotate: true,
          },
          duration: 12, repeat: -1, ease: "none", delay: 2
        });
      }

    }, sectionRef);

    // Image rotation timer
    const imageTimer = setInterval(() => {
      setCurrentImage(prev => prev === 'real' ? 'deepfake' : 'real');
    }, 3000);

    return () => {
      ctx.revert();
      clearInterval(imageTimer);
      floatingElementsRef.current.forEach(el => el.remove());
      particlesRef.current.forEach(el => el.remove());
    };
  }, []);

  const DetectionIcon = () => (
    <div className="icon-wrapper w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 relative">
      <svg viewBox="0 0 64 64" className="w-full h-full text-[#00D1FF]">
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
        <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
        <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="3"/>
        <circle cx="32" cy="32" r="4" fill="currentColor"/>
        <path d="M32 4 L36 12 L32 20 L28 12 Z" fill="currentColor" opacity="0.8"/>
        <path d="M60 32 L52 36 L44 32 L52 28 Z" fill="currentColor" opacity="0.8"/>
        <path d="M32 60 L28 52 L32 44 L36 52 Z" fill="currentColor" opacity="0.8"/>
        <path d="M4 32 L12 28 L20 32 L12 36 Z" fill="currentColor" opacity="0.8"/>
      </svg>
    </div>
  );

  const PlagiarismIcon = () => (
    <div className="icon-wrapper w-12 h-12 md:w-16 md:h-16 mx-auto mb-4">
      <svg viewBox="0 0 64 64" className="w-full h-full text-[#00D1FF]">
        <rect x="8" y="8" width="48" height="48" rx="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
        <rect x="12" y="12" width="40" height="40" rx="4" fill="currentColor" opacity="0.1"/>
        <line x1="18" y1="22" x2="46" y2="22" stroke="currentColor" strokeWidth="2"/>
        <line x1="18" y1="30" x2="46" y2="30" stroke="currentColor" strokeWidth="2"/>
        <line x1="18" y1="38" x2="38" y2="38" stroke="currentColor" strokeWidth="2"/>
        <circle cx="50" cy="14" r="10" fill="currentColor"/>
        <path d="M45 14 L48 17 L55 10" stroke="#0A0F1F" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );

  return (
    <div ref={sectionRef} className="bg-gradient-to-b from-black via-slate-900 to-slate-950 text-white font-sans relative overflow-hidden" id="about">
      
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative z-10 py-12 px-4 opacity-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/5 via-transparent to-[#1E40AF]/5 animate-pulse"></div>
        <div className="container mx-auto max-w-6xl relative z-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="hero-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-cyan-400 to-white bg-clip-text text-transparent leading-tight">
                Defending Truth in the Digital Age
              </h1>
              <div className="hero-description space-y-3">
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#E6F3FF] font-medium max-w-2xl mx-auto lg:mx-0">
                  In a world where <span className="font-bold text-white">synthetic content threatens authenticity</span>, we stand as your digital guardian. AI-generated deepfakes and plagiarized content are flooding the internet, making it harder than ever to trust what you see and read.
                </p>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#E6F3FF] font-medium max-w-2xl mx-auto lg:mx-0">
                  <span className="font-bold text-[#00D1FF]">GenReal.ai</span> provides cutting-edge detection technology that <span className="font-bold text-white">identifies AI-generated content with significant accuracy</span>. Our mission is simple: restore trust, verify authenticity, and protect the integrity of digital content across platforms worldwide.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                <button 
                  onClick={handleStartDetection}
                  className="bg-gradient-to-r from-[#00D1FF] to-[#0099CC] text-black font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full hover:shadow-lg hover:shadow-[#00D1FF]/30 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Start Detection
                </button>
                <button className="border-2 border-[#00D1FF] text-[#00D1FF] font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full hover:bg-[#00D1FF]/10 transition-all duration-300 text-sm sm:text-base">
                  View Demo
                </button>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xs h-64 sm:h-80 md:h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 bg-gradient-to-r from-[#00D1FF] to-[#0099CC] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.95C16.16 26.74 22 22.55 22 17V7l-10-5z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">AI Detection Engine</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4">Upload any content and get instant authenticity verification powered by advanced neural networks.</p>
                  <div className="flex items-center gap-2 text-[#00D1FF] font-semibold text-xs sm:text-sm">
                    <div className="w-2 h-2 bg-[#00D1FF] rounded-full animate-pulse"></div>
                    <span>Processing in real-time</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deepfake Detection Section */}
      <section ref={deepfakeRef} className="min-h-screen flex items-center py-12 relative z-10 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D1FF]/5 to-transparent transform -skew-y-1"></div>
        <div ref={leftMotionRef} className="absolute left-6 top-1/2 w-6 h-6 bg-[#00D1FF] rounded-full opacity-60 shadow-lg shadow-[#00D1FF]/50 z-20"></div>
        <div className="content-wrapper max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 lg:gap-12 items-center z-10">
          <div className="text-center md:text-left">
            <DetectionIcon />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#00D1FF] to-white bg-clip-text text-transparent">
              Deepfake Detection
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#C9D1D9] leading-relaxed mb-6 max-w-xl mx-auto md:mx-0">
              Our advanced neural networks analyze facial movements, voice patterns, and visual artifacts to identify AI-generated content. From social media posts to news footage, we protect platforms from malicious synthetic media.
            </p>
            <div className="space-y-3 mb-6 inline-block text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm">Real-time video and audio analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm">Detection of latest deepfake techniques</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm">Comprehensive confidence scoring</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-gradient-to-r from-[#00D1FF]/20 to-[#00D1FF]/10 px-4 py-2 rounded-full border border-[#00D1FF]/30 text-[#00D1FF] font-semibold text-xs sm:text-sm">
                Real-time API
              </span>
            </div>
          </div>
          <div className="relative [perspective:1000px] flex justify-center items-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto relative [transform-style:preserve-3d]" ref={rotatingCircleRef}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/30 to-transparent rounded-full"></div>
              <div className="absolute inset-3 bg-gradient-to-br from-[#1E2A38] to-[#2A3441] rounded-full border-2 border-[#00D1FF]/40 overflow-hidden">
                <div className="w-full h-full flex">
                  <div className="w-1/2 h-full bg-green-500/20 flex items-center justify-center border-r border-[#00D1FF]/30">
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                        </svg>
                      </div>
                      <div className="text-green-400 font-bold text-xs">REAL</div>
                    </div>
                  </div>
                  <div className="w-1/2 h-full bg-red-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </div>
                      <div className="text-red-400 font-bold text-xs">DEEPFAKE</div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D1FF]/10 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Plagiarism Detection Section - SWITCHED LAYOUT */}
      <section ref={plagiarismRef} className="min-h-screen flex items-center py-12 relative z-10 px-4">
        <div className="wave-bg absolute inset-0 bg-gradient-to-l from-[#00D1FF]/5 to-transparent transform skew-y-1"></div>
        <div ref={rightMotionRef} className="absolute right-6 top-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-[#00D1FF] to-[#00A8CC] rounded-full opacity-70 shadow-lg shadow-[#00D1FF]/50 z-20"></div>
        <div className="content-wrapper max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-center z-10">
          {/* CONTENT NOW ON LEFT */}
          <div className="text-center md:text-left">
            <PlagiarismIcon />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-l from-[#00D1FF] to-white bg-clip-text text-transparent">
              Code Plagiarism Detection
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#C9D1D9] leading-relaxed mb-6 max-w-xl mx-auto md:mx-0">
              Advanced semantic analysis detects code plagiarism beyond simple copying. Our AI understands programming patterns, identifies subtle modifications, and catches sophisticated attempts to disguise copied code.
            </p>
            <div className="space-y-3 mb-6 inline-block text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm">Multi-language support (50+ languages)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm">Semantic similarity detection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm">Repository-wide scanning</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-gradient-to-l from-[#00D1FF]/20 to-[#00D1FF]/10 px-3 py-2 rounded-full border border-[#00D1FF]/30 text-[#00D1FF] font-semibold text-xs sm:text-sm">
                GitHub Integration
              </span>
              <span className="bg-gradient-to-l from-[#00D1FF]/20 to-[#00D1FF]/10 px-3 py-2 rounded-full border border-[#00D1FF]/30 text-[#00D1FF] font-semibold text-xs sm:text-sm">
                IDE Plugins
              </span>
            </div>
          </div>
          {/* ANIMATION NOW ON RIGHT */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md h-48 sm:h-56 md:h-64 mx-auto relative bg-gray-900 rounded-lg border border-[#00D1FF]/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/5 to-transparent"></div>
              <div ref={codeBlockRef} className="p-2 sm:p-3 font-mono text-xs leading-relaxed">
                <div className="code-line text-gray-500">// Original Code</div>
                <div className="code-line text-blue-400">function <span className="text-yellow-400">calculateSum</span><span className="text-orange-400">(a, b)</span> {'{'}</div>
                <div className="code-line text-white ml-4">return a + b;</div>
                <div className="code-line text-blue-400">{'}'}</div>
                <div className="code-line text-gray-500 mt-2">// Detected Plagiarism</div>
                <div className="code-line text-red-400">function <span className="text-yellow-400">addNumbers</span><span className="text-orange-400">(x, y)</span> {'{'}</div>
                <div className="code-line text-white ml-4">return x + y;</div>
                <div className="code-line text-red-400">{'}'}</div>
                <div className="code-line text-[#00D1FF] mt-2 font-bold text-xs">// 95% Similarity Detected ⚠️</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-6"></div>
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                PLAGIARISM DETECTED
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default AboutUsSection;