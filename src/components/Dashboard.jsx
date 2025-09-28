import React, { useState, useEffect, createContext, useContext } from 'react';
import { Shield, Plus, Trash2, Eye, EyeOff, RefreshCw, X, ChevronLeft, BookText, CreditCard, User, Settings, Copy, Key, Server, ChevronsRight, LogOut } from 'lucide-react';
import { AuthUtils } from "./utils/authUtils"; 

// --- 1. CREATE AUTH CONTEXT ---
const AuthContext = createContext(null);

// --- HELPER FUNCTIONS ---
const generateApiKey = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 32;
  let result = 'g-'; // Updated prefix as requested
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// --- 2. CREATE AUTH PROVIDER COMPONENT ---
// This component now simulates an already authenticated user, as requested.
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Replace hardcoded mock with your util
      const storedUser = AuthUtils.getUser();  
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    }, []);


    const logout = () => {
      AuthUtils.logout(); // clears localStorage
      setUser(null);
      setIsAuthenticated(false);
    };


    const authContextValue = {
        user,
        isAuthenticated,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// --- 3. CREATE A CUSTOM HOOK FOR EASY ACCESS ---
const useAuth = () => {
    return useContext(AuthContext);
};


// --- UI COMPONENTS ---

const Dialog = ({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirm", confirmVariant = "cyan" }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const confirmColors = {
    cyan: "bg-cyan-600 hover:bg-cyan-500",
    red: "bg-red-600 hover:bg-red-500",
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700/50 rounded-xl p-6 w-full max-w-md shadow-2xl shadow-cyan-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-gray-300 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${confirmColors[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ view, setView }) => {
  const { user, logout } = useAuth(); // Correctly uses the context

  const navItems = [
    { id: 'dashboard', icon: Server, label: 'Projects' },
    { id: 'documentation', icon: BookText, label: 'API Docs' },
    { id: 'billing', icon: CreditCard, label: 'Credits' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-[#0a0f1c] border-r border-gray-800/50 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#0a0f1c] rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src="logoGenReal.png" 
              alt="logoGenReal" 
              className="w-full h-full object-cover"
            />
          </div>

        <h1 className="text-xl font-bold text-white">GenRealAI</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === item.id 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
      {user && ( // User details will display correctly
          <div className="mt-auto">
            <div className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800/50 rounded-lg">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-400"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors" title="Log Out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
      )}
    </div>
  );
};

// --- PAGE VIEWS ---

const ProjectsView = ({ projects, setProjects }) => {
  const [showApiKey, setShowApiKey] = useState({});
  const [copyStatus, setCopyStatus] = useState({});
  const [dialog, setDialog] = useState({ isOpen: false, type: null, data: null });
  const [newProjectName, setNewProjectName] = useState('');

  const toggleApiKey = (id) => setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }));

  const copyToClipboard = (text, id) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopyStatus({ [id]: true });
      setTimeout(() => setCopyStatus({ [id]: false }), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };
  
  const handleDialogConfirm = () => {
    const { type, data } = dialog;
    if (type === 'delete') {
      setProjects(prev => prev.filter(p => p.id !== data.id));
    }
    if (type === 'regenerate') {
      setProjects(prev => prev.map(p => p.id === data.id ? { ...p, apiKey: generateApiKey() } : p));
    }
    if (type === 'create') {
      if (newProjectName.trim()) {
        const newProject = {
          id: Date.now(),
          name: newProjectName.trim(),
          apiKey: generateApiKey(),
          status: 'active',
          createdAt: new Date().toLocaleDateString(),
        };
        setProjects(prev => [newProject, ...prev]);
        setNewProjectName('');
      }
    }
    setDialog({ isOpen: false, type: null, data: null });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Projects</h2>
        <button
          onClick={() => setDialog({ isOpen: true, type: "create", data: null })}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No projects yet.</p>
            <p>Click "New Project" to get started.</p>
          </div>
        ) : (
        <div className="divide-y divide-gray-800/50">
            {projects.map((project) => (
            <div key={project.id} className="p-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
              <div className="md:col-span-1">
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <span className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                  <span>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                  <span>•</span>
                  <span>Created {project.createdAt}</span>
                </div>
              </div>
              
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                <div className="flex items-center bg-gray-800/60 rounded-lg px-3 py-2 font-mono text-sm w-full sm:w-auto">
                    <span className="text-gray-300 flex-1 truncate">
                        {showApiKey[project.id] ? project.apiKey : `sk-genreal-••••••••••••••••••••`}
                    </span>
                    <button onClick={() => toggleApiKey(project.id)} className="p-1 ml-2 text-gray-400 hover:text-white">
                        {showApiKey[project.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => copyToClipboard(project.apiKey, project.id)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                        {copyStatus[project.id] ? <span className="text-xs">Copied!</span> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setDialog({ isOpen: true, type: 'regenerate', data: project })} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDialog({ isOpen: true, type: 'delete', data: project })} className="p-2 bg-gray-800 hover:bg-red-500/20 rounded-lg text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
      
      <Dialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ isOpen: false, type: null, data: null })}
        onConfirm={handleDialogConfirm}
        title={
          dialog.type === 'delete' ? 'Delete Project' :
          dialog.type === 'regenerate' ? 'Regenerate API Key' : 'Create New Project'
        }
        confirmText={
          dialog.type === 'delete' ? 'Delete' :
          dialog.type === 'regenerate' ? 'Regenerate' : 'Create'
        }
        confirmVariant={dialog.type === 'delete' ? 'red' : 'cyan'}
      >
        {dialog.type === 'delete' && <p>Are you sure you want to delete the project <strong>"{dialog.data?.name}"</strong>? This action cannot be undone.</p>}
        {dialog.type === 'regenerate' && <p>Are you sure you want to regenerate the API key for <strong>"{dialog.data?.name}"</strong>? Your old key will be invalidated immediately.</p>}
        {dialog.type === 'create' && (
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
            <input
              type="text"
              id="projectName"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              placeholder="e.g., My Awesome App"
            />
          </div>
        )}
      </Dialog>
    </>
  );
};

const ApiDocsView = () => {
    const codeExample = `curl -X POST https://api.genreal.ai/v1/detect \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "source_url": "https://example.com/media.mp4"
}'`;

  return (
    <div className="text-gray-300">
      <h2 className="text-3xl font-bold text-white mb-2">API Documentation</h2>
      <p className="text-gray-400 mb-8">Integrate our deepfake detection API into your application.</p>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-white mb-3 border-l-4 border-cyan-500 pl-3">Authentication</h3>
          <p>Authenticate your API requests by including your secret API key in the request's Authorization header.</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold text-white mb-3 border-l-4 border-cyan-500 pl-3">Endpoints</h3>
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <p className="font-mono text-sm"><span className="font-bold text-cyan-400 mr-2">POST</span> /v1/detect</p>
            <p className="mt-2 text-gray-400">Submits a media file for deepfake analysis.</p>
          </div>
        </section>
        <section>
          <h3 className="text-xl font-semibold text-white mb-3 border-l-4 border-cyan-500 pl-3">Example Request</h3>
          <div className="bg-black border border-gray-800/50 rounded-xl">
             <div className="px-4 py-2 border-b border-gray-800/50 text-xs text-gray-400">cURL Example</div>
             <pre className="p-4 text-sm whitespace-pre-wrap overflow-x-auto">
                 <code>{codeExample}</code>
             </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

const BillingView = () => {
    const [credits, setCredits] = useState(1250);
    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-8">Credits & Billing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gray-900/50 border border-gray-800/50 rounded-xl p-6 flex flex-col justify-between">
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Available Credits</p>
                        <p className="text-4xl font-bold text-white mt-2">{credits.toLocaleString()}</p>
                    </div>
                    <button className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 rounded-lg py-2 text-sm font-semibold transition-colors">
                        Buy More Credits
                    </button>
                </div>
                <div className="md:col-span-2 bg-gray-900/50 border border-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
                    <div className="h-48 flex items-center justify-center text-gray-500">
                        <p>Usage chart coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP LAYOUT ---
const DashboardLayout = () => {
  const [view, setView] = useState('dashboard');
  const [projects, setProjects] = useState([
    { id: 1, name: "AI Content Detector", apiKey: generateApiKey(), status: "active", createdAt: "09/15/2023" },
    { id: 2, name: "Video Verification Tool", apiKey: generateApiKey(), status: "active", createdAt: "08/21/2023" },
    { id: 3, name: "Staging Environment", apiKey: generateApiKey(), status: "paused", createdAt: "07/02/2023" },
  ]);

  const renderView = () => {
    switch(view) {
      case 'dashboard': return <ProjectsView projects={projects} setProjects={setProjects} />;
      case 'documentation': return <ApiDocsView />;
      case 'billing': return <BillingView />;
      case 'settings': return <div><h2 className="text-3xl font-bold">Settings</h2><p className="text-gray-500 mt-4">Settings page under construction.</p></div>;
      default: return <ProjectsView projects={projects} setProjects={setProjects} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white font-sans flex">
      <Sidebar view={view} setView={setView} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {/* New Header with Back to Home button */}
        <header className="flex items-center justify-end mb-8">
             <a
               href="/"
               className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors text-gray-300 hover:text-white"
             >
               <ChevronLeft className="w-4 h-4" /> Back to Home
             </a>
        </header>
        {renderView()}
      </main>
    </div>
  );
};


// --- ROOT APP COMPONENT ---
const Dashboard = () => {
  return (
      <AuthProvider>
        <DashboardLayout />
      </AuthProvider>
  );
};

export default Dashboard;

