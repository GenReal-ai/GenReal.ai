import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import CompanyLogo from "/logoGenReal.png";

import DeepfakeQuiz from './Quiz.jsx'; 


// --- SVG Icons (to remove external dependencies) ---
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="text-cyan-400 text-lg sm:text-2xl mt-1 flex-shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);



// --- Main Processing Component ---
const App = ({ uploadedFile, analysisResult, onProcessingComplete, expectedDuration = 240 }) => {
  // --- State for UI elements and timers ---
  const [showNotification, setShowNotification] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // --- Animation with Framer Motion ---
  const progress = useMotionValue(0);
  const roundedProgress = useTransform(progress, (latest) => Math.floor(latest));

  // Progress stages for display messages
  const stages = [
    { name: 'Upload', threshold: 15, message: 'Uploading and preprocessing...' },
    { name: 'Analysis', threshold: 75, message: 'Running detection algorithms...' },
    { name: 'Verification', threshold: 99, message: 'Finalizing analysis...' },
    { name: 'Complete', threshold: 100, message: 'Analysis complete!' }
  ];

  const currentStageInfo = stages.find(stage => progress.get() < stage.threshold) || stages[stages.length - 1];
  
  const getFileType = () => {
    if (!uploadedFile) return 'content';
    if (uploadedFile.type.startsWith('video/')) return 'video';
    if (uploadedFile.type.startsWith('image/')) return 'image';
    if (uploadedFile.type.startsWith('audio/')) return 'audio';
    return 'content';
  };

  // --- Main Animation Effect ---
  useEffect(() => {
    const simulationControls = animate(progress, 85, {
      duration: expectedDuration, 
      ease: [0.1, 0.5, 0.7, 0.9], 
    });
    return () => simulationControls.stop();
  }, [expectedDuration, progress]);

  // Effect when analysis result arrives
  useEffect(() => {
    if (analysisResult) {
      progress.stop(); 
      animate(progress, 100, {
        duration: 1.8, 
        ease: 'easeOut',
        onComplete: () => setProcessingComplete(true)
      });
    }
  }, [analysisResult, progress]);

  // Effect for timers and notifications
  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    const notificationTimeout = setTimeout(() => {
      if (!processingComplete) setShowNotification(true);
    }, 5000);
    return () => {
      clearInterval(timer);
      clearTimeout(notificationTimeout);
    };
  }, [processingComplete]);
  
  // Handle automatic transition to results
  useEffect(() => {
    if (processingComplete) {
      setShowNotification(false);
      const completeTimeout = setTimeout(() => {
        onProcessingComplete();
      }, 1500);
      return () => clearTimeout(completeTimeout);
    }
  }, [processingComplete, onProcessingComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEstimatedTimeRemaining = () => {
    if (processingComplete) return '0:00';
    const remaining = Math.max(0, expectedDuration - timeElapsed);
    return formatTime(remaining);
  };

  return (
    <div className="w-screen h-screen bg-slate-900 text-white flex flex-col items-center justify-center font-sans relative overflow-hidden p-4">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, staggerChildren: 0.15 }}
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl text-center gap-y-6 sm:gap-y-8"
      >
        
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-800/50 flex items-center justify-center border-2 border-cyan-400/30 shadow-2xl backdrop-blur-sm p-2">
            <img
              src={CompanyLogo}
              alt="Company Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping"></div>
        </div>

        {/* File Info */}
        {uploadedFile && (
          <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-slate-700/50">
            <p className="text-sm text-slate-300">
              Analyzing: <span className="text-cyan-400 font-semibold">{uploadedFile.name}</span>
            </p>
            <p className="text-xs text-slate-400">Size: {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
          </div>
        )}

        {/* Headline & Stages */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {processingComplete ? 'Analysis Complete' : `Analyzing Your ${getFileType()}`}
          </h1>
          <p className="text-sm md:text-base text-slate-300 mb-6">
            Our AI is processing your content for deepfake detection.
          </p>

          <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-4">
            {stages.map((stage, i) => (
              <div className="flex items-center gap-2" key={stage.name}>
                 <motion.div 
                    className="w-2.5 h-2.5 rounded-full"
                    animate={{ 
                        backgroundColor: progress.get() >= (stage.threshold -1) ? '#22d3ee' : '#475569',
                        scale: progress.get() >= (stage.threshold -1) ? 1.1 : 1,
                    }}
                    transition={{duration: 0.3}}
                 />
                <span className="text-xs text-slate-400">{stage.name}</span>
                {i < stages.length - 1 && <div className="w-6 sm:w-8 h-px bg-slate-600"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar & Info */}
        <div className="w-full max-w-md">
            <div className="relative h-8 flex items-center justify-center">
                 <motion.span className={`text-2xl font-bold ${processingComplete ? 'text-green-400' : 'text-cyan-400'}`}>
                   {roundedProgress}
                 </motion.span>
                 <span className={`text-2xl font-bold ${processingComplete ? 'text-green-400' : 'text-cyan-400'}`}>%</span>
            </div>

            <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className={`h-full rounded-full shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500`}
                style={{
                  width: useTransform(progress, val => `${val}%`),
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-3 text-xs sm:text-sm text-slate-400">
              <p>{currentStageInfo.message}</p>
              <p>ETA: {getEstimatedTimeRemaining()}</p>
            </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-700/50 shadow-xl max-w-md">
          <h3 className="text-cyan-400 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
            Did you know?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            60% of people encountered a deepfake {getFileType()} in the past year, but only 
            <span className="text-cyan-400 font-semibold"> 24% </span> 
            could identify them correctly.
          </p>
        </div>
      </motion.div>

      {/* Notification for Quiz */}
      <AnimatePresence>
        {showNotification && !showQuiz && (
          <motion.div
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 bg-slate-800/90 backdrop-blur-sm border border-cyan-400/30 px-5 py-4 rounded-xl shadow-2xl flex items-start gap-4 max-w-xs z-50"
          >
            <InfoIcon />
            <div>
              <p className="text-sm mb-3 leading-snug text-slate-200">
                Think you can spot a deepfake? Test your skills while you wait.
              </p>
              <button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  setShowQuiz(true);
                  setShowNotification(false);
                }}
              >
                Take Quiz
              </button>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-red-400 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <DeepfakeQuiz onClose={() => setShowQuiz(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default App;
