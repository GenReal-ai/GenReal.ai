import React, { useState, useEffect } from 'react'; // Import useEffect
import { motion } from 'framer-motion';
import { 
  Home, 
  AlertTriangle, 
  FileVideo, 
  FileImage, 
  FileAudio,
  Users,
  Radio,
  Bot,
  Cpu,
  Waves,
  AreaChart,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import FeedbackForm from './feedback'; 

// ================== HELPER FUNCTIONS ==================

const truncate = (num, decimalPlaces) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.trunc(num * factor) / factor;
};

const formatPercentage = (num) => {
  if (num == null || isNaN(num)) return "0.00";
  const safeNum = Math.min(100, Math.max(0, num));
  return truncate(safeNum, 2).toFixed(2);
};

// ================== BACKGROUND COMPONENTS ==================

const CleanBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    {/* Subtle floating blobs */}
    <motion.div 
      className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/5 rounded-full blur-xl"
      animate={{ 
        x: [0, 30, 0], 
        y: [0, -20, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute bottom-32 right-32 w-48 h-48 bg-blue-400/5 rounded-full blur-xl"
      animate={{ 
        x: [0, -40, 0], 
        y: [0, 30, 0],
        scale: [1, 0.9, 1]
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    
    {/* Subtle grid */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
  </div>
);

const CompanyLogo = ({ onClick }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="fixed top-6 left-6 z-50 cursor-pointer"
    onClick={onClick}
  >
     <img src="/logoGenReal.png" alt="Company Logo" className="h-10 w-auto" />
  </motion.div>
);

// ================== UNIFIED RESULT COMPONENT ==================

const UnifiedResult = ({ onReset, analysisResult }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  // --- AUTOMATICALLY TRIGGER FEEDBACK POPUP ---
  useEffect(() => {
    // If results are available, set a timer to show the feedback form
    if (analysisResult) {
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, 2500); // 2.5-second delay

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [analysisResult]); // This effect runs when analysisResult is received

  const processData = (data) => {
    if (!data) return null;
    
    let type = 'unknown';
    if (data.video) type = 'video';
    else if (data.AttentionFuNet || data['FuNet-A']) type = 'image';
    else if (data.prediction && data.probabilities) type = 'audio';

    let result;
    switch (type) {
      case 'video': result = processVideoResult(data); break;
      case 'image': result = processImageResult(data); break;
      case 'audio': result = processAudioResult(data); break;
      default: return null;
    }
    
    result.metadata = {
      fileName: data.fileName,
      fileSize: data.fileSize ? (data.fileSize / (1024 * 1024)).toFixed(2) : null,
      processingTime: data.processingTime ? (data.processingTime / 1000).toFixed(1) : null,
    };
    return result;
  };

  // --- DATA PROCESSORS ---

  const processVideoResult = (data) => {
    const videoData = data.video || {};
    const audioData = data.audio || {};
    
    const overallPrediction = videoData.overall_prediction || 'REAL';
    const deepfakeProbability = (overallPrediction === 'FAKE')
      ? (videoData.average_confidence || 0) * 100
      : (1 - (videoData.average_confidence || 1)) * 100;

    const personAnalyses = Object.entries(videoData.detailed_results || {}).map(([key, person]) => ({
        id: key,
        name: `Person ${key.replace('person_', '')}`,
        prediction: (person.batches[0]?.fake_probability || 0) > (person.batches[0]?.real_probability || 0) ? 'FAKE' : 'REAL',
        isFake: (person.batches[0]?.fake_probability || 0) > (person.batches[0]?.real_probability || 0),
        probabilities: { real: person.batches[0]?.real_probability, fake: person.batches[0]?.fake_probability },
    }));

    const audioAnalysis = {
        name: "Audio Track Analysis",
        prediction: audioData.prediction,
        isFake: audioData.prediction === 'FAKE',
        probabilities: { real: audioData.real_probability, fake: audioData.fake_probability },
    };

    return { type: 'video', overallPrediction, deepfakeProbability, personAnalyses, audioAnalysis };
  };

  const processImageResult = (data) => {
    const models = Object.entries(data)
      .filter(([key]) => ['FuNet-A', 'FuNet-M', 'AttentionFuNet'].includes(key))
      .map(([name, model]) => ({ name, ...model }));

    const primaryModel = models.find(m => m.name === 'AttentionFuNet') || models[0] || {};
    const overallPrediction = primaryModel.prediction || 'REAL';
    const deepfakeProbability = (primaryModel.probabilities?.fake || 0) * 100;
    
    const details = models.map(model => ({
        id: model.name,
        name: model.name,
        prediction: model.prediction,
        isFake: model.prediction === 'FAKE',
        probabilities: model.probabilities,
    }));
    
    return { type: 'image', overallPrediction, deepfakeProbability, details };
  };

  const processAudioResult = (data) => {
    const overallPrediction = data.prediction || 'REAL';
    const deepfakeProbability = (data.probabilities?.fake || 0) * 100;
    return {
      type: 'audio', 
      overallPrediction, 
      deepfakeProbability,
      details: [{
          id: 'audio_analysis',
          name: 'Primary Audio Analysis',
          prediction: data.prediction,
          isFake: data.prediction === 'FAKE',
          probabilities: data.probabilities
      }]
    };
  };

  // --- UI & RENDERING ---
  const processedResult = processData(analysisResult);

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  // Get model name based on detection type
  const getModelName = (type) => {
    switch (type) {
      case 'video': return 'Video Deepfake Detection';
      case 'image': return 'Image Deepfake Detection';
      case 'audio': return 'Audio Deepfake Detection';
      default: return 'Deepfake Detection';
    }
  };

  if (!processedResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <CleanBackground />
        <CompanyLogo onClick={handleHomeClick} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="mx-auto h-12 w-12 text-cyan-400 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white mb-2">Analysis in Progress</h2>
            <p className="text-slate-400">Performing complex calculations, please wait...</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { type, overallPrediction, deepfakeProbability, metadata } = processedResult;

  const getThreatLevel = (probability) => {
    if (probability > 80) return 'High Risk';
    if (probability > 50) return 'Medium Risk';
    if (probability > 20) return 'Low Risk';
    return 'Minimal Risk';
  };

  const getThreatColor = (probability) => {
    if (probability > 80) return 'text-red-500';
    if (probability > 50) return 'text-orange-500';
    if (probability > 20) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const isClassifiedAsFake = overallPrediction === 'FAKE';
  const MainIcon = { video: FileVideo, image: FileImage, audio: FileAudio }[type];

  const DetailCard = ({ item }) => {
    const itemIsFake = item.prediction === 'FAKE';
    const iconMap = { 'Person': Users, 'Audio': Radio, 'FuNet': Bot, 'Primary': Radio };
    const Icon = Object.entries(iconMap).find(([key]) => item.name.includes(key))?.[1] || Bot;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-slate-600/40 rounded-lg p-5 space-y-4 hover:bg-white/10 transition-all duration-300"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Icon size={20} className="text-cyan-400" />
                    <div>
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <p className="text-sm text-slate-400">Analysis Result</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {itemIsFake ? (
                        <XCircle size={18} className="text-red-400" />
                    ) : (
                        <CheckCircle size={18} className="text-green-400" />
                    )}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${itemIsFake ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                        {item.prediction}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Authentic</span>
                    <span className="text-green-400 font-medium">{formatPercentage(item.probabilities?.real * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div 
                        className="bg-green-500 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.probabilities?.real * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
                
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Deepfake</span>
                    <span className="text-red-400 font-medium">{formatPercentage(item.probabilities?.fake * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div 
                        className="bg-red-500 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.probabilities?.fake * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    />
                </div>
            </div>
        </motion.div>
    );
  };

  const InfoCard = ({ icon: Icon, title, children }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-slate-600/40 rounded-lg p-5 hover:bg-white/10 transition-all duration-300"
    >
        <div className="flex items-center gap-3 mb-3">
            <Icon className="w-5 h-5 text-cyan-400" />
            <h4 className="font-medium text-white">{title}</h4>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 relative overflow-hidden">
      <CleanBackground />
      <CompanyLogo onClick={handleHomeClick} />
      
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 pt-20">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-7xl bg-slate-800/30 backdrop-blur-xl rounded-xl border border-slate-600/30 shadow-2xl overflow-hidden relative z-10"
        >
        {/* Header */}
        <div className="p-6 border-b border-slate-600/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <MainIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Analysis Complete
                    </h1>
                    <p className="text-slate-400">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Detection Report
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {/* FEEDBACK BUTTON REMOVED */}
                <button 
                    onClick={() => { window.location.href = '/plagiarism-detection'; }} 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-sm"
                >
                    Try Code Plagiarism
                </button>
                <button 
                    onClick={() => { window.location.href = '/deepfake-detection'; }} 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-sm"
                >
                    Try Another
                </button>
            </div>
        </div>


            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Summary */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Overall Result */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-slate-600/40 rounded-lg p-6 text-center"
                    >
                        <div className="mb-4">
                            {isClassifiedAsFake ? (
                                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-3" />
                            ) : (
                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {overallPrediction}
                            </h3>
                            <p className={`text-lg font-medium ${getThreatColor(deepfakeProbability)}`}>
                                {getThreatLevel(deepfakeProbability)}
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Deepfake Confidence</span>
                                <span className="text-white font-medium">{formatPercentage(deepfakeProbability)}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3">
                                <motion.div 
                                    className={`h-3 rounded-full ${isClassifiedAsFake ? 'bg-red-500' : 'bg-green-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${deepfakeProbability}%` }}
                                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* File Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 border border-slate-600/40 rounded-lg p-5"
                    >
                        <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                            <Cpu size={18} className="text-cyan-400"/> 
                            File Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">File:</span> 
                                <span className="text-white truncate max-w-[150px]" title={metadata.fileName}>
                                    {metadata.fileName}
                                </span>
                            </div>
                            {metadata.fileSize && 
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Size:</span> 
                                    <span className="text-white">{metadata.fileSize} MB</span>
                                </div>
                            }
                            {metadata.processingTime && 
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Processing Time:</span> 
                                    <span className="text-white">{metadata.processingTime}s</span>
                                </div>
                            }
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Detailed Results */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <AreaChart className="w-6 h-6 text-cyan-400" />
                        Detailed Analysis
                    </h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {type === 'video' && (
                            <>
                                <DetailCard item={processedResult.audioAnalysis}/>
                                {processedResult.personAnalyses.map((person, index) => 
                                    <motion.div
                                        key={person.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                    >
                                        <DetailCard item={person} />
                                    </motion.div>
                                )}
                            </>
                        )}
                        {type === 'image' && processedResult.details.map((item, index) => 
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <DetailCard item={item} />
                            </motion.div>
                        )}
                        {type === 'audio' && 
                            <>
                                {processedResult.details.map((item, index) => 
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                    >
                                        <DetailCard item={item} />
                                    </motion.div>
                                )}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <InfoCard icon={Waves} title="Waveform Analysis">
                                        Examines audio patterns for unnatural silences, abrupt cuts, or inconsistent noise floors that indicate artificial generation or manipulation.
                                    </InfoCard>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <InfoCard icon={AreaChart} title="Spectral Analysis">
                                        Analyzes frequency spectrum patterns to detect artifacts and anomalies inconsistent with natural speech or audio.
                                    </InfoCard>
                                </motion.div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </motion.div>
      </div>

      {/* Feedback Form */}
      <FeedbackForm
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        modelName={getModelName(type)}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.7);
        }
      `}</style>
    </div>
  );
};

export default UnifiedResult;