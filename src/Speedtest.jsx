"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

const Speedtest = () => {
    // A larger, more interesting sample text
    const [sampleText, setSampleText] = useState("");
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    const intervalRef = useRef(null);
    const inputRef = useRef(null);

    // Array of different paragraphs for variety
    const textSamples = [
        "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Typing it helps test all keys.",
        "Technology has revolutionized the way we live and work. From smartphones to artificial intelligence, innovation continues to shape our future.",
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune.",
        "The sun dipped below the horizon, painting the sky in shades of orange and pink. A gentle breeze rustled the leaves of the trees, creating a soothing melody.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. This is a journey of perseverance and resilience."
    ];

    // Function to get a new random paragraph, wrapped in useCallback
    const getNewParagraph = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * textSamples.length);
        setSampleText(textSamples[randomIndex]);
    }, []);

    // Fetch a new paragraph when the component mounts
    useEffect(() => {
        getNewParagraph();
    }, [getNewParagraph]);
    
    // Focus the input when the component loads or resets
    useEffect(() => {
        if (!isFinished && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFinished]);


    const startTimer = () => {
        if (!startTime) {
            const now = Date.now();
            setStartTime(now);
            intervalRef.current = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - now) / 1000));
            }, 1000);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (!startTime) {
            startTimer();
        }
        setInput(value);

        if (value.length >= sampleText.length) {
            clearInterval(intervalRef.current);
            setIsFinished(true);

            const seconds = (Date.now() - startTime) / 1000;
            const words = sampleText.split(" ").length;
            const wpmCalc = Math.round((words / seconds) * 60);
            
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

    const handleReset = () => {
        clearInterval(intervalRef.current);
        setInput("");
        setStartTime(null);
        setTimeElapsed(0);
        setIsFinished(false);
        setWpm(0);
        setAccuracy(0);
        getNewParagraph(); // Get a new paragraph on reset
    };
    
    // Renders the sample text with color-coded characters
    const renderText = () => {
        return sampleText.split("").map((char, index) => {
            let color = "text-gray-500"; // Default color for untyped text
            if (index < input.length) {
                color = char === input[index] ? "text-green-400" : "text-red-500 underline";
            }
            return <span key={index} className={color}>{char}</span>;
        });
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center font-mono p-4">
            <div className="w-full max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
                    Typing Speed Test
                </h1>
                <p className="text-center text-indigo-400 mb-8">How fast can you type?</p>

                {/* Stats Display */}
                <div className="flex justify-around items-center bg-gray-800 p-4 rounded-lg shadow-lg mb-8 text-white">
                    <div className="text-center">
                        {/* Timer SVG Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 h-8 w-8 text-yellow-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span className="text-3xl font-semibold">{timeElapsed}</span>
                        <p className="text-sm text-gray-400">Seconds</p>
                    </div>
                    <div className="text-center">
                        {/* Zap SVG Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 h-8 w-8 text-green-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        <span className="text-3xl font-semibold">{wpm}</span>
                        <p className="text-sm text-gray-400">WPM</p>
                    </div>
                </div>

                {/* Text Display & Input Area */}
                <div className="relative">
                     {!isFinished && (
                        <>
                            <div className="bg-gray-800 p-6 rounded-lg shadow-inner text-2xl leading-relaxed tracking-wider select-none">
                                {renderText()}
                                {/* Blinking cursor */}
                                <span className="animate-ping">|</span>
                            </div>
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleChange}
                                disabled={isFinished}
                                className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-white text-2xl leading-relaxed tracking-wider outline-none p-6"
                                placeholder=""
                            />
                        </>
                    )}
                </div>

                {/* Results Screen */}
                {isFinished && (
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-white mb-2">Test Complete!</h2>
                        <p className="text-gray-400 mb-6">Here are your results:</p>
                        <div className="flex justify-around items-center text-white">
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <p className="text-xl text-gray-400">WPM</p>
                                <p className="text-5xl font-bold text-green-400">{wpm}</p>
                            </div>
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <p className="text-xl text-gray-400">Accuracy</p>
                                <p className="text-5xl font-bold text-blue-400">{accuracy}%</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Reset Button */}
                <div className="text-center mt-8">
                    <button 
                        onClick={handleReset}
                        className="flex items-center justify-center mx-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        {/* RefreshCw SVG Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                        {isFinished ? 'Try Again' : 'Reset'}
                    </button>
                </div>
            </div>
            
             <style jsx global>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Speedtest;

