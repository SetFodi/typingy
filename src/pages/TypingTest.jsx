// typingy/src/pages/TypingTest.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { simpleWords, intermediateWords, sentences, quotes } from "../wordLists";
import { motion, AnimatePresence } from "framer-motion";
import CryptoJS from "crypto-js";

//
// 1) Define your themes as before.
//
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

//
// 2) Define a mapping of profiles -> sound files.
//
//   Notice how we store "press_key" as an ARRAY so we can play random key sounds.
//   For special keys (Enter, Backspace, Space, etc.), we map them directly if available.
//
const soundProfiles = {
  alpaca: {
    press_key: [
      "/profiles/alpaca/press_key1.mp3",
      "/profiles/alpaca/press_key2.mp3",
      "/profiles/alpaca/press_key3.mp3",
      "/profiles/alpaca/press_key4.mp3",
      "/profiles/alpaca/press_key5.mp3",
    ],
    press_enter: "/profiles/alpaca/press_enter.mp3",
    press_back: "/profiles/alpaca/press_back.mp3",
    press_space: "/profiles/alpaca/press_space.mp3",
    release_key: "/profiles/alpaca/release_key.mp3",
    release_enter: "/profiles/alpaca/release_enter.mp3",
    release_back: "/profiles/alpaca/release_back.mp3",
    release_space: "/profiles/alpaca/release_space.mp3",
  },
  "gateron-black-ink": {
    press_key: [
      "/profiles/gateron-black-ink/press_key1.mp3",
      "/profiles/gateron-black-ink/press_key2.mp3",
      "/profiles/gateron-black-ink/press_key3.mp3",
      "/profiles/gateron-black-ink/press_key4.mp3",
      "/profiles/gateron-black-ink/press_key5.mp3",
    ],
    press_enter: "/profiles/gateron-black-ink/press_enter.mp3",
    press_back: "/profiles/gateron-black-ink/press_back.mp3",
    press_space: "/profiles/gateron-black-ink/press_space.mp3",
    release_key: "/profiles/gateron-black-ink/release_key.mp3",
    release_enter: "/profiles/gateron-black-ink/release_enter.mp3",
    release_back: "/profiles/gateron-black-ink/release_back.mp3",
    release_space: "/profiles/gateron-black-ink/release_space.mp3",
  },
  "gateron-red-ink": {
    press_key: [
      "/profiles/gateron-red-ink/press_key1.mp3",
      "/profiles/gateron-red-ink/press_key2.mp3",
      "/profiles/gateron-red-ink/press_key3.mp3",
      "/profiles/gateron-red-ink/press_key4.mp3",
      "/profiles/gateron-red-ink/press_key5.mp3",
    ],
    press_enter: "/profiles/gateron-red-ink/press_enter.mp3",
    press_back: "/profiles/gateron-red-ink/press_back.mp3",
    press_space: "/profiles/gateron-red-ink/press_space.mp3",
    release_key: "/profiles/gateron-red-ink/release_key.mp3",
    release_enter: "/profiles/gateron-red-ink/release_enter.mp3",
    release_back: "/profiles/gateron-red-ink/release_back.mp3",
    release_space: "/profiles/gateron-red-ink/release_space.mp3",
  },
  "holy-panda": {
    press_key: [
      "/profiles/holy-panda/press_key1.mp3",
      "/profiles/holy-panda/press_key2.mp3",
      "/profiles/holy-panda/press_key3.mp3",
      "/profiles/holy-panda/press_key4.mp3",
      "/profiles/holy-panda/press_key5.mp3",
    ],
    press_enter: "/profiles/holy-panda/press_enter.mp3",
    press_back: "/profiles/holy-panda/press_back.mp3",
    press_space: "/profiles/holy-panda/press_space.mp3",
    release_key: "/profiles/holy-panda/release_key.mp3",
    release_enter: "/profiles/holy-panda/release_enter.mp3",
    release_back: "/profiles/holy-panda/release_back.mp3",
    release_space: "/profiles/holy-panda/release_space.mp3",
  },
  "mx-blue": {
    press_key: [
      "/profiles/mx-blue/press_key1.mp3",
      "/profiles/mx-blue/press_key2.mp3",
      "/profiles/mx-blue/press_key3.mp3",
      "/profiles/mx-blue/press_key4.mp3",
      "/profiles/mx-blue/press_key5.mp3",
    ],
    // Single "release.mp3" for all releases
    release_key: "/profiles/mx-blue/release.mp3",
  },
  "mx-brown": {
    press_key: [
      "/profiles/mx-brown/press_key1.mp3",
      "/profiles/mx-brown/press_key2.mp3",
      "/profiles/mx-brown/press_key3.mp3",
      "/profiles/mx-brown/press_key4.mp3",
      "/profiles/mx-brown/press_key5.mp3",
    ],
    press_enter: "/profiles/mx-brown/press_enter.mp3",
    press_back: "/profiles/mx-brown/press_back.mp3",
    press_space: "/profiles/mx-brown/press_space.mp3",
    release_key: "/profiles/mx-brown/release_key.mp3",
    release_enter: "/profiles/mx-brown/release_enter.mp3",
    release_back: "/profiles/mx-brown/release_back.mp3",
    release_space: "/profiles/mx-brown/release_space.mp3",
  },
  "telios-v2": {
    // This profile uses `.wav` files; the approach is the same
    // We'll treat all letter/digit keys as "key1..key6.wav" (random)
    press_key: [
      "/profiles/telios-v2/key1.wav",
      "/profiles/telios-v2/key2.wav",
      "/profiles/telios-v2/key3.wav",
      "/profiles/telios-v2/key4.wav",
      "/profiles/telios-v2/key5.wav",
      "/profiles/telios-v2/key6.wav",
    ],
    press_back: "/profiles/telios-v2/back.wav",
    press_enter: "/profiles/telios-v2/ent.wav",
    press_space: "/profiles/telios-v2/space.wav",
    press_caps: "/profiles/telios-v2/caps.wav",
    press_ctrl: "/profiles/telios-v2/ctrl.wav",
    press_shift: "/profiles/telios-v2/shift.wav",
    press_tab: "/profiles/telios-v2/tab.wav",
    // For simplicity, you can add "release_key" or other if you want
    // or just omit them if you don’t need release sounds.
  },
  typewriter: {
    // We'll treat letter keys as "key.wav" or "key2.wav" (random)
    press_key: [
      "/profiles/typewriter/key.wav",
      "/profiles/typewriter/key2.wav",
    ],
    press_enter: "/profiles/typewriter/enter.wav",
    press_space: "/profiles/typewriter/space.wav",
    press_back: "/profiles/typewriter/delete.wav",
    // No release sounds in your file listing, so skip them here
  },
};

