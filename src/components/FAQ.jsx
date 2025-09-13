import React, { useEffect, useRef, useState } from 'react';
import { HelpCircle, Video, FileCheck, Shield } from 'lucide-react';

// Hook to check if we're on mobile
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < breakpoint);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [breakpoint]);

  return isMobile;
}


const DynamicFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const itemsRef = useRef([]);
  const contentRef = useRef(null);

  // New, more technical FAQ data
  const faqData = [
    {
      id: 1,
      number: "01",
      title: "What are your core detection technologies?",
      subtitle: "Overview of our analysis engines",
      icon: HelpCircle,
      content: {
        description: "We provide two core services: a multi-modal Deepfake Detector for video, image, and audio content, and an advanced Code Plagiarism engine that identifies semantic similarities and AI-generated code.",
        keyPoints: ["Deepfake Video/Image/Audio analysis", "Code Plagiarism & AI-Code detection", "API-first for easy integration", "High-accuracy neural network models"],
        color: "from-cyan-500 to-blue-400",
      }
    },
    {
      id: 2,
      number: "02",
      title: "How does your Deepfake Detector analyze content?",
      subtitle: "Technical breakdown of our media analysis",
      icon: Video,
      content: {
        description: "Our system deconstructs media into its core components. For video/images, we analyze for GAN-generated artifacts and inconsistent lighting. For audio, we perform spectral analysis to detect frequency manipulation and synthetic voice patterns.",
        keyPoints: ["GAN artifact detection", "Facial landmark inconsistency", "Spectral audio frequency analysis", "Voice cloning pattern recognition"],
        color: "from-emerald-500 to-teal-400",
      }
    },
    {
      id: 3,
      number: "03",
      title: "How does the Plagiarism Detector identify AI-generated code?",
      subtitle: "Beyond simple text matching",
      icon: FileCheck,
      content: {
        description: "Our engine parses code into Abstract Syntax Trees (AST) to compare its structural and logical flow, not just the text. It detects semantic equivalence (different code, same function) and uses stylometric analysis to identify patterns common in AI-generated code.",
        keyPoints: ["Abstract Syntax Tree (AST) analysis", "Detects semantic equivalence", "Stylometric analysis for AI patterns", "Supports 50+ programming languages"],
        color: "from-purple-500 to-pink-400",
      }
    },
    {
      id: 4,
      number: "04",
      title: "What is the technical reliability & data handling protocol?",
      subtitle: "Accuracy metrics and security measures",
      icon: Shield,
      content: {
        description: "Our models achieve a 99.7% accuracy rate with a minimal false-positive ratio, benchmarked on diverse datasets. All submissions are processed in secure, ephemeral containers with end-to-end encryption and are purged permanently after analysis.",
        keyPoints: ["99.7% detection accuracy", "Low false-positive rate", "End-to-end encryption (E2EE)", "Ephemeral containers & data purging"],
        color: "from-orange-500 to-red-400",
      }
    }
  ];


  useEffect(() => {
    // GSAP is a robust animation library. This setup loads it from a CDN.
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      initAnimations();
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initAnimations = () => {
    if (typeof gsap === 'undefined') return;

    gsap.fromTo(leftPanelRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(rightPanelRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );

    gsap.fromTo(itemsRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.5 }
    );
  };

  const handleItemClick = (index) => {
    if (isAnimating || index === activeIndex) return;

    setIsAnimating(true);

    if (typeof gsap !== 'undefined') {
      gsap.to(contentRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(index);
          gsap.fromTo(contentRef.current,
            { opacity: 0, x: -50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power2.out",
              delay: 0.1,
              onComplete: () => setIsAnimating(false)
            }
          );
        }
      });

      gsap.to(itemsRef.current[index], {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    } else {
      setActiveIndex(index);
      setIsAnimating(false);
    }
  };

  const currentItem = faqData[activeIndex];
  const isMobile = useIsMobile();


  return (
    <div className="min-h-screen bg-black text-gray-200 relative overflow-hidden pt-20" id="faq">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(https://www.transparenttextures.com/patterns/binary-code.png)",
          }}
        ></div>
        <div className="scanline"></div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel */}
        <div
          ref={leftPanelRef}
          className="w-full lg:w-2/5 p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-cyan-500/30 bg-black/30 backdrop-blur-sm"
        >
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-cyan-400 mb-2">
              FREQUENTLY ASKED QUESTIONS
            </h1>
            <div className="text-cyan-300/60 font-mono text-sm">
              &gt; Query the Knowledge Base
            </div>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;

              return (
                <div key={item.id} className="relative">
                  {/* FAQ Tile */}
                  <div
                    ref={el => itemsRef.current[index] = el}
                    onClick={() => handleItemClick(index)}
                    className={`
                      group cursor-pointer p-6 rounded-lg border transition-all duration-300
                      ${isActive
                        ? 'bg-cyan-900/50 border-cyan-400 shadow-lg shadow-cyan-400/20'
                        : 'bg-gray-900/30 border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                        ${isActive ? 'bg-cyan-400/20 text-cyan-300' : 'bg-gray-700/50 text-gray-400 group-hover:bg-cyan-400/10 group-hover:text-cyan-400'}
                      `}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`
                          font-bold text-lg truncate transition-colors duration-300
                          ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                        `}>
                          {item.title}
                        </h3>

                        <p className={`
                          text-sm truncate transition-colors duration-300
                          ${isActive ? 'text-cyan-200' : 'text-gray-500 group-hover:text-gray-400'}
                        `}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MOBILE DROPDOWN (only when active) */}
                  {isMobile && isActive && (
                    <div className="mt-4 bg-black/30 backdrop-blur border border-cyan-400/20 p-4 rounded-xl">
                      <h3 className="text-cyan-400 font-bold mb-2 text-md uppercase">Answer</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.content.description}</p>

                      <h3 className="text-cyan-400 font-bold mt-4 mb-2 text-md uppercase">Key Points</h3>
                      <ul className="list-disc ml-5 text-gray-200 text-sm space-y-1">
                        {item.content.keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                        <button 
                          onClick={() => {
                          const el = document.getElementById("contact-us");
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                          } else {
                            console.warn("Element with id='contact-us' not found");
                          }
                            }}
                            className="mt-4 px-4 py-2 rounded bg-cyan-600 text-white text-sm font-semibold hover:scale-105 transition"
                          >
                          Contact Support →
                        </button>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {/* Right Panel */}
        <div ref={rightPanelRef} className="flex-1 hidden lg:block p-4 sm:p-8 bg-black/10">
          <div ref={contentRef} className="h-full">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-4 mb-4 sm:mb-6">
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${currentItem.content.color} flex items-center justify-center`}
                >
                  <currentItem.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2">
                    {currentItem.title}
                  </h2>
                  <span className="text-cyan-400 font-mono text-xs sm:text-sm">
                    {currentItem.subtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-cyan-400 font-bold mb-2 sm:mb-4 text-sm sm:text-lg uppercase tracking-wider">
                  Answer
                </h3>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  {currentItem.content.description}
                </p>
              </div>

              <div>
                <h3 className="text-cyan-400 font-bold mb-2 sm:mb-4 text-sm sm:text-lg uppercase tracking-wider">
                  Key Points
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {currentItem.content.keyPoints.map((point, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
                        <span className="text-white font-medium text-sm sm:text-base">
                          {point}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 sm:pt-8">
                
                  <button
                    className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-white transition-all duration-300 bg-gradient-to-r ${currentItem.content.color} hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transform`}
                      onClick={() => {
                        const el = document.getElementById("contact-us");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                        } else {
                          console.warn("Element with id='contact-us' not found");
                        }
                      }}
                  >
                    Contact Support →
                  </button>
              
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(
            to bottom,
            rgba(0, 255, 255, 0),
            rgba(0, 255, 255, 0.2),
            rgba(0, 255, 255, 0)
          );
          animation: scan 6s linear infinite;
          opacity: 0.6;
          z-index: 1;
        }
      `}
      </style>

    </div>
  );
};

export default DynamicFAQ;