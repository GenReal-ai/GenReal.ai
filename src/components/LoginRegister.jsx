// File: src/components/Auth.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";


// ================== Auth Callback ==================
const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=" + error);
      return;
    }

    if (token && userParam) {
      try {
        localStorage.setItem("authToken", token);
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("user", JSON.stringify(user));

        window.dispatchEvent(
          new CustomEvent("authStateChanged", { detail: { isLoggedIn: true } })
        );

        navigate("/", { replace: true });
      } catch (err) {
        console.error("Error processing OAuth callback:", err);
        navigate("/login?error=processing_failed");
      }
    } else {
      navigate("/login?error=missing_data");
    }
  }, [navigate, searchParams]);

  return (
    <div className="h-screen w-full bg-[#111] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300">Finalizing authentication...</p>
      </div>
    </div>
  );
};

// ================== Login/Register ==================
const LoginRegister = ({ isLogin: initialLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialLogin);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const API_BASE_URL = "http://localhost:3001";

  useEffect(() => {
      const redirectError = searchParams.get('error');
      if(redirectError) {
          setError("Authentication failed. Please try again.")
      }
  }, [searchParams]);

  useEffect(() => setIsLogin(initialLogin), [initialLogin]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const toggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setError("");
    setSuccess("");
    navigate(newMode ? "/login" : "/register", { replace: true });
  };

  const handleAuthSuccess = (data) => {
    if (data.token) localStorage.setItem("authToken", data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

    window.dispatchEvent(
      new CustomEvent("authStateChanged", { detail: { isLoggedIn: true } })
    );

    setSuccess(isLogin ? "Login successful!" : "Account created!");
    
    setTimeout(() => {
      const redirectPath = searchParams.get('redirect') || '/';
      navigate(redirectPath, { replace: true });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        handleAuthSuccess(data);
      } else {
        setError(data.message || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Network error. Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleOAuth = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4 bg-[#0a0a0a] font-sans overflow-hidden">
      {/* New Background */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
            backgroundImage: `
                radial-gradient(ellipse at center, rgba(49, 46, 129, 0.1), transparent 80%),
                radial-gradient(ellipse at top left, rgba(167, 139, 250, 0.08), transparent 50%),
                radial-gradient(ellipse at bottom right, rgba(129, 140, 248, 0.08), transparent 50%)
            `,
        }}
      >
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/5 rounded-tl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white/5 rounded-br-3xl"></div>
      </div>


      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-4"
      >
        <div className="w-full bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40">
          <div className="p-8 space-y-6">
            <Link to="/" className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <X size={20} />
            </Link>

            <div className="text-center">
              {/* New Logo Container */}
              <div className="inline-block p-2 mb-4 bg-white/5 rounded-full ring-1 ring-white/10">
                <div className="w-12 h-12">
                     <img src="/logoGenReal.png" alt="Company Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">
                {isLogin ? "Welcome Back" : "Create an Account"}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
                <button
                  onClick={toggleMode}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 text-sm text-center text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                 <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 text-sm text-center text-green-300 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="confirm-password-field"
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/50 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </motion.button>
            </form>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

             <motion.button
                type="button"
                onClick={handleGoogleOAuth}
                disabled={isLoading}
                className="w-full py-3 font-semibold text-white bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 disabled:opacity-50 transition-all duration-300"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export { LoginRegister, AuthCallback };

