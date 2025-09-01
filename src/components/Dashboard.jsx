import React, { useState, useEffect } from "react";
import {
  Shield,
  FileSearch,
  Play,
  Code,
  Key,
  Plus,
  Settings,
  BarChart3,
  Book,
  DollarSign,
  Copy,
  Eye,
  EyeOff,
  Activity,
  Zap,
  Globe,
  Users,
  User,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showApiKey, setShowApiKey] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "VideoGuard App",
      type: "Deepfake Detection",
      apiKey: "sk-proj-abc123def456...",
      requests: 12847,
      status: "active",
      created: "2024-08-15",
    },
    {
      id: 2,
      name: "EduCheck Platform",
      type: "Plagiarism Detection",
      apiKey: "sk-proj-xyz789ghi012...",
      requests: 8965,
      status: "active",
      created: "2024-07-22",
    },
    {
      id: 3,
      name: "Media Verification",
      type: "Combined Services",
      apiKey: "sk-proj-mno345pqr678...",
      requests: 5234,
      status: "paused",
      created: "2024-06-10",
    },
  ]);

  const [usage, setUsage] = useState({
    totalRequests: 26046,
    thisMonth: 8945,
    successRate: 99.7,
    avgResponseTime: 240,
  });

  const modelPricing = [
    {
      name: "Deepfake Detection",
      model: "deepfake-v2.1",
      pricing: {
        tier1: { limit: "0-1K requests", price: "$0.05", unit: "per request" },
        tier2: { limit: "1K-10K requests", price: "$0.03", unit: "per request" },
        tier3: { limit: "10K+ requests", price: "$0.02", unit: "per request" },
      },
      features: ["Video Analysis", "Image Detection", "Real-time Processing"],
    },
    {
      name: "Plagiarism Detection",
      model: "plagiarism-v1.8",
      pricing: {
        tier1: { limit: "0-500 requests", price: "$0.08", unit: "per request" },
        tier2: { limit: "500-5K requests", price: "$0.05", unit: "per request" },
        tier3: { limit: "5K+ requests", price: "$0.03", unit: "per request" },
      },
      features: ["AI Content Detection", "Source Matching", "Citation Analysis"],
    },
  ];

  const toggleApiKeyVisibility = (projectId) => {
    setShowApiKey(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`group flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        isActive
          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/20"
          : "text-gray-400 hover:text-gray-300 hover:bg-slate-800/60 hover:border-slate-600/50 border border-transparent"
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:rotate-6'}`} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.5); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Compact Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center animate-glow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                  AI Detection API
                </h1>
              </div>
            </div>

            {/* User Profile & Status */}
            <div className="flex items-center gap-4">
              {/* API Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Operational</span>
              </div>

              {/* Notifications */}
              <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-300 hover:scale-110 relative group">
                <Bell className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-300 hover:scale-105 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium">Alex Chen</div>
                    <div className="text-xs text-slate-400">Developer</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700/50 transition-colors flex items-center gap-3">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700/50 transition-colors flex items-center gap-3 text-red-400">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton id="overview" label="Overview" icon={BarChart3} isActive={activeTab === "overview"} onClick={setActiveTab} />
          <TabButton id="projects" label="Projects" icon={Code} isActive={activeTab === "projects"} onClick={setActiveTab} />
          <TabButton id="pricing" label="Pricing" icon={DollarSign} isActive={activeTab === "pricing"} onClick={setActiveTab} />
          <TabButton id="docs" label="Documentation" icon={Book} isActive={activeTab === "docs"} onClick={setActiveTab} />
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Usage Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Requests", value: usage.totalRequests.toLocaleString(), color: "cyan", icon: Activity },
                  { label: "This Month", value: usage.thisMonth.toLocaleString(), color: "blue", icon: Zap },
                  { label: "Success Rate", value: `${usage.successRate}%`, color: "green", icon: Shield },
                  { label: "Avg Response", value: `${usage.avgResponseTime}ms`, color: "purple", icon: Globe },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 card-hover group">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                        <stat.icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 card-hover">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  Recent API Calls
                </h3>
                <div className="space-y-3">
                  {[
                    { project: "VideoGuard App", endpoint: "/v1/deepfake/detect", status: "success", time: "2m ago" },
                    { project: "EduCheck Platform", endpoint: "/v1/plagiarism/check", status: "success", time: "5m ago" },
                    { project: "Media Verification", endpoint: "/v1/deepfake/batch", status: "error", time: "12m ago" },
                  ].map((call, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] group">
                      <div>
                        <div className="text-sm text-white font-medium group-hover:text-cyan-300 transition-colors">{call.project}</div>
                        <div className="text-xs text-slate-400 font-mono">{call.endpoint}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                          call.status === 'success' 
                            ? 'text-green-400 bg-green-400/10 border border-green-400/30' 
                            : 'text-red-400 bg-red-400/10 border border-red-400/30'
                        }`}>
                          {call.status}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{call.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 card-hover animate-float">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-4 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/30 rounded-lg hover:from-cyan-600/50 hover:to-blue-600/50 transition-all duration-300 flex items-center gap-3 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="text-sm font-medium">Create New Project</span>
                  </button>
                  <button className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/70 transition-all duration-300 flex items-center gap-3 hover:scale-105 group">
                    <Key className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm font-medium">Generate API Key</span>
                  </button>
                  <button className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/70 transition-all duration-300 flex items-center gap-3 hover:scale-105 group">
                    <Book className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium">View Documentation</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 card-hover">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  Usage & Billing
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-green-400">$127.43</div>
                    <div className="text-xs text-slate-400">Current Month</div>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all duration-1000 hover:shadow-lg hover:shadow-green-500/30" 
                         style={{ width: '68%', animation: 'pulse 2s infinite' }}></div>
                  </div>
                  <div className="text-xs text-slate-400">
                    68% of monthly budget used
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Projects</h2>
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/30 rounded-xl hover:from-cyan-600/50 hover:to-blue-600/50 transition-all duration-300 flex items-center gap-3 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                New Project
              </button>
            </div>

            <div className="grid gap-6">
              {projects.map((project, index) => (
                <div key={project.id} className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 card-hover transition-all duration-300`}
                     style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer">{project.name}</h3>
                        <span className={`px-3 py-1 text-xs rounded-full transition-all duration-300 hover:scale-110 ${
                          project.status === 'active' 
                            ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                            : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{project.type}</p>
                    </div>
                    <button className="p-3 hover:bg-slate-700/50 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-90 group">
                      <Settings className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-all duration-300 group">
                      <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">API Requests</div>
                      <div className="text-2xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">{project.requests.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-all duration-300">
                      <div className="text-sm text-slate-400">Created</div>
                      <div className="text-sm text-white">{new Date(project.created).toLocaleDateString()}</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-all duration-300">
                      <div className="text-sm text-slate-400">Last Activity</div>
                      <div className="text-sm text-white">2 minutes ago</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">API Key</div>
                        <div className="font-mono text-sm text-white">
                          {showApiKey[project.id] ? project.apiKey : "sk-proj-" + "•".repeat(20)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleApiKeyVisibility(project.id)}
                          className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 hover:scale-110 group"
                        >
                          {showApiKey[project.id] ? 
                            <EyeOff className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" /> : 
                            <Eye className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                          }
                        </button>
                        <button
                          onClick={() => copyToClipboard(project.apiKey)}
                          className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 hover:scale-110 group"
                        >
                          <Copy className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Model Pricing</h2>
              <p className="text-slate-400">Pay-per-use pricing with volume discounts</p>
            </div>

            <div className="grid gap-6">
              {modelPricing.map((model, index) => (
                <div key={index} className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 card-hover`}
                     style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                      {model.name.includes('Deepfake') ? 
                        <Shield className="w-7 h-7 text-cyan-400" /> : 
                        <FileSearch className="w-7 h-7 text-blue-400" />
                      }
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer">{model.name}</h3>
                      <p className="text-sm text-slate-400">Model: {model.model}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {Object.entries(model.pricing).map(([tier, info], i) => (
                      <div key={tier} className={`bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
                           style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="text-sm text-slate-400 mb-2 group-hover:text-slate-300 transition-colors">{info.limit}</div>
                        <div className="text-2xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">{info.price}</div>
                        <div className="text-xs text-slate-400">{info.unit}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {model.features.map((feature, i) => (
                      <span key={i} className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30 hover:bg-cyan-500/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                            style={{ animationDelay: `${i * 50}ms` }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === "docs" && (
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 card-hover">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <Code className="w-6 h-6 text-cyan-400" />
                    </div>
                    Quick Start Guide
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: "1. Get Your API Key", desc: "Create a project and copy your API key from the dashboard." },
                      { title: "2. Make Your First Request", desc: "Send a POST request to our endpoint with your file." },
                      { title: "3. Handle Response", desc: "Process the JSON response with detection results." },
                    ].map((step, i) => (
                      <div key={i} className={`bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:scale-[1.02] group`}
                           style={{ animationDelay: `${i * 150}ms` }}>
                        <h4 className="text-sm font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">{step.title}</h4>
                        <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{step.desc}</p>
                        {i === 1 && (
                          <div className="bg-black/50 rounded p-3 mt-3 hover:bg-black/70 transition-colors">
                            <code className="text-xs text-green-400 font-mono">
                              curl -X POST https://api.aidetection.com/v1/deepfake/detect \<br/>
                              &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br/>
                              &nbsp;&nbsp;-F "file=@video.mp4"
                            </code>
                          </div>
                        )}
                        {i === 2 && (
                          <div className="bg-black/50 rounded p-3 mt-3 hover:bg-black/70 transition-colors">
                            <code className="text-xs text-cyan-400 font-mono">
                              {`{
  "result": "authentic",
  "confidence": 89.5,
  "analysis_time": "240ms"
}`}
                            </code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 card-hover animate-float">
                  <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
                  <div className="space-y-3">
                    {[
                      { method: "POST", endpoint: "/v1/deepfake/detect", desc: "Single file analysis" },
                      { method: "POST", endpoint: "/v1/deepfake/batch", desc: "Bulk processing" },
                      { method: "POST", endpoint: "/v1/plagiarism/check", desc: "Text analysis" },
                      { method: "GET", endpoint: "/v1/analysis/:id", desc: "Get analysis result" },
                    ].map((api, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] group`}
                           style={{ animationDelay: `${i * 100}ms` }}>
                        <span className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full font-mono group-hover:bg-cyan-500/30 transition-colors">
                          {api.method}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-mono text-white group-hover:text-cyan-300 transition-colors">{api.endpoint}</div>
                          <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{api.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 card-hover">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Code className="w-4 h-4 text-blue-400" />
                    </div>
                    SDKs & Libraries
                  </h3>
                  <div className="space-y-3">
                    {[
                      { lang: "Python", status: "Available", color: "green" },
                      { lang: "JavaScript", status: "Available", color: "green" },
                      { lang: "PHP", status: "Coming Soon", color: "yellow" },
                      { lang: "Go", status: "Coming Soon", color: "yellow" },
                    ].map((sdk, i) => (
                      <div key={i} className={`flex justify-between items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] group`}
                           style={{ animationDelay: `${i * 100}ms` }}>
                        <span className="text-sm text-white group-hover:text-cyan-300 transition-colors font-medium">{sdk.lang}</span>
                        <span className={`text-xs px-3 py-1 rounded-full transition-all duration-300 hover:scale-105 ${
                          sdk.color === 'green' 
                            ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                            : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                        }`}>
                          {sdk.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 card-hover">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Book className="w-4 h-4 text-purple-400" />
                    </div>
                    Resources
                  </h3>
                  <div className="space-y-3">
                    {[
                      { title: "API Reference", desc: "Complete endpoint documentation" },
                      { title: "Code Examples", desc: "Sample implementations" },
                      { title: "Rate Limits", desc: "Usage guidelines and limits" },
                      { title: "Webhooks", desc: "Real-time notifications" },
                    ].map((resource, i) => (
                      <button key={i} className={`w-full text-left p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] group`}
                              style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="text-sm text-white group-hover:text-cyan-300 transition-colors font-medium">{resource.title}</div>
                        <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{resource.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-cyan-400/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-purple-400/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Enhanced grid overlay with animation */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(6 182 212)" strokeWidth="0.5">
                  <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite"/>
                </path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Subtle moving lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0%" y1="20%" x2="100%" y2="25%" stroke="url(#lineGradient)" strokeWidth="1">
              <animateTransform attributeName="transform" type="translate" values="-100 0; 100 0; -100 0" dur="10s" repeatCount="indefinite"/>
            </line>
            <line x1="0%" y1="60%" x2="100%" y2="65%" stroke="url(#lineGradient)" strokeWidth="1">
              <animateTransform attributeName="transform" type="translate" values="100 0; -100 0; 100 0" dur="15s" repeatCount="indefinite"/>
            </line>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(6 182 212)" stopOpacity="0"/>
                <stop offset="50%" stopColor="rgb(6 182 212)" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="rgb(6 182 212)" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Click outside handler for user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;