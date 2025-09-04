import React, { useState, useEffect } from "react";
import {
  Shield,
  FileSearch,
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
  User,
  Bell,
  LogOut,
  ChevronDown,
  Trash2,
  RefreshCw,
  X, // For the close button in the dialog
} from "lucide-react";

// A custom, reusable dialog component for a consistent look and feel
const CustomDialog = ({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirm", confirmVariant = "primary" }) => {
  if (!isOpen) return null;

  const confirmButtonStyles = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={onClose}>
      <div 
        className="bg-slate-800/80 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 p-6 w-full max-w-md mx-4 animate-fade-in"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the dialog
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="text-slate-300 text-sm mb-6">
          {children}
        </div>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-medium">
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${confirmButtonStyles[confirmVariant]}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showApiKey, setShowApiKey] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [deletingProjects, setDeletingProjects] = useState(new Set());
  
  // State for managing the custom dialog
  const [dialogState, setDialogState] = useState({ isOpen: false, type: null, data: null });
  const [newProjectName, setNewProjectName] = useState("");

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
      pricing: { tier1: { limit: "0-1K requests", price: "$0.05" }, tier2: { limit: "1K-10K requests", price: "$0.03" }, tier3: { limit: "10K+ requests", price: "$0.02" } },
      features: ["Video Analysis", "Image Detection", "Real-time Processing"],
    },
    {
      name: "Plagiarism Detection",
      model: "plagiarism-v1.8",
      pricing: { tier1: { limit: "0-500 requests", price: "$0.08" }, tier2: { limit: "500-5K requests", price: "$0.05" }, tier3: { limit: "5K+ requests", price: "$0.03" } },
      features: ["AI Content Detection", "Source Matching", "Citation Analysis"],
    },
  ];

  const toggleApiKeyVisibility = (projectId) => setShowApiKey(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  // --- Logic for Handlers that are now decoupled from the UI ---
  
  const executeCreateProject = (projectName) => {
    if (projectName) {
      const newProject = {
        id: Date.now(),
        name: projectName,
        type: "Unspecified Service",
        apiKey: `sk-proj-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}...`,
        requests: 0,
        status: "active",
        created: new Date().toISOString().split('T')[0],
      };
      setProjects(prevProjects => [...prevProjects, newProject]);
      setActiveTab("projects");
    }
  };
  
  const executeDeleteProject = (projectId) => {
    setDeletingProjects(prev => new Set(prev).add(projectId));
    setTimeout(() => {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setDeletingProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }, 500);
  };

  const executeRegenerateApiKey = (projectId) => {
    setProjects(projects => projects.map(p => 
      p.id === projectId 
        ? { ...p, apiKey: `sk-proj-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}...` } 
        : p
    ));
  };
  
  // --- Dialog confirm/close handlers ---

  const handleDialogConfirm = () => {
    const { type, data } = dialogState;
    if (type === 'create') {
      executeCreateProject(newProjectName);
    }
    if (type === 'delete') {
      executeDeleteProject(data.id);
    }
    if (type === 'regenerate') {
      executeRegenerateApiKey(data.id);
    }
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setDialogState({ isOpen: false, type: null, data: null });
    setNewProjectName("");
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button onClick={() => onClick(id)} className={`group flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${isActive ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/20" : "text-gray-400 hover:text-gray-300 hover:bg-slate-800/60 hover:border-slate-600/50 border border-transparent"}`}>
      <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:rotate-6'}`} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <style jsx>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.5); }
        }
        @keyframes project-fade-out {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-project-fade-out { animation: project-fade-out 0.5s ease-out forwards; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          border-color: rgba(56, 189, 248, 0.3);
          background-color: rgba(30, 41, 59, 0.6);
        }
      `}</style>

      {/* Compact Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo - UPDATED to be a clickable link */}
            <a href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 rounded-lg p-1 -ml-1">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center animate-glow group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                  AI Detection API
                </h1>
              </div>
            </a>

            {/* User Profile & Status */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span className="text-green-400 text-sm font-medium">Operational</span></div>
              <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-300 hover:scale-110 relative group"><Bell className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" /><div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div></button>
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-300 hover:scale-105 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                  <div className="hidden sm:block text-left"><div className="text-sm font-medium">Alex Chen</div><div className="text-xs text-slate-400">Developer</div></div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (<div className="absolute right-0 top-full mt-2 w-48 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl py-2 z-50"><button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700/50 transition-colors flex items-center gap-3"><Settings className="w-4 h-4" />Settings</button><button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700/50 transition-colors flex items-center gap-3 text-red-400"><LogOut className="w-4 h-4" />Sign Out</button></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton id="overview" label="Overview" icon={BarChart3} isActive={activeTab === "overview"} onClick={setActiveTab} />
          <TabButton id="projects" label="Projects" icon={Code} isActive={activeTab === "projects"} onClick={setActiveTab} />
          <TabButton id="pricing" label="Pricing" icon={DollarSign} isActive={activeTab === "pricing"} onClick={setActiveTab} />
          <TabButton id="docs" label="Documentation" icon={Book} isActive={activeTab === "docs"} onClick={setActiveTab} />
        </div>
        
        {/* Render active tab content here... */}
        {activeTab === 'overview' && (
            <div> {/* Placeholder for Overview Tab Content */}</div>
        )}
        {activeTab === 'projects' && (
             <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Your Projects</h2>
                  <button onClick={() => { setNewProjectName("My New App"); setDialogState({ isOpen: true, type: 'create' }); }} className="px-6 py-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/30 rounded-xl hover:from-cyan-600/50 hover:to-blue-600/50 transition-all duration-300 flex items-center gap-3 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> New Project
                  </button>
                </div>
                <div className="grid gap-6">
                  {projects.map((project, index) => (
                    <div key={project.id} className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 transition-all duration-300 card-hover ${deletingProjects.has(project.id) ? 'animate-project-fade-out' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2"><h3 className="text-xl font-semibold text-white">{project.name}</h3><span className={`px-3 py-1 text-xs rounded-full ${project.status === 'active' ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'}`}>{project.status}</span></div>
                          <p className="text-sm text-slate-400">{project.type}</p>
                        </div>
                        <div className="flex items-center">
                          <button className="p-3 hover:bg-slate-700/50 rounded-lg transition-all duration-300 group"><Settings className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" /></button>
                          <button onClick={() => setDialogState({ isOpen: true, type: 'delete', data: { id: project.id, name: project.name } })} className="p-3 hover:bg-red-500/20 rounded-lg transition-all duration-300 group ml-2" title="Delete Project"><Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-400" /></button>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-slate-400 mb-1">API Key</div>
                            <div className="font-mono text-sm text-white">{showApiKey[project.id] ? project.apiKey : "sk-proj-" + "•".repeat(20)}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setDialogState({ isOpen: true, type: 'regenerate', data: { id: project.id, name: project.name } })} className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 group" title="Regenerate Key"><RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" /></button>
                            <button onClick={() => toggleApiKeyVisibility(project.id)} className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 group" title={showApiKey[project.id] ? "Hide Key" : "Show Key"}>{showApiKey[project.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                            <button onClick={() => copyToClipboard(project.apiKey)} className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 group" title="Copy Key"><Copy className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
        )}
        {/* Other tabs can be added here */}
      </div>

      {/* --- DIALOG RENDERING --- */}
      <CustomDialog
        isOpen={dialogState.isOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        title={
          dialogState.type === 'create' ? "Create New Project" :
          dialogState.type === 'delete' ? "Delete Project" :
          dialogState.type === 'regenerate' ? "Regenerate API Key" : ""
        }
        confirmText={
          dialogState.type === 'create' ? "Create" :
          dialogState.type === 'delete' ? "Delete" :
          dialogState.type === 'regenerate' ? "Regenerate" : ""
        }
        confirmVariant={dialogState.type === 'delete' ? 'danger' : 'primary'}
      >
        {dialogState.type === 'create' && (
          <div>
            <p className="mb-4">Enter a name for your new project.</p>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              autoFocus
            />
          </div>
        )}
        {dialogState.type === 'delete' && (
          <p>Are you sure you want to permanently delete the project <strong className="text-cyan-400">{dialogState.data?.name}</strong>? This action cannot be undone.</p>
        )}
        {dialogState.type === 'regenerate' && (
          <p>Are you sure you want to regenerate the API key for <strong className="text-cyan-400">{dialogState.data?.name}</strong>? The old key will be invalidated immediately.</p>
        )}
      </CustomDialog>
    </div>
  );
};

export default Dashboard;