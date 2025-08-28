import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinedDate: '2024-01-15',
    plan: 'Free'
  });
  
  const [credits, setCredits] = useState({
    total: 100,
    used: 25,
    remaining: 75
  });

  const [recentAnalyses, setRecentAnalyses] = useState([
    {
      id: 1,
      fileName: 'video_sample_01.mp4',
      type: 'Deepfake Detection',
      result: 'Authentic',
      confidence: 89.5,
      date: '2024-08-28',
      creditsUsed: 5
    },
    {
      id: 2,
      fileName: 'document_report.pdf',
      type: 'Plagiarism Detection',
      result: 'Minor Issues',
      confidence: 76.3,
      date: '2024-08-27',
      creditsUsed: 3
    },
    {
      id: 3,
      fileName: 'profile_image.jpg',
      type: 'Deepfake Detection',
      result: 'Suspicious',
      confidence: 92.1,
      date: '2024-08-26',
      creditsUsed: 2
    }
  ]);

  const [stats, setStats] = useState({
    totalAnalyses: 48,
    authenticContent: 35,
    suspiciousContent: 13,
    averageConfidence: 85.7
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const getResultColor = (result) => {
    switch (result.toLowerCase()) {
      case 'authentic': return 'text-green-400';
      case 'suspicious': return 'text-red-400';
      case 'minor issues': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getResultBg = (result) => {
    switch (result.toLowerCase()) {
      case 'authentic': return 'bg-green-400/10 border-green-400/20';
      case 'suspicious': return 'bg-red-400/10 border-red-400/20';
      case 'minor issues': return 'bg-yellow-400/10 border-yellow-400/20';
      default: return 'bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-400 mt-1">Welcome back, {user.name}</p>
            </div>
            <motion.button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Home
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Credits Section */}
            <motion.div variants={itemVariants} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Free Credits
                </h2>
                <span className="text-sm px-3 py-1 bg-green-400/20 text-green-400 rounded-full border border-green-400/30">
                  {user.plan} Plan
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{credits.total}</div>
                  <div className="text-sm text-slate-400">Total Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{credits.used}</div>
                  <div className="text-sm text-slate-400">Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{credits.remaining}</div>
                  <div className="text-sm text-slate-400">Remaining</div>
                </div>
              </div>

              <div className="w-full bg-slate-700/50 rounded-full h-3 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(credits.remaining / credits.total) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              <p className="text-sm text-slate-400">
                You have <span className="text-green-400 font-semibold">{credits.remaining} credits</span> remaining. 
                Each analysis costs 2-5 credits depending on file size and complexity.
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => navigate('/deepfake-detection')}
                  className="group p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Deepfake Detection</h3>
                      <p className="text-sm text-slate-400">Analyze videos & images</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => navigate('/plagiarism-detection')}
                  className="group p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg hover:border-green-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Plagiarism Detection</h3>
                      <p className="text-sm text-slate-400">Check text & documents</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Analyses */}
            <motion.div variants={itemVariants} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Recent Analyses
              </h2>
              
              <div className="space-y-4">
                {recentAnalyses.map((analysis, index) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-700/20 border border-slate-600/30 rounded-lg hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getResultBg(analysis.result)}`} />
                      <div>
                        <h4 className="font-medium text-white">{analysis.fileName}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{analysis.type}</span>
                          <span>•</span>
                          <span>{analysis.date}</span>
                          <span>•</span>
                          <span>{analysis.creditsUsed} credits</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${getResultColor(analysis.result)}`}>
                        {analysis.result}
                      </div>
                      <div className="text-sm text-slate-400">
                        {analysis.confidence}% confidence
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 text-sm border border-slate-600/30 rounded-lg hover:border-blue-400/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View All Analyses
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Account Info */}
            <motion.div variants={itemVariants} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Account Info
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Name</label>
                  <div className="text-white font-medium">{user.name}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Email</label>
                  <div className="text-white font-medium">{user.email}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Plan</label>
                  <div className="text-green-400 font-medium">{user.plan}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Member Since</label>
                  <div className="text-white font-medium">{new Date(user.joinedDate).toLocaleDateString()}</div>
                </div>
              </div>

              <motion.button
                className="w-full mt-6 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Upgrade Plan
              </motion.button>
            </motion.div>

            {/* Usage Statistics */}
            <motion.div variants={itemVariants} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Usage Stats
              </h2>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">{stats.totalAnalyses}</div>
                  <div className="text-sm text-slate-400">Total Analyses</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-green-400">{stats.authenticContent}</div>
                    <div className="text-xs text-slate-400">Authentic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-red-400">{stats.suspiciousContent}</div>
                    <div className="text-xs text-slate-400">Suspicious</div>
                  </div>
                </div>
                
                <div className="text-center pt-4 border-t border-slate-700/50">
                  <div className="text-lg font-semibold text-purple-400 mb-1">{stats.averageConfidence}%</div>
                  <div className="text-sm text-slate-400">Avg. Confidence</div>
                </div>
              </div>
            </motion.div>

            {/* API Access */}
            <motion.div variants={itemVariants} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="16 18 22 12 16 6" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="8 6 2 12 8 18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                API Access
              </h2>
              
              <p className="text-sm text-slate-400 mb-4">
                Integrate our detection capabilities into your applications.
              </p>
              
              <div className="space-y-3">
                <motion.button
                  className="w-full py-2 text-left px-3 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:bg-slate-700/50 transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📚 View Documentation
                </motion.button>
                <motion.button
                  className="w-full py-2 text-left px-3 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:bg-slate-700/50 transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔑 Generate API Key
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;