// typingy/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import typingyLogo from "./assets/typingy.png";

// Update this version string whenever you want to force a reset of stored user data
const CURRENT_APP_VERSION = "4.0";

const Home = () => {
  // Set default theme to dark
  const [darkMode, setDarkMode] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const navigate = useNavigate();

  // On mount, check the app version and clear localStorage if outdated, then check for user data
  useEffect(() => {
    // Retrieve the stored app version (if any)
    const storedVersion = localStorage.getItem("appVersion");
    if (storedVersion !== CURRENT_APP_VERSION) {
      // Clear only the specific keys you want to reset
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");

      // Optionally, if you want to clear all data, use:
      // localStorage.clear();

      // Save the current version so this check passes next time
      localStorage.setItem("appVersion", CURRENT_APP_VERSION);
    }

    // Check if the userName and userId exist after the version check
    const storedName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (!storedName || !storedUserId) {
      setIsModalOpen(true); // Open the modal if user data is missing
    }
  }, []);

  const handleStartTest = () => {
    const storedName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (storedName && storedUserId) {
      navigate("/test"); // Navigate to TypingTest page
    } else {
      setIsModalOpen(true); // Open modal if user data is missing
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
      const userId = crypto.randomUUID(); // Generate a unique userId
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // This is sent to the server to use as _id
          name: name.trim(),
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Failed to save your name. Please try a different name.");
      } else {
        // Save the user information in localStorage using the _id field from the response
        localStorage.setItem("userId", data.data._id);
        localStorage.setItem("userName", data.data.name);
        setIsModalOpen(false); // Close the modal
        navigate("/test"); // Navigate to the TypingTest page
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
        } p-4`}
      >
        {/* Animated Gradient Background */}
        <motion.div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-purple-800 via-gray-800 to-black"
              : "bg-gradient-to-br from-blue-300 via-pink-300 to-white"
          } blur-3xl opacity-20`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        ></motion.div>

        {/* Theme Toggle Button */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all z-10 ${
            darkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle Theme"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </motion.button>

        {/* Main Content */}
        <motion.div
          className="text-center z-10 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Logo with Enhanced Hover Effects */}
          <motion.img
            src={typingyLogo}
            alt="TypingY Logo"
            className={`w-24 h-24 mb-4 rounded-full p-2 ${
              darkMode
                ? "bg-transparent"
                : "bg-black border-4 border-white shadow-xl"
            }`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          />

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 tracking-wide">
            Welcome to <span className="text-blue-500 dark:text-blue-400">TypingY</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl mb-8 max-w-xl mx-auto px-2">
            Test your typing speed, improve your skills, and challenge yourself with a fun typing experience.
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg mt-[-11px]"
            >
              <button
                onClick={handleStartTest}
                className={`px-6 py-3 rounded-lg text-lg sm:text-xl font-semibold shadow-lg transition-all duration-300 ${
                  darkMode ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Start Typing Test
              </button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg"
            >
              <Link
                to="/results"
                className={`px-6 py-3 rounded-lg text-lg sm:text-xl font-semibold shadow-lg transition-all duration-300 ${
                  darkMode ? "bg-green-600 hover:bg-green-500 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                View Results
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="absolute bottom-4 left-0 right-0 text-center z-10 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
            <span className={`${darkMode ? "text-gray-500" : "text-gray-400"} hover:text-gray-600 transition-all`}>
              Built with ❤️ by Luka
            </span>
            <motion.a
              href="https://www.instagram.com/syncrolly/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-pink-500 hover:text-pink-400 transition-all text-2xl`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaInstagram />
            </motion.a>
          </div>
        </motion.footer>

        {/* Name Input Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 max-w-sm w-full ${darkMode ? "text-white" : "text-gray-900"}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
                  Enter Your Name
                </h2>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="Your Name"
                  className={`w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg focus:outline-none shadow-md mb-4 ${
                    darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-200 text-gray-800 placeholder-gray-500"
                  }`}
                  aria-label="User Name"
                />
                {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
                <motion.button
                  onClick={handleSaveName}
                  className={`w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
                    darkMode ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save and Start Test"}
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
