import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";

// Monaco Editor component with improved loading - LOGIC UNCHANGED
const MonacoCodeEditor = ({ language, value, onChange, onToggleFullscreen, isFullscreen }) => {
  const containerRef = useRef(null);
  const monacoInstance = useRef(null);
  const [isEditorLoading, setIsEditorLoading] = useState(true);

  useEffect(() => {
    // Function to initialize the editor
    function initializeEditor() {
      if (typeof window.require === 'undefined') {
        setTimeout(initializeEditor, 100); // Retry if loader is not ready
        return;
      }
      window.require.config({ 
        paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' } 
      });
      
      window.require(['vs/editor/editor.main'], () => {
        if (containerRef.current && !monacoInstance.current) {
          const languageMap = {
            'C++': 'cpp', 'C': 'c', 'Java': 'java', 'Python': 'python', 'JavaScript': 'javascript'
          };
          monacoInstance.current = window.monaco.editor.create(containerRef.current, {
            value: value || '',
            language: languageMap[language] || 'javascript',
            theme: 'vs-dark',
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          });

          monacoInstance.current.onDidChangeModelContent(() => {
            onChange(monacoInstance.current.getValue());
          });
          
          setIsEditorLoading(false); // Editor is ready
        }
      });
    }

    // Load the Monaco script
    if (!window.monaco) {
      if (!document.getElementById('monaco-loader-script')) {
        const script = document.createElement('script');
        script.id = 'monaco-loader-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.min.js';
        script.onload = initializeEditor;
        document.head.appendChild(script);
      }
    } else {
      initializeEditor();
    }

    return () => {
      if (monacoInstance.current) {
        monacoInstance.current.dispose();
        monacoInstance.current = null;
      }
    };
  }, []); // Runs only once

  // Update language when it changes
  useEffect(() => {
    if (monacoInstance.current && language) {
      const languageMap = {
        'C++': 'cpp', 'C': 'c', 'Java': 'java', 'Python': 'python', 'JavaScript': 'javascript'
      };
      const model = monacoInstance.current.getModel();
      if (model) {
        window.monaco.editor.setModelLanguage(model, languageMap[language] || 'javascript');
      }
    }
  }, [language]);

  // Update value when it changes from props
  useEffect(() => {
    if (monacoInstance.current && value !== monacoInstance.current.getValue()) {
      monacoInstance.current.setValue(value || '');
    }
  }, [value]);

  const FullscreenIcon = ({ isFullscreen }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {isFullscreen ? (
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
      ) : (
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      )}
    </svg>
  );

  return (
    <div className={`flex flex-col bg-slate-900 rounded-xl border border-cyan-400/20 overflow-hidden shadow-2xl ${
      isFullscreen ? 'fixed inset-4 z-50' : 'h-full'
    }`}>
      {/* Header is now always visible */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-cyan-400/20">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-cyan-300 font-medium">
            {language ? `${language} Editor` : 'Code Editor'}
          </span>
        </div>
        <button 
          onClick={onToggleFullscreen} 
          className="text-slate-400 hover:text-cyan-300 transition-colors p-2 rounded-lg hover:bg-slate-700/50"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <FullscreenIcon isFullscreen={isFullscreen} />
        </button>
      </div>
      
      {/* Editor container with loading overlay */}
      <div className="relative flex-1 min-h-0">
        {isEditorLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
            <p className="text-slate-400 animate-pulse">Loading Editor...</p>
          </div>
        )}
        <div 
          ref={containerRef}
          className="w-full h-full"
          style={{ visibility: isEditorLoading ? 'hidden' : 'visible' }}
        />
      </div>
    </div>
  );
};

