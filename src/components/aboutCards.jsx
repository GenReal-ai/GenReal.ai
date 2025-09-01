import React, { useState, useEffect } from "react";
import {
  Shield,
  FileSearch,
  Play,
  Scan,
  CheckCircle,
  ArrowRight,
  Zap,
  Eye,
  Code,
  Mic,
  Video,
} from "lucide-react";

// Enhanced dark cyan/blue theme
const colorMap = {
  cyan: {
    border: "border-cyan-400/40",
    text: "text-cyan-300",
    accent: "text-cyan-400",
    bgFrom: "from-cyan-900/60",
    bgTo: "to-slate-900/80",
    bgHover: "hover:from-cyan-800/70 hover:to-slate-800/90",
    shadow: "shadow-cyan-500/25",
    glow: "shadow-cyan-400/30",
  },
  blue: {
    border: "border-blue-400/40",
    text: "text-blue-300",
    accent: "text-blue-400",
    bgFrom: "from-blue-900/60",
    bgTo: "to-slate-900/80",
    bgHover: "hover:from-blue-800/70 hover:to-slate-800/90",
    shadow: "shadow-blue-500/25",
    glow: "shadow-blue-400/30",
  },
};

const DeepfakeDetectionPlatform = () => {
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleCard = (index) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const services = [
    {
      icon: Shield,
      title: "Advanced Deepfake Detection",
      bigTitle: "DEEPFAKE DETECTION",
      subtitle: "Protect Your Content with AI-Powered Detection",
      description: "We safeguard digital integrity by analyzing video and audio streams for signs of manipulation.",
      features: [
        { icon: Video, text: "Real-Time Video & Audio Analysis" },
        { icon: Zap, text: "Instant Threat Alerts" },
        { icon: CheckCircle, text: "Forensic-Grade Reporting" },
      ],
      buttonLabel: "Try Detection Tool",
      path: "/deepfake-detection",
      color: "cyan",
    },
    {
      icon: FileSearch,
      title: "AI Plagiarism Prevention",
      bigTitle: "CODE PLAGIARISM",
      subtitle: "Ensure Code Originality with AI Analysis",
      description: "Our service detects copied code and algorithmic similarities to protect your intellectual property.",
      features: [
        { icon: Code, text: "Code & Algorithm Analysis" },
        { icon: Shield, text: "Private Repository Scanning" },
        { icon: Zap, text: "Developer-First API" },
      ],
      buttonLabel: "Try Plagiarism Tool",
      path: "/plagiarism-detection",
      color: "blue",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4 lg:p-8 relative overflow-hidden"
      id="Products"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgb(6 182 212)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-pulse ${
              i % 2 === 0 ? 'bg-cyan-400/40' : 'bg-blue-400/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${i * 300}ms`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        className={`text-center mb-8 lg:mb-12 transition-all duration-1000 relative z-10 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            AI-Powered
          </span>{" "}
          Detection Platform
        </h1>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
          Advanced deepfake detection and plagiarism prevention tools for
          digital integrity
        </p>
      </div>

      {/* Cards Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isFlipped = flippedCards.has(index);
            const colors = colorMap[service.color];

            return (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-1000 ${
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                } w-full h-96 sm:h-[450px] lg:h-[500px] hover:scale-105`}
                onClick={() => toggleCard(index)}
                style={{ perspective: "1200px" }}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[1200ms] ease-out`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                  }}
                >
                  {/* Front */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${colors.bgFrom} ${colors.bgTo} border-2 ${colors.border} shadow-2xl ${colors.shadow} flex flex-col items-center justify-center p-6 lg:p-8 backdrop-blur-md transition-all duration-300 ${colors.bgHover} group-hover:${colors.glow}`}
                    style={{
                      backfaceVisibility: "hidden",
                      background: `linear-gradient(135deg, 
                        rgba(6, 182, 212, 0.1) 0%,
                        rgba(15, 23, 42, 0.8) 30%,
                        rgba(30, 41, 59, 0.9) 70%,
                        rgba(6, 182, 212, 0.05) 100%),
                        radial-gradient(circle at 30% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
                    }}
                  >
                    <div className="absolute top-4 right-4 w-12 h-12 border border-cyan-400/20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border border-cyan-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${colors.text} animate-pulse`} style={{ animationDelay: `${i * 200}ms` }}></div>
                      ))}
                    </div>

                    <Icon
                      className={`w-12 h-12 lg:w-16 lg:h-16 ${colors.accent} mb-4 lg:mb-6 drop-shadow-lg`}
                    />
                    <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-white text-center mb-2 lg:mb-4 drop-shadow-md">
                      {service.bigTitle}
                    </h2>
                    <p className="text-gray-200 text-xs sm:text-sm lg:text-base text-center max-w-sm drop-shadow-sm">
                      {service.subtitle}
                    </p>
                    <div className="mt-4 lg:mt-6 text-gray-300 text-xs flex items-center gap-2 animate-pulse">
                      <Scan className="w-4 h-4" />
                      Click to explore features
                      <Zap className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl border-2 ${colors.border} shadow-2xl ${colors.glow} p-4 lg:p-6 flex flex-col backdrop-blur-md`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: `linear-gradient(135deg, 
                        rgba(15, 23, 42, 0.95) 0%,
                        rgba(30, 41, 59, 0.98) 30%,
                        rgba(6, 182, 212, 0.08) 70%,
                        rgba(15, 23, 42, 0.95) 100%),
                        radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)`,
                    }}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 border-l border-b border-cyan-400/20 rounded-bl-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-t border-r border-cyan-400/20 rounded-tr-2xl"></div>

                    <div className="flex items-center gap-3 mb-4 lg:mb-6 relative z-10">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.bgFrom} ${colors.bgTo} border ${colors.border}`}>
                        <Icon
                          className={`w-4 h-4 lg:w-5 lg:h-5 ${colors.accent} flex-shrink-0`}
                        />
                      </div>
                      <h3 className="text-base lg:text-lg font-bold text-white">
                        {service.title}
                      </h3>
                      <div className="ml-auto">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="relative z-10 mb-4 lg:mb-6">
                      <p className="text-gray-300 text-xs lg:text-sm leading-relaxed p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        {service.description}
                      </p>
                    </div>

                    <div className="space-y-2 lg:space-y-3 mb-6 lg:mb-8 flex-1 relative z-10">
                      <div className="space-y-2">
                        {service.features.map((feature, i) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-2 lg:gap-3 text-gray-200 text-xs lg:text-sm p-2 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-200"
                            >
                              <FeatureIcon
                                className={`w-3 h-3 lg:w-4 lg:h-4 ${colors.accent} flex-shrink-0`}
                              />
                              <span>{feature.text}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <button
                      className={`relative z-10 py-3 lg:py-4 px-6 lg:px-8 rounded-xl bg-gradient-to-r ${colors.bgFrom} ${colors.bgTo} border-2 ${colors.border} text-white font-bold flex items-center justify-center gap-3 text-sm lg:text-base hover:shadow-2xl ${colors.glow} transition-all duration-500 mt-auto group/btn overflow-hidden`}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Navigating to ${service.path}`);
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.bgFrom} ${colors.bgTo} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`}></div>
                      <Play className="w-4 h-4 lg:w-5 lg:h-5 relative z-10" />
                      <span className="relative z-10">{service.buttonLabel}</span>
                      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs mt-8 lg:mt-12 relative z-10">
        <span className="bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
          Click on any card to flip and explore features
        </span>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-1">
        
        {/* HOW TO TUNE: This is the new glow effect for the top right. */}
        {/* Position: Change top-0 right-0. e.g., top-[-10vh] right-[-10vw] */}
        {/* Size: Adjust w-[50vw] h-[50vh]. vw/vh are responsive units. */}
        {/* Color & Brightness: Modify bg-cyan-400/10. Change color or opacity (/10 = 10%). */}
        {/* Softness: Change blur-[160px]. Larger number = softer. */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-cyan-400/10 rounded-full blur-[160px]"></div>

        {/* Large background orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-cyan-500/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-radial from-teal-500/12 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Accent lines */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent"></div>
        
        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-400/30 rounded-tl-2xl"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-blue-400/30 rounded-br-2xl"></div>
      </div>
    </div>
  );
};

export default DeepfakeDetectionPlatform;

