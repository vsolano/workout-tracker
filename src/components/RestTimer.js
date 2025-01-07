import React, { useState, useEffect } from 'react';

const RestTimer = ({ startTime }) => {
    const [restTime, setRestTime] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    useEffect(() => {
        setRestTime(60); // Reset timer when startTime changes
        setIsTimerRunning(true);
    }, [startTime]);

    useEffect(() => {
        let interval;
        if (isTimerRunning && restTime > 0) {
            interval = setInterval(() => {
                setRestTime(prev => prev - 1);
            }, 1000);
        } else if (restTime === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, restTime]);

    return (
        <div>
            <p>Rest Time: {restTime}s</p>
        </div>
    );
};

export default RestTimer;
