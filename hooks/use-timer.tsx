import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

const TIMER_STORAGE_KEY = 'breastfeeding_timer';

interface TimerState {
  isRunning: boolean;
  currentSide: 'left' | 'right' | null;
  leftDuration: number;
  rightDuration: number;
  startTime: number | null;
}

export const [TimerProvider, useTimer] = createContextHook(() => {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    currentSide: null,
    leftDuration: 0,
    rightDuration: 0,
    startTime: null,
  });
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved timer state
  useEffect(() => {
    AsyncStorage.getItem(TIMER_STORAGE_KEY).then(saved => {
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        if (parsed.isRunning && parsed.startTime) {
          // Resume timer if it was running
          const elapsed = Date.now() - parsed.startTime;
          if (parsed.currentSide === 'left') {
            setState(prev => ({ ...prev, leftDuration: prev.leftDuration + Math.floor(elapsed / 1000) }));
          } else if (parsed.currentSide === 'right') {
            setState(prev => ({ ...prev, rightDuration: prev.rightDuration + Math.floor(elapsed / 1000) }));
          }
        }
      }
    });
  }, []);

  // Save timer state
  useEffect(() => {
    AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Timer interval
  useEffect(() => {
    if (state.isRunning && state.currentSide) {
      intervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          [prev.currentSide === 'left' ? 'leftDuration' : 'rightDuration']: 
            prev[prev.currentSide === 'left' ? 'leftDuration' : 'rightDuration'] + 1,
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.currentSide]);

  const startTimer = (side: 'left' | 'right') => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      currentSide: side,
      startTime: Date.now(),
    }));
  };

  const pauseTimer = () => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      startTime: null,
    }));
  };

  const switchSide = () => {
    const newSide = state.currentSide === 'left' ? 'right' : 'left';
    setState(prev => ({
      ...prev,
      currentSide: newSide,
      startTime: Date.now(),
    }));
  };

  const resetTimer = () => {
    setState({
      isRunning: false,
      currentSide: null,
      leftDuration: 0,
      rightDuration: 0,
      startTime: null,
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    ...state,
    startTimer,
    pauseTimer,
    switchSide,
    resetTimer,
    formatTime,
    totalDuration: state.leftDuration + state.rightDuration,
  };
});