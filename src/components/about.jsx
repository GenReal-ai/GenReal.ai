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
  const deepfakeProgressRef = useRef(null);
  const codeBlockRef = useRef(null); 
  
 

const handleStartDetection = () => {
  const element = document.getElementById("products");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

  useEffect(() => {
    const createFloatingElements = () => {
      if (!sectionRef.current) return;
      for (let i = 0; i < 3; i++) { 
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
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
        `;
        sectionRef.current.appendChild(element);
        floatingElementsRef.current.push(element);
      }
    };

    const createParticles = () => {
      if (!sectionRef.current) return;
      for (let i = 0; i < 10; i++) {
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
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
        `;
        sectionRef.current.appendChild(particle);
        particlesRef.current.push(particle);
      }
    };

    createFloatingElements();
    createParticles();

    const ctx = gsap.context(() => {
      // Background particles
      particlesRef.current.forEach((particle) => {
        gsap.to(particle, {
          y: -window.innerHeight - 100,
          duration: Math.random() * 10 + 8,
          repeat: -1,
          delay: Math.random() * 5,
          ease: "none",
          force3D: true
        });
        gsap.to(particle, {
          x: `+=${Math.random() * 200 - 100}`,
          duration: Math.random() * 8 + 6,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          force3D: true
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
          delay: Math.random() * 2,
          force3D: true
        });
      });

      // Hero section animation
      if (heroRef.current) {
        gsap.fromTo(heroRef.current, 
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Deepfake section
      if (deepfakeRef.current) {
        gsap.fromTo(deepfakeRef.current.querySelector('.content-wrapper'),
          { x: -200, opacity: 0, scale: 0.8 },
          { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: deepfakeRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Deepfake Progress Animation
      if (deepfakeProgressRef.current) {
        const progressBars = deepfakeProgressRef.current.querySelectorAll('.progress-bar');
        const percentageTexts = deepfakeProgressRef.current.querySelectorAll('.percentage-text');
        const statusTexts = deepfakeProgressRef.current.querySelectorAll('.status-text');
        
        gsap.set(progressBars, { width: "0%" });
        gsap.set(percentageTexts, { textContent: "0%" });
        
        const tl = gsap.timeline({ 
          repeat: -1, 
          repeatDelay: 3,
          scrollTrigger: {
            trigger: deepfakeRef.current,
            start: "top 60%",
            toggleActions: "play none none restart"
          }
        });

        tl.to(statusTexts[0], { opacity: 1, duration: 0.3 })
          .to(progressBars[0], { 
            width: "100%", 
            duration: 2, 
            ease: "power2.out",
            onUpdate: function() {
              const progress = Math.round(this.progress() * 100);
              percentageTexts[0].textContent = progress + "%";
            }
          })
          .to(statusTexts[0], { opacity: 0.5, duration: 0.3 })
          .to(statusTexts[1], { opacity: 1, duration: 0.3 }, "-=0.2")
          .to(progressBars[1], { 
            width: "100%", 
            duration: 1.8, 
            ease: "power2.out",
            onUpdate: function() {
              const progress = Math.round(this.progress() * 100);
              percentageTexts[1].textContent = progress + "%";
            }
          })
          .to(statusTexts[1], { opacity: 0.5, duration: 0.3 })
          .to(statusTexts[2], { opacity: 1, duration: 0.3 }, "-=0.2")
          .to(progressBars[2], { 
            width: "87%", 
            duration: 2.2, 
            ease: "power2.out",
            onUpdate: function() {
              const progress = Math.round(this.progress() * 87);
              percentageTexts[2].textContent = progress + "%";
            }
          })
          .to(".final-result", { 
            opacity: 1, 
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
          }, "-=0.5");
      }

      // Plagiarism section
      if (plagiarismRef.current) {
        gsap.fromTo(plagiarismRef.current.querySelector('.content-wrapper'),
          { x: -200, opacity: 0, scale: 0.8 },
          { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: plagiarismRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // --- NEW Plagiarism Code Block Animation ---
      if (codeBlockRef.current) {
        const lines = gsap.utils.toArray(codeBlockRef.current.querySelectorAll('.code-line'));
        gsap.set(lines, { opacity: 0, x: -50 });
        
        gsap.to(lines, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.2,
          repeat: -1,
          repeatDelay: 2,
          yoyo: false,
          force3D: true,
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
          duration: 15, 
          repeat: -1, 
          ease: "none",
          force3D: true
        });
      }
      if (rightMotionRef.current) {
        gsap.to(rightMotionRef.current, {
          motionPath: {
            path: [{x:0, y:0}, {x:100, y:-150}, {x:-30, y:-350}, {x:80, y:-550}, {x:0, y:-750}],
            curviness: 2,
            autoRotate: true,
          },
          duration: 12, 
          repeat: -1, 
          ease: "none", 
          delay: 2,
          force3D: true
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

  return (
    <div ref={sectionRef} className="bg-gradient-to-b from-black via-slate-900 to-slate-950 text-white font-sans relative overflow-hidden" id="about">
      
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative z-10 py-12 px-4 opacity-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/2 via-transparent to-[#1E40AF]/2"></div>
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
                {/* Primary Button */}
                <button 
                  onClick={handleStartDetection}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-7 rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
                >
                  Read More
                </button>

                {/* Secondary Button */}
                <button 
                  className="bg-cyan-600/20 border-2 border-cyan-400 text-cyan-400 font-semibold py-3 px-7 rounded-full shadow-sm hover:bg-cyan-500/20 hover:shadow-md transform hover:scale-105 transition-all duration-300"
                >
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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-slate-950/50"></div>
        <div ref={leftMotionRef} className="absolute left-6 top-1/2 w-6 h-6 bg-[#00D1FF] rounded-full opacity-60 shadow-lg shadow-[#00D1FF]/50 z-20"></div>
        <div className="content-wrapper max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 lg:gap-12 items-center z-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-white via-[#00D1FF] to-white bg-clip-text text-transparent leading-tight">
              Deepfake Detection
            </h2>
            <div className="space-y-3">
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#E6F3FF] font-medium max-w-xl mx-auto md:mx-0">
                Our <span className="font-bold text-white">advanced neural networks</span> analyze facial movements, voice patterns, and visual artifacts to identify AI-generated content. From social media posts to news footage, we protect platforms from <span className="font-bold text-[#00D1FF]">malicious synthetic media</span>.
              </p>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#E6F3FF] font-medium max-w-xl mx-auto md:mx-0">
                <span className="font-bold text-white">Real-time analysis</span> with comprehensive confidence scoring ensures you can trust the authenticity of digital content across all platforms.
              </p>
            </div>
            <div className="space-y-3 mb-6 mt-6 inline-block text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm font-medium">Real-time video and audio analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm font-medium">Detection of latest deepfake techniques</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm font-medium">Comprehensive confidence scoring</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-gradient-to-r from-[#00D1FF]/20 to-[#00D1FF]/10 px-4 py-2 rounded-full border border-[#00D1FF]/30 text-[#00D1FF] font-bold text-xs sm:text-sm">
                Real-time API
              </span>
            </div>
          </div>
          <div className="relative flex justify-center items-center">
            <div className="w-80 max-w-full mx-auto relative" ref={deepfakeProgressRef}>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20">
                <h3 className="text-lg font-bold text-white mb-6 text-center">Deepfake Analysis</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="status-text text-sm text-gray-400 opacity-50">Processing Video...</span>
                    <span className="percentage-text text-sm text-[#00D1FF] font-bold">0%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="progress-bar bg-gradient-to-r from-[#00D1FF] to-[#0099CC] h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="status-text text-sm text-gray-400 opacity-50">Face Detection...</span>
                    <span className="percentage-text text-sm text-[#00D1FF] font-bold">0%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="progress-bar bg-gradient-to-r from-[#00D1FF] to-[#0099CC] h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="status-text text-sm text-gray-400 opacity-50">AI Analysis...</span>
                    <span className="percentage-text text-sm text-[#00D1FF] font-bold">0%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="progress-bar bg-gradient-to-r from-[#00D1FF] to-[#0099CC] h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>

                <div className="final-result text-center opacity-0 scale-0">
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                    <h4 className="text-red-400 font-bold text-lg mb-2">DEEPFAKE DETECTED</h4>
                    <p className="text-white text-sm">87% confidence - Synthetic content identified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Plagiarism Detection Section */}
      <section ref={plagiarismRef} className="min-h-screen flex items-center py-12 relative z-10 px-4">
        <div className="absolute inset-0 bg-gradient-to-bl from-gray-900/50 to-slate-950/50"></div>
        <div ref={rightMotionRef} className="absolute right-6 top-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-[#00D1FF] to-[#00A8CC] rounded-full opacity-70 shadow-lg shadow-[#00D1FF]/50 z-20"></div>
        <div className="content-wrapper max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-center z-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-l from-white via-[#00D1FF] to-white bg-clip-text text-transparent leading-tight">
              Code Plagiarism Detection
            </h2>
            <div className="space-y-3">
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#E6F3FF] font-medium max-w-xl mx-auto md:mx-0">
                <span className="font-bold text-white">Advanced semantic analysis</span> detects code plagiarism beyond simple copying. Our AI understands programming patterns, identifies subtle modifications, and catches <span className="font-bold text-[#00D1FF]">sophisticated attempts</span> to disguise copied code.
              </p>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#E6F3FF] font-medium max-w-xl mx-auto md:mx-0">
                <span className="font-bold text-white">Repository-wide scanning</span> with multi-language support ensures comprehensive code integrity verification across your entire codebase.
              </p>
            </div>
            <div className="space-y-3 mb-6 mt-6 inline-block text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm font-medium">Multi-language support (7+ languages)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm font-medium">Semantic similarity detection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
                <span className="text-[#E6F3FF] text-sm font-medium">Repository-wide scanning</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-gradient-to-l from-[#00D1FF]/20 to-[#00D1FF]/10 px-3 py-2 rounded-full border border-[#00D1FF]/30 text-[#00D1FF] font-bold text-xs sm:text-sm">
                GitHub Integration
              </span>
              <span className="bg-gradient-to-l from-[#00D1FF]/20 to-[#00D1FF]/10 px-3 py-2 rounded-full border border-[#00D1FF]/30 text-[#00D1FF] font-bold text-xs sm:text-sm">
                IDE Plugins
              </span>
            </div>
          </div>
          
          {/* --- NEW ANIMATION --- */}
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