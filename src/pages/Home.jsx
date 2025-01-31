// typingy/src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import typingyLogo from "./assets/typingy.png"; // Adjust the path based on your project structure

const Home = () => {
  // Set default theme to dark
  const [darkMode, setDarkMode] = useState(true);

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
          } blur-3xl opacity-20`} // Reduced opacity for subtlety
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        ></motion.div>

        {/* Theme Toggle Button */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all z-10 ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
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
                : "bg-black border-4 border-white shadow-xl" // Changed bg and border color in light mode
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
            Welcome to{" "}
            <span className="text-blue-500 dark:text-blue-400">TypingY</span>
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
              className="rounded-lg"
            >
              <Link
                to="/test"
                className={`px-6 py-3 rounded-lg text-lg sm:text-xl font-semibold shadow-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Start Typing Test
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg"
            >
              <Link
                to="/results"
                className={`px-6 py-3 rounded-lg text-lg sm:text-xl font-semibold shadow-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
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
            <span
              className={`${
                darkMode ? "text-gray-500" : "text-gray-400"
              } hover:text-gray-600 transition-all`}
            >
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
      </div>
    </div>
  );
};

export default Home;
