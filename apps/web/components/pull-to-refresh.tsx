"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowDown, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PullToRefresh() {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const threshold = 80; // Pixels needed to pull to trigger refresh

  // Use refs to persist values between events
  const startYRef = useRef(0);
  const scrollPositionRef = useRef(0);
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      scrollPositionRef.current = window.scrollY;
      if (scrollPositionRef.current <= 0) {
        startYRef.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      if (scrollPositionRef.current > 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;

      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        setTimeout(() => {
          router.refresh();
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
        }, 1000);
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      if (window.scrollY <= 0 && e.button === 0) {
        isMouseDownRef.current = true;
        startYRef.current = e.clientY;
        setIsPulling(true);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current || !isPulling) return;
      if (window.scrollY > 0) return;

      const currentY = e.clientY;
      const distance = currentY - startYRef.current;

      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
      } else {
        setPullDistance(0);
      }
    };

    const handleMouseUp = () => {
      if (!isMouseDownRef.current) return;

      isMouseDownRef.current = false;
      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        setTimeout(() => {
          router.refresh();
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
        }, 1000);
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // Only run once on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPulling, pullDistance, router]);

  const progressPercentage = Math.min((pullDistance / threshold) * 100, 100);

  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 flex justify-center items-center transition-transform duration-300"
      style={{
        height: `${pullDistance}px`,
        transform: isRefreshing ? "translateY(0)" : `translateY(0)`,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center transition-opacity",
          pullDistance > 10 ? "opacity-100" : "opacity-0"
        )}
      >
        {isRefreshing ? (
          <RefreshCcw className="w-6 h-6 text-purple-500 animate-spin" />
        ) : (
          <ArrowDown
            className={cn(
              "w-6 h-6 text-purple-500 transition-transform",
              progressPercentage >= 100 && "rotate-180"
            )}
          />
        )}
        <span className="mt-2 text-sm font-medium text-gray-600">
          {isRefreshing
            ? "Refreshing..."
            : progressPercentage >= 100
              ? "Release to refresh"
              : "Pull to refresh"}
        </span>
      </div>
    </div>
  );
}
