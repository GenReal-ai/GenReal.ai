import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect, useRef } from "react";

import { useNavigate, useSearchParams, Link } from "react-router-dom";

import { X, Mail, Lock, User, Eye, EyeOff, Clock, ArrowLeft } from "lucide-react";

import { useAuth } from './hooks/useAuth';



const API_BASE_URL = "https://backendgenreal-authservice.onrender.com";



// Simple inline SVG for Google Icon to remove dependency

const GoogleIcon = () => (

  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>

    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>

    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>

    <path d="M12 5.45c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>

  </svg>

);



// ================== Auth Callback (Updated) ==================

const AuthCallback = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { login } = useAuth();



  useEffect(() => {

    const token = searchParams.get("token");

    const error = searchParams.get("error");

    const redirect = searchParams.get("redirect") || "/";



    if (error) {

      console.error("OAuth error:", error);

      navigate(`/login?error=${error}&redirect=${encodeURIComponent(redirect)}`, { replace: true });

      return;

    }



    if (!token) {

      navigate(`/login?error=missing_token&redirect=${encodeURIComponent(redirect)}`, { replace: true });

      return;

    }



    // Validate token with backend

    fetch(`${API_BASE_URL}/api/auth/validate`, {

      headers: { Authorization: `Bearer ${token}` },

    })

      .then(res => res.json())

      .then(data => {

        if (data.success && data.user) {

          // Use the auth hook's login method

          login(token, data.user);

          navigate(decodeURIComponent(redirect), { replace: true });

        } else {

          navigate(`/login?error=validation_failed&redirect=${encodeURIComponent(redirect)}`, { replace: true });

        }

      })

      .catch(() => {

        navigate(`/login?error=network&redirect=${encodeURIComponent(redirect)}`, { replace: true });

      });

  }, [navigate, searchParams, login]);



  return (

    <div className="h-screen w-full bg-[#111] flex items-center justify-center text-white">

      <div className="text-center">

        <div className="w-12 h-12 border-b-2 border-indigo-500 rounded-full animate-spin"></div>

        <p className="mt-4 text-gray-300">Finalizing authentication...</p>

      </div>

    </div>

  );

};



// ================== OTP Timer Component ==================

const OTPTimer = ({ initialTime, onExpire, isActive }) => {

  const [timeLeft, setTimeLeft] = useState(initialTime);



  useEffect(() => {

    if (!isActive) return;

    setTimeLeft(initialTime);



    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) { clearInterval(timer); onExpire(); return 0; }

        return prev - 1;

      });

    }, 1000);



    return () => clearInterval(timer);

  }, [isActive, onExpire, initialTime]);



  const formatTime = (seconds) => {

    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;

  };



  return (

    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">

      <Clock size={16} />

      <span>{timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "OTP expired"}</span>

    </div>

  );

};



// ================== OTP Input Component ==================

const OTPInput = ({ value, onChange, length = 6 }) => {

  const inputsRef = useRef([]);



  const handleChange = (element, index) => {

    if (isNaN(element.value)) return;

    const newOtp = [...value];

    newOtp[index] = element.value;

    onChange(newOtp.join(""));

    if (element.value && index < length - 1) {

      inputsRef.current[index + 1]?.focus();

    }

  };



  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace") {

      if (!value[index] && index > 0) {

        inputsRef.current[index - 1]?.focus();

      }

      const newOtp = [...value];

      newOtp[index] = "";

      onChange(newOtp.join(""));

    }

  };

 

  const handlePaste = (e) => {

    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").slice(0, length).replace(/[^0-9]/g, "");

    onChange(pastedData);

  };



  return (

    <div className="flex justify-center space-x-2 sm:space-x-3" onPaste={handlePaste}>

      {Array(length).fill("").map((_, index) => (

        <input

          key={index}

          ref={el => (inputsRef.current[index] = el)}

          type="text"

          maxLength={1}

          value={value[index] || ""}

          onChange={e => handleChange(e.target, index)}

          onKeyDown={e => handleKeyDown(e, index)}

          className="w-12 h-12 text-center text-xl font-bold bg-[#1f1f1f] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"

        />

      ))}

    </div>

  );

};



