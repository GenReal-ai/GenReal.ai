import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; // Step 1: Import the real useNavigate hook
import { motion, AnimatePresence } from "framer-motion";

// --- Feedback Form Component ---
const FeedbackForm = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", { rating, feedbackText });
    setIsSubmitted(true);
    setTimeout(() => {
        onClose();
        setTimeout(() => {
            setIsSubmitted(false);
            setRating(0);
            setFeedbackText('');
        }, 500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-2xl"
                >
                    &times;
                </button>
                
                {isSubmitted ? (
                    <div className="p-8 text-center">
                        <motion.div
                             initial={{ scale: 0.5, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             className="text-green-400 text-5xl mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-green-500/10 rounded-full"
                        >
                            ✓
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white">Thank You!</h2>
                        <p className="text-slate-400 mt-2">Your feedback has been submitted successfully.</p>
                    </div>
                ) : (
                    // Step 2: Change the div to a <form> element
                    <form onSubmit={handleSubmit} className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Share Your Feedback</h2>
                        <p className="text-slate-400 mb-6">How accurate were the results?</p>
                        <div className="mb-6">
                            <label className="block text-slate-300 mb-3 text-sm font-medium">Your Rating</label>
                            <div className="flex items-center gap-2 text-3xl text-slate-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`cursor-pointer transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : ''}`}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="feedbackText" className="block text-slate-300 mb-2 text-sm font-medium">Comments (Optional)</label>
                            <textarea
                                id="feedbackText"
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Tell us more about your experience..."
                                className="w-full h-28 bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                        <button
                            // Step 2: Add type="submit" to the button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50"
                            disabled={rating === 0}
                        >
                            Submit Feedback
                        </button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};

// --- Other components (CodeEditor, PlagiarismResults) remain the same ---
const CodeEditor = ({ language, value, onChange }) => {
  const [lineNumbers, setLineNumbers] = React.useState([]);
  
  React.useEffect(() => {
    const lines = value.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const getLanguageIcon = (lang) => {
    const icons = {
      'C++': '⚡', 'C': '🔧', 'Java': '☕', 'Python': '🐍', 'JavaScript': '🟨'
    };
    return icons[lang] || '📄';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-600/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getLanguageIcon(language)}</span>
          <span className="text-sm text-slate-300 font-medium">{language || 'Code'}</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="bg-slate-800/30 px-3 py-4 text-slate-500 text-sm font-mono select-none border-r border-slate-700/30 min-w-[50px]">
          {lineNumbers.map(num => (
            <div key={num} className="leading-6 text-right">{num}</div>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Enter your ${language || 'code'} here...`}
          className="flex-1 bg-transparent text-slate-100 p-4 font-mono text-sm resize-none focus:outline-none leading-6 overflow-auto max-h-[400px]"
          spellCheck={false}
          style={{ minHeight: '200px', maxHeight: '400px' }}
        />
      </div>
    </div>
  );
};

const PlagiarismResults = ({ prediction, label, confidence, probabilities, inputLength }) => {
  const isOriginal = prediction === 0 || label === 'HUMAN_GENERATED';
  const predictionText = isOriginal ? 'Likely Human-Written' : 'Likely AI-Generated';
  const predictionIcon = isOriginal ? '✓' : '⚠';
  const predictionColor = isOriginal ? 'text-green-400' : 'text-red-400';
  const bgColor = isOriginal ? 'bg-green-500/20' : 'bg-red-500/20';
  const confidencePercentage = (confidence * 100).toFixed(2);

  return (
    <div className="flex-1 flex flex-col h-full text-white animate-fade-in">
      <div className="flex flex-col items-center justify-center p-8">
        <div className={`px-6 py-3 rounded-full text-sm font-medium mb-6 ${bgColor} ${predictionColor} flex items-center gap-2`}>
          <span className="text-lg">{predictionIcon}</span>
          {predictionText}
        </div>
        <div className="bg-slate-700/30 rounded-xl p-6 w-full mb-4 text-center">
          <span className="text-slate-300 block mb-2">Confidence Score</span>
          <span className="text-cyan-400 text-3xl font-bold">{confidencePercentage}%</span>
        </div>
        {probabilities && (
          <div className="bg-slate-700/30 rounded-xl p-6 w-full mb-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Human-Written:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 transition-all duration-1000" style={{ width: `${(probabilities.HUMAN_GENERATED * 100).toFixed(2)}%` }}></div>
                </div>
                <span className="text-green-400 font-semibold w-16 text-right">{(probabilities.HUMAN_GENERATED * 100).toFixed(2)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">AI-Generated:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 transition-all duration-1000" style={{ width: `${(probabilities.MACHINE_GENERATED * 100).toFixed(2)}%` }}></div>
                </div>
                <span className="text-red-400 font-semibold w-16 text-right">{(probabilities.MACHINE_GENERATED * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}
        <div className="bg-slate-700/30 rounded-xl p-4 w-full text-sm">
          <h4 className="text-slate-200 font-medium mb-2">Analysis Details</h4>
          <div className="text-slate-400 space-y-1">
            <div>Characters analyzed: {inputLength || 'N/A'}</div>
            <div>Model: AI Detection System</div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---
export default function AIPlagiarismChecker() {
  // Step 1: Initialize the real useNavigate hook
  const navigate = useNavigate();

  const [language, setLanguage] = useState("");
  const [codeInput, setCodeInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  
  const SUPPORTED_LANGUAGES = ["C++", "C", "Java", "Python", "JavaScript"];

  const handleCheckPlagiarism = async () => {
    if (!codeInput.trim() || !language) return;

    setIsChecking(true);
    setResults(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", new Blob([codeInput], { type: "text/plain" }), "code.js");
      formData.append("language", language.toLowerCase());

      const response = await fetch("https://backendgenreal-product-service.onrender.com/api/plagiarism/check", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      setResults({
        prediction: data.prediction,
        label: data.label,
        confidence: data.confidence,
        probabilities: data.probabilities,
        inputLength: data.input_length
      });
      
      setShowFeedbackPopup(true);
    } catch (err) {
      console.error('Error checking code:', err);
      setError('Failed to analyze code. Please check if the server is running and try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    setCodeInput("");
    setLanguage("");
    setResults(null);
    setError(null);
    setIsChecking(false);
    setShowFeedbackPopup(false);
  };

  const handleMainButtonAction = () => {
    results ? handleReset() : handleCheckPlagiarism();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <img src="/logoGenReal.png" alt="Logo" className="w-10 h-10 object-contain" />
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Code Plagiarism
                </h1>
            </button>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/deepfake-detection')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                    <span className="hidden sm:inline">Try Deepfake Detection</span>
                    <span className="sm:hidden">Deepfake</span>
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                    <span className="hidden sm:inline">Home</span>
                </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-start justify-center min-h-[calc(100vh-80px)] p-4 sm:p-6">
        <div className="relative z-10 w-full max-w-7xl">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-600/30 shadow-2xl">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Panel - Input */}
              <div className="w-full lg:w-3/5 p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50">
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">Select Programming Language:</h3>
                    <div className="flex flex-wrap gap-3">
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center gap-2 ${
                            language === lang
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          {lang === 'C++' && '⚡'} {lang === 'C' && '🔧'} {lang === 'Java' && '☕'} {lang === 'Python' && '🐍'} {lang === 'JavaScript' && '🟨'}
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col max-h-[500px]">
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">Enter Your Code:</h3>
                    <div className="flex-1 max-h-[400px]">
                      <CodeEditor
                        language={language}
                        value={codeInput}
                        onChange={setCodeInput}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleMainButtonAction}
                      disabled={!codeInput.trim() || isChecking || !language}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isChecking ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Analyzing Code...
                        </>
                      ) : results ? (
                        <>🔄 Analyze New Code</>
                      ) : (
                        <>🚀 Check for AI Generation</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel - Results */}
              <div className="w-full lg:w-2/5 p-6">
                  <div className="h-full flex flex-col">
                      <h3 className="text-xl font-semibold text-slate-200 mb-6">Analysis Results</h3>
                      <div className="flex-1 flex items-center justify-center">
                          <AnimatePresence mode="wait">
                              {!codeInput.trim() && !isChecking && !results && !error && (
                                  <motion.div 
                                  key="empty"
                                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                  className="text-center text-slate-400 py-12"
                                  >
                                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-700/30 flex items-center justify-center text-4xl">💻</div>
                                      <p className="text-lg mb-2">Ready to analyze</p>
                                      <p className="text-sm">Select a language and paste your code</p>
                                  </motion.div>
                              )}
                              
                              {isChecking && (
                                  <motion.div 
                                  key="loading"
                                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                  className="text-center py-12"
                                  >
                                      <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-slate-700 border-t-cyan-400 animate-spin"></div>
                                      <p className="text-cyan-400 font-medium">Analyzing code with AI...</p>
                                      <p className="text-slate-500 text-sm mt-2">This may take a few moments</p>
                                  </motion.div>
                              )}

                              {error && (
                                  <motion.div 
                                  key="error"
                                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                  className="text-center py-12"
                                  >
                                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-2xl">⚠</div>
                                      <p className="text-red-400 font-medium mb-2">Analysis Failed</p>
                                      <p className="text-slate-400 text-sm">{error}</p>
                                  </motion.div>
                              )}
                              
                              {results && !isChecking && (
                                  <motion.div 
                                  key="results"
                                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                  className="w-full"
                                  >
                                      <PlagiarismResults {...results} />
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <div className="fixed bottom-6 right-6 bg-slate-800 border border-slate-700 shadow-xl rounded-xl p-4 w-72 z-40">
            <button onClick={() => setShowFeedbackPopup(false)} className="absolute top-2 right-2 text-slate-400 hover:text-white"> × </button>
            <h3 className="text-white font-semibold mb-2">Give us your Feedback</h3>
            <p className="text-slate-400 text-sm mb-4">Help us improve by sharing your thoughts on the results.</p>
            <button
                onClick={() => { setShowFeedbackPopup(false); setIsFeedbackFormOpen(true); }}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium"
            >
                Share Feedback
            </button>
        </div>
      )}

      {/* Fullscreen Feedback Form */}
      <FeedbackForm
        isOpen={isFeedbackFormOpen}
        onClose={() => {setIsFeedbackFormOpen(false);setShowFeedbackPopup(true)}}
      />
    </div>
  );
}