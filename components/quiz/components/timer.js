import React, { useState, useEffect } from "react";

export default function CountdownTimer({ initialSeconds, onComplete, start, reset, stop  }) {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        setSeconds(0);
    }, [stop])

    useEffect(() => {
        setSeconds(initialSeconds);
    }, [reset])
    
    useEffect(() => {
        // Exit early if countdown is finished
        if (seconds <= 0) {
            onComplete();
            return;
        }
        
        if (start) {
            // Set up the timer
            const timer = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds-1);
            }, 1000);
            
            // Clean up the timer
            return () => clearInterval(timer)
        }
    }, [seconds, start]);
    
    // Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };
    
    return (
        <div style={seconds<=5 ? {backgroundColor: '#cf2323', color:'#fff'} : {}}>{formatTime(seconds)}</div>
    );
};