// typingy/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaKeyboard, FaTrophy, FaChartLine } from "react-icons/fa";
import typingyLogo from "./assets/typingy.png";

// Update this version string whenever you want to force a reset of stored user data
const CURRENT_APP_VERSION = "4.0";

const Home = () => {
  // Set default theme to dark
  const [darkMode, setDarkMode] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowFeatures(true);
    
    const storedVersion = localStorage.getItem("appVersion");
    if (storedVersion !== CURRENT_APP_VERSION) {
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      localStorage.setItem("appVersion", CURRENT_APP_VERSION);
    }

    const storedName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (!storedName || !storedUserId) {
      setIsModalOpen(true);
    }
  }, []);

  const handleStartTest = () => {
    const storedName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (storedName && storedUserId) {
      navigate("/test");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      setError("Please enter your name to start the test.");
      return;
    }
  
    setIsSubmitting(true);
    setError("");
  
    try {
      const userId = crypto.randomUUID();
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: name.trim(),
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Failed to save your name. Please try a different name.");
      } else {
        localStorage.setItem("userId", data.data._id);
        localStorage.setItem("userName", data.data.name);
        setIsModalOpen(false);
        navigate("/test");
      }
    } catch (err) {
      console.error("Error saving name:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
        } p-4 transition-colors duration-300`}
      >
        {/* Refined Gradient Background */}
        <motion.div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
              : "bg-gradient-to-br from-blue-50 via-indigo-50 to-white"
          } opacity-80`}
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        ></motion.div>
        
        {/* Subtle floating keyboard keys */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              className={`absolute text-lg opacity-10 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                y: ["-10%", "110%"],
              }}
              transition={{
                duration: Math.random() * 15 + 25,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            >
              {index % 2 === 0 ? "⌨️" : "⌨️"}
            </motion.div>
          ))}
        </div>

        {/* Theme Toggle */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-4 right-4 p-3 rounded-lg transition-all z-10 ${
            darkMode 
              ? "bg-gray-800 hover:bg-gray-700 text-gray-200" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle Theme"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </motion.button>

        {/* Main Content */}
        <motion.div
          className={`text-center z-10 flex flex-col items-center p-8 rounded-xl ${
            darkMode 
              ? "bg-gray-800 bg-opacity-40 backdrop-blur-sm" 
              : "bg-white bg-opacity-60 backdrop-blur-sm"
          } shadow-lg max-w-3xl mx-auto`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src={typingyLogo}
              alt="TypingY Logo"
              className={`w-20 h-20 rounded-full p-2 ${
                darkMode
                  ? "bg-gray-900 border border-blue-500"
                  : "bg-white border border-blue-400 shadow-md"
              }`}
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Welcome to{" "}
            <span className="text-blue-500 dark:text-blue-400">TypingY</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            className="text-base sm:text-lg mb-8 max-w-lg mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Test your typing speed, improve your skills, and challenge yourself.
          </motion.p>

          {/* Actions */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              onClick={handleStartTest}
              className={`px-6 py-3 rounded-lg text-lg font-medium shadow-md transition-all ${
                darkMode 
                  ? "bg-blue-600 hover:bg-blue-500 text-white" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center gap-2">
                <FaKeyboard />
                <span>Start Typing Test</span>
              </div>
            </motion.button>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/results"
                className={`px-6 py-3 rounded-lg text-lg font-medium shadow-md transition-all flex items-center gap-2 ${
                  darkMode 
                    ? "bg-green-600 hover:bg-green-500 text-white" 
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <FaTrophy />
                <span>View Results</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features */}
          <AnimatePresence>
            {showFeatures && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {[
                  {
                    icon: <FaKeyboard className="text-2xl text-blue-500" />,
                    title: "Measure WPM",
                    description: "Track your words per minute"
                  },
                  {
                    icon: <FaChartLine className="text-2xl text-green-500" />,
                    title: "Improve Accuracy",
                    description: "Practice with different word sets"
                  },
                  {
                    icon: <FaTrophy className="text-2xl text-yellow-500" />,
                    title: "Compare Results",
                    description: "See how you rank on leaderboards"
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className={`rounded-lg p-4 ${
                      darkMode 
                        ? "bg-gray-700 bg-opacity-50" 
                        : "bg-gray-50"
                    } flex flex-col items-center text-center`}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    {feature.icon}
                    <h3 className="text-base font-bold my-2">{feature.title}</h3>
                    <p className="text-sm opacity-80">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="absolute bottom-4 left-0 right-0 text-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className={`${darkMode ? "text-gray-500" : "text-gray-500"} text-sm`}>
              Built with ❤️ by Luka
            </span>
            <motion.a
              href="https://www.instagram.com/syncrolly/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 text-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Instagram"
            >
              <FaInstagram />
            </motion.a>
          </div>
        </motion.footer>

        {/* Name Input Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`rounded-lg shadow-lg p-6 max-w-md w-full ${
                  darkMode 
                    ? "bg-gray-800 text-white" 
                    : "bg-white text-gray-900"
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <h2 className="text-2xl font-bold mb-1 text-center">
                  Enter Your Name
                </h2>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-4 text-center`}>
                  We'll use this to track your progress
                </p>
                
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    placeholder="Your Name"
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none ${
                      darkMode 
                        ? "bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500" 
                        : "bg-gray-50 text-gray-800 placeholder-gray-500 border border-gray-200 focus:border-blue-500"
                    } transition-colors`}
                    aria-label="User Name"
                  />
                  {name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="text-red-500 mb-4 text-sm p-2 rounded bg-red-50 dark:bg-red-900 dark:bg-opacity-20">
                    {error}
                  </div>
                )}
                
                <motion.button
                  onClick={handleSaveName}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? "bg-blue-600 hover:bg-blue-500 text-white" 
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    "Save and Start Test"
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;