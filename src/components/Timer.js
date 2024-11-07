import React, { useState, useEffect, useRef } from "react";
import "../assets/styles/Timer.css";

const CountdownTimer = () => {
  const [time, setTime] = useState(2400);
  const [selectedTime, setSelectedTime] = useState(2400);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const calculateRemainingTime = () => {
    const savedTime = parseInt(localStorage.getItem("remainingTime"), 10);
    const savedSelectedTime = parseInt(
      localStorage.getItem("selectedTime"),
      10
    );
    const savedStartTime = parseInt(localStorage.getItem("startTime"), 10);

    if (savedTime && savedStartTime && savedSelectedTime) {
      const elapsed = Math.floor((Date.now() - savedStartTime) / 1000);
      const remainingTime = savedTime - elapsed;

      return {
        time: remainingTime > 0 ? remainingTime : 0,
        selectedTime: savedSelectedTime,
      };
    }
    return { time: selectedTime, selectedTime };
  };

  useEffect(() => {
    const { time: initialRemainingTime, selectedTime: initialSelectedTime } =
      calculateRemainingTime();
    if (initialRemainingTime > 0) {
      setTime(initialRemainingTime);
      setIsRunning(true);
    } else {
      setTime(initialRemainingTime);
      setSelectedTime(initialSelectedTime);
    }

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const updatedTime = prevTime - 1;
          if (updatedTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            localStorage.removeItem("remainingTime");
            localStorage.removeItem("startTime");
            localStorage.removeItem("selectedTime");
            return 0;
          }
          return updatedTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    localStorage.setItem("remainingTime", time);
    localStorage.setItem("selectedTime", selectedTime);
    localStorage.setItem("startTime", Date.now());

    return () => clearInterval(intervalRef.current);
  }, [isRunning, time, selectedTime]);

  const handleTimeChange = (e) => {
    const newTime = parseInt(e.target.value) * 60;
    setSelectedTime(newTime);
    setTime(newTime);
    setIsRunning(false);
    clearInterval(intervalRef.current);
    localStorage.setItem("selectedTime", newTime);
    localStorage.removeItem("remainingTime");
    localStorage.removeItem("startTime");
  };

  const handleStart = () => {
    if (time > 0) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime(selectedTime);
    setIsRunning(false);
    clearInterval(intervalRef.current);
    localStorage.setItem("remainingTime", selectedTime);
    localStorage.setItem("selectedTime", selectedTime);
    localStorage.setItem("startTime", Date.now());
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    ((selectedTime - time) / selectedTime) * circumference;

  return (
    <div className="timer">
      <h1>Countdown Timer</h1>
      <div className="select-wrapper">
        <select value={selectedTime / 60} onChange={handleTimeChange}>
          <option value={5}>5 minutes</option>
          <option value={10}>10 minutes</option>
          <option value={15}>15 minutes</option>
          <option value={20}>20 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={40}>40 minutes</option>
        </select>
      </div>
      <div className="circle">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} className="background-circle" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="progress-circle"
            style={{ strokeDasharray, strokeDashoffset }}
          />
        </svg>
        <div className="time-text">{formatTime(time)}</div>
      </div>
      <div className="controls">
        <button className="start" onClick={handleStart}>
          Start
        </button>
        <button className="stop" onClick={handleStop}>
          Stop
        </button>
        <button className="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default CountdownTimer;
