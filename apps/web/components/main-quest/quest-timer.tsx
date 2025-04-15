import React, { useState, useEffect } from "react";
import { Clock, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuestTimerProps = {
  duration: string; // "15 mins", "30 mins", etc.
  onComplete?: () => void;
  questId: string;
};

const QuestTimer = ({ duration, onComplete, questId }: QuestTimerProps) => {
  // Convert duration string to seconds (e.g., "15 mins" -> 900 seconds)
  const getDurationInSeconds = () => {
    const match = duration.match(/(\d+)/);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    if (duration.includes("min")) return value * 60;
    if (duration.includes("hour")) return value * 60 * 60;
    if (duration.includes("sec")) return value;
    return value * 60; // Default to minutes
  };

  const initialTime = getDurationInSeconds();
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  // Check local storage for saved timer state
  useEffect(() => {
    const savedTimer = localStorage.getItem(`quest-timer-${questId}`);
    if (savedTimer) {
      const timerData = JSON.parse(savedTimer);
      const elapsedTime = Math.floor((Date.now() - timerData.timestamp) / 1000);
      const remainingTime = timerData.timeLeft - elapsedTime;

      if (remainingTime > 0 && timerData.isRunning) {
        setTimeLeft(remainingTime);
        setIsRunning(true);
        setTimerStarted(true);
      } else if (remainingTime <= 0 && timerData.isRunning) {
        // Timer completed while away
        setTimeLeft(0);
        setIsRunning(false);
        setTimerStarted(true);
        localStorage.removeItem(`quest-timer-${questId}`);
        if (onComplete) onComplete();
      } else {
        setTimeLeft(timerData.timeLeft);
        setTimerStarted(timerData.started);
      }
    }
  }, [questId, onComplete]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newValue = prev - 1;
          // Save timer state to localStorage
          localStorage.setItem(
            `quest-timer-${questId}`,
            JSON.stringify({
              timeLeft: newValue,
              isRunning: newValue > 0,
              timestamp: Date.now(),
              started: true,
            })
          );

          if (newValue <= 0) {
            clearInterval(interval);
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, questId, onComplete]);

  const toggleTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
    setIsRunning(!isRunning);
  };

  const formatTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / initialTime) * 100;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 text-xs text-quest-gray">
          <Clock className="h-3 w-3" />
          <span>{timerStarted ? formatTime() : duration}</span>
        </div>
        {timerStarted && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={toggleTimer}
          >
            {isRunning ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      {timerStarted && (
        <div className="w-full h-1 bg-quest-navy rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              progress > 30
                ? progress > 60
                  ? "bg-green-500"
                  : "bg-yellow-500"
                : "bg-red-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default QuestTimer;
