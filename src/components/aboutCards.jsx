import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const useAuth = () => ({ isAuthenticated: false }); // Mock hook for standalone example

import {
  Shield,
  FileSearch,
  Play,
  Scan,
  CheckCircle,
  ArrowRight,
  Zap,
  Image,
  Video,
  Mic,
} from "lucide-react";

// Cyan/Blue theme WITHOUT hover color changes
const colorMap = {
  cyan: {
    border: "border-cyan-400/40",
    text: "text-cyan-300",
    accent: "text-cyan-400",
    bgFrom: "from-cyan-900/60",
    bgTo: "to-slate-900/80",
    shadow: "shadow-cyan-500/25",
    glow: "shadow-cyan-400/30",
  },
  blue: {
    border: "border-blue-400/40",
    text: "text-blue-300",
    accent: "text-blue-400",
    bgFrom: "from-blue-900/60",
    bgTo: "to-slate-900/80",
    shadow: "shadow-blue-500/25",
    glow: "shadow-blue-400/30",
  },
};

const DeepfakeDetectionPlatform = () => {
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
      subtitle: "AI-powered multi-modal deepfake protection",
      description:
        "We safeguard digital integrity by analyzing video, audio, and images for signs of manipulation.",
      features: [
        { icon: Video, text: "Deepfake Video Analysis" },
        { icon: Mic, text: "Deepfake Audio Detection" },
        { icon: Image, text: "Deepfake Image Detection" },
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
      description:
        "Our service detects copied code and algorithmic similarities to protect your intellectual property.",
      features: [
        { icon: Shield, text: "Algorithmic Similarity Detection" },
        { icon: Zap, text: "Developer-Friendly API" },
        { icon: CheckCircle, text: "Secure Repository Scanning" },
      ],
      buttonLabel: "Try Plagiarism Tool",
      path: "/plagiarism-detection",
      color: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4 md:p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgb(6 182 212)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <div
        className={`text-center mb-8 lg:mb-16 transition-all duration-1000 relative z-10 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            AI-Powered
          </span>{" "}
          Detection Platform
        </h1>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
          Advanced deepfake detection and plagiarism prevention tools for digital integrity.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isFlipped = flippedCards.has(index);
            const colors = colorMap[service.color];

            return (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-1000 ${
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                } w-full h-[460px] lg:h-[480px] xl:h-[500px]`}
                onClick={() => toggleCard(index)}
                style={{ perspective: "1200px" }}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[1000ms] ease-in-out`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front Side */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl 
                      bg-gradient-to-br ${colors.bgFrom} ${colors.bgTo} 
                      border-2 ${colors.border} shadow-2xl ${colors.shadow} 
                      flex flex-col items-center justify-center p-6 text-center 
                      backdrop-blur-md transition-all duration-500 ease-in-out`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <Icon className={`w-14 h-14 lg:w-16 lg:h-16 ${colors.accent} mb-4 drop-shadow-lg`} />
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 drop-shadow-md">
                      {service.bigTitle}
                    </h2>
                    <p className="text-gray-200 text-sm lg:text-base max-w-xs drop-shadow-sm">
                      {service.subtitle}
                    </p>
                    <div className="mt-6 text-gray-400 text-xs flex items-center gap-2 animate-pulse">
                      <Scan className="w-4 h-4" />
                      Click to explore features
                    </div>
                  </div>


                  {/* Back */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl border-2 ${colors.border} shadow-2xl ${colors.glow} p-4 sm:p-6 flex flex-col backdrop-blur-md bg-slate-900/80`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-slate-800/50 border ${colors.border}`}>
                        <Icon className={`w-5 h-5 ${colors.accent}`} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed p-3 mb-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      {service.description}
                    </p>
                    <div className="space-y-3 flex-1">
                      {service.features.map((feature, i) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-gray-200 text-xs sm:text-sm p-2 rounded-lg bg-slate-800/30 border border-slate-700/30"
                          >
                            <FeatureIcon className={`w-4 h-4 ${colors.accent}`} />
                            <span>{feature.text}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className={`w-full mt-4 py-3 px-6 rounded-xl bg-gradient-to-r ${colors.bgFrom} ${colors.bgTo} border-2 ${colors.border} text-white font-bold flex items-center justify-center gap-3 text-sm sm:text-base hover:shadow-2xl ${colors.glow} transition-all duration-500`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAuthenticated) {
                          navigate(service.path);
                        } else {
                          navigate(`/login?redirect=${service.path}`);
                        }
                      }}
                    >
                      <Play className="w-5 h-5" />
                      <span>{service.buttonLabel}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs mt-8 lg:mt-12 relative z-10">
        <span className="bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700/50">
          Click on any card to flip and explore features
        </span>
      </div>
    </div>
  );
};

export default DeepfakeDetectionPlatform;
