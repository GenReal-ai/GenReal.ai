import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaHome, FaChartBar, FaArrowLeft, FaEye, FaCog, FaShieldAlt, FaMicrophone, FaBrain, FaCheckCircle, FaExclamationTriangle, FaClock, FaLightbulb, FaWaveSquare } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackForm from "./feedback";

// Your DetailedAnalysis component remains unchanged.
const DetailedAnalysis = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    

  const detailedModels = [
    {
      id: 1,
      name: "Micro Facial Changes Tracker",
      subtitle: "Pixel-Level Facial Analysis",
      score: 78,
      confidence: "High",
      icon: <FaEye className="text-2xl" />,
      gradient: "from-purple-500 to-indigo-600",
      description: "Advanced computer vision system that tracks minute facial inconsistencies, micro-expressions, and pixel-level anomalies that are invisible to the human eye but characteristic of deepfake generation.",
      metrics: {
        "Facial Consistency": 82,
        "Micro-Expression": 74,
        "Pixel Anomalies": 76,
        "Edge Detection": 80
      },
      technicalDetails: "Employs sub-pixel analysis techniques with attention mechanisms to detect subtle inconsistencies in facial muscle movements and skin texture variations across video frames.",
      processingTime: "2.1s",
      dataPoints: "1,847 facial landmarks tracked"
    },
    {
      id: 2,
      name: "Frequency Domain Analyser",
      subtitle: "Spectral Analysis Engine",
      score: 69,
      confidence: "Medium",
      icon: <FaWaveSquare className="text-2xl" />,
      gradient: "from-cyan-500 to-blue-600",
      description: "Analyzes video content in the frequency domain to detect compression artifacts, temporal inconsistencies, and spectral signatures unique to AI-generated content.",
      metrics: {
        "Spectral Consistency": 71,
        "Compression Artifacts": 67,
        "Temporal Frequency": 72,
        "Noise Pattern": 66
      },
      technicalDetails: "Uses Fourier transform analysis and wavelet decomposition to examine frequency patterns and detect anomalies in the spectral domain that indicate synthetic generation.",
      processingTime: "3.4s",
      dataPoints: "2,134 frequency bins analyzed"
    },
    {
      id: 3,
      name: "Graph Neural Network Model",
      subtitle: "Relational Pattern Analysis",
      score: 81,
      confidence: "High",
      icon: <FaBrain className="text-2xl" />,
      gradient: "from-emerald-500 to-green-600",
      description: "Advanced GNN architecture that models spatial and temporal relationships between facial features, detecting inconsistencies in feature correlations typical of deepfake generation.",
      metrics: {
        "Feature Correlation": 84,
        "Spatial Relations": 79,
        "Temporal Coherence": 83,
        "Graph Connectivity": 78
      },
      technicalDetails: "Leverages graph convolutional networks to model complex relationships between facial landmarks and their temporal evolution, identifying unnatural correlation patterns.",
      processingTime: "4.2s",
      dataPoints: "156 graph nodes processed"
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 70) return 'from-red-500 to-red-600';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative"
    >
      {/* Professional Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-700/50"
            >
              <FaArrowLeft className="text-cyan-400" />
              <span className="text-slate-300">Back to Summary</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Detailed Analysis
              </h1>
              <p className="text-slate-400">Comprehensive AI Model Breakdown</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-400 text-2xl" />
              </div>
              <div className="text-4xl font-bold text-red-400 mb-2">76%</div>
              <div className="text-slate-300 font-medium">Deepfake Probability</div>
              <div className="text-slate-500 text-sm mt-1">High Risk Detected</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaBrain className="text-cyan-400 text-2xl" />
              </div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">3</div>
              <div className="text-slate-300 font-medium">AI Models</div>
              <div className="text-slate-500 text-sm mt-1">Advanced Analysis</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-emerald-400 text-2xl" />
              </div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">9.7s</div>
              <div className="text-slate-300 font-medium">Processing Time</div>
              <div className="text-slate-500 text-sm mt-1">Real-time Analysis</div>
            </div>
          </div>
        </motion.div>

        {/* Model Analysis Cards */}
        <div className="space-y-8">
          {detailedModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/30 shadow-2xl hover:shadow-cyan-500/5 hover:border-cyan-500/30 transition-all duration-500"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${model.gradient} shadow-lg`}>
                      {model.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{model.name}</h3>
                      <p className="text-slate-400">{model.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-5xl font-bold mb-2 ${getScoreColor(model.score)}`}>
                      {model.score}%
                    </div>
                    <div className={`text-sm px-4 py-2 rounded-xl ${
                      model.confidence === 'High' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      model.confidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {model.confidence} Confidence
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-8 leading-relaxed text-lg">{model.description}</p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {Object.entries(model.metrics).map(([metric, value], i) => (
                    <motion.div
                      key={metric}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + i * 0.05, duration: 0.3 }}
                      className="bg-slate-700/40 rounded-2xl p-6 border border-slate-600/30 hover:border-cyan-500/30 transition-colors duration-300"
                    >
                      <div className="text-center">
                        <div className={`text-3xl font-bold mb-3 ${getScoreColor(value)}`}>
          _                  {value}%
                        </div>
                        <div className="text-slate-400 text-sm font-medium">{metric}</div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-4 h-2 bg-slate-600/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ delay: index * 0.1 + i * 0.05 + 0.3, duration: 0.8 }}
                          className={`h-full bg-gradient-to-r ${getScoreGradient(value)} rounded-full shadow-lg`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Technical Details */}
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <FaLightbulb className="text-yellow-400 text-xl" />
                    <h4 className="text-xl font-semibold text-white">Technical Insights</h4>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">{model.technicalDetails}</p>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/40 rounded-xl">
                      <FaClock className="text-cyan-400" />
                      <span className="text-slate-400">Processing:</span>
                      <span className="text-cyan-400 font-semibold">{model.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/40 rounded-xl">
                      <FaChartBar className="text-emerald-400" />
                      <span className="text-slate-400">Data Points:</span>
                      <span className="text-emerald-400 font-semibold">{model.dataPoints}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom accent */}
              <div className={`h-1 bg-gradient-to-r ${model.gradient}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Result = () => {
  const [showDetailed, setShowDetailed] = useState(false);
const [showFeedbackPopup, setShowFeedbackPopup] = useState(true); // small bottom popup
    const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false); // fullscreen form

  const modelResults = [
    {
      label: 'Micro Facial Changes',
      value: 78,
      confidence: 'High',
      icon: <FaEye className="text-lg" />,
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      label: 'Frequency Domain',
      value: 69,
      confidence: 'Medium',
      icon: <FaWaveSquare className="text-lg" />,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      label: 'Graph Neural Network',
      value: 81,
      confidence: 'High',
      icon: <FaBrain className="text-lg" />,
      gradient: 'from-emerald-500 to-green-600'
    }
  ];

  const getConfidenceColor = (confidence) => {
    switch(confidence) {
      case 'High': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getProgressColor = (value) => {
    if (value >= 70) return 'from-red-500 to-red-600';
    if (value >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-600';
  };

  return (
    //  👇 THIS IS THE CORRECTED LINE 👇
    <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative ${!showDetailed ? "h-screen overflow-hidden" : ""}`}>
      {/* Professional Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
          <span className="text-white font-bold text-xl">GR</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showDetailed ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="h-screen flex items-center justify-center p-6"
          >
            <div className="w-full max-w-6xl relative z-10">
              
        _          {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-12"
              >
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  Analysis Complete
                </h1>
                <p className="text-lg text-slate-400">AI-powered deepfake detection results</p>
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
                
                {/* Primary Score Card */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="order-2 lg:order-1"
                >
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10 text-center">
                      {/* Status Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          _              className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30"
                      >
                        <FaExclamationTriangle className="text-red-400 text-2xl" />
                      </motion.div>

                      {/* Score Circle */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                        className="relative mb-6"
                      >
                        <div className="w-40 h-40 mx-auto relative">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-slate-700"
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={`${76 * 2.83} ${100 * 2.83}`}
                              className="text-red-500"
                              initial={{ strokeDasharray: "0 283" }}
                              animate={{ strokeDasharray: `${76 * 2.83} ${100 * 2.83}` }}
                              transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="text-4xl font-bold text-red-400 mb-1"
                              >
                                76%
                              </motion.div>
                              <div className="text-slate-400 text-sm">Risk Score</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Result Label */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                      >
                        <h3 className="text-2xl font-bold text-red-400 mb-2">
                          Likely Deepfake
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          High confidence detection based on AI consensus
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Model Results - Compact */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="order-1 lg:order-2"
                >
                  <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
                    
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                        <FaChartBar className="text-cyan-400 text-lg" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">AI Models</h3>
                        <p className="text-slate-400 text-sm">Detection breakdown</p>
                      </div>
                    </div>

                    {/* Compact Model Results */}
                    <div className="space-y-4">
                      {modelResults.map((model, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                          className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${model.gradient} flex items-center justify-center`}>
                                {model.icon}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-white">{model.label}</h4>
                                <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs border ${getConfidenceColor(model.confidence)}`}>
                                  {model.confidence}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-white">{model.value}%</div>
                            </div>
                          </div>
                          
                          {/* Compact Progress Bar */}
                          <div className="h-2 bg-slate-600/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${model.value}%` }}
          _                    transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                              className={`h-full bg-gradient-to-r ${getProgressColor(model.value)}`}
                            />
                          </div>
                _        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
                {showFeedbackPopup && (
                <div className="fixed bottom-6 right-6 bg-slate-800 border border-slate-700 shadow-xl rounded-xl p-4 w-72 z-40">
                  {/* Close button */}
                  <button
                    onClick={() => setShowFeedbackPopup(false)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
        
                  <h3 className="text-white font-semibold mb-2">
                    Give us your Feedback
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Help us improve by sharing your thoughts on the results you got.
                  </p>
                  <button
                    onClick={() => {
                      setShowFeedbackPopup(false);
                      setIsFeedbackFormOpen(true);
                    }}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium"
                  >
                    Open Feedback Form
                  </button>
                </div>
              )}
        
              {/* Fullscreen Feedback Form */}
              <FeedbackForm
                isOpen={isFeedbackFormOpen}
                onClose={() => {setIsFeedbackFormOpen(false);setShowFeedbackPopup(true)}}
              />

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button
                  onClick={() => (window.location.href = "/")}
                  className="group bg-slate-700/50 hover:bg-slate-600/50 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-slate-600/50 flex items-center gap-2"
                >
                  <FaHome className="group-hover:scale-110 transition-transform duration-300" />
                  Back to Home
                </button>
                <button
                  onClick={() => setShowDetailed(true)}
                  className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <FaChartBar className="group-hover:scale-110 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">Detailed Analysis</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                </button>

                {/* Processing Time Info */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <FaCheckCircle className="text-emerald-400 text-sm" />
                  <span className="text-slate-300 text-sm">Completed in 9.7s</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        ) : (
          <DetailedAnalysis onBack={() => setShowDetailed(false)} />
        )}
      </AnimatePresence>
        
    </div>
  );
};

export default Result;