//
// 3) Main Component
//
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

  // For the on-screen keyboard highlight
  const [pressedKey, setPressedKey] = useState(null);

  // Theme Modal
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("default");

  // Loading + Error
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Keep track of old input for error counting
  const [previousInput, setPreviousInput] = useState("");

  // For quotes
  const [quoteAuthor, setQuoteAuthor] = useState("");

  // Keystroke capturing
  const [keystrokes, setKeystrokes] = useState([]);

  // The testId from the server
  const [testId, setTestId] = useState("");

  // ----------- NEW: Sound Profile -----------
  // Let's default to 'alpaca'. The user can pick from a dropdown if desired.
  const [soundProfile, setSoundProfile] = useState("alpaca");

  const navigate = useNavigate();

  // Retrieve user info from localStorage
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  // API URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  // Helper to calculate word count based on test duration
  const getWordCount = (seconds) => {
    const wordsPerMinute = 48;
    return Math.ceil((seconds / 60) * wordsPerMinute);
  };

  const toggleThemeModal = () => {
    setIsThemeModalOpen((prev) => !prev);
  };

  // 4) Start a new test session on the server
  const startTestSession = async (text) => {
    try {
      const response = await fetch(`${API_URL}/api/test/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text }),
      });
      const result = await response.json();
      if (result.success) {
        return result.data.testId;
      } else {
        setErrorMessage(result.message);
        return null;
      }
    } catch (error) {
      console.error("Error starting test session:", error);
      setErrorMessage("An unexpected error occurred.");
      return null;
    }
  };

  // 5) Generate a new sentence and start a test session
  const generateSentence = async (mode = typingMode, time = selectedTime) => {
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
    setQuoteAuthor("");
    setKeystrokes([]);

    let generatedText = "";
    if (mode === "quotes") {
      const randomQuoteObj = quotes[Math.floor(Math.random() * quotes.length)];
      generatedText = randomQuoteObj.text;
      setQuoteAuthor(randomQuoteObj.author);
    } else if (mode === "sentence") {
      generatedText = sentences[Math.floor(Math.random() * sentences.length)];
    } else {
      const wordPool = mode === "simple" ? simpleWords : intermediateWords;
      const wordCount = getWordCount(time);
      generatedText = Array.from({ length: wordCount }, () =>
        wordPool[Math.floor(Math.random() * wordPool.length)]
      ).join(" ");
    }

    setSentence(generatedText);
    const sessionId = await startTestSession(generatedText);
    setTestId(sessionId);
  };

  // 6) useEffect to set up test initially
  useEffect(() => {
    if (!userName || !userId) {
      navigate("/");
    } else {
      generateSentence(typingMode, selectedTime);
    }
    // eslint-disable-next-line
  }, [typingMode, selectedTime, userName, userId, navigate]);

  // 7) Timer logic
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
  }, [isRunning, timeLeft]);

  // 8) Error calculation
  const calculateErrors = (currentInput) => {
    let errors = 0;
    const len = Math.min(currentInput.length, sentence.length);
    for (let i = 0; i < len; i++) {
      if (currentInput[i] !== sentence[i]) {
        errors++;
      }
    }
    return errors;
  };

  const handleInputChange = (e) => {
    if (isFinished) {
      console.log("Test already finished");
      return;
    }
    const value = e.target.value;
    const timestamp = Date.now();
    setKeystrokes((prev) => [...prev, { key: value.slice(-1), timestamp }]);

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
    const newErrors = calculateErrors(limitedValue);
    // Compare newly typed char with expected
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
    // Auto-finish if typed full sentence perfectly
    if (limitedValue.length === sentence.length && limitedValue === sentence) {
      console.log("Test completion conditions met, finishing test...");
      finishTest(limitedValue);
    }
  };

  //
  // 9) FINISH TEST
  //
  const finishTest = async (finalInput) => {
    // If user typed EXACT sentence or time is up
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

    const testAccuracy =
      typedChars > 0
        ? (((typedChars - totalErrors) / typedChars) * 100).toFixed(2)
        : 0;
    const testWpm =
      elapsedTime > 0
        ? Math.floor((typedChars / 5) / (elapsedTime / 60))
        : 0;

    const newTest = {
      userId,
      testId,
      wpm: Number(testWpm),
      accuracy: Number(testAccuracy),
      errorCount: Number(totalErrors),
      duration: Number(selectedTime),
    };

    const signature = CryptoJS.HmacSHA256(
      JSON.stringify(newTest),
      process.env.REACT_APP_HMAC_SECRET
    ).toString();
    const payload = { ...newTest, signature, keystrokes };

    console.log("Finishing Test with Errors:", totalErrors);
    console.log("Sending Test Data with Signature:", payload);

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
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

  //
  // 10) SOUND-PLAYING HELPER FUNCTIONS
  //     We'll do "playPressSound(e.key)" on keydown, "playReleaseSound(e.key)" on keyup
  //

  // Safely play an audio file (handles if file doesn’t exist)
  const playAudio = (filePath) => {
    if (!filePath) return;
    const audio = new Audio(filePath);
    audio.currentTime = 0;
    audio.play().catch((err) => {
      // In case user didn't interact or there's a browser policy
      console.error("Audio play error:", err);
    });
  };

  // Which "press_" sound do we play for a given key?
  // If none match, we fallback to press_key array.
  const playPressSound = (key) => {
    const profile = soundProfiles[soundProfile];
    if (!profile) return;

    // Lowercase to match typical e.key
    const keyLower = key.toLowerCase();

    // Check for special keys first
    if (keyLower === "enter" && profile.press_enter) {
      playAudio(profile.press_enter);
    } else if ((keyLower === "backspace" || keyLower === "delete") && profile.press_back) {
      playAudio(profile.press_back);
    } else if ((keyLower === " " || keyLower === "spacebar") && profile.press_space) {
      playAudio(profile.press_space);
    } else if (keyLower === "capslock" && profile.press_caps) {
      playAudio(profile.press_caps);
    } else if ((keyLower === "control" || keyLower === "ctrl") && profile.press_ctrl) {
      playAudio(profile.press_ctrl);
    } else if (keyLower === "shift" && profile.press_shift) {
      playAudio(profile.press_shift);
    } else if (keyLower === "tab" && profile.press_tab) {
      playAudio(profile.press_tab);
    }
    // If not a special key, or if no special file is found, pick from press_key
    else if (profile.press_key && profile.press_key.length > 0) {
      const randomIndex = Math.floor(Math.random() * profile.press_key.length);
      playAudio(profile.press_key[randomIndex]);
    }
  };

  // Which "release_" sound do we play for a given key?
  // If none match, either do nothing or fallback to release_key.
  const playReleaseSound = (key) => {
    const profile = soundProfiles[soundProfile];
    if (!profile) return;

    const keyLower = key.toLowerCase();

    if (keyLower === "enter" && profile.release_enter) {
      playAudio(profile.release_enter);
    } else if (
      (keyLower === "backspace" || keyLower === "delete") &&
      profile.release_back
    ) {
      playAudio(profile.release_back);
    } else if ((keyLower === " " || keyLower === "spacebar") && profile.release_space) {
      playAudio(profile.release_space);
    }
    // If no specialized release for that key, fallback to a general "release_key" if it exists
    else if (profile.release_key) {
      playAudio(profile.release_key);
    }
  };

  //
  // 11) KEY EVENTS
  //
  // - We'll incorporate the existing handleKeyDown logic plus sound playing
  // - We'll add a keyup listener for release sounds
  //

  const onKeyDown = (e) => {
    // If user hits TAB => restart test
    if (e.key === "Tab") {
      e.preventDefault();
      generateSentence(typingMode, selectedTime);
      return;
    }

    // 1) Highlight the on-screen keyboard
    setPressedKey(e.key.toLowerCase());
    // 2) Play the press sound
    playPressSound(e.key);
  };

  const onKeyUp = (e) => {
    // 1) Remove highlight
    setPressedKey(null);
    // 2) Play the release sound
    playReleaseSound(e.key);
  };

  // Attach keydown/up listeners
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line
  }, [soundProfile, typingMode, selectedTime]);

  //
  // 12) Derive metrics for display
  //
  const displayAccuracy =
    typedChars > 0
      ? (((typedChars - totalErrors) / typedChars) * 100).toFixed(2)
      : 0;
  const displayWpm =
    elapsedTime > 0
      ? ((typedChars / 5) / (elapsedTime / 60)).toFixed(0)
      : 0;

  if (!userName || !userId) {
    return <div>Loading...</div>;
  }

  //
  // 13) Rendering the main JSX
  //
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
                    style={{ background: themes[theme].background }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`h-full flex items-center justify-center text-xs sm:text-sm text-center ${themes[theme].text}`}
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

      {!isFinished && !isRunning && (
  <motion.div
    className="absolute top-4 left-4 bg-gray-800 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <label htmlFor="soundProfile" className="text-white text-sm sm:text-base">
      Sound:
    </label>
    <select
      id="soundProfile"
      className="bg-gray-700 hover:bg-gray-600 text-white text-sm sm:text-base rounded px-2 py-1 focus:outline-none transition-all"
      value={soundProfile}
      onChange={(e) => setSoundProfile(e.target.value)}
    >
      {Object.keys(soundProfiles).map((profileKey) => (
        <option key={profileKey} value={profileKey}>
          {profileKey}
        </option>
      ))}
    </select>
  </motion.div>
)}


      {/* Test Configuration Options */}
      {!isRunning && !isFinished && (
        <motion.div
          className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
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
            disabled={isFinished}
            className="w-full max-w-md sm:max-w-2xl px-4 sm:px-6 py-3 sm:py-4 rounded-lg bg-gray-800 text-white text-base sm:text-xl focus:outline-none shadow-lg"
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
            <span>
              Press <kbd className="bg-gray-700 px-1 py-0.5 rounded">Tab</kbd> to
              restart the test and change words.
            </span>
          </motion.div>
          {errorMessage && (
            <p className="text-red-500 text-sm sm:text-lg mt-2 sm:mt-4">
              {errorMessage}
            </p>
          )}
        </>
      )}

      {/* Results Display */}
      {isFinished && (
        <motion.div
          className="text-center px-4 sm:px-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Results</h2>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 justify-center">
            <p className="text-base sm:text-xl">Name: {userName}</p>
            <p className="text-base sm:text-xl">Characters Typed: {typedChars}</p>
            <p className="text-base sm:text-xl">Errors: {totalErrors}</p>
            <p className="text-base sm:text-xl">
              Accuracy: {displayAccuracy}%
            </p>
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
          <motion.div
            className="progress-bar mt-4"
            initial={{ width: 0 }}
            animate={{ width: `${displayAccuracy}%` }}
            transition={{ duration: 1 }}
          >
            <div className="progress-fill bg-green-500 h-2 rounded-full"></div>
          </motion.div>
        </motion.div>
      )}

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

      {/* On-Screen Keyboard */}
      <div className="mt-12 max-w-5xl p-4 rounded-lg shadow-lg relative">
        <div className="flex flex-col gap-2">
          <div className="flex justify-center gap-2">
            {[..."qwertyuiop"].map((key) => (
              <motion.div
                key={key}
                className={`w-12 h-12 flex justify-center items-center rounded-lg ${
                  themes[selectedTheme].keyboard
                } text-2xl font-bold shadow-md ${
                  pressedKey === key ? themes[selectedTheme].keyPressed : ""
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.1 }}
              >
                {key}
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-2 ml-6">
            {[..."asdfghjkl"].map((key) => (
              <motion.div
                key={key}
                className={`w-12 h-12 flex justify-center items-center rounded-lg ${
                  themes[selectedTheme].keyboard
                } text-2xl font-bold shadow-md ${
                  pressedKey === key ? themes[selectedTheme].keyPressed : ""
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.1 }}
              >
                {key}
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-2 ml-12">
            {[..."zxcvbnm"].map((key) => (
              <motion.div
                key={key}
                className={`w-12 h-12 flex justify-center items-center rounded-lg ${
                  themes[selectedTheme].keyboard
                } text-2xl font-bold shadow-md ${
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
