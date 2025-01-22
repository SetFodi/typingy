import React from "react";
import { motion } from "framer-motion";

const Profile = () => {
  const data = JSON.parse(localStorage.getItem("typingData")) || { tests: [] };

  const totalTests = data.tests.length;

  const avgWPM =
    totalTests > 0
      ? (data.tests.reduce((sum, test) => sum + parseInt(test.wpm), 0) / totalTests).toFixed(2)
      : 0;

  const avgAccuracy =
    totalTests > 0
      ? (
          data.tests.reduce((sum, test) => sum + parseFloat(test.accuracy), 0) / totalTests
        ).toFixed(2)
      : 0;

  const bestWPM =
    totalTests > 0 ? Math.max(...data.tests.map((test) => parseInt(test.wpm))) : 0;

  const worstWPM =
    totalTests > 0 ? Math.min(...data.tests.map((test) => parseInt(test.wpm))) : 0;

  const totalErrors =
    totalTests > 0
      ? data.tests.reduce((sum, test) => sum + (test.errors || 0), 0)
      : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      {/* Title */}
      <motion.h1
        className="text-5xl font-extrabold mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Your Profile
      </motion.h1>

      {/* Statistics Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
        }}
      >
        {/* Total Tests */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-blue-500">Total Tests</h2>
          <p className="text-2xl">{totalTests}</p>
        </motion.div>

        {/* Average WPM */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-green-500">Average WPM</h2>
          <p className="text-2xl">{avgWPM}</p>
        </motion.div>

        {/* Average Accuracy */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-purple-500">Average Accuracy</h2>
          <p className="text-2xl">{avgAccuracy}%</p>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${avgAccuracy}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Best WPM */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-yellow-500">Best WPM</h2>
          <p className="text-2xl">{bestWPM}</p>
        </motion.div>

        {/* Worst WPM */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-red-500">Worst WPM</h2>
          <p className="text-2xl">{worstWPM}</p>
        </motion.div>

        {/* Total Errors */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-pink-500">Total Errors</h2>
          <p className="text-2xl">{totalErrors}</p>
        </motion.div>
      </motion.div>

      {/* Back Button */}
      <motion.button
        onClick={() => window.history.back()}
        className="px-8 py-4 mt-12 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-2xl shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Back to Previous Page"
      >
        Back
      </motion.button>
    </div>
  );
};

export default Profile;
