import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime, onTimeExpired) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef(null);
  const onTimeExpiredRef = useRef(onTimeExpired);

  // Cập nhật callback ref khi onTimeExpired thay đổi
  useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired;
  }, [onTimeExpired]);

  // Format thời gian hiển thị
  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  // Reset timer khi initialTime thay đổi
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  // Khởi tạo timer khi component mount
  useEffect(() => {
    if (initialTime <= 0) {
      console.warn('Initial time is 0 or negative:', initialTime);
      return;
    }

    console.log('Starting timer with:', initialTime, 'seconds');

    // Clear previous interval nếu có
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        
        if (prevTime <= 1) {
          // Hết thời gian
          clearInterval(intervalRef.current);
          
          if (onTimeExpiredRef.current) {
            onTimeExpiredRef.current();
          }
          return 0;
        }
        
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initialTime]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    timeDisplay: formatTime(timeLeft),
    isExpired: timeLeft <= 0
  };
};