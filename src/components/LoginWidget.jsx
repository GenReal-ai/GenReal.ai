import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginWidget = ({ isLoggedIn }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // Define color palettes for the two states
  const loggedOutColors = "from-indigo-500 via-purple-500 to-blue-500";
  const loggedInColors = "from-amber-400 via-orange-500 to-red-500";

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
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
            className={`absolute inset-0 rounded-full blur-lg opacity-75 ${
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

        {/* Tooltip */}
        <motion.div
          className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800/60 backdrop-blur-md text-white text-xs rounded-full whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {isLoggedIn ? "Dashboard" : "Login / Sign Up"}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800/60"></div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default LoginWidget;