// Feedback Form Component - LOGIC UNCHANGED
const FeedbackForm = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
  
    const handleSubmit = () => {
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-slate-800/95 backdrop-blur-sm border border-cyan-400/20 rounded-2xl w-full max-w-lg shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-slate-400 hover:text-cyan-300 transition-colors text-2xl"
            >
              ×
            </button>
            
            {isSubmitted ? (
              <div className="p-6 text-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-green-400 text-4xl mx-auto mb-3 w-12 h-12 flex items-center justify-center bg-green-400/10 rounded-full"
                >
                  ✓
                </motion.div>
                <h2 className="text-xl font-bold text-white">Thank You!</h2>
                <p className="text-slate-400 mt-2">Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <div className="p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  Share Your Feedback
                </h2>
                <p className="text-slate-400 mb-4">How accurate were the results?</p>
                
                <div className="mb-4">
                  <div className="block text-slate-300 mb-2 text-sm font-medium">Your Rating</div>
                  <div className="flex items-center gap-1 text-2xl text-slate-500">
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
                
                <div className="mb-4">
                  <div className="block text-slate-300 mb-2 text-sm font-medium">
                    Comments (Optional)
                  </div>
                  <textarea
                    value={feedbackText} 
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us more about your experience..."
                    className="w-full h-20 bg-slate-700/50 border border-cyan-400/20 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors text-sm"
                  />
                </div>
                
                <button
                  onClick={handleSubmit}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  disabled={rating === 0}
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

// Results Component - LOGIC UNCHANGED
const PlagiarismResults = ({ prediction, label, confidence, probabilities, inputLength }) => {
    const isOriginal = prediction === 0 || label === 'HUMAN_GENERATED';
    const predictionText = isOriginal ? 'Likely Human-Written' : 'Likely AI-Generated';
    const predictionIcon = isOriginal ? '✓' : '⚠';
    const predictionColor = isOriginal ? 'text-green-400' : 'text-red-400';
    const bgColor = isOriginal ? 'bg-green-400/20' : 'bg-red-400/20';
    const confidencePercentage = (confidence * 100).toFixed(2);
  
    return (
      <div className="flex-1 flex flex-col h-full text-white p-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`px-4 py-3 rounded-2xl text-sm font-semibold ${bgColor} ${predictionColor} flex items-center gap-3 border border-current/20`}>
            <span className="text-lg">{predictionIcon}</span>
            {predictionText}
          </div>
          
          <div className="bg-slate-800/60 border border-cyan-400/10 rounded-xl p-4 w-full text-center">
            <span className="text-slate-300 block mb-2 text-sm font-medium">Confidence Score</span>
            <span className="text-cyan-400 text-2xl font-bold">{confidencePercentage}%</span>
          </div>
          
          {probabilities && (
            <div className="bg-slate-800/60 border border-cyan-400/10 rounded-xl p-4 w-full space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm font-medium">Human-Written:</span>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-cyan-500 transition-all duration-1000" 
                      style={{ width: `${(probabilities.HUMAN_GENERATED * 100).toFixed(2)}%` }}
                    />
                  </div>
                  <span className="text-green-400 font-bold text-sm w-12 text-right">
                    {(probabilities.HUMAN_GENERATED * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm font-medium">AI-Generated:</span>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-400 to-orange-500 transition-all duration-1000" 
                      style={{ width: `${(probabilities.MACHINE_GENERATED * 100).toFixed(2)}%` }}
                    />
                  </div>
                  <span className="text-red-400 font-bold text-sm w-12 text-right">
                    {(probabilities.MACHINE_GENERATED * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-slate-800/60 border border-cyan-400/10 rounded-xl p-4 w-full">
            <h4 className="text-slate-200 font-semibold mb-3 text-sm">Analysis Details</h4>
            <div className="text-slate-400 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Characters:</span>
                <span className="text-cyan-400">{inputLength || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="text-cyan-400">AI Detection System</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
// Main Component - LOGIC UNCHANGED
export default function AIPlagiarismChecker() {
    const [language, setLanguage] = useState("Python");
    const [codeInput, setCodeInput] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
    const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
    const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  
    const SUPPORTED_LANGUAGES = ["Python", "JavaScript", "Java", "C++", "C"];
    
    // Simplified Templates
    const languageTemplates = {
        "Python": `print("Hello, World!")`,
        "JavaScript": `console.log("Hello, World!");`,
        "Java": `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
        "C++": `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}`,
        "C": `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`
    };

    useEffect(() => {
        if (language && languageTemplates[language]) {
            setCodeInput(languageTemplates[language]);
        }
    }, [language]);

    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        setResults(null); 
        setError(null);
    };

    const handleCheckPlagiarism = async () => {
      if (!codeInput.trim() || !language) return;
      setIsChecking(true);
      setResults(null);
      setError(null);
      
      try {
        const formData = new FormData();
        formData.append("file", new Blob([codeInput], { type: "text/plain" }), "code.js");
        formData.append("language", language.toLowerCase());

        const apiUrl = import.meta.env.VITE_PRODUCT_API_URL;
        
        const response = await fetch(`${apiUrl}/api/plagiarism/check`, {
          method: "POST",
          body: formData,
        });

        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        setResults({
          prediction: data.prediction,
          label: data.label,
          confidence: data.confidence,
          probabilities: data.probabilities,
          inputLength: data.input_length || codeInput.length
        });
        
        setShowFeedbackPopup(true);
      } catch (err) {
        console.error('Error checking code:', err);
        setError('Failed to analyze code. Please check the server and try again.');
      } finally {
        setIsChecking(false);
      }
    };
  
    const handleReset = () => {
      setResults(null);
      setError(null);
      setIsChecking(false);
      setShowFeedbackPopup(false);
      setCodeInput(languageTemplates[language] || '');
    };
  
    const handleMainButtonAction = () => {
      results ? handleReset() : handleCheckPlagiarism();
    };
  
    return (
      <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-cyan-400/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <img 
                src="/logoGenReal.png" 
                alt="Logo" 
                className="h-10 object-contain" 
              />
              <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Code Plagiarism
              </h1>
            </a>
            <a
              href="/deepfake-detection"
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-400/20 rounded-lg text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-all"
            >
              Try Deepfake Detection
            </a>
          </div>
        </header>



        {/* Main Content Wrapper */}
        <main className="relative z-10 p-4 flex items-center justify-center" style={{ height: 'calc(100vh - 65px)' }}>
            <div className="w-full max-w-7xl bg-slate-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-cyan-400/20 shadow-2xl" style={{ height: '80vh' }}>
                <div className="flex h-full">
                    {/* Editor Panel */}
                    <div className={`transition-all duration-300 ease-in-out ${isEditorFullscreen ? 'w-full' : 'w-full lg:w-3/5'} flex flex-col`}>
                        <div className="bg-slate-800/60 border-b border-cyan-400/20 p-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-sm font-medium text-slate-300">Language:</span>
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageSelect(lang)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                                        language === lang
                                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                                            : "bg-slate-700/50 border border-cyan-400/20 text-slate-300 hover:bg-slate-600/50 hover:text-cyan-300"
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex-1 p-4 lg:p-6 min-h-0">
                            <MonacoCodeEditor
                                language={language}
                                value={codeInput}
                                onChange={setCodeInput}
                                isFullscreen={isEditorFullscreen}
                                onToggleFullscreen={() => setIsEditorFullscreen(!isEditorFullscreen)}
                            />
                        </div>
                        
                        <div className="bg-slate-800/60 border-t border-cyan-400/20 p-4">
                            <button
                                onClick={handleMainButtonAction}
                                disabled={!codeInput.trim() || isChecking || !language}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-3"
                            >
                                {isChecking ? (
                                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Analyzing Code...</>
                                ) : results ? (
                                    <><span>🔄</span> Try another </>
                                ) : (
                                    <><span>🚀</span> Analyse </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Panel */}
                    {!isEditorFullscreen && (
                        <div className="hidden lg:flex w-2/5 bg-slate-900/50 border-l border-cyan-400/20 flex-col">
                            <div className="bg-slate-800/60 border-b border-cyan-400/20 p-4">
                                <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                                    <span></span> Analysis Results
                                </h3>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    {!results && !isChecking && !error && (
                                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-slate-400 p-8">
                                            <div className="text-5xl mb-4 opacity-50">🔍</div>
                                            <p className="font-medium mb-2">Ready to Analyze</p>
                                            <p className="text-sm">Your results will appear here.</p>
                                        </motion.div>
                                    )}
                                    {isChecking && (
                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-cyan-400 p-8">
                                            <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-slate-700 border-t-cyan-400 animate-spin"></div>
                                            <p className="font-medium">Analyzing...</p>
                                        </motion.div>
                                    )}
                                    {error && (
                                        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-red-400 p-8">
                                            <div className="text-5xl mb-4">❌</div>
                                            <p className="font-semibold mb-2">Analysis Failed</p>
                                            <p className="text-slate-400 text-sm">{error}</p>
                                        </motion.div>
                                    )}
                                    {results && !isChecking && (
                                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                                            <PlagiarismResults {...results} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
        
        <FeedbackForm
          isOpen={isFeedbackFormOpen}
          onClose={() => setIsFeedbackFormOpen(false)}
        />
      </div>
    );
  }

