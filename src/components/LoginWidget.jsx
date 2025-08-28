import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const LoginWidget = ({ isLoggedIn, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleClick = () => {
    if (isLoggedIn) {
      setShowMenu(!showMenu);
    } else {
      navigate("/login");
    }
  };

  const handleDashboard = () => {
    setShowMenu(false);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setShowMenu(false);
    // Clear tokens from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    // Call parent component's logout handler if provided
    if (onLogout) {
      onLogout();
    }
    // Navigate to home
    navigate("/");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Define color palettes for the two states
  const loggedOutColors = "from-indigo-500 via-purple-500 to-blue-500";
  const loggedInColors = "from-amber-400 via-orange-500 to-red-500";

  return (
    <div ref={menuRef} className="fixed bottom-8 right-8 z-50">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 2.5,
          ease: "easeInOut",
        }}
      >
        <motion.button
          onClick={handleClick}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative group outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="relative w-16 h-16">
            {/* Subtle background glow */}
            <motion.div
              className={`absolute inset-0 rounded-full blur-lg opacity-75 bg-gradient-to-br ${
                isLoggedIn ? loggedInColors : loggedOutColors
              }`}
            />
            
            {/* Main animated blob */}
            <motion.div
              className={`relative w-full h-full overflow-hidden rounded-full bg-gradient-to-br ${
                isLoggedIn ? loggedInColors : loggedOutColors
              }`}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white drop-shadow-lg"
                >
                  {isLoggedIn ? (
                    <motion.path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <>
                      <motion.path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </>
                  )}
                </motion.svg>
              </div>
            </motion.div>
          </div>

          {/* Tooltip for logged out state */}
          {!isLoggedIn && (
            <motion.div
              className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800/60 backdrop-blur-md text-white text-xs rounded-full whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              Login / Sign Up
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800/60"></div>
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Dropdown Menu for logged in state */}
      {isLoggedIn && (
        <motion.div
          className="absolute bottom-20 right-0 bg-slate-800/90 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 overflow-hidden min-w-[140px]"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={showMenu ? 
            { opacity: 1, y: 0, scale: 1 } : 
            { opacity: 0, y: 10, scale: 0.95 }
          }
          transition={{ duration: 0.2 }}
          style={{ display: showMenu ? 'block' : 'none' }}
        >
          <motion.button
            onClick={handleDashboard}
            className="w-full px-4 py-3 text-left text-white hover:bg-slate-700/50 transition-colors duration-200 flex items-center gap-3 text-sm"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dashboard
          </motion.button>
          
          <div className="h-px bg-slate-700/50"></div>
          
          <motion.button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 flex items-center gap-3 text-sm"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default LoginWidget;