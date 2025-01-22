import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { simpleWords, intermediateWords } from "../wordLists";
import { motion } from "framer-motion";

const themes = {
  default: {
    background: "bg-gray-900",
    text: "text-white",
    keyboard: "bg-gray-800 text-gray-300",
    keyPressed: "bg-blue-500 text-white shadow-blue-500",
  },
  andromeda: {
    background: "bg-purple-900",
    text: "text-yellow-300",
    keyboard: "bg-purple-800 text-purple-300",
    keyPressed: "bg-yellow-500 text-black shadow-yellow-500",
  },
  dracula: {
    background: "bg-gray-800",
    text: "text-pink-500",
    keyboard: "bg-gray-700 text-gray-400",
    keyPressed: "bg-pink-500 text-black shadow-pink-500",
  },
  monokai: {
    background: "bg-green-900",
    text: "text-yellow-300",
    keyboard: "bg-green-800 text-green-300",
    keyPressed: "bg-yellow-500 text-black shadow-yellow-500",
  },
  nord: {
    background: "bg-blue-900",
    text: "text-cyan-300",
    keyboard: "bg-blue-800 text-blue-300",
    keyPressed: "bg-cyan-500 text-black shadow-cyan-500",
  },
  solarized: {
    background: "bg-yellow-900",
    text: "text-orange-300",
    keyboard: "bg-yellow-800 text-yellow-300",
    keyPressed: "bg-orange-500 text-black shadow-orange-500",
  },
  gruvbox: {
    background: "bg-orange-900",
    text: "text-green-400",
    keyboard: "bg-orange-800 text-orange-300",
    keyPressed: "bg-green-500 text-black shadow-green-500",
  },
  horizon: {
    background: "bg-orange-800",
    text: "text-red-300",
    keyboard: "bg-orange-700 text-orange-300",
    keyPressed: "bg-red-500 text-black shadow-red-500",
  },
  material: {
    background: "bg-gray-700",
    text: "text-green-400",
    keyboard: "bg-gray-600 text-gray-300",
    keyPressed: "bg-green-500 text-black shadow-green-500",
  },
  oceanic: {
    background: "bg-blue-800",
    text: "text-teal-300",
    keyboard: "bg-blue-700 text-blue-300",
    keyPressed: "bg-teal-500 text-black shadow-teal-500",
  },
  oneDark: {
    background: "bg-gray-800",
    text: "text-orange-300",
    keyboard: "bg-gray-700 text-gray-300",
    keyPressed: "bg-orange-500 text-black shadow-orange-500",
  },
  palenight: {
    background: "bg-purple-800",
    text: "text-teal-300",
    keyboard: "bg-purple-700 text-purple-300",
    keyPressed: "bg-teal-500 text-black shadow-teal-500",
  },
  tokyoNight: {
    background: "bg-blue-900",
    text: "text-purple-300",
    keyboard: "bg-blue-800 text-blue-300",
    keyPressed: "bg-purple-500 text-black shadow-purple-500",
  },
  solarizedOsaka: {
    background: "bg-[#000a14]", // HSL(192, 100, 5)
    text: "text-[#d8dee9]", // HSL(186, 8, 55)
    keyboard: "bg-[#001e28] text-[#5a6a73]", // HSL(192, 100, 11)
    keyPressed: "bg-[#5e81ac] text-[#000000] shadow-[#5e81ac]", // Example accent (HSL-based color)
  },
  
  rosePine: {
    background: "bg-rose-900",
    text: "text-rose-300",
    keyboard: "bg-rose-800 text-rose-400",
    keyPressed: "bg-rose-500 text-black shadow-rose-500",
  },
  forest: {
    background: "bg-green-900",
    text: "text-lime-300",
    keyboard: "bg-green-800 text-green-400",
    keyPressed: "bg-lime-500 text-black shadow-lime-500",
  },
  cyberpunk: {
    background: "bg-black",
    text: "text-pink-500",
    keyboard: "bg-gray-900 text-gray-400",
    keyPressed: "bg-pink-500 text-black shadow-pink-500",
  },
  spaceCadet: {
    background: "bg-indigo-900",
    text: "text-blue-300",
    keyboard: "bg-indigo-800 text-indigo-300",
    keyPressed: "bg-blue-500 text-black shadow-blue-500",
  },
};



