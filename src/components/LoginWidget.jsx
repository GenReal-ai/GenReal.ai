import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const LoginWidget = ({ isLoggedIn, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Detect login change → show success tick briefly
  useEffect(() => {
    if (isLoggedIn) {
      setShowSuccessTick(true);
      const timer = setTimeout(() => setShowSuccessTick(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

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

    // Clear all auth tokens
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Dispatch custom event to notify App component
    window.dispatchEvent(
      new CustomEvent("authStateChanged", { detail: { isLoggedIn: false } })
    );

    if (onLogout) onLogout();
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
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const loggedOutColors = "from-indigo-500 via-purple-500 to-blue-500";
  const loggedInColors = "from-amber-400 via-orange-500 to-red-500";

  return (
    <div ref={menuRef} className="fixed bottom-8 right-8 z-50">
      <motion.div
        animate={
          isLoggedIn
            ? { y: [0, -8, 0] } // calm float
            : { y: [0, -15, 0, -12, 0], x: [0, -2, 2, -2, 2, 0] } // bounce + vibrate
        }
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: isLoggedIn ? 2.5 : 1.5,
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
            {/* Glow background */}
            <motion.div
              className={`absolute inset-0 rounded-full blur-lg opacity-75 bg-gradient-to-br ${
                isLoggedIn ? loggedInColors : loggedOutColors
              }`}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Main animated blob */}
            <motion.div
              className={`relative w-full h-full overflow-hidden rounded-full bg-gradient-to-br ${
                isLoggedIn ? loggedInColors : loggedOutColors
              } shadow-lg`}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
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
                  initial={false}
                  animate={{
                    rotate: isLoggedIn ? [0, 360] : 0,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 0.8, ease: "easeInOut" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  {isLoggedIn ? (
                    showSuccessTick ? (
                      // ✅ Success tick
                      <motion.path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                    ) : (
                      // 👤 Profile icon
                      <motion.path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2
                           M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )
                  ) : (
                    // 👤 Default login icon
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

          {/* Tooltip */}
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800/90 backdrop-blur-md text-white text-xs rounded-full whitespace-nowrap border border-slate-700/50"
            initial={{ opacity: 0, y: 10 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {isLoggedIn
              ? `Welcome, ${currentUser?.name || "User"}!`
              : "Login / Sign Up"}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800/90"></div>
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Dropdown menu */}
      {isLoggedIn && (
        <motion.div
          className="absolute bottom-20 right-0 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 overflow-hidden min-w-[160px]"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={
            showMenu
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 10, scale: 0.95 }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ display: showMenu ? "block" : "none" }}
        >
          {currentUser && (
            <div className="px-4 py-3 border-b border-slate-700/50">
              <div className="text-white font-medium text-sm">
                {currentUser.name}
              </div>
              <div className="text-slate-400 text-xs">{currentUser.email}</div>
              {currentUser.credits !== undefined && (
                <div className="text-amber-400 text-xs mt-1">
                  {currentUser.credits} credits
                </div>
              )}
            </div>
          )}

          <motion.button
            onClick={handleDashboard}
            className="w-full px-4 py-3 text-left text-white hover:bg-slate-700/50 transition-colors duration-200 flex items-center gap-3 text-sm"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="9,22 9,12 15,12 15,22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="16,17 21,12 16,7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Logout
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default LoginWidget;
