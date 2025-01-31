// typingy/src/pages/Results.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Results = () => {
  const [data, setData] = useState({ tests: [] });
  const [loading, setLoading] = useState(true);

  // Define API_URL using environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchResults = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(`${API_URL}/api/results?userId=${userId}`); // Corrected API endpoint
          const result = await response.json();
          if (result.success) {
            setData({ tests: result.data });
            console.log("Fetched Results:", result.data); // Debugging
          } else {
            console.error("Failed to fetch results:", result.message);
          }
        } catch (error) {
          console.error("Error fetching results:", error);
        }
      } else {
        console.warn("No userId found in localStorage.");
      }
      setLoading(false);
    };
    fetchResults();
  }, [API_URL]); // Added API_URL as dependency

  // Compute Statistics
  const totalTests = data.tests.length;

  const avgWPM =
    totalTests > 0
      ? (
          data.tests.reduce((sum, test) => sum + parseInt(test.wpm, 10), 0) /
          totalTests
        ).toFixed(2)
      : 0;

  const avgAccuracy =
    totalTests > 0
      ? (
          data.tests.reduce((sum, test) => sum + parseFloat(test.accuracy), 0) /
          totalTests
        ).toFixed(2)
      : 0;

  const bestWPM =
    totalTests > 0 ? Math.max(...data.tests.map((test) => parseInt(test.wpm, 10))) : 0;

  const worstWPM =
    totalTests > 0 ? Math.min(...data.tests.map((test) => parseInt(test.wpm, 10))) : 0;

  const totalErrors =
    totalTests > 0
      ? data.tests.reduce((sum, test) => sum + (test.errorCount || 0), 0) // Use errorCount
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <p className="text-xl">Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {/* Title */}
      <motion.h1
        className="text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Your Typing Results
      </motion.h1>

      {/* Statistics Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-sm sm:max-w-2xl w-full px-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
        }}
      >
        {/* Total Tests */}
        <motion.div
          className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-lg sm:text-2xl font-bold mb-2 text-blue-500">
            Total Tests
          </h2>
          <p className="text-base sm:text-xl">{totalTests}</p>
        </motion.div>

        {/* Average WPM */}
        <motion.div
          className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-lg sm:text-2xl font-bold mb-2 text-green-500">
            Average WPM
          </h2>
          <p className="text-base sm:text-xl">{avgWPM}</p>
        </motion.div>

        {/* Average Accuracy */}
        <motion.div
          className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-lg sm:text-2xl font-bold mb-2 text-purple-500">
            Average Accuracy
          </h2>
          <p className="text-base sm:text-xl">{avgAccuracy}%</p>
          <div className="mt-2 sm:mt-4 w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${avgAccuracy}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Best WPM */}
        <motion.div
          className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-lg sm:text-2xl font-bold mb-2 text-yellow-500">
            Best WPM
          </h2>
          <p className="text-base sm:text-xl">{bestWPM}</p>
        </motion.div>

        {/* Worst WPM */}
        <motion.div
          className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-lg sm:text-2xl font-bold mb-2 text-red-500">
            Worst WPM
          </h2>
          <p className="text-base sm:text-xl">{worstWPM}</p>
        </motion.div>

        {/* Total Errors */}
        <motion.div
          className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-lg sm:text-2xl font-bold mb-2 text-pink-500">
            Total Errors
          </h2>
          <p className="text-base sm:text-xl">{totalErrors}</p>
        </motion.div>
      </motion.div>

      {/* Back Button */}
      <motion.button
        onClick={() => window.history.back()}
        className="mt-4 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-base sm:text-2xl shadow-lg transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Back to Previous Page"
      >
        Back
      </motion.button>
    </div>
  );
};

export default Results;