// ================== Login/Register Component (Updated) ==================

const LoginRegister = ({ isLogin: initialLogin = true }) => {

  const [authMode, setAuthMode] = useState(initialLogin ? "login" : "register");

  const [formData, setFormData] = useState({ name: "", email: "", otp: "" });

  const passwordRef = useRef(null);

  const confirmPasswordRef = useRef(null);



  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [animationDirection, setAnimationDirection] = useState(1);

  const [otpExpired, setOtpExpired] = useState(false);



  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { login } = useAuth();



  // Get redirect URL from search params

  const redirectUrl = searchParams.get("redirect") || "/";



  useEffect(() => {

    const redirectError = searchParams.get("error");

    if (redirectError) {

      const errorMessages = {

        'missing_token': 'Authentication failed. Missing token.',

        'validation_failed': 'Token validation failed. Please try again.',

        'network': 'Network error. Please check your connection.',

        'fetch_failed': 'Authentication service unavailable.'

      };

      setError(errorMessages[redirectError] || 'Authentication failed. Please try again.');

    }

  }, [searchParams]);

 

  const handleInputChange = (e) => {

    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    setError("");

    setSuccess("");

  };

 

  const handleOTPChange = (otpValue) => {

     setFormData(prev => ({ ...prev, otp: otpValue }));

     setError("");

  };



  const handleAuthSuccess = (data) => {

    if (data.token && data.user) {

      // Use the auth hook's login method

      login(data.token, data.user);

      setSuccess(authMode === "login" ? "Login successful!" : "Account created!");

     

      // Redirect to the original destination or home

      setTimeout(() => {

        navigate(decodeURIComponent(redirectUrl), { replace: true });

      }, 1000);

    }

  };

 

  const switchMode = (newMode) => {

    if ((authMode === 'login' && ['register', 'forgot'].includes(newMode)) || (authMode === 'forgot' && newMode === 'otp') || (authMode === 'otp' && newMode === 'reset')) {

      setAnimationDirection(1);

    } else {

      setAnimationDirection(-1);

    }

    setError("");

    setSuccess("");

    if (passwordRef.current) passwordRef.current.value = "";

    if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";

    setAuthMode(newMode);

  };



  const getTitle = () => {

    if (authMode === "register") return "Create an Account";

    if (authMode === "forgot") return "Reset Password";

    if (authMode === "otp") return "Enter Verification Code";

    if (authMode === "reset") return "Set New Password";

    return "Welcome Back";

  };



  const handleGoogleOAuth = () => {

    window.location.href = `${API_BASE_URL}/api/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;

  };

 

  const handleResendOtp = async () => {

     setIsLoading(true);

     setError("");

     try {

       const res = await fetch(`${API_BASE_URL}/api/auth/send-password-reset-otp`, {

         method: 'POST',

         headers: { 'Content-Type': 'application/json' },

         body: JSON.stringify({ email: formData.email }),

       });

       const data = await res.json();

       if (data.success) {

         setSuccess("A new OTP has been sent.");

         setOtpExpired(false);

       } else {

         setError(data.message || 'Failed to resend OTP.');

       }

     } catch (err) {

       setError("Network error. Please try again.");

     } finally {

       setIsLoading(false);

     }

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setIsLoading(true);

    setError("");

    setSuccess("");



    const password = passwordRef.current?.value;

    const confirmPassword = confirmPasswordRef.current?.value;



    try {

      let endpoint = "", payload = {};

     

      if (authMode === "login" || authMode === "register") {

        if (authMode === "register" && password !== confirmPassword) throw new Error("Passwords do not match");

        if (password && password.length < 6) throw new Error("Password must be at least 6 characters");



        endpoint = authMode === 'login' ? "/api/auth/login" : "/api/auth/register";

        payload = authMode === 'login'

          ? { email: formData.email, password }

          : { name: formData.name, email: formData.email, password };

         

      } else if (authMode === "forgot") {

        endpoint = "/api/auth/send-password-reset-otp";

        payload = { email: formData.email };

       

      } else if (authMode === "otp") {

        // For OTP verification only, we don't reset password yet

        endpoint = "/api/auth/verify-password-reset-otp";

        payload = { email: formData.email, otp: formData.otp };

       

      } else if (authMode === "reset") {

        if (password !== confirmPassword) throw new Error("Passwords do not match");

        if (password.length < 6) throw new Error("Password must be at least 6 characters");



        endpoint = "/api/auth/reset-password-with-otp";

        payload = { email: formData.email, otp: formData.otp, newPassword: password };

      }



      const res = await fetch(`${API_BASE_URL}${endpoint}`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(payload),

      });



      const data = await res.json();

     

      if (!data.success) {

        throw new Error(data.message || `An error occurred during ${authMode}`);

      }

     

      // Handle success based on mode

      if (authMode === 'login' || authMode === 'register') {

        handleAuthSuccess(data);

      } else if (authMode === 'forgot') {

        setSuccess(data.message || 'OTP sent successfully!');

        switchMode('otp');

      } else if (authMode === 'otp') {

        // For OTP mode, we just verified the OTP, now go to reset

        setSuccess('OTP verified successfully!');

        switchMode('reset');

      } else if (authMode === 'reset') {

        setSuccess(data.message || 'Password has been reset successfully!');

        setTimeout(() => switchMode('login'), 2000);

      }



    } catch (err) {

      setError(err.message);

    } finally {

      setIsLoading(false);

    }

  };

 

  const formVariants = {

    hidden: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }),

    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },

    exit: (direction) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }),

  };



  return (

    <div className="flex items-center justify-center w-full min-h-screen p-4 bg-[#0a0a0a] font-sans overflow-hidden">

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative z-10 w-full max-w-md p-4">

        <motion.div layout transition={{ duration: 0.5, type: "spring", bounce: 0.3 }} className="w-full bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8">

          <Link to="/" className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20}/></Link>

          <div className="text-center mb-6">

            <img src="/logoGenReal.png" alt="Logo" className="w-14 h-14 rounded-full object-cover mx-auto mb-4" />

            <h1 className="text-2xl font-bold text-white">{getTitle()}</h1>

            {redirectUrl !== "/" && (

              <p className="text-sm text-gray-400 mt-2">Sign in to continue to your destination</p>

            )}

          </div>

          <AnimatePresence>{error && <motion.div key="error" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="p-3 mb-4 text-sm text-center text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</motion.div>}</AnimatePresence>

          <AnimatePresence>{success && <motion.div key="success" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="p-3 mb-4 text-sm text-center text-green-300 bg-green-500/10 border border-green-500/20 rounded-lg">{success}</motion.div>}</AnimatePresence>

          <form onSubmit={handleSubmit} className="overflow-hidden relative">

            <AnimatePresence mode="wait" custom={animationDirection}>

              {authMode === "login" && (

                <motion.div key="login" custom={animationDirection} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">

                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/></div>

                  <div className="relative">

                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>

                    <input type={showPassword?"text":"password"} ref={passwordRef} placeholder="Password" required className="w-full pl-10 pr-10 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>

                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button>

                  </div>

                  <div className="text-right"><button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium" onClick={() => switchMode('forgot')}>Forgot Password?</button></div>

                  <motion.button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/50 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">{isLoading?"Processing...":"Sign In"}</motion.button>

                </motion.div>

              )}

             

              {authMode === "register" && (

                <motion.div key="register" custom={animationDirection} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">

                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/></div>

                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/></div>

                  <div className="relative">

                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>

                    <input type={showPassword?"text":"password"} ref={passwordRef} placeholder="Password" required className="w-full pl-10 pr-10 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>

                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button>

                  </div>

                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/><input type="password" ref={confirmPasswordRef} placeholder="Confirm Password" required className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/></div>

                  <motion.button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/50 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">{isLoading?"Processing...":"Create Account"}</motion.button>

                </motion.div>

              )}

             

              {authMode === 'forgot' && (

                <motion.div key="forgot" custom={animationDirection} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">

                  <p className="text-center text-sm text-gray-400">Enter your email and we'll send you a code to reset your password.</p>

                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/></div>

                  <motion.button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/50 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">{isLoading ? "Sending..." : "Send Code"}</motion.button>

                  <div className="text-center"><button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center w-full gap-2" onClick={() => switchMode('login')}><ArrowLeft size={16}/> Back to Login</button></div>

                </motion.div>

              )}

             

              {authMode === 'otp' && (

                <motion.div key="otp" custom={animationDirection} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">

                   <p className="text-center text-sm text-gray-400">We've sent a 6-digit code to <span className="font-semibold text-white">{formData.email}</span>. Enter it to verify your identity.</p>

                   <OTPInput value={formData.otp} onChange={handleOTPChange} length={6} />

                   <OTPTimer initialTime={180} onExpire={() => setOtpExpired(true)} isActive={!otpExpired} />

                   <motion.button type="submit" disabled={isLoading || formData.otp.length !== 6} className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/50 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">{isLoading ? "Verifying..." : "Verify & Continue"}</motion.button>

                   <div className="text-center">

                    {otpExpired ? (

                      <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium" onClick={handleResendOtp} disabled={isLoading}>{isLoading ? "Sending..." : "Resend Code"}</button>

                    ) : (

                      <p className="text-sm text-gray-500">Didn't receive the code? Wait for timer to expire</p>

                    )}

                   </div>

                </motion.div>

              )}

             

              {authMode === 'reset' && (

                <motion.div key="reset" custom={animationDirection} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">

                  <p className="text-center text-sm text-gray-400">Create a new, strong password for your account.</p>

                  <div className="relative">

                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>

                    <input type={showPassword?"text":"password"} ref={passwordRef} placeholder="New Password" required className="w-full pl-10 pr-10 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>

                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button>

                  </div>

                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/><input type="password" ref={confirmPasswordRef} placeholder="Confirm New Password" required className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/></div>

                  <motion.button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/50 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">{isLoading ? "Resetting..." : "Reset Password"}</motion.button>

                </motion.div>

              )}

            </AnimatePresence>



            <div className="mt-6 space-y-4">

              <div className="relative flex items-center">

                  <div className="flex-grow border-t border-white/10"></div><span className="flex-shrink mx-4 text-xs text-gray-500">OR</span><div className="flex-grow border-t border-white/10"></div>

              </div>

              <motion.button type="button" onClick={handleGoogleOAuth} disabled={isLoading} className="w-full py-3 font-semibold text-white bg-white/5 border border-white/10 rounded-lg flex items-center justify-center space-x-2 hover:bg-white/10 disabled:opacity-50 transition-all duration-300"><GoogleIcon /> <span>Continue with Google</span></motion.button>

              <div className="text-center text-sm text-gray-400">

                {authMode === "login"

                  ? <>Don't have an account? <button type="button" className="text-indigo-400 hover:text-indigo-300 font-medium" onClick={() => switchMode('register')}>Sign Up</button></>

                  : authMode !== 'forgot' && authMode !== 'otp' && authMode !== 'reset' && <>Already have an account? <button type="button" className="text-indigo-400 hover:text-indigo-300 font-medium" onClick={() => switchMode('login')}>Login</button></>}

              </div>

            </div>

          </form>

        </motion.div>

      </motion.div>

    </div>

  );

};



export { LoginRegister, AuthCallback };