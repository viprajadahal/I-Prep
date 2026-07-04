import { useState, useEffect, useRef, useCallback } from 'react';

const useTimer = (initialSeconds = 0, autoStart = false) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSeconds) => {
    setSeconds(newSeconds || initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);
  const restart = useCallback((newSeconds) => {
    setSeconds(newSeconds || initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const formatTime = useCallback(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [seconds]);

  const formatTimeLong = useCallback(() => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, [seconds]);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    restart,
    formatTime,
    formatTimeLong,
  };
};

export default useTimer;