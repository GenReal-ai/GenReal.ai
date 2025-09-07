import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  AlertTriangle, 
  ShieldCheck, 
  FileVideo, 
  FileImage, 
  FileAudio,
  RotateCw,
  Users,
  Radio,
  Bot,
  Cpu,
  Waves,
  AreaChart
} from 'lucide-react';

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

const NetworkBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Animated grid lines */}
    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1"/>
        </pattern>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#smallGrid)" />
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* Floating cyan blobs */}
    <motion.div
      className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"
      animate={{ 
        x: [0, 30, 0], 
        y: [0, -20, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/15 rounded-full blur-lg"
      animate={{ 
        x: [0, -40, 0], 
        y: [0, 30, 0],
        scale: [1, 0.9, 1]
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    <motion.div
      className="absolute bottom-32 left-1/4 w-40 h-40 bg-cyan-600/8 rounded-full blur-2xl"
      animate={{ 
        x: [0, 50, 0], 
        y: [0, -40, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div
      className="absolute bottom-20 right-1/3 w-28 h-28 bg-cyan-500/12 rounded-full blur-xl"
      animate={{ 
        x: [0, -30, 0], 
        y: [0, 25, 0],
        scale: [1, 0.8, 1]
      }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
    />
    
    {/* Diagonal network lines */}
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M0,100 Q200,50 400,100 T800,100 L800,200 Q600,150 400,200 T0,200 Z"
        fill="none"
        stroke="rgba(6, 182, 212, 0.4)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      <motion.path
        d="M0,300 Q300,250 600,300 T1200,300"
        fill="none"
        stroke="rgba(8, 145, 178, 0.3)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
      />
    </svg>
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

  if (!processedResult) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
        <NetworkBackground />
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

  const getThreatDetails = (probability) => {
    if (probability > 95) return {
        level: 'Critical',
        colors: { primary: '#dc2626', text: 'text-red-500', bg: 'bg-red-900/30', border: 'border-red-600/50' }
    };
    if (probability > 75) return {
        level: 'High',
        colors: { primary: '#f97316', text: 'text-orange-500', bg: 'bg-orange-900/30', border: 'border-orange-600/50' }
    };
    if (probability > 30) return {
        level: 'Medium',
        colors: { primary: '#facc15', text: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-600/50' }
    };
    return {
        level: 'Low',
        colors: { primary: '#22c55e', text: 'text-green-500', bg: 'bg-green-900/30', border: 'border-green-600/50' }
    };
  };
  
  const threat = getThreatDetails(deepfakeProbability);
  const { colors } = threat;
  const isClassifiedAsFake = overallPrediction === 'FAKE';
  const MainIcon = { video: FileVideo, image: FileImage, audio: FileAudio }[type];

  const DetailCard = ({ item }) => {
    const itemIsFake = item.prediction === 'FAKE';
    const iconMap = { 'Person': Users, 'Audio': Radio, 'FuNet': Bot, 'Primary': Radio };
    const Icon = Object.entries(iconMap).find(([key]) => item.name.includes(key))?.[1] || Bot;
    
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4 space-y-3 hover:bg-slate-800/40 transition-all duration-300"
        >
            <div className="flex justify-between items-center">
                <p className="font-semibold text-cyan-200 flex items-center gap-2">
                    <Icon size={16} /> {item.name}
                </p>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${itemIsFake ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                    {item.prediction}
                </span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <div className="text-green-400 text-center">
                    <span className="text-slate-400 block text-xs mb-1">Authentic</span>
                    <span className="font-mono font-bold">{formatPercentage(item.probabilities?.real * 100)}%</span>
                </div>
                <div className="flex-1 px-4">
                    <div className="w-full bg-slate-700/50 rounded-full h-3 relative overflow-hidden border border-slate-600/30">
                        <div className="absolute inset-0 flex">
                            <motion.div 
                                className="bg-gradient-to-r from-green-500 to-green-400 h-full" 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.probabilities?.real * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                            <motion.div 
                                className="bg-gradient-to-r from-red-500 to-red-400 h-full" 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.probabilities?.fake * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            />
                        </div>
                    </div>
                </div>
                <div className="text-red-400 text-center">
                    <span className="text-slate-400 block text-xs mb-1">Deepfake</span>
                    <span className="font-mono font-bold">{formatPercentage(item.probabilities?.fake * 100)}%</span>
                </div>
            </div>
        </motion.div>
    );
  };

  const InfoCard = ({ icon: Icon, title, children }) => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4 hover:bg-slate-800/40 transition-all duration-300"
    >
        <div className="flex items-center gap-3 mb-3">
            <Icon className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-cyan-200">{title}</h4>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 relative overflow-hidden">
      <NetworkBackground />
      <CompanyLogo onClick={handleHomeClick} />
      
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 pt-20">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full max-w-7xl bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col relative z-10"
        >
            <header className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-700/40 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <MainIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Analysis Report
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { window.location.href = '/plagiarism-upload'; }} 
                        className="px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all duration-300 border border-slate-700/50 hover:border-cyan-500/30 text-sm font-medium"
                    >
                        Try Code Plagiarism
                    </button>
                    <button 
                        onClick={() => { window.location.href = '/deepfake-detection'; }} 
                        className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300 transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50 text-sm font-medium"
                    >
                        Try Another
                    </button>
                </div>
            </header>

            <main className="flex-grow p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8 overflow-y-auto">
                <div className="lg:col-span-2 flex flex-col items-center text-center space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.border} border backdrop-blur-sm`}
                    >
                        <AlertTriangle className={`w-4 h-4 ${colors.text}`} />
                        <span className={`${colors.text} text-xs font-bold uppercase tracking-wider`}>
                            {threat.level} Threat Level
                        </span>
                    </motion.div>

                    <motion.div 
                        className="relative w-52 h-52"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="4" stroke="rgba(51, 65, 85, 0.3)" />
                            <motion.circle 
                                cx="50" cy="50" r="42" fill="none" strokeWidth="4" 
                                stroke={colors.primary} strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 42}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - deepfakeProbability / 100) }}
                                transition={{ delay: 0.8, duration: 2, ease: "circOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span 
                                className={`text-5xl font-bold font-mono ${colors.text}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                            >
                                {formatPercentage(deepfakeProbability)}%
                            </motion.span>
                            <p className="text-sm font-semibold text-slate-400 mt-2">Deepfake Probability</p>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className={`p-6 rounded-xl w-full ${isClassifiedAsFake ? 'bg-red-900/20 border border-red-500/30' : 'bg-green-900/20 border border-green-500/30'} backdrop-blur-sm`}
                    >
                        <p className="text-sm uppercase tracking-wider text-slate-400 mb-2">Final Verdict</p>
                        <p className={`text-3xl font-bold ${isClassifiedAsFake ? 'text-red-400' : 'text-green-400'}`}>
                            {overallPrediction}
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="w-full text-left bg-slate-800/30 backdrop-blur-sm p-5 rounded-xl border border-slate-700/40"
                    >
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Cpu size={18} className="text-cyan-400"/> 
                            File Information
                        </h3>
                        <div className="space-y-3 text-sm text-slate-400">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">File:</span> 
                                <span className="truncate max-w-[150px] sm:max-w-xs text-right text-cyan-300" title={metadata.fileName}>
                                    {metadata.fileName}
                                </span>
                            </div>
                            {metadata.fileSize && 
                                <div className="flex justify-between">
                                    <span className="font-medium">Size:</span> 
                                    <span className="text-slate-300">{metadata.fileSize} MB</span>
                                </div>
                            }
                            {metadata.processingTime && 
                                <div className="flex justify-between">
                                    <span className="font-medium">Processing Time:</span> 
                                    <span className="text-slate-300">{metadata.processingTime}s</span>
                                </div>
                            }
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-3">
                    <motion.h3 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl font-bold text-white mb-6 flex items-center gap-2"
                    >
                        <AreaChart className="w-6 h-6 text-cyan-400" />
                        Detailed Analysis Breakdown
                    </motion.h3>
                    <div className="space-y-4 max-h-[65vh] lg:max-h-full overflow-y-auto pr-2 custom-scrollbar">
                        {type === 'video' && (
                            <>
                                <DetailCard item={processedResult.audioAnalysis}/>
                                {processedResult.personAnalyses.map((person, index) => 
                                    <motion.div
                                        key={person.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                    >
                                        <DetailCard item={person} />
                                    </motion.div>
                                )}
                            </>
                        )}
                        {type === 'image' && processedResult.details.map((item, index) => 
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <DetailCard item={item} />
                            </motion.div>
                        )}
                        {type === 'audio' && 
                            <>
                                {processedResult.details.map((item, index) => 
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                    >
                                        <DetailCard item={item} />
                                    </motion.div>
                                )}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.0 }}
                                >
                                    <InfoCard icon={Waves} title="Waveform Consistency Analysis">
                                        This involves checking for unnatural silences, abrupt cuts, or a non-uniform noise floor, which are often byproducts of audio splicing or generation.
                                    </InfoCard>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.1 }}
                                >
                                    <InfoCard icon={AreaChart} title="Spectrogram Anomaly Detection">
                                        AI models analyze the audio's frequency spectrum over time to find artifacts, unnatural harmonics, or patterns inconsistent with human speech or natural sounds.
                                    </InfoCard>
                                </motion.div>
                            </>
                        }
                    </div>
                </div>
            </main>
        </motion.div>
      </div>

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