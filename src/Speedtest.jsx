"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

const Speedtest = () => {
    // State variables
    const [sampleText, setSampleText] = useState("");
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [errors, setErrors] = useState(0);

    // Refs for intervals and DOM elements
    const intervalRef = useRef(null);
    const inputRef = useRef(null);

    // Array of text samples for variety
    const textSamples = [
        "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet, making it a classic for practice.",
        "Technology has revolutionized our world. From artificial intelligence to blockchain, we are living in an era of rapid digital transformation and innovation.",
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
        "The sun dipped below the horizon, painting the sky in fiery shades of orange, pink, and purple. A gentle breeze whispered through the tall grass, a soothing melody for the soul.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. This journey requires perseverance, resilience, and an unwavering belief in oneself."
    ];

    // Get a new random paragraph
    const getNewParagraph = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * textSamples.length);
        setSampleText(textSamples[randomIndex]);
    }, []);

    // Initialize with a new paragraph on component mount
    useEffect(() => {
        getNewParagraph();
    }, [getNewParagraph]);
    
    // Auto-focus the input field
    useEffect(() => {
        if (!isFinished && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFinished, sampleText]);

    // Start the timer on the first keypress
    const startTimer = () => {
        if (!startTime) {
            const now = Date.now();
            setStartTime(now);
            intervalRef.current = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - now) / 1000));
            }, 1000);
        }
    };

    // Handle user input changes
    const handleChange = (e) => {
        const value = e.target.value;
        if (isFinished) return;

        if (!startTime) {
            startTimer();
        }
        
        // Count errors
        let errorCount = 0;
        for(let i=0; i < value.length; i++){
            if(value[i] !== sampleText[i]){
                errorCount++;
            }
        }
        setErrors(errorCount);
        setInput(value);

        // Check for completion
        if (value.length === sampleText.length) {
            clearInterval(intervalRef.current);
            setIsFinished(true);

            const seconds = (Date.now() - startTime) / 1000;
            const words = sampleText.split(" ").length;
            const wpmCalc = Math.round((words / (seconds / 60)));
            
            let correctChars = 0;
            for (let i = 0; i < sampleText.length; i++) {
                if (sampleText[i] === value[i]) {
                    correctChars++;
                }
            }
            const accuracyCalc = Math.round((correctChars / sampleText.length) * 100);

            setWpm(wpmCalc);
            setAccuracy(accuracyCalc);
        }
    };

    // Reset the test
    const handleReset = () => {
        clearInterval(intervalRef.current);
        setInput("");
        setStartTime(null);
        setTimeElapsed(0);
        setIsFinished(false);
        setWpm(0);
        setAccuracy(0);
        setErrors(0);
        getNewParagraph();
    };
    
    // Render the sample text with color-coded feedback
    const renderText = () => {
        return sampleText.split("").map((char, index) => {
            let className = "text-gray-400"; // Untyped text
            if (index < input.length) {
                className = char === input[index] ? "text-emerald-300" : "text-red-400 bg-red-500/20 rounded-sm";
            } else if (index === input.length) {
                // This is the cursor position
                return (
                    <span key={index} className="blinking-cursor text-sky-300">
                        {char}
                    </span>
                );
            }
            return <span key={index} className={className}>{char}</span>;
        });
    };

    return (
        <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center font-sans p-4 bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white">
            <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-2">
                    Typing Speed Test
                </h1>
                <p className="text-center text-sky-300 mb-8">Measure your typing skill, speed, and accuracy.</p>

                {/* Stats Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
                    {/* Time */}
                    <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400">Time</p>
                        <p className="text-3xl font-semibold text-yellow-400">{timeElapsed}s</p>
                    </div>
                    {/* WPM */}
                     <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400">WPM</p>
                        <p className="text-3xl font-semibold text-green-400">{wpm}</p>
                    </div>
                     {/* Accuracy */}
                      <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400">Accuracy</p>
                        <p className="text-3xl font-semibold text-blue-400">{isFinished ? `${accuracy}%` : '-'}</p>
                    </div>
                    {/* Errors */}
                     <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400">Errors</p>
                        <p className="text-3xl font-semibold text-red-400">{errors}</p>
                    </div>
                </div>

                {/* Text Display & Input Area */}
                <div className="relative">
                     {!isFinished ? (
                        <>
                            <div className="bg-black/20 p-6 rounded-lg shadow-inner text-2xl leading-relaxed tracking-wide select-none text-left h-48 overflow-y-auto">
                                {renderText()}
                            </div>
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleChange}
                                className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-sky-300 text-2xl leading-relaxed tracking-wide outline-none p-6 resize-none"
                                placeholder=""
                            />
                        </>
                    ) : (
                        <div className="bg-black/20 p-8 rounded-lg shadow-xl text-center animate-fade-in-up h-48 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Test Complete!</h2>
                            <p className="text-gray-300 mb-6">You are a typing pro!</p>
                            <div className="flex justify-center items-center space-x-8 text-white">
                                <div>
                                    <p className="text-lg text-gray-400">WPM</p>
                                    <p className="text-5xl font-bold text-green-400">{wpm}</p>
                                </div>
                                <div>
                                    <p className="text-lg text-gray-400">Accuracy</p>
                                    <p className="text-5xl font-bold text-blue-400">{accuracy}%</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Reset Button */}
                <div className="text-center mt-8">
                    <button 
                        onClick={handleReset}
                        className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300/50"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                        {/* RefreshCw SVG Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                        <span className="relative">{isFinished ? 'Try Again' : 'Reset'}</span>
                    </button>
                </div>
            </div>
            
             <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                body {
                    font-family: 'Poppins', sans-serif;
                }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
                @keyframes blink {
                    0%, 100% { background-color: transparent; }
                    50% { background-color: rgba(125, 211, 252, 0.5); }
                }
                .blinking-cursor {
                    border-radius: 2px;
                    animation: blink 1s infinite;
                }
             `}</style>
        </div>
    );
};

export default Speedtest;

