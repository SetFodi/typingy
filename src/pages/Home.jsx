import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";

const Home = () => {
  // Set default theme to dark
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className={`h-screen flex items-center justify-center relative overflow-hidden ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
        }`}
      >
        {/* Animated Gradient Background */}
        <motion.div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-purple-800 via-gray-800 to-black"
              : "bg-gradient-to-br from-blue-300 via-pink-300 to-white"
          } blur-3xl opacity-30`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        ></motion.div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all z-10 ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Main Content */}
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-extrabold mb-6 tracking-wide">
            Welcome to <span className="text-blue-500 dark:text-blue-400">Typingy</span>
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Test your typing speed, improve your skills, and challenge yourself with a fun typing experience.
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-8 justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg"
            >
              <Link
                to="/test"
                className={`px-8 py-4 rounded-lg text-xl font-semibold shadow-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Start Typing Test
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg"
            >
              <Link
                to="/results"
                className={`px-8 py-4 rounded-lg text-xl font-semibold shadow-lg transition-all duration-300 ${
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
          className="absolute bottom-4 left-0 right-0 text-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="flex items-center justify-center gap-4">
            <span
              className={`${
                darkMode ? "text-gray-500" : "text-gray-400"
              } hover:text-gray-600 transition-all`}
            >
              Built with ❤️ by Luka
            </span>
            <a
              href="https://www.instagram.com/syncrolly/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-pink-500 hover:text-pink-400 transition-all text-xl`}
            >
              <FaInstagram />
            </a>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;
