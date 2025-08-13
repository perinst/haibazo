import { useCallback, useRef } from "react";
import { GAME_CONFIG } from "../types";

export const useInterval = () => {
  const intervalRef = useRef<number | undefined>(undefined);

  const startInterval = useCallback((callback: () => void, delay: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(callback, delay);
  }, []);

  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  return {
    startInterval,
    clearInterval: clearIntervalRef,
    intervalRef,
  };
};

export const useCountdown = (onComplete: () => void, isActive: boolean) => {
  const { startInterval, clearInterval } = useInterval();

  const startCountdown = useCallback(
    (setTime: (fn: (prev: number) => number) => void) => {
      if (!isActive) return;

      startInterval(() => {
        setTime((prev) => {
          const newTime = prev - 0.1;
          if (newTime <= 0) {
            clearInterval();
            onComplete();
            return 0;
          }
          return newTime;
        });
      }, GAME_CONFIG.COUNTDOWN_UPDATE_INTERVAL);
    },
    [isActive, onComplete, startInterval, clearInterval]
  );

  return {
    startCountdown,
    stopCountdown: clearInterval,
  };
};