const TypingTest = () => {
  const [sentence, setSentence] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedTime, setSelectedTime] = useState(15);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [typingMode, setTypingMode] = useState("simple");
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [errors, setErrors] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [pressedKey, setPressedKey] = useState(null);
  const navigate = useNavigate();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("default");

  // Calculate number of words based on time
  const getWordCount = (seconds) => {
    const wordsPerMinute = 48; // Base rate of 48 words per minute
    return Math.ceil((seconds / 60) * wordsPerMinute);
  };
  const toggleThemeModal = () => {
    setIsThemeModalOpen((prev) => !prev);
  };
  // Generate a random sentence
  const generateSentence = (mode = typingMode, time = selectedTime) => {
    const wordPool = mode === "simple" ? simpleWords : intermediateWords;
    const wordCount = getWordCount(time);
    const randomSentence = Array.from({ length: wordCount }, () =>
      wordPool[Math.floor(Math.random() * wordPool.length)]
    ).join(" ");
    setSentence(randomSentence);
    setInput("");
    setTypedChars(0);
    setErrors(0);
    setElapsedTime(0);
    setTimeLeft(time);
    setIsFinished(false);
    setIsRunning(false);
  };

  useEffect(() => {
    generateSentence(typingMode, selectedTime);
  }, [typingMode, selectedTime]);

  // Handle timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      finishTest();
    }
  }, [isRunning, timeLeft]);

  // Handle user input
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isRunning) setIsRunning(true);
    setInput(value);
    setTypedChars(value.length);
    if (!sentence.startsWith(value)) setErrors((prev) => prev + 1);
    if (value === sentence) finishTest();
  };

  // Finish the test
  const finishTest = () => {
    setIsRunning(false);
    setIsFinished(true);

    const previousData = JSON.parse(localStorage.getItem("typingData")) || { tests: [] };
    const newTest = {
      wpm: elapsedTime > 0 ? ((typedChars / 5) / (elapsedTime / 60)).toFixed(0) : 0,
      accuracy: typedChars > 0 ? (((typedChars - errors) / typedChars) * 100).toFixed(2) : 0,
      errors,
      duration: selectedTime
    };
    previousData.tests.push(newTest);
    localStorage.setItem("typingData", JSON.stringify(previousData));
  };

  // Handle key press
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      generateSentence(typingMode, selectedTime);
    } else {
      setPressedKey(e.key.toLowerCase());
      setTimeout(() => setPressedKey(null), 150);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typingMode, selectedTime]);

  const accuracy = typedChars > 0 ? (((typedChars - errors) / typedChars) * 100).toFixed(2) : 0;
  const wpm = elapsedTime > 0 ? ((typedChars / 5) / (elapsedTime / 60)).toFixed(0) : 0;

