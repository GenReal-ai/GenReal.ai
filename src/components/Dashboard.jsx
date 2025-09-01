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
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showApiKey, setShowApiKey] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

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
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive
          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
          : "text-gray-400 hover:text-gray-300 hover:bg-slate-800/50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                AI Detection API
              </h1>
              <p className="text-slate-400 mt-1 text-sm">Developer Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-400">API Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton id="overview" label="Overview" icon={BarChart3} isActive={activeTab === "overview"} onClick={setActiveTab} />
          <TabButton id="projects" label="Projects" icon={Code} isActive={activeTab === "projects"} onClick={setActiveTab} />
          <TabButton id="pricing" label="Pricing" icon={DollarSign} isActive={activeTab === "pricing"} onClick={setActiveTab} />
          <TabButton id="docs" label="Documentation" icon={Book} isActive={activeTab === "docs"} onClick={setActiveTab} />
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Usage Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Requests", value: usage.totalRequests.toLocaleString(), color: "cyan", icon: Activity },
                  { label: "This Month", value: usage.thisMonth.toLocaleString(), color: "blue", icon: Zap },
                  { label: "Success Rate", value: `${usage.successRate}%`, color: "green", icon: Shield },
                  { label: "Avg Response", value: `${usage.avgResponseTime}ms`, color: "purple", icon: Globe },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-slate-400">{stat.label}</span>
                    </div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Recent API Calls
                </h3>
                <div className="space-y-3">
                  {[
                    { project: "VideoGuard App", endpoint: "/v1/deepfake/detect", status: "success", time: "2m ago" },
                    { project: "EduCheck Platform", endpoint: "/v1/plagiarism/check", status: "success", time: "5m ago" },
                    { project: "Media Verification", endpoint: "/v1/deepfake/batch", status: "error", time: "12m ago" },
                  ].map((call, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <div className="text-sm text-white font-medium">{call.project}</div>
                        <div className="text-xs text-slate-400">{call.endpoint}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium ${call.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                          {call.status}
                        </div>
                        <div className="text-xs text-slate-400">{call.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/30 rounded-lg hover:from-cyan-600/40 hover:to-blue-600/40 transition-all duration-300 flex items-center gap-3">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Create New Project</span>
                  </button>
                  <button className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/70 transition-all duration-300 flex items-center gap-3">
                    <Key className="w-4 h-4" />
                    <span className="text-sm">Generate API Key</span>
                  </button>
                  <button className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/70 transition-all duration-300 flex items-center gap-3">
                    <Book className="w-4 h-4" />
                    <span className="text-sm">View Documentation</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Usage & Billing
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400">$127.43</div>
                    <div className="text-xs text-slate-400">Current Month</div>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full" style={{ width: '68%' }}></div>
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
          <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Projects</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/30 rounded-lg hover:from-cyan-600/40 hover:to-blue-600/40 transition-all duration-300 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>

            <div className="grid gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'active' 
                            ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                            : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{project.type}</p>
                    </div>
                    <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-400">API Requests</div>
                      <div className="text-xl font-bold text-cyan-400">{project.requests.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Created</div>
                      <div className="text-sm text-white">{new Date(project.created).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Last Activity</div>
                      <div className="text-sm text-white">2 minutes ago</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
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
                          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          {showApiKey[project.id] ? 
                            <EyeOff className="w-4 h-4 text-slate-400" /> : 
                            <Eye className="w-4 h-4 text-slate-400" />
                          }
                        </button>
                        <button
                          onClick={() => copyToClipboard(project.apiKey)}
                          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-slate-400" />
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
          <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Model Pricing</h2>
              <p className="text-slate-400 text-sm">Pay-per-use pricing with volume discounts</p>
            </div>

            <div className="grid gap-6">
              {modelPricing.map((model, index) => (
                <div key={index} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {model.name.includes('Deepfake') ? 
                      <Shield className="w-6 h-6 text-cyan-400" /> : 
                      <FileSearch className="w-6 h-6 text-blue-400" />
                    }
                    <div>
                      <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                      <p className="text-sm text-slate-400">Model: {model.model}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    {Object.entries(model.pricing).map(([tier, info]) => (
                      <div key={tier} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                        <div className="text-sm text-slate-400 mb-1">{info.limit}</div>
                        <div className="text-xl font-bold text-cyan-400">{info.price}</div>
                        <div className="text-xs text-slate-400">{info.unit}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {model.features.map((feature, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
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
          <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    Quick Start Guide
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                      <h4 className="text-sm font-semibold text-white mb-2">1. Get Your API Key</h4>
                      <p className="text-xs text-slate-400">Create a project and copy your API key from the dashboard.</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                      <h4 className="text-sm font-semibold text-white mb-2">2. Make Your First Request</h4>
                      <div className="bg-black/50 rounded p-3 mt-2">
                        <code className="text-xs text-green-400 font-mono">
                          curl -X POST https://api.aidetection.com/v1/deepfake/detect \<br/>
                          &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br/>
                          &nbsp;&nbsp;-F "file=@video.mp4"
                        </code>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                      <h4 className="text-sm font-semibold text-white mb-2">3. Handle Response</h4>
                      <div className="bg-black/50 rounded p-3 mt-2">
                        <code className="text-xs text-cyan-400 font-mono">
                          {`{
  "result": "authentic",
  "confidence": 89.5,
  "analysis_time": 240ms
}`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
                  <div className="space-y-3">
                    {[
                      { method: "POST", endpoint: "/v1/deepfake/detect", desc: "Single file analysis" },
                      { method: "POST", endpoint: "/v1/deepfake/batch", desc: "Bulk processing" },
                      { method: "POST", endpoint: "/v1/plagiarism/check", desc: "Text analysis" },
                      { method: "GET", endpoint: "/v1/analysis/:id", desc: "Get analysis result" },
                    ].map((api, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded">
                        <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded font-mono">
                          {api.method}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-mono text-white">{api.endpoint}</div>
                          <div className="text-xs text-slate-400">{api.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">SDKs & Libraries</h3>
                  <div className="space-y-2">
                    {[
                      { lang: "Python", status: "Available" },
                      { lang: "JavaScript", status: "Available" },
                      { lang: "PHP", status: "Coming Soon" },
                      { lang: "Go", status: "Coming Soon" },
                    ].map((sdk, i) => (
                      <div key={i} className="flex justify-between items-center p-2">
                        <span className="text-sm text-white">{sdk.lang}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          sdk.status === 'Available' 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-yellow-400/20 text-yellow-400'
                        }`}>
                          {sdk.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(6 182 212)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;