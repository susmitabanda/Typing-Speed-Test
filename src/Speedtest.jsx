import React, { useState, useEffect, useRef } from "react";

const Speedtest = () => {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);

  const intervalRef = useRef(null);
  const sampleText = "The quick brown fox jumps over the lazy dog.";

  const handleChange = (e) => {
    const value = e.target.value;

    // Start timer on first keypress
    if (!startTime) {
      const now = Date.now();
      setStartTime(now);

      // Start interval
      intervalRef.current = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - now) / 1000));
      }, 1000);
    }

    setInput(value);

    // If user finishes typing
    if (value === sampleText) {
      clearInterval(intervalRef.current);
      setIsFinished(true);

      const seconds = (Date.now() - startTime) / 1000;
      const words = sampleText.split(" ").length;
      const wpmCalc = Math.round((words / seconds) * 60);
      setWpm(wpmCalc);
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setInput("");
    setStartTime(null);
    setTimeElapsed(0);
    setIsFinished(false);
    setWpm(0);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1 className="text-green-800 font-serif text-5xl mb-6">⏱ Typing Speed Test ⌨</h1>
      <p class="text-2xl mb-3 text-red-500 font-mono"><strong>⌨Type this:</strong></p>
      <p style={{ background: "#eee", padding: "1rem", borderRadius: "8px", fontStyle:"italic"}}>
        {sampleText}
      </p>

      <textarea
        value={input}
        onChange={handleChange}
        disabled={isFinished}
        rows="5"
        style={{ width: "100%", fontSize: "16px", padding: "1rem", marginTop: "1rem", border:"2px solid green" ,borderRadius:"10px"}}
        placeholder="Start typing here..."
      />

      <div style={{ marginTop: "1rem" }}>
        <p class="text-2xl mb-3 text-red-500 font-mono"><strong>⏱ Time:</strong> {timeElapsed} seconds</p>
        {isFinished && <p><strong>WPM:</strong> {wpm}</p>}
        <button onClick={handleReset}
        style={{backgroundColor:'green',
                color: 'white',
                padding:'10px 20px',
                borderRadius:'10px',
                fontWeight: 'bold'

        }}>Reset</button>
      </div>
    </div>
  );
};

export default Speedtest;
