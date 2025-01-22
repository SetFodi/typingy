import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import TypingTest from "./pages/TypingTest";
import Results from "./pages/Results";

const App = () => {
  return (
    <Router>
      <AnimatePresence>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<TypingTest />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;
