import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert,
  FileVideo, 
  FileImage, 
  FileAudio,
  BarChartBig,
  Cpu,
  Home,
  RotateCw,
  User,
  Film,
  Music,
  Bot,
  Clock
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

// ================== UNIFIED RESULT COMPONENT ==================

const UnifiedResult = ({ onReset, analysisResult }) => {
  const [processedResult, setProcessedResult] = useState(null);

  useEffect(() => {
    const processData = () => {
      if (!analysisResult) return null;
      
      let type = 'unknown';
      if (analysisResult?.video) {
        type = 'video';
      } else if (analysisResult?.AttentionFuNet || analysisResult?.['FuNet-A']) {
        type = 'image';
      } else if (analysisResult?.prediction && analysisResult?.probabilities) {
        type = 'audio';
      }

      let result;
      switch (type) {
        case 'video': result = processVideoResult(analysisResult); break;
        case 'image': result = processImageResult(analysisResult); break;
        case 'audio': result = processAudioResult(analysisResult); break;
        default: return null;
      }
      
      result.metadata = {
        fileName: analysisResult.fileName,
        fileSize: analysisResult.fileSize ? (analysisResult.fileSize / (1024 * 1024)).toFixed(2) : null,
        processingTime: analysisResult.processingTime ? (analysisResult.processingTime / 1000).toFixed(1) : null,
      };
      return result;
    };
    setProcessedResult(processData());
  }, [analysisResult]);

  const processVideoResult = (data) => {
    const videoData = data.video || {};
    const audioData = data.audio || {};
    const isFake = videoData.overall_prediction === 'FAKE';
    const displayConfidence = (isFake ? (1 - (videoData.average_confidence || 0)) : (videoData.average_confidence || 0)) * 100;
    
    // Process persons with averaged batch results
    const personAnalyses = Object.entries(videoData.detailed_results || {}).map(([key, person]) => {
      const batches = person.batches || [];
      
      if (batches.length === 0) {
        return {
          id: key,
          name: `Person ${key.replace('person_', '')}`,
          prediction: 'UNKNOWN',
          probabilities: { real: 0, fake: 0 },
          batchCount: 0
        };
      }

      // Calculate averages across all batches for this person
      const avgRealProb = batches.reduce((sum, batch) => sum + (batch.real_probability || 0), 0) / batches.length;
      const avgFakeProb = batches.reduce((sum, batch) => sum + (batch.fake_probability || 0), 0) / batches.length;
      
      // Determine overall prediction based on higher average probability
      const prediction = avgFakeProb > avgRealProb ? 'FAKE' : 'REAL';
      
      return {
        id: key,
        name: `Person ${key.replace('person_', '')}`,
        prediction,
        probabilities: { real: avgRealProb, fake: avgFakeProb },
        batchCount: batches.length
      };
    });

    return {
      type: 'video',
      isFake,
      displayConfidence,
      overallPrediction: videoData.overall_prediction,
      audioAnalysis: {
        prediction: audioData.prediction,
        probabilities: { real: audioData.real_probability || 0, fake: audioData.fake_probability || 0 }
      },
      personAnalyses
    };
  };

  const processImageResult = (data) => {
    const modelData = data;
    const primaryModel = modelData['AttentionFuNet'] || Object.values(modelData)[0] || {};
    const isFake = primaryModel.prediction === 'FAKE';
    const displayConfidence = (isFake ? (primaryModel.probabilities?.fake || 0) : (primaryModel.probabilities?.real || 0)) * 100;
    
    const details = Object.entries(modelData).map(([name, model]) => ({
        id: name, 
        name, 
        prediction: model.prediction, 
        probabilities: model.probabilities || { real: 0, fake: 0 }
    }));
    
    return { type: 'image', isFake, displayConfidence, overallPrediction: primaryModel.prediction, details };
  };

  const processAudioResult = (data) => {
    const isFake = data.prediction === 'FAKE';
    const displayConfidence = (isFake ? (data.probabilities?.fake || 0) : (data.probabilities?.real || 0)) * 100;
    return {
      type: 'audio', 
      isFake, 
      displayConfidence, 
      overallPrediction: data.prediction,
      details: [{ 
          id: 'audio_analysis', 
          name: 'Waveform Analysis', 
          prediction: data.prediction, 
          probabilities: data.probabilities || { real: 0, fake: 0 }
      }]
    };
  };

  if (!processedResult) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="flex items-center gap-3">
                <Cpu className="animate-pulse" />
                <span>Processing Analysis...</span>
            </div>
        </div>
    );
  }
  
  const { type, isFake, displayConfidence, overallPrediction, metadata } = processedResult;
  
  const colors = {
    text: isFake ? 'text-red-400' : 'text-green-400',
    bg: isFake ? 'bg-red-500/10' : 'bg-green-500/10',
    gradientId: isFake ? 'red-gradient' : 'green-gradient',
  };

  const Icon = { video: FileVideo, image: FileImage, audio: FileAudio }[type];
  const progressBarLabel = isFake ? "Deepfake Confidence" : "Authenticity Score";

  const DetailCard = ({ item, showBatchCount = false }) => {
    const probabilities = item.probabilities || { real: 0, fake: 0 };
    const highestProb = Math.max(probabilities.real, probabilities.fake);
    const isHighestFake = probabilities.fake > probabilities.real;
    const highestPercentage = formatPercentage(highestProb * 100);
  
    return (
      <div 
        className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-semibold text-cyan-200 flex items-center gap-2 mb-1">
              {item.name.includes('Person') && <User size={16}/>}
              {item.name.includes('Audio') && <Music size={16}/>}
              {item.name.includes('FuNet') && <Bot size={16}/>}
              {item.name.includes('Waveform') && <FileAudio size={16}/>}
              {item.name}
            </p>
            {showBatchCount && item.batchCount && (
              <p className="text-xs text-slate-400">
                Analyzed across {item.batchCount} batch{item.batchCount !== 1 ? 'es' : ''}
              </p>
            )}
          </div>
          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${item.prediction === 'FAKE' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {item.prediction}
          </span>
        </div>
        
        {/* Progress bar showing highest confidence */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">Confidence Score</span>
            <span className={`text-sm font-bold ${isHighestFake ? 'text-red-400' : 'text-green-400'}`}>
              {highestPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isHighestFake ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${highestPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Detailed probabilities */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-green-400">
            <span className="text-slate-400 block">Authentic</span>
            {formatPercentage(probabilities.real * 100)}%
          </div>
          <div className="text-red-400 text-right">
            <span className="text-slate-400 block">Deepfake</span>
            {formatPercentage(probabilities.fake * 100)}%
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-200 flex items-center justify-center p-2 sm:p-4">
      <div 
        className="w-full h-screen max-w-7xl bg-slate-900/50 rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
      >
        <header className="flex-shrink-0 p-3 sm:p-4 border-b border-slate-700/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
                <h1 className="text-base sm:text-lg font-bold text-white">Analysis Report</h1>
            </div>
            <div className="flex items-center gap-2">
                <a href="/" className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors">
                  <Home className="w-4 h-4" />
                </a>
                <button onClick={onReset} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors">
                  <RotateCw className="w-4 h-4" />
                </button>
            </div>
        </header>

        <main className="flex-grow p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 overflow-hidden">
            {/* Left Panel - Overall Results */}
            <div className="lg:col-span-2 flex flex-col items-center text-center space-y-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Overall Verdict</h2>
                  <div className={`inline-flex items-center gap-3 p-3 rounded-lg ${colors.bg}`}>
                      {isFake ? <ShieldAlert size={24} className={colors.text} /> : <ShieldCheck size={24} className={colors.text} />}
                      <p className={`text-xl sm:text-2xl font-bold ${colors.text}`}>{overallPrediction}</p>
                  </div>
                </div>

                <div className="w-full max-w-xs">
                    <div className="relative">
                        <svg className="w-full" viewBox="0 0 100 55">
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" strokeWidth="8" stroke="#334155" strokeLinecap="round" />
                            <path 
                              d="M 10 50 A 40 40 0 0 1 90 50" 
                              fill="none" 
                              strokeWidth="8" 
                              stroke={`url(#${colors.gradientId})`} 
                              strokeLinecap="round"
                              strokeDasharray={`${(displayConfidence / 100) * 125.6}, 251.2`}
                              className="transition-all duration-1500 ease-out"
                            />
                        </svg>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                            <span className={`text-3xl sm:text-4xl font-bold ${colors.text}`}>{formatPercentage(displayConfidence)}%</span>
                            <p className="text-xs font-semibold text-slate-400 mt-1">{progressBarLabel}</p>
                        </div>
                    </div>
                </div>

                {type === 'video' && processedResult.audioAnalysis && (
                    <div className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                         <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Audio Track</h3>
                         <div className={`inline-flex items-center gap-2 p-2 rounded-lg ${processedResult.audioAnalysis.prediction === 'FAKE' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                             {processedResult.audioAnalysis.prediction === 'FAKE' ? <ShieldAlert size={18} className="text-red-400"/> : <ShieldCheck size={18} className="text-green-400"/>}
                             <p className={`text-sm font-bold ${processedResult.audioAnalysis.prediction === 'FAKE' ? 'text-red-400' : 'text-green-400'}`}>{processedResult.audioAnalysis.prediction}</p>
                         </div>
                    </div>
                )}

                <div className="w-full text-left bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mt-auto">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Cpu size={16}/> File Info
                    </h3>
                    <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span className="font-medium">Name:</span> 
                          <span className="truncate max-w-[120px] sm:max-w-[200px] text-right" title={metadata.fileName}>
                            {metadata.fileName}
                          </span>
                        </div>
                        {metadata.fileSize && (
                          <div className="flex justify-between">
                            <span className="font-medium">Size:</span> 
                            <span>{metadata.fileSize} MB</span>
                          </div>
                        )}
                        {metadata.processingTime && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium flex items-center gap-1">
                              <Clock size={12}/> Time:
                            </span> 
                            <span>{metadata.processingTime}s</span>
                          </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel - Detailed Analysis */}
            <div className="lg:col-span-3 flex flex-col overflow-hidden">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2 flex-shrink-0">
                  <BarChartBig size={18}/> Detailed Analysis
                </h3>
                <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                    {type === 'video' && (
                        <>
                            <DetailCard item={{ name: "Audio Track Analysis", ...processedResult.audioAnalysis }}/>
                            {processedResult.personAnalyses.map(person => (
                                <DetailCard 
                                  key={person.id} 
                                  item={person} 
                                  showBatchCount={true}
                                />
                            ))}
                        </>
                    )}
                    {(type === 'image' || type === 'audio') && processedResult.details.map(item => 
                        <DetailCard key={item.id} item={item} />
                    )}
                </div>
            </div>
        </main>
      </div>
      
      <svg className="w-0 h-0 absolute">
        <defs>
          <linearGradient id="red-gradient">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="green-gradient">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default UnifiedResult;