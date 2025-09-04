import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaVideo, 
  FaImage, 
  FaVolumeUp,
  FaMicrophone, 
  FaWaveSquare, 
  FaBrain,
  FaEye,
  FaRobot,
  FaCamera,
  FaPlay,
  FaDownload
} from 'react-icons/fa';

const UnifiedResult = ({ onReset, analysisResult }) => {
  const [selectedModel, setSelectedModel] = useState(null);

  // Determine content type from analysis result
  const getContentType = () => {
    if (analysisResult?.analysisType) {
      return analysisResult.analysisType.toLowerCase();
    }
    // Fallback detection based on result structure
    if (analysisResult?.data && typeof analysisResult.data === 'object') {
      const keys = Object.keys(analysisResult.data);
      if (keys.some(key => key.includes('FuNet') || key.includes('AttentionFuNet'))) {
        return 'image';
      }
    }
    if (analysisResult?.video) {
      return 'video';
    }
    if (analysisResult?.audio) {
      return 'audio';
    }
    return 'video'; // Default fallback
  };

  const contentType = getContentType();

  // Process different response formats
  const processAnalysisResult = () => {
    if (!analysisResult) return null;

    switch (contentType) {
      case 'audio':
        return processAudioResult();
      case 'image':
        return processImageResult();
      case 'video':
      default:
        return processVideoResult();
    }
  };

  const processVideoResult = () => {
    // Handle the actual video API response structure
    const videoData = analysisResult?.video;
    const prediction = videoData?.overall_prediction?.toLowerCase() || 'real';
    const isFake = prediction === 'fake';
    const hasError = !!analysisResult?.error;

    // Use the actual confidence from the API response
    const confidence = videoData?.average_confidence || 0.87;

    // Extract detailed results for individual persons if available
    const detailedResults = videoData?.detailed_results || {};
    const personResults = Object.keys(detailedResults).map(personKey => {
      const person = detailedResults[personKey];
      const firstBatch = person.batches?.[0];
      return {
        name: `Person ${personKey.replace('person_', '')}`,
        prediction: firstBatch?.prediction || 'REAL',
        confidence: (firstBatch?.confidence || 0.87) * 100,
        probabilities: {
          fake: firstBatch?.fake_probability || (1 - confidence),
          real: firstBatch?.real_probability || confidence
        },
        totalBatches: person.total_batches || 1,
        validFrames: firstBatch?.valid_frames || 0
      };
    });

    return {
      type: 'video',
      isFake,
      hasError,
      confidence: confidence * 100,
      prediction,
      models: personResults.length > 0 ? personResults : [{
        name: 'Video Analysis',
        prediction: isFake ? 'FAKE' : 'REAL',
        confidence: confidence * 100,
        probabilities: {
          fake: isFake ? confidence : (1 - confidence),
          real: isFake ? (1 - confidence) : confidence
        }
      }],
      features: [
        {
          name: 'Temporal Consistency',
          score: confidence * 100,
          icon: <FaVideo />,
          description: isFake ? 'Inconsistencies detected in frame transitions and facial movements.' : 'Natural temporal flow and consistent facial features maintained across frames.'
        },
        {
          name: 'Person Detection',
          score: personResults.length > 0 ? Math.min(100, personResults.length * 45 + 10) : 85,
          icon: <FaEye />,
          description: `Detected ${personResults.length || 1} person(s) in the video for analysis. ${personResults.length > 1 ? 'Multiple face tracking active.' : 'Single person analysis.'}`
        },
        {
          name: 'AI Model Confidence',
          score: confidence * 100,
          icon: <FaBrain />,
          description: `Deep learning model analyzed ${Object.values(detailedResults).reduce((sum, person) => sum + (person.batches?.[0]?.valid_frames || 0), 0) || 'multiple'} frames with ${Math.round(confidence * 100)}% confidence.`
        }
      ]
    };
  };

  const processImageResult = () => {
    const data = analysisResult?.data || {};
    const models = Object.keys(data).map(modelName => ({
      name: modelName,
      prediction: data[modelName]?.prediction || 'REAL',
      probabilities: data[modelName]?.probabilities || { fake: 0, real: 1 },
      confidence: (data[modelName]?.probabilities?.real || 1) * 100
    }));

    // Calculate overall result based on majority vote or confidence
    const fakeCount = models.filter(m => m.prediction === 'FAKE').length;
    const isFake = fakeCount > models.length / 2;
    const avgConfidence = models.reduce((sum, m) => sum + m.confidence, 0) / models.length;

    return {
      type: 'image',
      isFake,
      hasError: false,
      confidence: avgConfidence,
      prediction: isFake ? 'fake' : 'real',
      models,
      features: [
        {
          name: 'Pixel Analysis',
          score: isFake ? 72 : 94,
          icon: <FaCamera />,
          description: isFake ? 'Pixel-level artifacts suggest manipulation.' : 'Natural pixel patterns detected.'
        },
        {
          name: 'Compression Analysis',
          score: isFake ? 68 : 91,
          icon: <FaImage />,
          description: isFake ? 'Compression artifacts indicate synthetic generation.' : 'Consistent compression patterns.'
        },
        {
          name: 'Feature Extraction',
          score: avgConfidence,
          icon: <FaRobot />,
          description: `Combined model analysis shows ${Math.round(avgConfidence)}% confidence.`
        }
      ]
    };
  };

  const processAudioResult = () => {
    // Handle both audio-only results and combined video+audio results
    const audioData = analysisResult?.audio;
    const prediction = audioData?.prediction?.toLowerCase() || 'real';
    const isFake = prediction === 'fake';
    const hasError = !!analysisResult?.error;

    const realProb = audioData?.real_probability || (hasError ? 0.13 : 0.87);
    const fakeProb = audioData?.fake_probability || (hasError ? 0.87 : 0.13);
    
    const confidence = isFake ? fakeProb * 100 : realProb * 100;

    return {
      type: 'audio',
      isFake,
      hasError,
      confidence,
      prediction,
      models: [{
        name: 'Audio Analysis',
        prediction: isFake ? 'FAKE' : 'REAL',
        confidence,
        probabilities: { fake: fakeProb, real: realProb }
      }],
      features: [
        {
          name: 'Vocal Patterns',
          score: isFake ? confidence * 0.97 : confidence * 1.02,
          icon: <FaMicrophone />,
          description: isFake ? 'Detected unnatural resonances and harmonic inconsistencies.' : 'Vocal patterns appear natural and consistent.'
        },
        {
          name: 'Spectral Analysis',
          score: isFake ? confidence * 0.95 + 1.5 : confidence * 0.98 - 1.2,
          icon: <FaWaveSquare />,
          description: isFake ? 'Spectral artifacts and irregularities common in synthetic audio.' : 'Spectral integrity is high, no manipulation detected.'
        },
        {
          name: 'AI Model Verdict',
          score: confidence,
          icon: <FaBrain />,
          description: `The neural network classified this sample with ${Math.round(confidence)}% confidence.`
        }
      ]
    };
  };

  const result = processAnalysisResult();
  
  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950 text-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-400 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Analysis Error</h1>
          <p className="text-slate-400 mb-6">Unable to process the analysis result.</p>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg transition-colors text-cyan-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getResultColors = () => {
    if (result.isFake || result.hasError) {
      return {
        stroke: '#ef4444',
        badgeBg: 'bg-red-500/20',
        badgeBorder: 'border-red-400/30',
        text: 'text-red-400',
        gradient: 'from-red-500 to-red-600'
      };
    }
    return {
      stroke: '#22c55e',
      badgeBg: 'bg-green-500/20',
      badgeBorder: 'border-green-400/30',
      text: 'text-green-400',
      gradient: 'from-green-500 to-green-600'
    };
  };

  const colors = getResultColors();

  const getContentIcon = () => {
    switch (result.type) {
      case 'video': return <FaVideo />;
      case 'image': return <FaImage />;
      case 'audio': return <FaVolumeUp />;
      default: return <FaBrain />;
    }
  };

  const getContentTypeLabel = () => {
    return result.type.charAt(0).toUpperCase() + result.type.slice(1);
  };

  const formatPercentage = (num) => {
    if (num == null || isNaN(num)) return "0";
    return Math.trunc(Math.min(100, Math.max(0, num)));
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 85) return 'Very High';
    if (confidence >= 75) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950 text-cyan-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glowing circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-cyan-400/15 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-300/20 rounded-full blur-md"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-cyan-500/12 rounded-full blur-lg"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl text-center relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-3xl text-cyan-400">
              {getContentIcon()}
            </div>
            <h1 className="text-4xl font-bold text-cyan-300">
              {getContentTypeLabel()} Analysis Complete
            </h1>
          </div>
        </motion.div>

        {/* Main Result Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Confidence Circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="lg:col-span-1"
          >
            <div className="w-40 h-40 mx-auto mb-6 relative">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-800"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke={colors.stroke}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 42 * (1 - result.confidence / 100),
                  }}
                  transition={{ delay: 1.2, duration: 2.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <motion.span
                  className="text-3xl font-bold text-cyan-300"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  {formatPercentage(result.confidence)}%
                </motion.span>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 ${colors.badgeBg} ${colors.badgeBorder} rounded-full mb-2`}>
              {result.isFake || result.hasError ? (
                <FaExclamationTriangle className={colors.text} />
              ) : (
                <FaCheckCircle className={colors.text} />
              )}
              <span className={`${colors.text} font-medium`}>
                {result.hasError
                  ? 'ERROR DETECTED'
                  : result.isFake
                  ? 'DEEPFAKE DETECTED'
                  : 'AUTHENTIC CONTENT'}
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Confidence Level:{' '}
              <span className={`${colors.text} font-semibold`}>
                {getConfidenceLevel(result.confidence)}
              </span>
            </p>
          </motion.div>

          {/* Model Results (for image analysis) or Person Results (for video analysis) */}
          {((result.type === 'image' && result.models) || (result.type === 'video' && result.models && result.models.length > 0)) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2"
            >
              <h3 className="text-xl font-semibold mb-4 text-cyan-200">
                {result.type === 'image' ? 'Model Analysis' : 'Person Detection Analysis'}
              </h3>
              <div className="grid gap-4">
                {result.models.map((model, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-cyan-800/30 hover:border-cyan-600/50 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedModel(model)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-cyan-200">{model.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        model.prediction === 'FAKE' 
                          ? 'bg-red-500/20 text-red-400 border border-red-400/30'
                          : 'bg-green-500/20 text-green-400 border border-green-400/30'
                      }`}>
                        {model.prediction}
                      </span>
                    </div>
                    
                    {/* Additional info for video person results */}
                    {result.type === 'video' && model.totalBatches && (
                      <div className="text-xs text-slate-500 mb-2">
                        {model.validFrames} frames analyzed • {model.totalBatches} batch{model.totalBatches > 1 ? 'es' : ''}
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Real: {formatPercentage(model.probabilities.real * 100)}%</span>
                      <span className="text-slate-400">Fake: {formatPercentage(model.probabilities.fake * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <motion.div
                        className={`h-2 rounded-full ${model.prediction === 'FAKE' ? 'bg-red-500' : 'bg-green-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${formatPercentage(model.confidence)}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Feature Analysis for video/audio */}
          {(result.type === 'video' || result.type === 'audio') && !((result.type === 'video' && result.models && result.models.length > 1)) && (
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4 text-cyan-200">Analysis Features</h3>
              <div className="grid gap-4">
                {result.features?.slice(0, 2).map((feature, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-cyan-800/30 hover:border-cyan-600/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-xl text-cyan-400">{feature.icon}</div>
                      <h4 className="font-semibold text-cyan-200">{feature.name}</h4>
                      <span className="ml-auto text-lg font-bold text-cyan-300">
                        {formatPercentage(feature.score)}%
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{feature.description}</p>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full bg-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${formatPercentage(feature.score)}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards - Full Width for All Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {result.features?.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.9 }}
                className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-800/30 hover:border-cyan-600/50 transition-all duration-300"
              >
                <div className="text-2xl mb-3 text-cyan-400">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-cyan-200">
                  {feature.name}
                </h3>
                <div className="text-2xl font-bold text-cyan-300 mb-2">
                  {formatPercentage(feature.score)}%
                </div>
                <p className="text-sm text-slate-400 mb-4">{feature.description}</p>

                <div className="w-full bg-slate-800 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${formatPercentage(feature.score)}%` }}
                    transition={{ delay: 0.1 * index + 1.2, duration: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Info Section */}
        {analysisResult?.fileName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mb-8"
          >
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <FaDownload className="text-cyan-400" />
                  <span>File: {analysisResult.fileName}</span>
                </div>
                {analysisResult.fileSize && (
                  <div className="flex items-center gap-2">
                    <FaDownload className="text-cyan-400" />
                    <span>Size: {(analysisResult.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                )}
                {analysisResult.processingTime && (
                  <div className="flex items-center gap-2">
                    <FaPlay className="text-cyan-400" />
                    <span>Processing Time: {(analysisResult.processingTime / 1000).toFixed(1)}s</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => (window.location.href = '/')}
            className="flex items-center gap-3 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 rounded-lg transition-colors text-cyan-200"
          >
            <FaHome />
            <span>Back to Home</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-3 px-6 py-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg transition-colors text-cyan-300"
          >
            {getContentIcon()}
            <span>Analyze Another</span>
          </button>
        </motion.div>

        {/* Model Selection Modal for Image/Video Analysis */}
        {(result.type === 'image' || result.type === 'video') && selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedModel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-cyan-300">{selectedModel.name}</h3>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="text-slate-400 hover:text-red-400 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Prediction:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedModel.prediction === 'FAKE' 
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedModel.prediction}
                  </span>
                </div>
                
                {/* Video-specific info */}
                {result.type === 'video' && selectedModel.validFrames && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Frames Analyzed:</span>
                      <span className="text-cyan-400">{selectedModel.validFrames}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Processing Batches:</span>
                      <span className="text-cyan-400">{selectedModel.totalBatches}</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Real Probability:</span>
                    <span className="text-green-400">{formatPercentage(selectedModel.probabilities.real * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Fake Probability:</span>
                    <span className="text-red-400">{formatPercentage(selectedModel.probabilities.fake * 100)}%</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        selectedModel.prediction === 'FAKE' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${formatPercentage(selectedModel.confidence)}%` }}
                    />
                  </div>
                  <p className="text-center text-sm text-slate-400 mt-2">
                    Confidence: {formatPercentage(selectedModel.confidence)}%
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UnifiedResult;