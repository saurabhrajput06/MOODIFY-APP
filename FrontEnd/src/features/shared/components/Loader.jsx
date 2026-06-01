import React, { useState, useEffect } from "react";
import "./Loader.scss";

const LOADING_MESSAGES = [
  "Syncing your vibe...",
  "Decoding your expressions...",
  "Finetuning audio frequencies...",
  "Preparing the perfect beats...",
  "Scanning your mood energy...",
];

const Loader = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="moodify-loader-container" id="moodify-global-loader">
      {/* Background glow layers */}
      <div className="loader-glow circle-purple"></div>
      <div className="loader-glow circle-cyan"></div>
      <div className="loader-glow circle-pink"></div>

      <div className="loader-content-box">
        {/* Neon Vinyl Spinner */}
        <div className="spinning-vinyl-loader">
          <div className="vinyl-groove"></div>
          <div className="vinyl-groove second"></div>
          <div className="vinyl-center">
            <span className="vinyl-logo">M</span>
          </div>
          <div className="vinyl-glowing-ring"></div>
        </div>

        {/* Brand Header */}
        <h1 className="loader-brand">
          Mood<span>ify</span>
        </h1>

        {/* Dynamic status text */}
        <div className="loader-status">
          <p className="status-text">{LOADING_MESSAGES[messageIndex]}</p>
          <div className="status-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Equalizer Visualizer */}
        <div className="loader-visualizer">
          <div className="visualizer-bar"></div>
          <div className="visualizer-bar"></div>
          <div className="visualizer-bar"></div>
          <div className="visualizer-bar"></div>
          <div className="visualizer-bar"></div>
          <div className="visualizer-bar"></div>
          <div className="visualizer-bar"></div>
          <div className="visualizer-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
