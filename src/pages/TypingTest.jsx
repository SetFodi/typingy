// typingy/src/pages/TypingTest.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { simpleWords, intermediateWords, sentences, quotes } from "../wordLists";
import { motion, AnimatePresence } from "framer-motion";

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
    background: "bg-[#000a14]",
    text: "text-[#d8dee9]",
    keyboard: "bg-[#001e28] text-[#5a6a73]",
    keyPressed: "bg-[#5e81ac] text-[#000000] shadow-[#5e81ac]",
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
  // State Variables
  const [sentence, setSentence] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedTime, setSelectedTime] = useState(15);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [typingMode, setTypingMode] = useState("simple");
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentErrors, setCurrentErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [pressedKey, setPressedKey] = useState(null);
  const navigate = useNavigate();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previousInput, setPreviousInput] = useState("");
  // New state to store the author when in quotes mode
  const [quoteAuthor, setQuoteAuthor] = useState("");

  // Retrieve the user's name and userId from localStorage
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  // Define API_URL using environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  // Calculate number of words based on time
  const getWordCount = (seconds) => {
    const wordsPerMinute = 48; // Base rate of 48 words per minute
    return Math.ceil((seconds / 60) * wordsPerMinute);
  };

  const toggleThemeModal = () => {
    setIsThemeModalOpen((prev) => !prev);
  };

  // Generate a random sentence/quote based on the selected mode.
  const generateSentence = (mode = typingMode, time = selectedTime) => {
    // Reset common state
    setInput("");
    setPreviousInput("");
    setTypedChars(0);
    setCurrentErrors(0);
    setTotalErrors(0);
    setElapsedTime(0);
    setTimeLeft(time);
    setIsFinished(false);
    setIsRunning(false);
    setErrorMessage("");
    setQuoteAuthor(""); // reset stored quote author

    if (mode === "quotes") {
      // Pick a random quote object
      const randomQuoteObj = quotes[Math.floor(Math.random() * quotes.length)];
      // Set the sentence to only the quote text
      setSentence(randomQuoteObj.text);
      // Store the author separately (to display as a note after finishing, if desired)
      setQuoteAuthor(randomQuoteObj.author);
    } else if (mode === "sentence") {
      // Pick a random full sentence from the sentences array
      const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
      setSentence(randomSentence);
    } else {
      // For "simple" and "intermediate" modes, generate a sentence from words
      const wordPool = mode === "simple" ? simpleWords : intermediateWords;
      const wordCount = getWordCount(time);
      const randomSentence = Array.from({ length: wordCount }, () =>
        wordPool[Math.floor(Math.random() * wordPool.length)]
      ).join(" ");
      setSentence(randomSentence);
    }
  };

  // Initialize the sentence
  useEffect(() => {
    if (!userName || !userId) {
      // If userName or userId is not set, navigate back to home
      navigate("/");
    } else {
      generateSentence(typingMode, selectedTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingMode, selectedTime, userName, userId]);

  // Handle timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isRunning && timeLeft === 0) {
      finishTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft]);

  // Calculate errors for the current state of input
  const calculateErrors = (currentInput) => {
    let errors = 0;
    const inputLength = Math.min(currentInput.length, sentence.length);
    for (let i = 0; i < inputLength; i++) {
      if (currentInput[i] !== sentence[i]) {
        errors++;
      }
    }
    return errors;
  };

  // Handle user input changes
  const handleInputChange = (e) => {
    if (isFinished) {
      console.log("Test already finished");
      return;
    }

    const value = e.target.value;

    // Debug logs
    console.log("Current input:", value);
    console.log("Expected sentence:", sentence);
    console.log("Input length:", value.length);
    console.log("Sentence length:", sentence.length);
    console.log("Are they equal?", value === sentence);

    // Limit input to sentence length
    let limitedValue = value;
    if (value.length > sentence.length) {
      setErrorMessage("You've reached the end of the sentence.");
      limitedValue = value.slice(0, sentence.length);
    } else {
      setErrorMessage("");
    }

    if (!isRunning) {
      setIsRunning(true);
    }

    // Calculate new errors
    const newErrors = calculateErrors(limitedValue);

    // Check for additional errors by comparing with previous input
    if (limitedValue.length > previousInput.length) {
      const newChar = limitedValue[limitedValue.length - 1];
      const expectedChar = sentence[limitedValue.length - 1];
      if (newChar !== expectedChar) {
        setTotalErrors((prev) => prev + 1);
      }
    }

    setInput(limitedValue);
    setPreviousInput(limitedValue);
    setTypedChars(limitedValue.length);
    setCurrentErrors(newErrors);

    // Check for test completion
    if (limitedValue.length === sentence.length && limitedValue === sentence) {
      console.log("Test completion conditions met, finishing test...");
      finishTest(limitedValue);
    } else if (limitedValue.length === sentence.length) {
      console.log(
        "Lengths match but content differs. Current errors:",
        newErrors
      );
    }
  };

  // Finish the test and save results
  const finishTest = async (finalInput) => {
    // Double check completion conditions using finalInput
    if (isFinished || finalInput !== sentence) {
      console.log("Test not finished - conditions not met:", {
        isFinished,
        inputMatchesSentence: finalInput === sentence,
        input: finalInput,
        sentence,
      });
      return;
    }

    setIsRunning(false);
    setIsFinished(true);

    // Calculate WPM and Accuracy using totalErrors
    const testAccuracy =
      typedChars > 0
        ? (((typedChars - totalErrors) / typedChars) * 100).toFixed(2)
        : 0;
    const testWpm =
      elapsedTime > 0
        ? Math.floor((typedChars / 5) / (elapsedTime / 60))
        : 0;

    // Prepare the test data
    const newTest = {
      userId,
      wpm: Number(testWpm),
      accuracy: Number(testAccuracy),
      errorCount: Number(totalErrors),
      duration: Number(selectedTime),
    };

    console.log("Finishing Test with Errors:", totalErrors);
    console.log("Sending Test Data:", newTest);

    // Save the test results to the API
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTest),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the backend
        setErrorMessage(data.message || "Failed to save your results.");
      } else {
        console.log("Results saved successfully:", data.data);
      }
    } catch (error) {
      console.error("Error saving results:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  };

  // Handle key presses for the on-screen keyboard UI
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      generateSentence(typingMode, selectedTime);
    } else {
      setPressedKey(e.key.toLowerCase());
      setTimeout(() => setPressedKey(null), 150);
    }
  };

  // Add event listener for key presses
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingMode, selectedTime]);

  // Calculate display metrics
  const displayAccuracy =
    typedChars > 0
      ? (((typedChars - totalErrors) / typedChars) * 100).toFixed(2)
      : 0;
  const displayWpm =
    elapsedTime > 0
      ? ((typedChars / 5) / (elapsedTime / 60)).toFixed(0)
      : 0;

  return (
    <div
      className={`min-h-screen ${themes[selectedTheme].background} ${themes[selectedTheme].text} flex flex-col items-center justify-center p-4 relative`}
    >
      {/* Title */}
      <motion.h1
        className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Typing Test
      </motion.h1>

      {/* Navigation Buttons */}
      <div className="absolute top-4 right-4 flex flex-col sm:flex-row gap-2">
        <motion.button
          onClick={() => navigate("/")}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm sm:text-lg font-semibold shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go to Home"
        >
          Home
        </motion.button>
        <motion.button
          onClick={toggleThemeModal}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-500 hover:bg-gray-600 rounded-lg text-sm sm:text-lg font-semibold shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Select Theme"
        >
          Themes
        </motion.button>
        <motion.button
          onClick={() => navigate("/results")}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-green-500 hover:bg-green-600 rounded-lg text-sm sm:text-lg font-semibold shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="View Results"
        >
          Results
        </motion.button>
      </div>

      {/* Theme Selector Modal */}
      <AnimatePresence>
        {isThemeModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 max-w-lg w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-orange-300">
                Choose a Theme
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {Object.keys(themes).map((theme) => (
                  <motion.div
                    key={theme}
                    className={`cursor-pointer p-2 sm:p-4 rounded-lg border-2 ${
                      selectedTheme === theme
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedTheme(theme)}
                    style={{
                      background: themes[theme].background,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`h-full flex items-center justify-center text-xs sm:text-sm text-center ${
                        themes[theme].text
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={toggleThemeModal}
                className="mt-3 sm:mt-6 px-4 py-2 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close Theme Selector"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Configuration Options */}
      {!isRunning && !isFinished && (
        <motion.div
          className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Word / Sentence / Quote Mode Options */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <motion.button
              onClick={() => setTypingMode("simple")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded font-semibold text-sm sm:text-lg transition-all ${
                typingMode === "simple"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={typingMode === "simple"}
              aria-label="Select Simple Words"
            >
              Simple Words
            </motion.button>
            <motion.button
              onClick={() => setTypingMode("intermediate")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded font-semibold text-sm sm:text-lg transition-all ${
                typingMode === "intermediate"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={typingMode === "intermediate"}
              aria-label="Select Intermediate Words"
            >
              Intermediate Words
            </motion.button>
            <motion.button
              onClick={() => setTypingMode("sentence")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded font-semibold text-sm sm:text-lg transition-all ${
                typingMode === "sentence"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={typingMode === "sentence"}
              aria-label="Select Sentences"
            >
              Sentences
            </motion.button>
            <motion.button
              onClick={() => setTypingMode("quotes")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded font-semibold text-sm sm:text-lg transition-all ${
                typingMode === "quotes"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={typingMode === "quotes"}
              aria-label="Select Quotes"
            >
              Quotes
            </motion.button>
          </div>

          {/* Time Duration Options */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {[15, 30, 45].map((time) => (
              <motion.button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded font-semibold text-sm sm:text-lg transition-all ${
                  selectedTime === time
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={selectedTime === time}
                aria-label={`Select ${time} seconds`}
              >
                {time} seconds
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Timer Progress Bar */}
      {isRunning && (
        <motion.div
          className="w-full max-w-2xl bg-gray-700 rounded-full h-2 mb-4 sm:mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ originX: 0 }}
          transition={{ duration: selectedTime, ease: "linear" }}
        >
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${(timeLeft / selectedTime) * 100}%` }}
          ></div>
        </motion.div>
      )}

      {/* Typing Area */}
      {!isFinished && (
        <>
          <motion.div
            className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold tracking-wide leading-relaxed max-w-md sm:max-w-3xl text-center px-2"
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
          <motion.input
            type="text"
            value={input}
            onChange={handleInputChange}
            disabled={isFinished} // Disable input after test
            className={`w-full max-w-md sm:max-w-2xl px-4 sm:px-6 py-3 sm:py-4 rounded-lg bg-gray-800 text-white text-base sm:text-xl focus:outline-none shadow-lg`}
            placeholder="Start typing..."
            autoFocus
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            aria-label="Typing Input"
          />
          <div className="mt-2 sm:mt-4 text-sm sm:text-lg text-gray-400">
            Time Left: {timeLeft}s
          </div>
          <motion.div
            className="mt-2 sm:mt-4 flex items-center text-sm sm:text-base text-gray-400 italic px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Info Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-1a1 1 0 10-2 0v4a1 1 0 102 0V9z"
                clipRule="evenodd"
              />
            </svg>

            {/* Note Text */}
            <span>
              Press <kbd className="bg-gray-700 px-1 py-0.5 rounded">Tab</kbd> to restart the test and change words.
            </span>
          </motion.div>
          {errorMessage && (
            <p className="text-red-500 text-sm sm:text-lg mt-2 sm:mt-4">
              {errorMessage}
            </p>
          )}
        </>
      )}

      {/* Results */}
      {isFinished && (
        <motion.div
          className="text-center px-4 sm:px-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
            Results
          </h2>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 justify-center">
            <p className="text-base sm:text-xl">Name: {userName}</p>
            <p className="text-base sm:text-xl">Characters Typed: {typedChars}</p>
            <p className="text-base sm:text-xl">Errors: {totalErrors}</p>
            <p className="text-base sm:text-xl">Accuracy: {displayAccuracy}%</p>
            <p className="text-base sm:text-xl">WPM: {displayWpm}</p>
            {typingMode === "quotes" && (
              <p className="text-sm sm:text-base italic mt-2">
                Quote by: {quoteAuthor}
              </p>
            )}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm sm:text-lg mt-2 sm:mt-4">
              {errorMessage}
            </p>
          )}
          <motion.button
            onClick={() => generateSentence(typingMode, selectedTime)}
            className="mt-4 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-base sm:text-2xl shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Restart Test"
          >
            Restart Test
          </motion.button>
        </motion.div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg text-white text-base sm:text-xl max-w-sm w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Saving your results...
          </motion.div>
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