return (
  <div
    className={`min-h-screen ${themes[selectedTheme].background} ${themes[selectedTheme].text} flex flex-col items-center justify-center p-6 relative`}
  >
    {/* Title */}
    <motion.h1
      className="text-5xl font-extrabold mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      Typing Test
    </motion.h1>

    {/* Navigation Buttons */}
    <div className="absolute top-6 right-6 flex gap-4">
      <motion.button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-lg font-semibold shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Go to Home
      </motion.button>
      <motion.button
        onClick={toggleThemeModal}
        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 rounded-lg text-lg font-semibold shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Select Theme
      </motion.button>
      <motion.button
        onClick={() => navigate("/results")}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-semibold shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        View Results
      </motion.button>
    </div>

    {/* Theme Selector Modal */}
    {isThemeModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <motion.div
          className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-orange-300">Choose a Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(themes).map((theme) => (
              <div
                key={theme}
                className={`cursor-pointer p-4 rounded-lg border-4 ${
                  selectedTheme === theme ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setSelectedTheme(theme)}
                style={{
                  background: themes[theme].background,
                }}
              >
                <div
                  className={`h-full flex items-center justify-center text-sm text-center ${
                    themes[theme].text
                  }`}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={toggleThemeModal}
            className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md mx-auto block"
          >
            Close
          </button>
        </motion.div>
      </div>
    )}


      {/* Test Configuration Options */}
      {!isRunning && !isFinished && (
        <motion.div
          className="mb-6 flex flex-col gap-4 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Word Difficulty Options */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setTypingMode("simple")}
              className={`px-6 py-3 rounded font-semibold text-lg transition-all ${
                typingMode === "simple" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              Simple Words
            </button>
            <button
              onClick={() => setTypingMode("intermediate")}
              className={`px-6 py-3 rounded font-semibold text-lg transition-all ${
                typingMode === "intermediate" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              Intermediate Words
            </button>
          </div>
          
          {/* Time Duration Options */}
          <div className="flex gap-4">
            {[15, 30, 45].map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-6 py-3 rounded font-semibold text-lg transition-all ${
                  selectedTime === time ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                {time} seconds
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Timer Progress Bar */}
      {isRunning && (
        <motion.div
          className="w-full max-w-3xl bg-gray-700 rounded-full h-3 mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ originX: 0 }}
          transition={{ duration: selectedTime, ease: "linear" }}
        >
          <div
            className="bg-blue-500 h-3 rounded-full"
            style={{ width: `${(timeLeft / selectedTime) * 100}%` }}
          ></div>
        </motion.div>
      )}

      {/* Typing Area */}
      {!isFinished && (
        <>
          <motion.div
            className="mb-8 text-3xl font-bold tracking-wide leading-relaxed max-w-4xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {sentence.split("").map((char, index) => (
              <span
                key={index}
                className={
                  index < input.length
                    ? char === input[index]
                      ? "text-green-500"
                      : "text-red-500"
                    : "text-gray-400"
                }
              >
                {char}
              </span>
            ))}
          </motion.div>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="w-full max-w-2xl px-6 py-4 rounded-lg bg-gray-800 text-white text-xl focus:outline-none shadow-lg"
            placeholder="Start typing..."
          />
          <div className="mt-6 text-gray-400 text-xl">Time Left: {timeLeft}s</div>
        </>
      )}

      {/* Results */}
      {isFinished && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-6">Results</h2>
          <p className="text-2xl">Characters Typed: {typedChars}</p>
          <p className="text-2xl">Errors: {errors}</p>
          <p className="text-2xl">Accuracy: {accuracy}%</p>
          <p className="text-2xl">WPM: {wpm}</p>
          <button
            onClick={() => generateSentence(typingMode, selectedTime)}
            className="px-8 py-4 mt-8 bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-2xl"
          >
            Restart Test
          </button>
        </motion.div>
      )}

{/* Typing Keyboard */}
<div className="mt-12 max-w-5xl p-4 rounded-lg shadow-lg relative">
  <div className="flex flex-col gap-2">
    {/* Top Row */}
    <div className="flex justify-center gap-2">
      {[..."qwertyuiop"].map((key) => (
        <motion.div
          key={key}
          className={`w-12 h-12 flex justify-center items-center rounded-lg ${themes[selectedTheme].keyboard} text-2xl font-bold shadow-md ${
            pressedKey === key ? themes[selectedTheme].keyPressed : ""
          }`}
          whileHover={{ scale: 1.1 }}
          animate={pressedKey === key ? { backgroundColor: "#3b82f6", color: "#fff" } : {}}
          transition={{ duration: 0.1 }}
        >
          {key}
        </motion.div>
      ))}
    </div>
    {/* Middle Row */}
    <div className="flex justify-center gap-2 ml-6">
      {[..."asdfghjkl"].map((key) => (
        <motion.div
          key={key}
          className={`w-12 h-12 flex justify-center items-center rounded-lg ${themes[selectedTheme].keyboard} text-2xl font-bold shadow-md ${
            pressedKey === key ? themes[selectedTheme].keyPressed : ""
          }`}
          whileHover={{ scale: 1.1 }}
          animate={pressedKey === key ? { backgroundColor: "#3b82f6", color: "#fff" } : {}}
          transition={{ duration: 0.1 }}
        >
          {key}
        </motion.div>
      ))}
    </div>
    {/* Bottom Row */}
    <div className="flex justify-center gap-2 ml-12">
      {[..."zxcvbnm"].map((key) => (
        <motion.div
          key={key}
          className={`w-12 h-12 flex justify-center items-center rounded-lg ${themes[selectedTheme].keyboard} text-2xl font-bold shadow-md ${
            pressedKey === key ? themes[selectedTheme].keyPressed : ""
          }`}
          whileHover={{ scale: 1.1 }}
          animate={pressedKey === key ? { backgroundColor: "#3b82f6", color: "#fff" } : {}}
          transition={{ duration: 0.1 }}
        >
          {key}
        </motion.div>
      ))}
    </div>
  </div>
</div>

    </div>
  );
};

export default TypingTest;