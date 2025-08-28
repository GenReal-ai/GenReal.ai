import React, { useState, useEffect } from 'react';
import { Shield, FileSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * A component that displays two interactive, flippable cards for different services.
 * This version has been updated for full responsiveness and to fix 3D transform issues.
 */
const DeepfakeDetectionPlatform = () => {
  // State to track which cards are flipped. Using a Set is efficient.
  const [flippedCards, setFlippedCards] = useState(new Set());
  // State to manage the initial fade-in animation.
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Trigger the fade-in animation once the component mounts.
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Toggles the flipped state of a specific card by its index.
  const toggleCard = (index) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const services = [
    {
      icon: Shield,
      title: "Advanced Deepfake Detection",
      bigTitle: "DEEPFAKE DETECTION",
      subtitle: "Protect Your Content with AI-Powered Detection",
      description:
        "Our cutting-edge deepfake detection service identifies manipulated media using state-of-the-art artificial intelligence to safeguard visual and audio content authenticity in real-time.",
      features: [
        "Real-time Video Analysis",
        "99.7% Detection Accuracy",
        "Multiple Format Support",
        "Batch Processing Available",
        "API Integration Ready"
      ],
      buttonLabel: "Try Detection Tool",
      path: "/deepfake-detection",
      bgImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='bg1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23064e77;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%23155e75;stop-opacity:0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23bg1)'/%3E%3Cg opacity='0.4'%3E%3Ccircle cx='80' cy='80' r='3' fill='%2306b6d4'/%3E%3Ccircle cx='320' cy='60' r='2' fill='%2306b6d4'/%3E%3Ccircle cx='150' cy='180' r='2.5' fill='%2306b6d4'/%3E%3Ccircle cx='280' cy='220' r='2' fill='%2306b6d4'/%3E%3Cpath d='M50 150 Q200 100 350 200' stroke='%2306b6d4' stroke-width='1' fill='none' opacity='0.3'/%3E%3Cpath d='M100 250 Q250 180 380 240' stroke='%2306b6d4' stroke-width='1' fill='none' opacity='0.2'/%3E%3C/g%3E%3Ctext x='200' y='160' text-anchor='middle' fill='%2306b6d4' font-family='Arial' font-size='24' font-weight='bold' opacity='0.1'%3EDETECT%3C/text%3E%3C/svg%3E"
    },
    {
      icon: FileSearch,
      title: "AI Plagiarism Prevention",
      bigTitle: "PLAGIARISM DETECTION",
      subtitle: "Ensure Academic Integrity with AI Detection",
      description:
        "Comprehensive plagiarism detection tools that identify AI-generated content and copied text with advanced language understanding, tailored for educational institutions and content creators.",
      features: [
        "AI Content Detection",
        "Smart Plagiarism Analysis",
        "Instant Detailed Reports",
        "Multi-language Support",
        "Citation Verification"
      ],
      buttonLabel: "Try Plagiarism Tool",
      path: "/plagiarism-detection",
      bgImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='bg2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23075985;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%234338ca;stop-opacity:0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23bg2)'/%3E%3Cg opacity='0.3'%3E%3Crect x='60' y='60' width='80' height='4' fill='%2306b6d4' rx='2'/%3E%3Crect x='60' y='80' width='120' height='4' fill='%2306b6d4' rx='2'/%3E%3Crect x='60' y='100' width='90' height='4' fill='%2306b6d4' rx='2'/%3E%3Crect x='220' y='60' width='100' height='4' fill='%2306b6d4' rx='2'/%3E%3Crect x='220' y='80' width='80' height='4' fill='%2306b6d4' rx='2'/%3E%3Crect x='220' y='100' width='110' height='4' fill='%2306b6d4' rx='2'/%3E%3Crect x='60' y='160' width='70' height='4' fill='%2306b6d4' rx='2'/%3E%3Crect x='60' y='180' width='140' height='4' fill='%2306b6d4' rx='2'/%3E%3Crect x='220' y='160' width='90' height='4' fill='%2306b6d4' rx='2'/%3E%3Crect x='220' y='180' width='75' height='4' fill='%2306b6d4' rx='2'/%3E%3C/g%3E%3Ctext x='200' y='260' text-anchor='middle' fill='%2306b6d4' font-family='Arial' font-size='20' font-weight='bold' opacity='0.1'%3EVERIFY%3C/text%3E%3C/svg%3E"
    }
  ];

  return (
   <div className="relative min-h-screen py-12 sm:py-20 bg-black overflow-hidden" id="Products">
  {/* Header */}
  <div
    className={`relative z-20 pt-6 pb-10 sm:pb-14 transition-all duration-1000 ${
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
        <span className="block">
          <span className="text-cyan-400">Deepfake Detection</span> &{" "}
          <span className="text-cyan-400">AI Plagiarism Prevention</span>
        </span>
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
        Cutting-edge AI tools to identify manipulated media and detect AI-generated
        content — built for trust, transparency, and digital integrity.
      </p>
    </div>
  </div>

  {/* Services Grid */}
  <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
      {services.map((service, index) => {
        const Icon = service.icon;
        const isFlipped = flippedCards.has(index);

        return (
          <div
            key={index}
            className={`group cursor-pointer transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } [perspective:1200px]`}
            style={{ transitionDelay: `${index * 200}ms` }}
            onClick={() => toggleCard(index)}
          >
            {/* Flip container */}
            <div
              className={`relative w-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] transition-transform duration-1000 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Front Side */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-500/40 transition-all duration-700 hover:scale-[1.02] flex flex-col items-center justify-center overflow-hidden [backface-visibility:hidden]"
                style={{
                  backgroundImage: `url("${service.bgImage}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "overlay",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/50 to-slate-900/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10 text-center px-4 sm:px-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm border border-cyan-400/20">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 mb-4 tracking-wide leading-tight">
                    {service.bigTitle}
                  </h2>

                  <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
                    {service.subtitle}
                  </p>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-cyan-500/20">
                    <p className="text-cyan-300 text-xs sm:text-sm font-medium uppercase tracking-widest">
                      Click for Details
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-cyan-400/40 shadow-2xl shadow-cyan-500/10 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-slate-900/50 to-blue-500/5" />

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center backdrop-blur-sm border border-cyan-400/20 flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{service.title}</h3>
                      <p className="text-cyan-300 font-medium text-xs sm:text-sm">{service.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2 md:block hidden mb-6">
                    <h4 className="text-white font-semibold text-base sm:text-lg mb-2">Key Features:</h4>
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-4">
                    <button
                      className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/40 text-white font-semibold text-sm sm:text-base hover:from-cyan-500/40 hover:to-blue-500/40 hover:border-cyan-300/60 transition-all duration-300 backdrop-blur-sm group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(service.path);
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {service.buttonLabel}
                        <span className="inline-block group-hover/btn:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </span>
                    </button>

                    <p className="text-center text-gray-400 text-xs mt-3 font-medium">
                      Free trial available • No credit card required
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

  );
};

export default DeepfakeDetectionPlatform;
