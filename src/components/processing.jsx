import React, { useEffect, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import DeepfakeQuiz from './Quiz';

const Processing = ({ uploadedFile, analysisResult, onProcessingComplete, expectedDuration = 180 }) => {
  // --- State for UI elements and timers ---
  const [showNotification, setShowNotification] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [currentStage, setCurrentStage] = useState('Upload');
  const [timeElapsed, setTimeElapsed] = useState(0);

  // --- Refactored for smooth animation with Framer Motion ---
  const progress = useMotionValue(0);
  const roundedProgress = useTransform(progress, (latest) => Math.floor(latest));

  // Progress stages for display messages
  const stages = [
    { name: 'Upload', threshold: 15, message: 'Uploading and preprocessing...' },
    { name: 'Analysis', threshold: 75, message: 'Running detection algorithms...' },
    { name: 'Verification', threshold: 99, message: 'Finalizing analysis...' },
    { name: 'Complete', threshold: 100, message: 'Analysis complete!' }
  ];

  // Get file type for messaging
  const getFileType = () => {
    if (!uploadedFile) return 'content';
    if (uploadedFile.type.startsWith('video/')) return 'video';
    if (uploadedFile.type.startsWith('image/')) return 'image';
    if (uploadedFile.type.startsWith('audio/')) return 'audio';
    return 'content';
  };

  // --- Main Animation Effect ---
  useEffect(() => {
    // Start the realistic progress simulation on mount
    const simulationControls = animate(progress, 85, {
      duration: expectedDuration, 
      ease: [0.1, 0.5, 0.7, 0.9], 
    });

    // When the component unmounts, stop any running animation
    return () => {
      simulationControls.stop();
    };
  }, [expectedDuration]);

  // Effect to handle when the analysis result arrives from the backend
  useEffect(() => {
    if (analysisResult) {
      progress.stop(); 
      
      // Start a new, fast animation to 100%
      animate(progress, 100, {
        duration: 1.8, 
        ease: 'easeOut',
        onComplete: () => {
          // Once the bar hits 100%, mark processing as complete
          setProcessingComplete(true);
        }
      });
    }
  }, [analysisResult, progress]);

  // Effect to track elapsed time and update the current stage message
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Show the quiz notification after a few seconds
    const notificationTimeout = setTimeout(() => {
      if (!processingComplete) {
        setShowNotification(true);
      }
    }, 5000);

    // Subscribe to changes in the motion value to update the stage text
    const unsubscribeProgress = progress.onChange(latest => {
        const currentStageObj = stages.find(stage => latest < stage.threshold) || stages[stages.length - 1];
        setCurrentStage(currentStageObj.name);
    });

    return () => {
      clearInterval(timer);
      clearTimeout(notificationTimeout);
      unsubscribeProgress();
    };
  }, [progress, processingComplete]);
  
  // Handle the automatic transition to the results page
  useEffect(() => {
    if (processingComplete) {
      setShowNotification(false); // Hide notification on complete
      const completeTimeout = setTimeout(() => {
        onProcessingComplete();
      }, 1500); // Wait 1.5s on the "Complete!" screen before transitioning

      return () => clearTimeout(completeTimeout);
    }
  }, [processingComplete, onProcessingComplete]);

  const getCurrentStageMessage = () => {
    const stage = stages.find(s => s.name === currentStage);
    return stage ? stage.message : 'Processing...';
  };

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

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center font-sans relative overflow-hidden p-3 sm:p-4 md:p-6">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl h-full">
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border-2 border-cyan-400/30 shadow-2xl backdrop-blur-sm">
              <img
                src="/logoGenReal.png"
                alt="GenReal.AI Logo"
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
              />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping"></div>
          </div>
        </motion.div>

        {/* File Info */}
        {uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-4 sm:mb-6 bg-slate-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-slate-700/50"
          >
            <p className="text-xs sm:text-sm text-slate-300">
              Analyzing: <span className="text-cyan-400 font-semibold">{uploadedFile.name}</span>
            </p>
            <p className="text-xs text-slate-400">Size: {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
          </motion.div>
        )}

        {/* Headline & Stages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {processingComplete ? 'Analysis Complete' : 'Analyzing Content'}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 mb-4 sm:mb-6">
            Our AI is processing your {getFileType()} for deepfake detection
          </p>

          <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 text-center">
            {stages.map((stage, i) => (
              <div className="flex items-center gap-1 sm:gap-2" key={stage.name}>
                <motion.div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-500"
                   animate={{
                    backgroundColor: progress.get() >= stage.threshold 
                      ? (stage.name === 'Complete' && processingComplete ? '#22c55e' : '#22d3ee')
                      : '#475569'
                  }}
                />
                <span className="text-xs text-slate-400">{stage.name}</span>
                {i < stages.length - 1 && <div className="w-4 sm:w-8 h-0.5 bg-slate-600"></div>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-md mb-8 sm:mb-12"
        >
          <div className="relative mb-4">
            <div className="w-full h-2 sm:h-3 bg-slate-700 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className={`h-full rounded-full shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500`}
                style={{
                  scaleX: useTransform(progress, val => val / 100),
                  originX: 0
                }}
              />
            </div>

            <div className="absolute -top-6 sm:-top-8 left-0 right-0 text-center">
              <motion.span className={`text-lg sm:text-xl md:text-2xl font-bold ${processingComplete ? 'text-green-400' : 'text-cyan-400'}`}>
                {roundedProgress}
              </motion.span>
              <span className={`text-lg sm:text-xl md:text-2xl font-bold ${processingComplete ? 'text-green-400' : 'text-cyan-400'}`}>%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-xs sm:text-sm">
              {getCurrentStageMessage()}
            </p>
            <div className="text-right">
              <p className="text-xs text-slate-400">ETA: {getEstimatedTimeRemaining()}</p>
            </div>
          </div>
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-xl">
            <h3 className="text-cyan-400 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3">
              Did you know?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
              60% of people encountered a deepfake {getFileType()} in the past year, but only 
              <span className="text-cyan-400 font-semibold"> 24% </span> 
              could identify them correctly.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Notification for Quiz */}
      <AnimatePresence>
        {showNotification && !showQuiz && (
          <motion.div
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-slate-800/90 backdrop-blur-sm border border-cyan-400/30 px-4 sm:px-6 py-4 sm:py-5 rounded-xl shadow-2xl flex items-start gap-3 sm:gap-4 max-w-xs z-50"
          >
            <FaInfoCircle className="text-cyan-400 text-lg sm:text-2xl mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm mb-2 sm:mb-3 leading-snug text-slate-200">
                Think you can spot a deepfake? Put your skills to the test while you wait.
              </p>
              <button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
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
              className="absolute top-2 right-2 text-slate-400 hover:text-red-400 text-xl"
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
            <DeepfakeQuiz onClose={handleCloseQuiz} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Processing;