"use client";
import { SlidingNumber } from "@/components/motion-primitives/sliding-number";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
}

export function CountdownTimer({
  targetDate,
  onComplete,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        onComplete?.();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const shouldShowDays = timeLeft.days > 0;

  return (
    <div
      className={`flex items-center gap-1 font-mono text-sm ${className || ""}`}
    >
      {shouldShowDays && (
        <>
          <SlidingNumber value={timeLeft.days} padStart={true} />
          <span className="text-zinc-500">d</span>
        </>
      )}
      <SlidingNumber value={timeLeft.hours} padStart={true} />
      <span className="text-zinc-500">h</span>
      <SlidingNumber value={timeLeft.minutes} padStart={true} />
      <span className="text-zinc-500">m</span>
      <SlidingNumber value={timeLeft.seconds} padStart={true} />
      <span className="text-zinc-500">s</span>
    </div>
  );
}
