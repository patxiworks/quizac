import React, { useState, useEffect } from "react";

export default function CountdownTimer({ 
    initialSeconds, // duration in seconds
    onComplete, // callback after completion of timer
    getTime = ()=>void 0, // callback to get the current time
    start, // if true, starts the timer
    reset, // if true resets the timer
    stop  // if true stops the timer
}) {
    //console.log(initialSeconds, start, reset, stop)
    const [seconds, setSeconds] = useState(initialSeconds);
    const [arrSeconds, setArrSeconds] = useState([]);

    useEffect(() => {
        getTime(arrSeconds.length ? arrSeconds : parseInt(initialSeconds-seconds));
        setSeconds(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stop])

    useEffect(() => {
        // capture each time spent before a reset
        if (reset !== undefined) setArrSeconds([...arrSeconds, parseInt(initialSeconds-seconds)])
        setSeconds(initialSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset])
    
    useEffect(() => {
        // Exit early if countdown is finished
        if (start && seconds <= 0) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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